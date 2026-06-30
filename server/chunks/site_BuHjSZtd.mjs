globalThis.process ??= {};
globalThis.process.env ??= {};
import { getSession } from "./auth_TPDi1U5M.mjs";
import { cachedEntitlement } from "./client_v-7HzW5v.mjs";
import { updatePageMeta, setSitePassword, clearLayout, restoreLayoutVersion, listLayoutVersions, publishLayout, saveLayoutDraft, deleteSite, upsertSite } from "./sites_CEQQtq4m.mjs";
import { r as randomId } from "./stripe_r-RFTlbb.mjs";
import { blockDef } from "./defs_C7dN86-U.mjs";
import { audit } from "./storage_4iye1Zw4.mjs";
import { a as atLeast } from "./types_BVJxqWI9.mjs";
import { env } from "cloudflare:workers";
const MAX_BLOCKS = 40;
const MAX_TEXT = 4e3;
const MAX_RICH = 2e4;
const MAX_LIST = 12;
const cleanUrl = (v) => {
  const s = typeof v === "string" ? v.trim() : "";
  if (!s) return "";
  if (s === "#" || s.startsWith("#")) return s.slice(0, 200);
  return /^https:\/\/[\w./?=&%:#@-]+$/i.test(s) || /^\/[\w./?=&%#-]*$/.test(s) ? s.slice(0, 500) : "";
};
const cleanText = (v, max = MAX_TEXT) => typeof v === "string" ? v.slice(0, max) : "";
const optValues = (f) => f.options.map((o) => o.value);
function cleanField(f, val) {
  switch (f.type) {
    case "text":
      return cleanText(val);
    case "textarea":
      return cleanText(val, 8e3);
    case "richtext":
      return cleanText(val, MAX_RICH);
    case "image":
      return cleanUrl(val);
    case "url":
      return cleanUrl(val);
    // リンク（ボタンhref等）。不正スキーム（javascript: 等）は空に＝XSS防止（P1-23）
    case "icon":
      return typeof val === "string" ? val.slice(0, 24) : "";
    case "number": {
      const n = Math.round(Number(val));
      return Number.isFinite(n) ? Math.max(0, Math.min(n, 100)) : 0;
    }
    case "boolean":
      return !!val;
    case "select":
      return optValues(f).includes(String(val)) ? String(val) : optValues(f)[0];
    case "list": {
      const arr = Array.isArray(val) ? val.slice(0, Math.min(f.max ?? MAX_LIST, MAX_LIST)) : [];
      return arr.map((row) => {
        const out = {};
        for (const sub of f.item) out[sub.key] = cleanField(sub, row?.[sub.key]);
        return out;
      });
    }
    default:
      return "";
  }
}
function validateLayout(input) {
  const obj = input ?? {};
  const rawBlocks = Array.isArray(obj.blocks) ? obj.blocks : null;
  if (!rawBlocks) return { ok: false, error: "blocks がありません" };
  if (rawBlocks.length > MAX_BLOCKS) return { ok: false, error: `ブロックは最大 ${MAX_BLOCKS} 個までです` };
  const blocks = [];
  let dropped = 0;
  for (const rb of rawBlocks) {
    const b = rb ?? {};
    const def = blockDef(String(b.type));
    if (!def) {
      dropped++;
      continue;
    }
    const props = {};
    const src = b.props ?? {};
    for (const f of def.fields) props[f.key] = cleanField(f, src[f.key]);
    blocks.push({ id: typeof b.id === "string" && b.id ? b.id.slice(0, 24) : randomId(8), type: def.type, props, bg: typeof b.bg === "string" ? b.bg.slice(0, 16) : void 0 });
  }
  const json2 = JSON.stringify({ version: 1, blocks });
  if (json2.length > 256e3) return { ok: false, error: "ページが大きすぎます（画像はURL参照にしてください）" };
  return { ok: true, layout: { version: 1, blocks }, dropped };
}
function makeBlock(type) {
  const def = blockDef(type);
  if (!def) return null;
  return { id: randomId(8), type, props: structuredClone(def.defaults) };
}
const prerender = false;
const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { "content-type": "application/json" } });
const POST = async ({ request, locals }) => {
  const ses = await getSession(env, request);
  if (!ses || ses.role !== "admin") return json({ error: "管理者のみ" }, 403);
  if (!atLeast(await cachedEntitlement(env), "pro")) return json({ error: "HP/LP は Pro プランで利用できます" }, 403);
  const b = await request.json().catch(() => ({}));
  if (b._action === "save_page_settings") {
    const s = (b.slug ?? "").trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
    if (!s) return json({ error: "slug（英数字）が必要" }, 400);
    const t = (b.title ?? "").trim();
    if (!t) return json({ error: "ページタイトルが必要です" }, 400);
    await updatePageMeta(env, s, { title: t.slice(0, 120), show_join: !!b.show_join });
    return json({ ok: true, slug: s });
  }
  const slug = (b.slug ?? "").trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
  switch (b._action) {
    case "save":
      if (!slug) return json({ error: "slug（英数字）が必要" }, 400);
      if (!b.title) return json({ error: "タイトルが必要" }, 400);
      await upsertSite(env, { slug, title: b.title, body: b.body, published: b.published, show_join: b.show_join });
      return json({ ok: true, slug });
    case "delete":
      if (slug) await deleteSite(env, slug);
      return json({ ok: true });
    // ページビルダー：下書き保存（layout_draft）。検証してから保存。
    case "save_layout": {
      if (!slug) return json({ error: "slug（英数字）が必要" }, 400);
      const r = validateLayout(b.layout);
      if (!r.ok) return json({ error: r.error }, 400);
      await saveLayoutDraft(env, slug, JSON.stringify(r.layout), b.title);
      return json({ ok: true, slug });
    }
    // AIでHP構成を生成/整形（H・AI生成）。説明文（prompt）または現在の下書き（base）から
    // ブロック構成を作り、検証して layout_draft に保存。プレビュー→確認→公開は既存フローのまま。
    case "ai_layout": {
      if (!slug) return json({ error: "slug（英数字）が必要" }, 400);
      let prompt = (b.prompt ?? "").trim();
      if (b.ref?.dataB64) {
        const { prepareDevAttachment } = await import("./chat-flow_CND9C88D.mjs");
        const r = await prepareDevAttachment(b.ref, ses.uid, ses.ctx);
        if (!r.ok) return json({ error: r.error }, r.status);
        prompt = (prompt ? prompt : "添付の参考資料を踏まえてHPを作成・更新する。") + r.promptAdd;
      }
      const baseV = b.base != null ? validateLayout(b.base) : null;
      const base = baseV && baseV.ok ? baseV.layout ?? null : null;
      if (!prompt && !base) return json({ error: "作りたいHPの説明を入力してください" }, 400);
      const history = Array.isArray(b.history) ? b.history.filter((t) => t && (t.role === "user" || t.role === "assistant") && typeof t.text === "string").slice(-6).map((t) => ({ role: t.role, text: String(t.text).slice(0, 600) })) : void 0;
      const { generateSiteLayout } = await import("./site-ai_Ce5XVK6m.mjs");
      const { getMemberModel, parseRequestModel } = await import("./settings_C_1axsCz.mjs");
      const { modelId: siteModelId } = parseRequestModel(await getMemberModel(env, ses.uid).catch(() => null) ?? "");
      const g = await generateSiteLayout(env, { prompt, base, history, modelId: siteModelId });
      if (!g.ok) return json({ error: g.error }, 400);
      await saveLayoutDraft(env, slug, JSON.stringify(g.layout), b.title);
      await audit(env, ses.uid, "site.ai_layout", `${slug}:${g.layout.blocks.length}blocks`);
      return json({ ok: true, slug, layout: g.layout, note: g.note });
    }
    // 公開：下書きを公開版へ反映。公開時点を版として記録（P1-22・publish 内で1回だけ）。
    case "publish_layout":
      if (!slug) return json({ error: "slug が必要" }, 400);
      await publishLayout(env, slug, ses.uid);
      return json({ ok: true, slug });
    // 公開履歴一覧（P1-22）。
    case "list_versions":
      if (!slug) return json({ error: "slug が必要" }, 400);
      return json({ ok: true, versions: await listLayoutVersions(env, slug) });
    // ロールバック（P1-22）：指定版を下書きへ戻す（公開前確認を経て再公開）。復元操作を監査ログへ残す。
    case "restore_version": {
      if (!slug) return json({ error: "slug が必要" }, 400);
      const vn = Number(b.version_no);
      if (!Number.isInteger(vn) || vn < 1) return json({ error: "version_no が必要" }, 400);
      const layout = await restoreLayoutVersion(env, slug, vn);
      if (layout == null) return json({ error: "指定の版が見つかりません" }, 404);
      await audit(env, ses.uid, "site.restore_version", `${slug}#${vn}`);
      return json({ ok: true, slug, layout });
    }
    // ブロック構成を解除（body HTML 描画へ戻す）。
    case "clear_layout":
      if (slug) await clearLayout(env, slug);
      return json({ ok: true });
    // 限定公開（H7）：パスワード設定/解除（空文字で解除）。
    case "set_password":
      if (!slug) return json({ error: "slug が必要" }, 400);
      await setSitePassword(env, slug, (b.password ?? "").trim() || null);
      return json({ ok: true });
    default:
      return json({ error: "不明な操作" }, 400);
  }
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
const site___ts = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  page
}, Symbol.toStringTag, { value: "Module" }));
export {
  makeBlock as m,
  site___ts as s,
  validateLayout as v
};

globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_Dn7U0_eq.mjs";
import { r as renderTemplate, m as maybeRenderHead, a as addAttribute } from "./sequence_I_kcixDX.mjs";
import { r as renderComponent } from "./worker-entry_Cv5GlnJ5.mjs";
import { env } from "cloudflare:workers";
import { $ as $$App } from "./App_ChWwyHiq.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const prerender = false;
const $$Setup = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Setup;
  const { getSession } = await import("./auth_BXoLTJDQ.mjs");
  const ses = await getSession(env, Astro2.request);
  if (!ses) return Astro2.redirect("/login", 302);
  const isAdmin = ses.role === "admin" && ses.ctx === "org";
  if (!isAdmin) return Astro2.redirect("/", 302);
  const { hasApiKey } = await import("./client_DsX87Mps.mjs");
  const { googleConfigured } = await import("./google_BPQSD05g.mjs");
  const { getTheme } = await import("./theme_DO0iS6ur.mjs");
  const { getBackupState } = await import("./backup_Buj-Jcas.mjs");
  const [gemini, claude, line, google, theme, backup] = await Promise.all([
    hasApiKey(env, "gemini").catch(() => false),
    hasApiKey(env, "claude").catch(() => false),
    hasApiKey(env, "line_token").catch(() => false),
    googleConfigured(env).catch(() => false),
    getTheme(Astro2.locals.ctx).catch(() => ({})),
    getBackupState(env).catch(() => null)
  ]);
  let guides = [];
  try {
    guides = JSON.parse(await env.LICENSE.get("onboarding_guides") ?? "[]");
  } catch {
    guides = [];
  }
  const steps = [
    { key: "ai", title: "AI を使えるようにする", done: gemini || claude, href: "/settings/keys", why: "Gemini か Claude の API キーを登録すると、AIチャットや自動処理が使えます。", how: "Google AI Studio（Gemini）や Anthropic（Claude）でキーを発行し、連携設定に貼り付けます。" },
    { key: "brand", title: "ブランド設定（見た目）", done: !!(theme.brand || theme.logoUrl || theme.colors), href: "/settings/theme", why: "団体名・ロゴ・色を設定すると、画面が自団体の見た目になります。", how: "ロゴ画像のアップロードや色のパレット選択ができます。" },
    { key: "google", title: "Google 連携（予定・メール）", done: google, href: "/settings/google-setup", why: "カレンダー・Gmail・Meet と連携できます。手順ガイドつき。", how: "Google Cloud Console で OAuth クライアントを作成し、ID/シークレットを登録します。" },
    { key: "line", title: "LINE 連携（任意・Pro）", done: line, href: "/settings/keys", why: "LINE から AI に話しかけて操作できます（Proプラン）。", how: "LINE Developers でチャネルを作成し、シークレット/トークンを登録します。" },
    { key: "backup", title: "バックアップを取得", done: !!backup, href: "/backup", why: "データは自団体の責任で保全します。定期的な取得をおすすめします。", how: "ローカルへのダウンロードか Google ドライブへの保存ができます。" }
  ];
  const doneCount = steps.filter((s) => s.done).length;
  return renderTemplate`${renderComponent($$result, "App", $$App, { "title": "はじめの設定", "active": "/settings", "data-astro-cid-jz2jwhht": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<h1 data-astro-cid-jz2jwhht>はじめの設定</h1> <p class="muted" data-astro-cid-jz2jwhht>baku-office を使い始めるための設定です。上から順に進めると迷いません（${doneCount} / ${steps.length} 完了）。</p> <div class="setup-steps" data-astro-cid-jz2jwhht> ${steps.map((s, i) => renderTemplate`<div${addAttribute("setup-step" + (s.done ? " done" : ""), "class")} data-astro-cid-jz2jwhht> <div class="ss-mark" aria-hidden="true" data-astro-cid-jz2jwhht>${s.done ? "✓" : i + 1}</div> <div class="ss-body" data-astro-cid-jz2jwhht> <div class="ss-title" data-astro-cid-jz2jwhht>${s.title}${s.done && renderTemplate`<span class="ss-badge" data-astro-cid-jz2jwhht>設定済み</span>`}</div> <div class="muted" style="font-size:.88rem" data-astro-cid-jz2jwhht>${s.why}</div> <div class="muted" style="font-size:.82rem;margin-top:2px" data-astro-cid-jz2jwhht>やり方：${s.how}</div> </div> <a${addAttribute("btn btn-sm " + (s.done ? "btn-ghost" : "btn-primary"), "class")}${addAttribute(s.href, "href")} data-astro-cid-jz2jwhht>${s.done ? "確認する" : "設定する"}</a> </div>`)} </div> <h2 data-astro-cid-jz2jwhht>ガイド動画・資料</h2> ${guides.length > 0 ? renderTemplate`<div class="card" data-astro-cid-jz2jwhht> <ul style="margin:.2rem 0;padding-left:1.2rem;line-height:1.9" data-astro-cid-jz2jwhht> ${guides.map((g) => renderTemplate`<li data-astro-cid-jz2jwhht><a${addAttribute(g.url, "href")} target="_blank" rel="noopener" data-astro-cid-jz2jwhht>${g.title} ↗</a></li>`)} </ul> </div>` : renderTemplate`<div class="card" data-astro-cid-jz2jwhht><p class="muted" data-astro-cid-jz2jwhht>案内動画・資料はまだ登録されていません。各ステップの画面にも手順の案内があります。下の欄から動画や資料のリンクを登録すると、ここに表示されます。</p></div>`}<details class="adv" style="margin-top:.4rem" data-astro-cid-jz2jwhht> <summary data-astro-cid-jz2jwhht>ガイド動画・資料のリンクを登録（管理者）</summary> <div class="card" data-astro-cid-jz2jwhht> <p class="muted" style="font-size:.85rem" data-astro-cid-jz2jwhht>タイトルと URL（https://…）の組を登録します。動画（YouTube等）や資料（PDF/スプレッドシート）のリンクをそのまま貼り付けてください。</p> <div id="g-rows" data-astro-cid-jz2jwhht> ${(guides.length ? guides : [{ title: "", url: "" }]).map((g) => renderTemplate`<div class="row g-row" style="margin-bottom:.4rem" data-astro-cid-jz2jwhht><input class="g-title"${addAttribute(g.title, "value")} placeholder="例：Gemini APIキーの取り方" data-astro-cid-jz2jwhht><input class="g-url"${addAttribute(g.url, "value")} placeholder="https://…" data-astro-cid-jz2jwhht><button type="button" class="btn btn-sm btn-ghost g-del" style="flex:0 0 auto" data-astro-cid-jz2jwhht>削除</button></div>`)} </div> <div class="row" style="margin-top:.4rem" data-astro-cid-jz2jwhht><button type="button" class="btn btn-sm" id="g-add" style="flex:0 0 auto" data-astro-cid-jz2jwhht>＋ 行を追加</button><button type="button" class="btn btn-primary" id="g-save" style="flex:0 0 auto" data-astro-cid-jz2jwhht>保存</button></div> </div> </details> <div class="row" style="margin-top:1rem" data-astro-cid-jz2jwhht><button type="button" class="btn btn-ghost" id="setup-dismiss" style="flex:0 0 auto" data-astro-cid-jz2jwhht>この案内を今後表示しない</button></div>   `, "scripts": async ($$result2) => renderTemplate(_a || (_a = __template([`<script>
    document.getElementById("g-add")?.addEventListener("click", () => {
      const rows = document.getElementById("g-rows");
      const div = document.createElement("div");
      div.className = "row g-row"; div.style.marginBottom = ".4rem";
      div.innerHTML = '<input class="g-title" placeholder="例：Gemini APIキーの取り方" /><input class="g-url" placeholder="https://…" /><button type="button" class="btn btn-sm btn-ghost g-del" style="flex:0 0 auto">削除</button>';
      rows.appendChild(div);
    });
    document.getElementById("g-rows")?.addEventListener("click", (e) => { const b = e.target.closest(".g-del"); if (b) b.closest(".g-row").remove(); });
    document.getElementById("g-save")?.addEventListener("click", async (e) => {
      const guides = [...document.querySelectorAll(".g-row")].map((r) => ({ title: r.querySelector(".g-title").value, url: r.querySelector(".g-url").value })).filter((g) => g.title.trim() && g.url.trim());
      const r = await window.bo.api("/api/settings", { _action: "onboarding_guides", guides }, { btn: e.currentTarget, successMsg: "保存しました" });
      if (r.ok) setTimeout(() => location.reload(), 700);
    });
    document.getElementById("setup-dismiss")?.addEventListener("click", async (e) => {
      const r = await window.bo.api("/api/settings", { _action: "onboarding_dismiss" }, { btn: e.currentTarget, successMsg: "今後この案内は表示しません" });
      if (r.ok) setTimeout(() => location.href = "/", 700);
    });
  <\/script>`]))) })}`;
}, "/home/runner/work/baku-office/baku-office/apps/client/src/pages/setup.astro", void 0);
const $$file = "/home/runner/work/baku-office/baku-office/apps/client/src/pages/setup.astro";
const $$url = "/setup";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Setup,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};

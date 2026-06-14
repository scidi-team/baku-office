globalThis.process ??= {};
globalThis.process.env ??= {};
import { getSession } from "./auth_BXoLTJDQ.mjs";
import { setMaxUploadMb, setRetentionDays } from "./storage_C7TJPJmI.mjs";
import { setAiEngine, setWorkersAiModel, setBookkeepingMode, setCustomPrompt, setNotifyWebhook, setWorkersPaid } from "./settings_BubM6K6A.mjs";
import { setAutonomy, saveAutonomyConfig } from "./autonomy_CO_jx1es.mjs";
import { setStorageLimits } from "./storage-usage_J5_c4nFJ.mjs";
import { s as setEnabledPartIds, p as partCatalog, e as enabledPartIds } from "./parts_D1i9CXVc.mjs";
import { setTheme } from "./theme_DO0iS6ur.mjs";
import { setNavOverrides } from "./nav_CqD0IXOG.mjs";
import { setHomeLayout } from "./home_g2cvhiOl.mjs";
import { setCustomDomain } from "./custom-domain_0fz0VPJf.mjs";
import { n as nowSec } from "./accounting_BipJ8jvJ.mjs";
import { installApp, uninstallApp, installedAppIds, appCatalog } from "./apps_CY4lyIL1.mjs";
import { fetchAndInstall, uninstallExternal, listExternalApps, listDrafts, submitDraft, deleteDraft } from "./external-apps_DgoO-c89.mjs";
import { env } from "cloudflare:workers";
const prerender = false;
const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { "content-type": "application/json" } });
const POST = async ({ request, locals }) => {
  const ses = await getSession(env, request);
  if (!ses || ses.role !== "admin" || ses.ctx !== "org") return json({ error: "管理者のみ" }, 403);
  const b = await request.json().catch(() => ({}));
  if (b._action === "max_upload") {
    const v = await setMaxUploadMb(env, Number(b.mb));
    return json({ ok: true, mb: v });
  }
  if (b._action === "file_retention") {
    const v = await setRetentionDays(env, Number(b.days));
    return json({ ok: true, days: v });
  }
  if (b._action === "agent_approval") {
    const { setApprovalMode } = await import("./approvals_DxT97YqP.mjs");
    const v = await setApprovalMode(env, b.on === true);
    return json({ ok: true, on: v });
  }
  if (b._action === "ai_engine") {
    const v = await setAiEngine(env, String(b.engine ?? "gemini"));
    return json({ ok: true, engine: v });
  }
  if (b._action === "workers_ai_model") {
    const v = await setWorkersAiModel(env, String(b.model ?? ""));
    return json({ ok: true, model: v });
  }
  if (b._action === "bookkeeping_mode") {
    const v = await setBookkeepingMode(env, String(b.mode ?? "single"));
    return json({ ok: true, mode: v });
  }
  if (b._action === "custom_prompt") {
    const v = await setCustomPrompt(env, String(b.prompt ?? ""));
    return json({ ok: true, prompt: v });
  }
  if (b._action === "notify_webhook") {
    const v = await setNotifyWebhook(env, String(b.webhook ?? ""));
    return json({ ok: true, webhook: v });
  }
  if (b._action === "workers_paid") {
    const v = await setWorkersPaid(env, b.workersPaid === true);
    return json({ ok: true, workersPaid: v });
  }
  if (b._action === "autonomy_toggle") {
    await setAutonomy(env, b.on === true);
    return json({ ok: true, on: b.on === true });
  }
  if (b._action === "autonomy_config") {
    await saveAutonomyConfig(env, { cfToken: b.cfToken, cfAccount: b.cfAccount, ghToken: b.ghToken, ghRepo: b.ghRepo });
    return json({ ok: true });
  }
  if (b._action === "storage_limits") {
    const inc = b.limits ?? {};
    const clean = {};
    for (const k of ["d1", "kv", "r2", "drive"]) {
      const v = Number(inc[k]);
      if (Number.isFinite(v) && v > 0) clean[k] = v;
    }
    await setStorageLimits(env, clean);
    return json({ ok: true });
  }
  if (b._action === "enabled_parts") {
    const v = await setEnabledPartIds(locals.ctx, Array.isArray(b.parts) ? b.parts : []);
    return json({ ok: true, enabled: v, catalog: partCatalog() });
  }
  if (b._action === "list_parts") {
    return json({ ok: true, enabled: await enabledPartIds(locals.ctx), catalog: partCatalog() });
  }
  if (b._action === "ui_theme") {
    try {
      const v = await setTheme(locals.ctx, b.theme);
      return json({ ok: true, theme: v });
    } catch (e) {
      return json({ error: "テーマの保存に失敗しました：" + e.message }, 500);
    }
  }
  if (b._action === "onboarding_guides") {
    const guides = (Array.isArray(b.guides) ? b.guides : []).map((g) => ({ title: String(g?.title ?? "").slice(0, 80).trim(), url: String(g?.url ?? "").trim() })).filter((g) => g.title && /^https?:\/\//.test(g.url)).slice(0, 20);
    await env.LICENSE.put("onboarding_guides", JSON.stringify(guides));
    return json({ ok: true, guides });
  }
  if (b._action === "onboarding_dismiss") {
    await env.LICENSE.put("onboarding_dismissed", "1");
    return json({ ok: true });
  }
  if (b._action === "nav_overrides") {
    const v = await setNavOverrides(locals.ctx, b.nav ?? {});
    return json({ ok: true, nav: v });
  }
  if (b._action === "home_layout") {
    const v = await setHomeLayout(locals.ctx, b.layout ?? {});
    return json({ ok: true, layout: v });
  }
  if (b._action === "custom_domain") {
    const v = await setCustomDomain(locals.ctx, b.domain ?? "", nowSec());
    return json({ ok: true, domain: v });
  }
  if (b._action === "install_app") {
    const installed = await installApp(locals.ctx, String(b.appId ?? ""));
    return json({ ok: true, installed });
  }
  if (b._action === "uninstall_app") {
    try {
      const installed = await uninstallApp(locals.ctx, String(b.appId ?? ""));
      return json({ ok: true, installed });
    } catch (e) {
      return json({ error: e.message }, 400);
    }
  }
  if (b._action === "list_apps") {
    return json({ ok: true, catalog: appCatalog(), installed: await installedAppIds(locals.ctx) });
  }
  if (b._action === "fetch_app") {
    const r = await fetchAndInstall(locals.ctx, String(b.appId ?? ""));
    return json(r, r.ok ? 200 : 400);
  }
  if (b._action === "uninstall_external") {
    await uninstallExternal(locals.ctx, String(b.appId ?? ""));
    return json({ ok: true });
  }
  if (b._action === "list_external") {
    return json({ ok: true, external: await listExternalApps(locals.ctx) });
  }
  if (b._action === "list_drafts") {
    return json({ ok: true, drafts: await listDrafts(locals.ctx) });
  }
  if (b._action === "submit_draft") {
    const r = await submitDraft(locals.ctx, String(b.draftId ?? ""));
    return json(r, r.ok ? 200 : 400);
  }
  if (b._action === "delete_draft") {
    await deleteDraft(locals.ctx, String(b.draftId ?? ""));
    return json({ ok: true });
  }
  return json({ error: "不明な操作" }, 400);
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};

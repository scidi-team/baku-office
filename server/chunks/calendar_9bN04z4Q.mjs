globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_Dn7U0_eq.mjs";
import { r as renderTemplate, m as maybeRenderHead, F as Fragment } from "./sequence_I_kcixDX.mjs";
import { r as renderComponent } from "./worker-entry_Cv5GlnJ5.mjs";
import { env } from "cloudflare:workers";
import { $ as $$App } from "./App_ChWwyHiq.mjs";
import "./stripe_r-RFTlbb.mjs";
import { atLeast } from "./index_CrjiuAkj.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const prerender = false;
const $$Calendar = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Calendar;
  const ctx = Astro2.locals.ctx;
  const { getSession } = await import("./auth_BXoLTJDQ.mjs");
  const ses = await getSession(env, Astro2.request);
  if (!ses) return Astro2.redirect("/login", 302);
  const isAdmin = ses.role === "admin" && ses.ctx === "org";
  const { cachedEntitlement } = await import("./client_DsX87Mps.mjs");
  const hasPro = atLeast(await cachedEntitlement(env), "pro");
  const { googleConfigured, googleStatus } = await import("./google_BPQSD05g.mjs");
  let configured = false, connected = false, eventsText = "";
  let calGranted = false, lastUsed = null;
  if (hasPro) {
    configured = await googleConfigured(env);
    const st = await googleStatus(env);
    connected = st.connected;
    calGranted = st.groups.includes("calendar");
    lastUsed = st.lastUsed;
    if (connected) {
      const { listEvents } = await import("./calendar_DZa9-ObP.mjs");
      eventsText = await listEvents(ctx, { max: 20 });
    }
  }
  const fmtTs = (s) => s ? new Date(s * 1e3).toISOString().slice(0, 16).replace("T", " ") + " UTC" : "—";
  return renderTemplate`${renderComponent($$result, "App", $$App, { "title": "カレンダー", "active": "/calendar" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<h1>カレンダー連携</h1> <p class="muted">団体内の予定の登録・確認は <a href="/schedule">予定</a> から行えます。この画面は Google カレンダーとの連携を設定します。</p> ${!hasPro && renderTemplate`<div class="card"> <div class="banner banner-warn">この機能は <strong>Pro 以上</strong>のプランで利用できます。</div> <p class="muted">Google カレンダーの予定を閲覧・作成（Meet付き会議の発行）・編集・削除できます。AIチャットからも操作できます。</p> <a class="btn btn-primary" href="/billing">プラン・課金へ</a> </div>`}${hasPro && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate`${!configured && renderTemplate`<div class="banner banner-warn">Google との連携が未設定のため利用できません。${isAdmin ? renderTemplate`${renderComponent($$result3, "Fragment", Fragment, {}, { "default": async ($$result4) => renderTemplate`管理者は <a href="/settings/google-setup">Google との連携</a> から設定できます。` })}` : "管理者にご確認ください。"}</div>`}<div class="card"> <p>カレンダー連携：<span class="pill">${calGranted ? "連携済み" : "未連携"}</span> ${connected && renderTemplate`<span class="muted" style="font-size:.8rem">最終利用：${fmtTs(lastUsed)}</span>`}</p> ${isAdmin && configured && renderTemplate`<div class="row"> <a class="btn btn-primary" href="/api/google/start?groups=calendar">${calGranted ? "再連携" : "カレンダーを連携"}</a> ${connected && renderTemplate`<button class="btn" id="gdisc">連携を全解除</button>`} </div>`} ${!isAdmin && renderTemplate`<p class="muted">連携・解除の操作は管理者のみ可能です。</p>`} </div> ${connected && renderTemplate`${renderComponent($$result3, "Fragment", Fragment, {}, { "default": async ($$result4) => renderTemplate` <h2>今後の予定</h2> <div class="card"><pre style="white-space:pre-wrap;font-size:.85rem;margin:0">${eventsText || "予定はありません。"}</pre></div> <p class="muted">予定の作成・編集・Meet付き会議の発行は、AIチャットに「来週月曜10時に定例会議をMeet付きで作成して」のように依頼してください。</p> ` })}`}` })}`} `, "scripts": async ($$result2) => renderTemplate(_a || (_a = __template(['<script>\n    const d = document.getElementById("gdisc");\n    if (d) d.addEventListener("click", async (e) => {\n      const r = await window.bo.api("/api/google", { _action: "disconnect" }, { btn: e.currentTarget, successMsg: "連携を解除しました" });\n      if (r.ok) setTimeout(() => location.reload(), 600);\n    });\n  <\/script>']))) })}`;
}, "/home/runner/work/baku-office/baku-office/apps/client/src/pages/calendar.astro", void 0);
const $$file = "/home/runner/work/baku-office/baku-office/apps/client/src/pages/calendar.astro";
const $$url = "/calendar";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Calendar,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};

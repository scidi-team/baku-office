globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_Dn7U0_eq.mjs";
import { r as renderTemplate, m as maybeRenderHead, F as Fragment } from "./sequence_I_kcixDX.mjs";
import { r as renderComponent } from "./worker-entry_Cv5GlnJ5.mjs";
import { env } from "cloudflare:workers";
import { $ as $$App } from "./App_ChWwyHiq.mjs";
import { getSession } from "./auth_BXoLTJDQ.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const prerender = false;
const $$Account = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Account;
  const ses = await getSession(env, Astro2.request);
  if (!ses) return Astro2.redirect("/login", 302);
  let leaveRequested = false;
  if (ses.ctx === "org" && ses.uid !== "org") {
    const r = await env.DB.prepare("SELECT leave_requested_at AS t FROM users WHERE id=?").bind(ses.uid).first();
    leaveRequested = !!r?.t;
  }
  const canLeave = ses.ctx === "org" && ses.uid !== "org";
  return renderTemplate`${renderComponent($$result, "App", $$App, { "title": "アカウント", "active": "/account" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<h1>アカウント</h1> <div class="card"> <p>${ses.name ?? ""}（${ses.role}）</p> </div> ${canLeave && renderTemplate`<div class="card" style="margin-top:1rem"> <h2 style="font-size:1.05rem">退会（アカウントの無効化）</h2> <p class="muted">退会を申請すると管理者の承認後にアカウントが無効化されます。会計・名簿などの業務データは団体に帰属するため削除されません。</p> ${leaveRequested ? renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate`<p>現在、脱退を申請中です（管理者の承認待ち）。</p><button class="btn btn-sm" id="cancelLeave">申請を取り消す</button>` })}` : renderTemplate`<button class="btn btn-sm btn-danger" id="reqLeave">退会を申請する</button>`} <div class="muted" id="leaveMsg" role="status" aria-live="polite" style="margin-top:8px"></div> </div>`} `, "scripts": async ($$result2) => renderTemplate(_a || (_a = __template(['<script>\n    const req = document.getElementById("reqLeave");\n    const cancel = document.getElementById("cancelLeave");\n    const msg = document.getElementById("leaveMsg");\n    if (req) req.addEventListener("click", async (e) => {\n      if (!confirm("退会を申請します。よろしいですか？")) return;\n      const r = await window.bo.api("/api/me/leave-request", {}, { btn: e.currentTarget, successMsg: null });\n      if (r.ok) { window.bo.toast("退会を申請しました"); setTimeout(() => location.reload(), 600); }\n      else if (msg) msg.textContent = (r.data && r.data.error) || "申請に失敗しました。";\n    });\n    if (cancel) cancel.addEventListener("click", async (e) => {\n      const r = await window.bo.api("/api/me/leave-request", null, { method: "DELETE", btn: e.currentTarget, successMsg: null });\n      if (r.ok) { window.bo.toast("申請を取り消しました"); setTimeout(() => location.reload(), 600); }\n    });\n  <\/script>']))) })}`;
}, "/home/runner/work/baku-office/baku-office/apps/client/src/pages/account.astro", void 0);
const $$file = "/home/runner/work/baku-office/baku-office/apps/client/src/pages/account.astro";
const $$url = "/account";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Account,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};

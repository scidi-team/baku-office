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
const $$Review = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Review;
  const { getSession, canAccess } = await import("./auth_BXoLTJDQ.mjs");
  const ses = await getSession(env, Astro2.request);
  if (!ses) return Astro2.redirect("/login", 302);
  const allowed = canAccess(ses.role, "review_accounting") || canAccess(ses.role, "review_documents");
  const { reviewQueue } = await import("./users_BHOLHxMy.mjs");
  const queue = allowed ? await reviewQueue(env) : [];
  const yen = (n) => n != null ? "¥" + n.toLocaleString("ja-JP") : "";
  return renderTemplate`${renderComponent($$result, "App", $$App, { "title": "共有承認", "active": "/review" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<h1>共有承認キュー</h1> ${!allowed && renderTemplate`<div class="banner banner-info">承認権限（会計／庶務／管理者）がありません。</div>`}${allowed && renderTemplate`<div class="table-wrap"><table><thead><tr><th>種別</th><th>概要</th><th>金額</th><th>日付</th><th></th></tr></thead><tbody> ${queue.map((q) => renderTemplate`<tr${addAttribute(q.id, "data-id")}><td>${q.type}</td><td>${q.title}</td><td>${yen(q.amount)}</td><td>${q.date ?? ""}</td><td><button class="btn btn-sm btn-ok ap">承認</button> <button class="btn btn-sm btn-danger rj">却下</button></td></tr>`)} ${queue.length === 0 && renderTemplate`<tr><td colspan="5" class="muted">承認待ちはありません。</td></tr>`} </tbody></table></div>`}<p class="muted" style="margin-top:1rem">領収書の承認は会計取引のドラフトを自動生成します（§9）。</p>  `, "scripts": async ($$result2) => renderTemplate(_a || (_a = __template(['<script>\n    document.querySelectorAll("tr[data-id]").forEach(tr=>{const id=tr.dataset.id;\n      tr.querySelector(".ap")?.addEventListener("click",async(e)=>{const r=await window.bo.api("/api/review",{_action:"approve",id},{btn:e.target,successMsg:"承認しました"});if(r.ok)setTimeout(()=>location.reload(),600);});\n      tr.querySelector(".rj")?.addEventListener("click",async(e)=>{const reason=prompt("却下理由")||"";const r=await window.bo.api("/api/review",{_action:"reject",id,reason},{btn:e.target,successMsg:"却下しました"});if(r.ok)setTimeout(()=>location.reload(),600);});\n    });\n  <\/script>']))) })}`;
}, "/home/runner/work/baku-office/baku-office/apps/client/src/pages/review.astro", void 0);
const $$file = "/home/runner/work/baku-office/baku-office/apps/client/src/pages/review.astro";
const $$url = "/review";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Review,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};

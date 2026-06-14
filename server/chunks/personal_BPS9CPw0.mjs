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
const $$Personal = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Personal;
  const { getSession } = await import("./auth_BXoLTJDQ.mjs");
  const ses = await getSession(env, Astro2.request);
  if (!ses || ses.ctx !== "personal") return Astro2.redirect("/login", 302);
  const { listMyItems } = await import("./users_BHOLHxMy.mjs");
  const items = await listMyItems(env, ses.uid);
  const yen = (n) => n != null ? "¥" + n.toLocaleString("ja-JP") : "";
  return renderTemplate`${renderComponent($$result, "App", $$App, { "title": "個人", "active": "/personal" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<h1>個人の作業領域</h1> <p class="muted">領収書・メモ・タスク・予定を記録し、必要なものを組織へ共有申請できます（§6/9）。</p> <div class="card"> <div class="row"> <select id="type" aria-label="種別"><option value="receipt">領収書</option><option value="memo">メモ</option><option value="task">タスク</option><option value="schedule">予定</option></select> <input id="title" placeholder="概要" aria-label="概要"> <input id="amount" type="number" placeholder="金額" aria-label="金額"> <button class="btn btn-primary" id="add" style="flex:0 0 auto">追加</button> </div> </div> <div class="table-wrap" style="margin-top:1rem"><table><thead><tr><th>種別</th><th>概要</th><th>金額</th><th>共有</th><th></th></tr></thead><tbody> ${items.map((it) => renderTemplate`<tr${addAttribute(it.id, "data-id")}><td>${it.type}</td><td>${it.title}</td><td>${yen(it.amount)}</td><td>${it.share_scope === "org" ? "組織：" + it.review_status : "個人"}</td><td>${it.share_scope !== "org" && renderTemplate`<button class="btn btn-sm btn-primary share">組織へ共有</button>`}</td></tr>`)} ${items.length === 0 && renderTemplate`<tr><td colspan="5" class="muted" style="text-align:center;padding:1.2rem">まだ記録がありません。上の欄から領収書・メモなどを追加してみましょう。</td></tr>`} </tbody></table></div>  `, "scripts": async ($$result2) => renderTemplate(_a || (_a = __template(['<script>\n    document.getElementById("add").addEventListener("click",async(e)=>{const r=await window.bo.api("/api/personal",{_action:"create",type:document.getElementById("type").value,title:document.getElementById("title").value,amount:document.getElementById("amount").value||undefined},{btn:e.currentTarget,successMsg:"追加しました"});if(r.ok)setTimeout(()=>location.reload(),500);});\n    document.querySelectorAll("tr[data-id] .share").forEach(b=>b.addEventListener("click",async(e)=>{const r=await window.bo.api("/api/personal",{_action:"share",id:e.target.closest("tr").dataset.id},{btn:e.target,successMsg:"共有申請しました"});if(r.ok)setTimeout(()=>location.reload(),500);}));\n  <\/script>']))) })}`;
}, "/home/runner/work/baku-office/baku-office/apps/client/src/pages/personal.astro", void 0);
const $$file = "/home/runner/work/baku-office/baku-office/apps/client/src/pages/personal.astro";
const $$url = "/personal";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Personal,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};

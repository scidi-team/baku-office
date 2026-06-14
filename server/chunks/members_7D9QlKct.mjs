globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_Dn7U0_eq.mjs";
import { r as renderTemplate, m as maybeRenderHead, a as addAttribute, F as Fragment } from "./sequence_I_kcixDX.mjs";
import { r as renderComponent } from "./worker-entry_Cv5GlnJ5.mjs";
import { env } from "cloudflare:workers";
import { $ as $$App } from "./App_ChWwyHiq.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const prerender = false;
const $$Members = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Members;
  const { getSession } = await import("./auth_BXoLTJDQ.mjs");
  const ses = await getSession(env, Astro2.request);
  if (!ses || ses.role !== "admin" || ses.ctx !== "org") return Astro2.redirect("/login", 302);
  const { listUsers } = await import("./users_BHOLHxMy.mjs");
  const users = await listUsers(env);
  const roles = ["admin", "accounting", "clerical", "other", "member"];
  return renderTemplate`${renderComponent($$result, "App", $$App, { "title": "人・ロール管理", "active": "/settings/members" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<h1>人・ロール管理</h1> <div class="card"> <div class="row"> <select id="inviteRole" aria-label="招待する人の役割">${roles.map((r) => renderTemplate`<option${addAttribute(r, "value")}>${r}</option>`)}</select> <button class="btn btn-primary" id="inviteBtn" style="flex:0 0 auto">招待コードを発行</button> </div> <p class="muted" id="inviteOut"></p> </div> <div class="table-wrap" style="margin-top:1rem"><table><thead><tr><th>氏名・役職</th><th>ロール</th><th>状態</th><th>操作</th></tr></thead><tbody> ${users.map((u) => renderTemplate`<tr${addAttribute(u.id, "data-id")}> <td>${u.name || "(未設定)"}</td> <td><select class="role btn-sm"${addAttribute(u.id === "org", "disabled")} aria-label="役割">${roles.map((r) => renderTemplate`<option${addAttribute(r, "value")}${addAttribute(r === u.role, "selected")}>${r}</option>`)}</select></td> <td>${u.status}${u.leave_requested_at ? renderTemplate`<span class="muted">・脱退申請中</span>` : null}</td> <td style="white-space:nowrap"> ${u.status === "pending" && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate`<button class="btn btn-sm btn-ok act" data-a="approve">承認</button> <button class="btn btn-sm btn-danger act" data-a="reject">却下</button>` })}`} ${u.status === "active" && u.leave_requested_at && renderTemplate`<button class="btn btn-sm btn-danger act" data-a="leave_approve">脱退を承認</button>`} ${u.status === "active" && !u.leave_requested_at && renderTemplate`<button class="btn btn-sm btn-danger act" data-a="reject">無効化</button>`} ${u.id !== "org" && u.id !== ses.uid && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <button class="btn btn-sm btn-danger del-user" title="名簿から完全に削除">削除</button>` })}`} </td></tr>`)} ${users.length === 0 && renderTemplate`<tr><td colspan="4" class="muted">メンバーがいません。招待コードを発行してください。</td></tr>`} </tbody></table></div>  `, "scripts": async ($$result2) => renderTemplate(_a || (_a = __template(['<script>\n    document.getElementById("inviteBtn").addEventListener("click",async(e)=>{\n      const r=await window.bo.api("/api/members",{_action:"invite",role:document.getElementById("inviteRole").value},{btn:e.currentTarget,successMsg:null});\n      if(r.ok){const code=r.data.code,url=location.origin+"/join?code="+encodeURIComponent(code);const out=document.getElementById("inviteOut");out.replaceChildren();out.append("コード：");const c=document.createElement("code");c.textContent=code;const m=document.createElement("span");m.className="muted";m.textContent="（1週間・1回）";const cp=document.createElement("button");cp.className="btn btn-sm";cp.type="button";cp.textContent="参加URLをコピー";out.append(c," ",m," ",cp);cp.addEventListener("click",()=>navigator.clipboard.writeText(url).then(()=>window.bo.toast("参加URLをコピーしました")).catch(()=>window.bo.toast("コピーできませんでした","err")));window.bo.toast("招待コードを発行しました");}\n    });\n    document.querySelectorAll("tr[data-id]").forEach(tr=>{const id=tr.dataset.id;\n      tr.querySelectorAll(".act").forEach(b=>b.addEventListener("click",async(e)=>{const r=await window.bo.api("/api/members",{_action:e.target.dataset.a,id},{btn:e.target,successMsg:"更新しました"});if(r.ok)setTimeout(()=>location.reload(),500);}));\n      const delBtn=tr.querySelector(".del-user");if(delBtn)delBtn.addEventListener("click",async(e)=>{const nm=(tr.querySelector("td")?.textContent||"このメンバー").trim();if(!(await window.bo.confirm("「"+nm+"」を名簿から完全に削除します。よろしいですか？",{title:"メンバーの削除",confirmLabel:"削除",danger:true,irreversible:true,auditHref:"/diagnostics"})))return;const r=await window.bo.api("/api/members",{_action:"delete",id},{btn:e.target,successMsg:"削除しました"});if(r.ok)setTimeout(()=>location.reload(),500);});\n      const sel=tr.querySelector(".role");if(sel&&!sel.disabled){let prev=sel.value;sel.addEventListener("change",async()=>{if(!(await window.bo.confirm("このメンバーのロールを「"+sel.value+"」に変更しますか？",{confirmLabel:"変更",danger:true,auditHref:"/diagnostics"}))){sel.value=prev;return;}const r=await window.bo.api("/api/members",{_action:"role",id,role:sel.value},{successMsg:"ロールを変更しました"});if(r.ok)prev=sel.value;else sel.value=prev;});}\n    });\n  <\/script>']))) })}`;
}, "/home/runner/work/baku-office/baku-office/apps/client/src/pages/settings/members.astro", void 0);
const $$file = "/home/runner/work/baku-office/baku-office/apps/client/src/pages/settings/members.astro";
const $$url = "/settings/members";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Members,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};

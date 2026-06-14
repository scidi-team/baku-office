globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_Dn7U0_eq.mjs";
import { r as renderTemplate, m as maybeRenderHead, a as addAttribute } from "./sequence_I_kcixDX.mjs";
import { r as renderComponent } from "./worker-entry_Cv5GlnJ5.mjs";
import { $ as $$App } from "./App_ChWwyHiq.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const prerender = false;
const $$Join = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Join;
  const code = Astro2.url.searchParams.get("code") ?? "";
  return renderTemplate`${renderComponent($$result, "App", $$App, { "title": "参加", "auth": false }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<h1 style="margin-top:1rem">組織に参加</h1> <p class="muted">招待コードで参加します。登録後は<strong>管理者の承認</strong>で利用開始（§6.3）。</p> <div class="card"> <div class="field"><label for="code">招待コード</label><input id="code"${addAttribute(code, "value")}></div> <div class="field"><label for="name">氏名・役職</label><input id="name" placeholder="例：山田太郎 / 会計"></div> <div class="field"><label for="lid">ログインID</label><input id="lid" placeholder="半角"></div> <div class="field"><label for="pw">パスワード</label><input id="pw" type="password"></div> <button class="btn btn-primary" id="join">参加申請する</button> </div>  `, "scripts": async ($$result2) => renderTemplate(_a || (_a = __template(['<script>\n    document.getElementById("join").addEventListener("click",async(e)=>{\n      const r=await window.bo.api("/api/join",{code:document.getElementById("code").value,name:document.getElementById("name").value,loginId:document.getElementById("lid").value,password:document.getElementById("pw").value},{btn:e.currentTarget,successMsg:"申請しました。管理者の承認をお待ちください。"});\n      if(r.ok)setTimeout(()=>location.href="/login",1500);\n    });\n  <\/script>']))) })}`;
}, "/home/runner/work/baku-office/baku-office/apps/client/src/pages/join.astro", void 0);
const $$file = "/home/runner/work/baku-office/baku-office/apps/client/src/pages/join.astro";
const $$url = "/join";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Join,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};

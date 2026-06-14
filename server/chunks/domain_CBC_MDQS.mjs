globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_Dn7U0_eq.mjs";
import { r as renderTemplate, m as maybeRenderHead, F as Fragment, a as addAttribute } from "./sequence_I_kcixDX.mjs";
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
const $$Domain = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Domain;
  const { getSession } = await import("./auth_BXoLTJDQ.mjs");
  const ses = await getSession(env, Astro2.request);
  if (!ses || ses.role !== "admin" || ses.ctx !== "org") return Astro2.redirect("/login", 302);
  const entitlement = await (await import("./client_DsX87Mps.mjs")).cachedEntitlement(env);
  const hasPlus = atLeast(entitlement, "plus");
  const { getCustomDomain } = await import("./custom-domain_0fz0VPJf.mjs");
  const cfg = hasPlus ? await getCustomDomain(Astro2.locals.ctx) : null;
  const t = (n) => new Date(n * 1e3).toLocaleString("ja-JP");
  return renderTemplate`${renderComponent($$result, "App", $$App, { "title": "カスタムドメイン", "active": "/settings" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<h1>カスタムドメイン</h1> ${!hasPlus && renderTemplate`<div class="card"> <div class="banner banner-warn">この機能は <strong>Plus 以上</strong>のプランで利用できます。</div> <p class="muted">独自ドメイン（例 <code>office.example.org</code>）でアプリを公開できます。</p> <a class="btn btn-primary" href="/billing">プラン・課金へ</a> </div>`}${hasPlus && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <p class="muted">アプリを独自ドメインで公開します。ここで希望ドメインを保存し、実際の紐付けは下記手順に従って <strong>あなたの Cloudflare アカウント</strong>で行ってください（当社はあなたのアカウントに入りません）。</p> <div class="card"> <div class="field"><label>カスタムドメイン<input id="cd"${addAttribute(cfg?.domain ?? "", "value")} placeholder="office.example.org"></label></div> ${cfg && renderTemplate`<p class="muted" style="font-size:.82rem">登録：${cfg.domain}（保存 ${t(cfg.registeredAt)}）</p>`} <button class="btn btn-primary" id="saveDomain">保存</button> <p class="muted" style="font-size:.82rem;margin-top:.4rem">空欄で保存すると設定を解除します。</p> </div> <h2>紐付け手順（Cloudflare ダッシュボード）</h2> <div class="card"> <ol style="margin:0;padding-left:1.2rem;line-height:1.9"> <li>Cloudflare ダッシュボード → <strong>Workers &amp; Pages</strong> → このアプリの Worker（<code>baku-office-app</code>）を開く。</li> <li><strong>Settings → Domains &amp; Routes → Add → Custom Domain</strong> を選び、上で保存したドメインを入力。</li> <li>ドメインが Cloudflare で管理されていれば、DNS と証明書は自動で設定されます（数分〜）。</li> <li>反映後、独自ドメインでアプリが開けることを確認してください。</li> </ol> <p class="muted" style="font-size:.82rem;margin-top:.5rem">※ Worker への紐付けはお客様の Cloudflare 操作です。当社は手順案内のみを行います。</p> </div> <h2>ドメインをお持ちでない場合</h2> <div class="banner banner-info">
ドメインは <strong>Cloudflare Registrar</strong> で取得すると、上記の紐付けがスムーズです（原価提供・更新も簡単）。
<a href="https://www.cloudflare.com/products/registrar/" target="_blank" rel="noopener">Cloudflare Registrar を見る</a>。
        もちろん他社で取得済み／取得するドメインでも、Cloudflare に追加すれば利用できます。
</div>  `, "scripts": async ($$result3) => renderTemplate(_a || (_a = __template(['<script slot="scripts">\n        (function () {\n          const btn = document.getElementById("saveDomain");\n          if (!btn) return;\n          btn.addEventListener("click", async (e) => {\n            const domain = document.getElementById("cd").value.trim();\n            const r = await window.bo.api("/api/settings", { _action: "custom_domain", domain }, { btn: e.currentTarget, successMsg: "保存しました" });\n            if (r.ok) setTimeout(() => location.reload(), 700);\n          });\n        })();\n      <\/script>']))) })}`}` })}`;
}, "/home/runner/work/baku-office/baku-office/apps/client/src/pages/settings/domain.astro", void 0);
const $$file = "/home/runner/work/baku-office/baku-office/apps/client/src/pages/settings/domain.astro";
const $$url = "/settings/domain";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Domain,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};

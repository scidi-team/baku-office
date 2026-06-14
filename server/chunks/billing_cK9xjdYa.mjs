globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_Dn7U0_eq.mjs";
import { r as renderTemplate, d as defineScriptVars, m as maybeRenderHead, a as addAttribute } from "./sequence_I_kcixDX.mjs";
import { r as renderComponent } from "./worker-entry_Cv5GlnJ5.mjs";
import { env } from "cloudflare:workers";
import { $ as $$App } from "./App_ChWwyHiq.mjs";
import "./stripe_r-RFTlbb.mjs";
import { planLabel, atLeast } from "./index_CrjiuAkj.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const prerender = false;
const $$Billing = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Billing;
  const { getSession } = await import("./auth_BXoLTJDQ.mjs");
  const ses = await getSession(env, Astro2.request);
  if (!ses || ses.role !== "admin" || ses.ctx !== "org") return Astro2.redirect("/login", 302);
  const { pollHost, cachedEntitlement, getLicenseId, hostFetch } = await import("./client_DsX87Mps.mjs");
  const check = await pollHost(env, Astro2.url.origin);
  const entitlement = check?.entitlement ?? await cachedEntitlement(env);
  const licenseId = await getLicenseId(env);
  const hostBase = env.HOST_BASE_URL.replace(/\/$/, "");
  let stripe = false;
  try {
    stripe = (await (await hostFetch(env, "/api/billing/status")).json()).stripe ?? false;
  } catch {
  }
  return renderTemplate`${renderComponent($$result, "App", $$App, { "title": "プラン・課金", "active": "/billing" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<h1>プラン・課金</h1> ${!stripe && renderTemplate`<div class="banner banner-warn">🧪 <strong>デモモード</strong>：Stripe未接続のため、下の「支払った（デモ）」で入金を擬似確認しエンタイトルメントを昇格します（本番はStripe決済）。</div>`}<div class="card">現在のプラン：<span class="pill">${planLabel(entitlement)}</span> <p class="muted">入金が確認・継続している間のみ有料機能が有効（§2.3）。無料(Free)は常に利用可。データはロック・削除しません。</p> </div> <div class="card" style="margin-top:1rem"> <h2 style="margin-top:0;border:0">アップグレード</h2> <p class="muted">${stripe ? "カードは即時、銀行振込・コンビニは入金確認後に反映（§2.4）。" : "デモ：ボタンで即時に昇格します。"}</p> <button${addAttribute(`btn ${stripe ? "btn-primary" : "btn-warn"} up`, "class")} data-plan="plus"${addAttribute(atLeast(entitlement, "plus"), "disabled")}>${stripe ? "Plus（AI）にする" : "【デモ】Plus に支払った"}</button> <button${addAttribute(`btn ${stripe ? "btn-primary" : "btn-warn"} up`, "class")} data-plan="pro"${addAttribute(atLeast(entitlement, "pro"), "disabled")}>${stripe ? "Pro（エージェント）にする" : "【デモ】Pro に支払った"}</button> ${entitlement === "test" && renderTemplate`<p class="muted" style="margin-top:.5rem">テスト権限（全機能解放）が付与されています。</p>`} </div> <div class="card" style="margin-top:1rem"> <h2 style="margin-top:0;border:0">NonProfit（非営利団体・全機能無料）</h2> ${entitlement === "nonprofit" ? renderTemplate`<p class="muted">NonProfit（全機能・無料）が有効です。ご不明点は担当窓口へ。</p>` : renderTemplate`<p class="muted">非営利団体は、ホスト審査の通過で<strong>全機能を無料</strong>で利用できます。お申し込みは<strong>申込画面の「非営利団体として申し込む」</strong>から（既に導入済みの場合は当社までお問い合わせください）。承認まではFree相当で利用できます。</p>`} </div> <div class="card" style="margin-top:1rem"> <h2 style="margin-top:0;border:0">エンタープライズ（大企業・組織向け）</h2> ${entitlement === "enterprise" ? renderTemplate`<p class="muted">エンタープライズ（全機能解放）が有効です。ご相談は担当窓口へ。</p>` : renderTemplate`<p class="muted">大企業・組織向けに、全機能解放・個別サポート・専用条件をご用意します。<strong>自己決済ではなく個別相談</strong>での提供です。導入をご検討の場合は当社（合同会社貘）までお問い合わせください。</p>`} </div>  `, "scripts": async ($$result2) => renderTemplate(_a || (_a = __template(["<script>(function(){", '\n    document.querySelectorAll(".up").forEach(b=>b.addEventListener("click",async(e)=>{\n      const plan=e.currentTarget.dataset.plan;\n      const r=await window.bo.api("/api/billing/start",{plan},{btn:e.currentTarget,successMsg:null});\n      if(!r.ok)return;\n      if(r.data.mode==="stripe"){window.bo.toast("決済へ移動します");location.href=r.data.url;return;}\n      window.bo.toast("入金確認（デモ）へ移動します");\n      location.href=`${hostBase}/api/billing/dev-confirm?license_id=${encodeURIComponent(licenseId)}&plan=${plan}&return=${encodeURIComponent(location.origin+"/billing")}`;\n    }));\n  })();<\/script>'], ["<script>(function(){", '\n    document.querySelectorAll(".up").forEach(b=>b.addEventListener("click",async(e)=>{\n      const plan=e.currentTarget.dataset.plan;\n      const r=await window.bo.api("/api/billing/start",{plan},{btn:e.currentTarget,successMsg:null});\n      if(!r.ok)return;\n      if(r.data.mode==="stripe"){window.bo.toast("決済へ移動します");location.href=r.data.url;return;}\n      window.bo.toast("入金確認（デモ）へ移動します");\n      location.href=\\`\\${hostBase}/api/billing/dev-confirm?license_id=\\${encodeURIComponent(licenseId)}&plan=\\${plan}&return=\\${encodeURIComponent(location.origin+"/billing")}\\`;\n    }));\n  })();<\/script>'])), defineScriptVars({ licenseId, hostBase, stripe })) })}`;
}, "/home/runner/work/baku-office/baku-office/apps/client/src/pages/billing.astro", void 0);
const $$file = "/home/runner/work/baku-office/baku-office/apps/client/src/pages/billing.astro";
const $$url = "/billing";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Billing,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};

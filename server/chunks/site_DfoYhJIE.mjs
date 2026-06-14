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
const $$Site = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Site;
  const { getSession } = await import("./auth_BXoLTJDQ.mjs");
  const ses = await getSession(env, Astro2.request);
  if (!ses || ses.role !== "admin" || ses.ctx !== "org") return Astro2.redirect("/login", 302);
  const { cachedEntitlement } = await import("./client_DsX87Mps.mjs");
  const hasPro = atLeast(await cachedEntitlement(env), "pro");
  const { listSites } = await import("./sites_xD8oSYrt.mjs");
  const sites = hasPro ? await listSites(env) : [];
  const origin = Astro2.url.origin;
  return renderTemplate`${renderComponent($$result, "App", $$App, { "title": "HP/LP 管理", "active": "/settings/site" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<h1>HP/LP 管理</h1> ${!hasPro && renderTemplate`<div class="card"> <div class="banner banner-warn">この機能は <strong>Pro プラン</strong>で利用できます。</div> <p class="muted">団体のHP/LPをサブパスで公開し、会員申込フォームを会員管理・Stripe と連動できます。</p> <a class="btn btn-primary" href="/billing">プラン・課金へ</a> </div>`}${hasPro && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <p class="muted">サブパス公開：トップ＝<code>${origin}/site</code>（slug=home）、各ページ＝<code>${origin}/lp/&lt;slug&gt;</code>。会員申込フォームを表示すると<strong>会員管理に連動</strong>します。</p> <h2>ページ一覧</h2> <div class="table-wrap"><table> <thead><tr><th>slug</th><th>タイトル</th><th>状態</th><th>申込</th><th>操作</th></tr></thead> <tbody> ${sites.map((s) => renderTemplate`<tr${addAttribute(s.slug, "data-slug")}${addAttribute(s.title, "data-title")}${addAttribute(s.body ?? "", "data-body")}${addAttribute(s.published, "data-pub")}${addAttribute(s.show_join, "data-join")}> <td><code>${s.slug}</code></td><td>${s.title}</td><td>${s.published ? "公開" : "下書き"}</td><td>${s.show_join ? "あり" : "—"}</td> <td style="white-space:nowrap"><button class="btn btn-sm s-edit">編集</button> ${s.published && renderTemplate`<a class="btn btn-sm"${addAttribute(s.slug === "home" ? "/site" : "/lp/" + s.slug, "href")} target="_blank" rel="noreferrer">開く</a>`} <button class="btn btn-sm btn-danger s-del">削除</button></td> </tr>`)} ${sites.length === 0 && renderTemplate`<tr><td colspan="5" class="muted">ページがありません。下で作成してください。</td></tr>`} </tbody> </table></div> <h2 id="editor">ページを作成 / 編集</h2> <div class="card"> <div class="field"><label>slug（英数字。トップは home）</label><input id="s-slug" placeholder="home"></div> <div class="field"><label>タイトル</label><input id="s-title"></div> <div class="field"><label>本文（HTML可）</label><textarea id="s-body" rows="10" placeholder="<h1>○○会へようこそ</h1><p>……</p>"></textarea></div> <label><input type="checkbox" id="s-pub"> 公開する</label> <label style="margin-left:1rem"><input type="checkbox" id="s-join"> 会員申込フォームを表示</label> <div style="margin-top:.6rem"><button class="btn btn-primary" id="s-save">保存</button></div> </div> <h2>Stripe 連携（任意）</h2> <div class="banner banner-info">カード決済で会員を自動連携する場合：Stripe の Webhook 送信先に <code>${origin}/api/site/stripe-webhook</code> を設定し、連携設定で Stripe のシークレット／Webhook シークレットを登録してください。未設定でも申込は「未払い」で登録され、<strong>現金管理の団体は手動またはエージェントで会員管理</strong>できます。</div>  `, "scripts": async ($$result3) => renderTemplate(_a || (_a = __template(['<script slot="scripts">\n        const save = document.getElementById("s-save");\n        document.querySelectorAll("tr[data-slug]").forEach((tr) => {\n          tr.querySelector(".s-edit")?.addEventListener("click", () => {\n            document.getElementById("s-slug").value = tr.dataset.slug;\n            document.getElementById("s-title").value = tr.dataset.title;\n            document.getElementById("s-body").value = tr.dataset.body;\n            document.getElementById("s-pub").checked = tr.dataset.pub === "1";\n            document.getElementById("s-join").checked = tr.dataset.join === "1";\n            location.hash = "editor";\n          });\n          tr.querySelector(".s-del")?.addEventListener("click", async (e) => {\n            if (await window.bo.confirm("この公開ページを削除しますか？（公開中の場合は閲覧できなくなります）", { confirmLabel: "削除", danger: true, irreversible: true })) { const r = await window.bo.api("/api/site", { _action: "delete", slug: tr.dataset.slug }, { btn: e.currentTarget }); if (r.ok) setTimeout(() => location.reload(), 400); }\n          });\n        });\n        save.addEventListener("click", async (e) => {\n          const slug = (document.getElementById("s-slug").value.trim() || "home");\n          const r = await window.bo.api("/api/site", { _action: "save", slug, title: document.getElementById("s-title").value, body: document.getElementById("s-body").value, published: document.getElementById("s-pub").checked, show_join: document.getElementById("s-join").checked }, { btn: e.currentTarget, successMsg: "保存しました" });\n          if (r.ok) setTimeout(() => location.reload(), 600);\n        });\n      <\/script>']))) })}`}` })}`;
}, "/home/runner/work/baku-office/baku-office/apps/client/src/pages/settings/site.astro", void 0);
const $$file = "/home/runner/work/baku-office/baku-office/apps/client/src/pages/settings/site.astro";
const $$url = "/settings/site";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Site,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};

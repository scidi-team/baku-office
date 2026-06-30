globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_Bc18R3r1.mjs";
import { r as renderTemplate, a as addAttribute, m as maybeRenderHead } from "./sequence_BESBTeYg.mjs";
import { r as renderComponent } from "./worker-entry_C_PXI25C.mjs";
import { env } from "cloudflare:workers";
import { $ as $$App } from "./App_DKNgqumx.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const prerender = false;
const $$Nav = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Nav;
  const { getSession } = await import("./auth_TPDi1U5M.mjs");
  const ses = await getSession(env, Astro2.request);
  if (!ses) return Astro2.redirect("/login", 302);
  if (ses.role !== "admin") return Astro2.redirect("/forbidden", 302);
  const { getSiteNav } = await import("./site-nav_XChDIK-s.mjs");
  const nav = await getSiteNav(env);
  return renderTemplate`${renderComponent($$result, "App", $$App, { "title": "サイトナビ", "active": "/settings" }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", '<h1>サイトナビ</h1> <p class="muted" style="font-size:.9rem">公開ページ（HP/LP・お知らせ・イベント）共通のヘッダーメニューとフッターリンクです。1行 = 「表示名 | リンク」（リンクは /で始まる内部パスか https）。</p> <div class="card" style="padding:20px;margin-top:12px"> <div class="field" style="margin:.5rem 0"><label>ヘッダーメニュー（最大8行）</label> <textarea id="menu" rows="6"', ' style="width:100%">', '</textarea> </div> <div class="field" style="margin:.5rem 0"><label>フッターリンク（最大12行）</label> <textarea id="footer" rows="5"', ' style="width:100%">', '</textarea> </div> <div class="field" style="margin:.5rem 0"><label>言語切替（多言語・最大8行／「表示名 | リンク | 言語コード」）</label> <textarea id="langs" rows="4"', ' style="width:100%">', '</textarea> <div class="muted" style="font-size:.8rem;margin-top:4px">各言語の翻訳ページを別 slug で作り、ここで割り当てると公開ページに言語切替＋hreflang が出ます。</div> </div> <button class="btn btn-primary" id="nav-save">保存</button> <span class="muted" id="nav-msg" style="margin-left:8px;font-size:.85rem"></span> </div> <script data-astro-rerun>\n    (function () {\n      const parse = (t) => t.split("\\n").map((l) => { const i = l.indexOf("|"); if (i < 0) return null; const label = l.slice(0, i).trim(); const href = l.slice(i + 1).trim(); return label && href ? { label, href } : null; }).filter(Boolean);\n      const parseLangs = (t) => t.split("\\n").map((l) => { const ps = l.split("|").map((x) => x.trim()); return ps[0] && ps[1] && ps[2] ? { label: ps[0], href: ps[1], code: ps[2] } : null; }).filter(Boolean);\n      document.getElementById("nav-save").addEventListener("click", async () => {\n        const msg = document.getElementById("nav-msg"); msg.textContent = "保存中…";\n        const r = await fetch("/api/nav", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ menu: parse(document.getElementById("menu").value), footer: parse(document.getElementById("footer").value), langs: parseLangs(document.getElementById("langs").value) }) });\n        const j = await r.json().catch(() => ({}));\n        msg.textContent = j.ok ? "保存しました（公開ページに反映されます）。" : (j.error || "失敗しました");\n      });\n    })();\n  <\/script> '], [" ", '<h1>サイトナビ</h1> <p class="muted" style="font-size:.9rem">公開ページ（HP/LP・お知らせ・イベント）共通のヘッダーメニューとフッターリンクです。1行 = 「表示名 | リンク」（リンクは /で始まる内部パスか https）。</p> <div class="card" style="padding:20px;margin-top:12px"> <div class="field" style="margin:.5rem 0"><label>ヘッダーメニュー（最大8行）</label> <textarea id="menu" rows="6"', ' style="width:100%">', '</textarea> </div> <div class="field" style="margin:.5rem 0"><label>フッターリンク（最大12行）</label> <textarea id="footer" rows="5"', ' style="width:100%">', '</textarea> </div> <div class="field" style="margin:.5rem 0"><label>言語切替（多言語・最大8行／「表示名 | リンク | 言語コード」）</label> <textarea id="langs" rows="4"', ' style="width:100%">', '</textarea> <div class="muted" style="font-size:.8rem;margin-top:4px">各言語の翻訳ページを別 slug で作り、ここで割り当てると公開ページに言語切替＋hreflang が出ます。</div> </div> <button class="btn btn-primary" id="nav-save">保存</button> <span class="muted" id="nav-msg" style="margin-left:8px;font-size:.85rem"></span> </div> <script data-astro-rerun>\n    (function () {\n      const parse = (t) => t.split("\\\\n").map((l) => { const i = l.indexOf("|"); if (i < 0) return null; const label = l.slice(0, i).trim(); const href = l.slice(i + 1).trim(); return label && href ? { label, href } : null; }).filter(Boolean);\n      const parseLangs = (t) => t.split("\\\\n").map((l) => { const ps = l.split("|").map((x) => x.trim()); return ps[0] && ps[1] && ps[2] ? { label: ps[0], href: ps[1], code: ps[2] } : null; }).filter(Boolean);\n      document.getElementById("nav-save").addEventListener("click", async () => {\n        const msg = document.getElementById("nav-msg"); msg.textContent = "保存中…";\n        const r = await fetch("/api/nav", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ menu: parse(document.getElementById("menu").value), footer: parse(document.getElementById("footer").value), langs: parseLangs(document.getElementById("langs").value) }) });\n        const j = await r.json().catch(() => ({}));\n        msg.textContent = j.ok ? "保存しました（公開ページに反映されます）。" : (j.error || "失敗しました");\n      });\n    })();\n  <\/script> '])), maybeRenderHead(), addAttribute("会社概要 | /lp/about\nお知らせ | /news", "placeholder"), nav.menu.map((m) => `${m.label} | ${m.href}`).join("\n"), addAttribute("プライバシーポリシー | /legal\nお問い合わせ | /lp/contact", "placeholder"), nav.footer.map((m) => `${m.label} | ${m.href}`).join("\n"), addAttribute("English | /lp/about-en | en\n中文 | /lp/about-zh | zh", "placeholder"), (nav.langs ?? []).map((m) => `${m.label} | ${m.href} | ${m.code}`).join("\n")) })}`;
}, "/home/runner/work/baku-office/baku-office/apps/client/src/pages/settings/nav.astro", void 0);
const $$file = "/home/runner/work/baku-office/baku-office/apps/client/src/pages/settings/nav.astro";
const $$url = "/settings/nav";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Nav,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};

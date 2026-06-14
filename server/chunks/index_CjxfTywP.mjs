globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_Dn7U0_eq.mjs";
import { r as renderTemplate, m as maybeRenderHead, a as addAttribute } from "./sequence_I_kcixDX.mjs";
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
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Index;
  const { getSession } = await import("./auth_BXoLTJDQ.mjs");
  const ses = await getSession(env, Astro2.request);
  if (!ses) return Astro2.redirect("/login", 302);
  const { cachedEntitlement, getApiKey } = await import("./client_DsX87Mps.mjs");
  const entitlement = await cachedEntitlement(env).catch(() => "free");
  const isAdminOrg = ses.role === "admin" && ses.ctx === "org";
  const hasPlus = atLeast(entitlement, "plus");
  let steps = [];
  if (isAdminOrg) {
    const { googleConfigured } = await import("./google_BPQSD05g.mjs");
    const aiReady = !!await getApiKey(env, "gemini") || !!await getApiKey(env, "claude") || !!env.LOCAL_AI_BASE_URL;
    const googleReady = await googleConfigured(env).catch(() => false);
    steps = [
      { label: "AIの接続", href: "/settings/keys", done: aiReady, hint: "AIを使うための接続設定" },
      { label: "プランの確認", href: "/billing", done: entitlement !== "free", hint: "上位プランでAI・連携機能が使えます" },
      { label: "Google との連携（任意）", href: "/settings/google-setup", done: googleReady, hint: "カレンダー・メール等との連携（任意）" }
    ];
  }
  const pendingSteps = steps.filter((s) => !s.done);
  const groups = [
    { title: "アカウント・メンバー", items: [
      { href: "/account", label: "自分のアカウント", desc: "お名前・パスワードなど", show: true },
      { href: "/settings/members", label: "メンバー・権限", desc: "招待・承認・できることの設定", show: isAdminOrg },
      { href: "/billing", label: "プラン・お支払い", desc: "ご利用プランの確認・変更", show: isAdminOrg }
    ] },
    { title: "連携・AI", items: [
      { href: "/settings/keys", label: "AI・外部サービスの連携", desc: "AIや外部サービスとつなぐ設定", show: isAdminOrg },
      { href: "/settings/google-setup", label: "Google との連携", desc: "カレンダー・メールなどとの連携を手順で案内", show: isAdminOrg },
      { href: "/usage", label: "利用状況・上限", desc: "今の利用量と上限の確認", show: isAdminOrg && hasPlus },
      { href: "/drive", label: "クラウド保存の連携", desc: "ファイルの同期・バックアップ", show: isAdminOrg && hasPlus },
      { href: "/settings/directory", label: "エージェントを公開（受付にする）", desc: "団体を公開し、招待なしで問い合わせを受け付ける", show: isAdminOrg && hasPlus },
      { href: "/directory", label: "公開団体を探す", desc: "公開している他団体を探して連絡する", show: isAdminOrg && hasPlus }
    ] },
    { title: "管理者向け（詳細設定）", items: [
      { href: "/settings/advanced", label: "高度なオプション", desc: "AIの詳細設定・容量プラン（上級者向け）", show: isAdminOrg && hasPlus },
      { href: "/settings/domain", label: "独自アドレス（URL）", desc: "独自のURLで公開する", show: isAdminOrg && hasPlus },
      { href: "/settings/a2a", label: "他団体との連携", desc: "ほかの団体と、相互の同意でつながる", show: isAdminOrg && atLeast(entitlement, "pro") }
    ] },
    { title: "運用・サポート", items: [
      { href: "/backup", label: "データの保存（バックアップ）", desc: "データの保存と、もとに戻す操作", show: isAdminOrg },
      { href: "/approvals", label: "AI操作の承認", desc: "AIが行う送信・変更の承認", show: isAdminOrg },
      { href: "/legal", label: "外部送信・AI利用について", desc: "外部への送信やAI利用についての説明", show: true },
      { href: "/review", label: "共有の承認", desc: "個人から団体への共有を承認", show: ses.role === "admin" || ses.role === "accounting" || ses.role === "clerical" },
      { href: "/diagnostics", label: "状態の確認・サポート", desc: "稼働状況の確認・困ったときに", show: true },
      { href: "/settings/update", label: "アプリの更新", desc: "最新版への更新", show: isAdminOrg }
    ] }
  ];
  const slugify = (s) => "g-" + s.replace(/[^\p{L}\p{N}]+/gu, "-");
  const catIcon = {
    "アカウント・メンバー": "M8 11a3.2 3.2 0 100-6.4A3.2 3.2 0 008 11zM2.5 19a5.5 5.5 0 0111 0M16 11a3 3 0 000-6M21.5 19a5.5 5.5 0 00-4-5.3",
    "連携・AI": "M9 3v5M15 3v5M6 8h12v3a6 6 0 01-12 0zM12 17v4",
    "管理者向け（詳細設定）": "M5 6h14M5 12h14M5 18h14M9 6a1.6 1.6 0 100 .01M15 12a1.6 1.6 0 100 .01M8 18a1.6 1.6 0 100 .01",
    "運用・サポート": "M12 3l7 2.5V11c0 4.5-3 8-7 9.5C8 19 5 15.5 5 11V5.5z"
  };
  const visGroups = groups.map((g) => ({ ...g, items: g.items.filter((i) => i.show) })).filter((g) => g.items.length > 0);
  return renderTemplate`${renderComponent($$result, "App", $$App, { "title": "設定", "active": "/settings", "data-astro-cid-376iicvc": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<h1 data-astro-cid-376iicvc>設定</h1> <p class="muted" data-astro-cid-376iicvc>このシステムの設定・オプションをまとめています。項目を選んでください。</p> <div class="card" style="margin-top:1rem" data-astro-cid-376iicvc> <h2 class="h2" style="margin:0 0 .7rem" data-astro-cid-376iicvc>表示</h2> <div class="spread" style="flex-wrap:wrap;gap:14px" data-astro-cid-376iicvc> <div data-astro-cid-376iicvc><strong data-astro-cid-376iicvc>ダークモード</strong><div class="muted" style="font-size:.82rem" data-astro-cid-376iicvc>画面全体の配色を切り替えます。</div></div> <label class="switch" data-astro-cid-376iicvc><input type="checkbox" id="set-dark" aria-label="ダークモード" data-astro-cid-376iicvc><span class="track" data-astro-cid-376iicvc></span><span class="knob" data-astro-cid-376iicvc></span></label> </div> <div class="hr" data-astro-cid-376iicvc></div> <div class="spread" style="flex-wrap:wrap;gap:14px" data-astro-cid-376iicvc> <div data-astro-cid-376iicvc><strong data-astro-cid-376iicvc>文字の大きさ</strong><div class="muted" style="font-size:.85rem" data-astro-cid-376iicvc>画面全体の文字を大きくできます（見えにくい方に）。</div></div> <div class="seg" id="set-fontsize" role="group" aria-label="文字の大きさ" data-astro-cid-376iicvc> <button class="seg-opt" type="button" data-fs="std" data-astro-cid-376iicvc>標準</button> <button class="seg-opt" type="button" data-fs="large" style="font-size:1.12rem" data-astro-cid-376iicvc>大</button> <button class="seg-opt" type="button" data-fs="xl" style="font-size:1.28rem" data-astro-cid-376iicvc>特大</button> </div> </div> <div class="hr" data-astro-cid-376iicvc></div> <div class="spread" style="flex-wrap:wrap;gap:14px" data-astro-cid-376iicvc> <div data-astro-cid-376iicvc><strong data-astro-cid-376iicvc>ナビの形</strong><div class="muted" style="font-size:.85rem" data-astro-cid-376iicvc>メニューの配置（スマホ画面では自動で下部タブになります）。</div></div> <div class="seg" id="set-nav" role="group" aria-label="ナビの形" data-astro-cid-376iicvc> <button class="seg-opt" type="button" data-nav="top" data-astro-cid-376iicvc>上部</button> <button class="seg-opt" type="button" data-nav="side" data-astro-cid-376iicvc>サイド</button> <button class="seg-opt" type="button" data-nav="bottom" data-astro-cid-376iicvc>下部</button> </div> </div> <div class="hr" data-astro-cid-376iicvc></div> <div class="spread" style="flex-wrap:wrap;gap:14px" data-astro-cid-376iicvc> <div data-astro-cid-376iicvc><strong data-astro-cid-376iicvc>相棒（キャラクター）を表示</strong><div class="muted" style="font-size:.85rem" data-astro-cid-376iicvc>画面の右下に表示される相棒のオン／オフ。</div></div> <label class="switch" data-astro-cid-376iicvc><input type="checkbox" id="set-mascot" aria-label="相棒を表示" data-astro-cid-376iicvc><span class="track" data-astro-cid-376iicvc></span><span class="knob" data-astro-cid-376iicvc></span></label> </div> </div> ${isAdminOrg && pendingSteps.length > 0 && renderTemplate`<div class="card" style="border-left:3px solid var(--brand)" data-astro-cid-376iicvc> <strong data-astro-cid-376iicvc>初期設定（あと ${pendingSteps.length} 項目）</strong> <p class="muted" style="font-size:.85rem;margin:.2rem 0 .6rem" data-astro-cid-376iicvc>まず必須項目から段階的に設定すると、AI・連携機能を安全に有効化できます。</p> <ul style="margin:0;padding-left:1.2rem" data-astro-cid-376iicvc> ${steps.map((s) => renderTemplate`<li style="margin:.2rem 0" data-astro-cid-376iicvc> <span${addAttribute(s.done ? "設定済み" : "未設定", "aria-label")} data-astro-cid-376iicvc>${s.done ? "✅" : "⬜"}</span>${" "} ${s.done ? renderTemplate`<span data-astro-cid-376iicvc>${s.label}</span>` : renderTemplate`<a${addAttribute(s.href, "href")} data-astro-cid-376iicvc>${s.label}</a>`} <span class="muted" style="font-size:.8rem" data-astro-cid-376iicvc> — ${s.hint}</span> </li>`)} </ul> </div>`}<div class="settings" data-astro-cid-376iicvc> <nav class="set-nav" aria-label="設定カテゴリ" data-astro-cid-376iicvc> ${visGroups.map((g, idx) => renderTemplate`<a${addAttribute("set-nav-btn" + (idx === 0 ? " on" : ""), "class")}${addAttribute("#" + slugify(g.title), "href")}${addAttribute(slugify(g.title), "data-spy")} data-astro-cid-376iicvc> <span class="sn-ico" data-astro-cid-376iicvc><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-astro-cid-376iicvc><path${addAttribute(catIcon[g.title] ?? "", "d")} data-astro-cid-376iicvc></path></svg></span> <span data-astro-cid-376iicvc><strong data-astro-cid-376iicvc>${g.title}</strong></span> </a>`)} </nav> <div class="set-pane" data-astro-cid-376iicvc> ${visGroups.map((g) => renderTemplate`<section${addAttribute(slugify(g.title), "id")} style="margin-bottom:28px;scroll-margin-top:78px" data-astro-cid-376iicvc> <h2 style="margin-top:0" data-astro-cid-376iicvc>${g.title}</h2> <div class="grid" data-astro-cid-376iicvc> ${g.items.map((i) => renderTemplate`<a class="card link"${addAttribute(i.href, "href")} data-astro-cid-376iicvc> <strong data-astro-cid-376iicvc>${i.label}</strong> <div class="muted" style="font-size:.85rem;margin-top:.2rem" data-astro-cid-376iicvc>${i.desc}</div> </a>`)} </div> </section>`)} </div> </div>   `, "scripts": async ($$result2) => renderTemplate(_a || (_a = __template(['<script>\n    // 表示設定（ダークモード・ナビ形態）。localStorage に保存し即時反映（App.astro の起動スクリプトと同じキー）。\n    (function () {\n      const root = document.documentElement;\n      const dark = document.getElementById("set-dark");\n      if (dark) {\n        dark.checked = root.getAttribute("data-theme") === "dark";\n        dark.addEventListener("change", () => {\n          root.classList.add("theme-switching");\n          root.setAttribute("data-theme", dark.checked ? "dark" : "light");\n          try { localStorage.setItem("bo_theme", dark.checked ? "dark" : "light"); } catch (e) { /* noop */ }\n          requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("theme-switching")));\n        });\n      }\n      // 文字の大きさ（標準/大/特大）。html[data-fontsize] を即時切替＋localStorage 保存（App.astro 起動scriptが読む）。\n      // 相棒（マスコット）の表示ON/OFF。html[data-mascot] を即時切替＋localStorage 保存（App.astro 起動scriptが読む）。\n      const mascot = document.getElementById("set-mascot");\n      if (mascot) {\n        mascot.checked = root.getAttribute("data-mascot") !== "off";\n        mascot.addEventListener("change", () => {\n          if (mascot.checked) { root.removeAttribute("data-mascot"); try { localStorage.setItem("bo_mascot", "on"); } catch (e) { /* noop */ } }\n          else { root.setAttribute("data-mascot", "off"); try { localStorage.setItem("bo_mascot", "off"); } catch (e) { /* noop */ } }\n        });\n      }\n      const fs = document.getElementById("set-fontsize");\n      if (fs) {\n        const curFs = root.getAttribute("data-fontsize") || "std";\n        fs.querySelectorAll(".seg-opt").forEach((b) => b.classList.toggle("on", b.dataset.fs === curFs));\n        fs.querySelectorAll(".seg-opt").forEach((b) => b.addEventListener("click", () => {\n          root.setAttribute("data-fontsize", b.dataset.fs);\n          try { localStorage.setItem("bo_fontsize", b.dataset.fs); } catch (e) { /* noop */ }\n          fs.querySelectorAll(".seg-opt").forEach((x) => x.classList.toggle("on", x === b));\n        }));\n      }\n      const seg = document.getElementById("set-nav");\n      if (seg) {\n        const cur = root.getAttribute("data-nav") || "bottom";\n        seg.querySelectorAll(".seg-opt").forEach((b) => { b.classList.toggle("on", b.dataset.nav === cur); });\n        seg.querySelectorAll(".seg-opt").forEach((b) => b.addEventListener("click", () => {\n          root.setAttribute("data-nav", b.dataset.nav);\n          try { localStorage.setItem("bo_nav", b.dataset.nav); } catch (e) { /* noop */ }\n          seg.querySelectorAll(".seg-opt").forEach((x) => x.classList.toggle("on", x === b));\n        }));\n      }\n    })();\n    // スクロールスパイ：表示中セクションに応じて左ナビをハイライト。\n    (function () {\n      const btns = [...document.querySelectorAll(".set-nav-btn")];\n      const map = new Map(btns.map((b) => [b.dataset.spy, b]));\n      const secs = btns.map((b) => document.getElementById(b.dataset.spy)).filter(Boolean);\n      if (!("IntersectionObserver" in window) || !secs.length) return;\n      const io = new IntersectionObserver((ents) => {\n        ents.forEach((en) => { if (en.isIntersecting) { btns.forEach((b) => b.classList.remove("on")); map.get(en.target.id)?.classList.add("on"); } });\n      }, { rootMargin: "-78px 0px -70% 0px" });\n      secs.forEach((s) => io.observe(s));\n    })();\n  <\/script>']))) })}`;
}, "/home/runner/work/baku-office/baku-office/apps/client/src/pages/settings/index.astro", void 0);
const $$file = "/home/runner/work/baku-office/baku-office/apps/client/src/pages/settings/index.astro";
const $$url = "/settings";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};

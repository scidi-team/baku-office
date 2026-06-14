globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_Dn7U0_eq.mjs";
import { c as createRenderInstruction, r as renderTemplate, e as renderSlot, F as Fragment, a as addAttribute, b as renderHead, u as unescapeHTML } from "./sequence_I_kcixDX.mjs";
import { r as renderComponent } from "./worker-entry_Cv5GlnJ5.mjs";
import { env } from "cloudflare:workers";
import "./stripe_r-RFTlbb.mjs";
import { atLeast } from "./index_CrjiuAkj.mjs";
async function renderScript(result, id) {
  const inlined = result.inlinedScripts.get(id);
  let content = "";
  if (inlined != null) {
    if (inlined) {
      content = `<script type="module">${inlined}<\/script>`;
    }
  } else {
    const resolved = await result.resolve(id);
    content = `<script type="module" src="${result.userAssetsBase ? (result.base === "/" ? "" : result.base) + result.userAssetsBase : ""}${resolved}"><\/script>`;
  }
  return createRenderInstruction({ type: "script", id, content });
}
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$App = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$App;
  const { title, active = "", auth = true, bare = false } = Astro2.props;
  const { getSession } = await import("./auth_BXoLTJDQ.mjs");
  const ses = await getSession(env, Astro2.request).catch(() => null);
  const ICONS = {
    home: "M3 11.2 12 4l9 7.2M5 9.6V20h5v-5.5h4V20h5V9.6",
    spark: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z",
    grid: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
    gear: "M12 9.2a2.8 2.8 0 100 5.6 2.8 2.8 0 000-5.6M19.4 12c0-.5 0-1-.1-1.4l2-1.5-2-3.4-2.3 1a7 7 0 00-2.4-1.4L14.2 2H9.8l-.4 2.3a7 7 0 00-2.4 1.4l-2.3-1-2 3.4 2 1.5c-.1.4-.1.9-.1 1.4s0 1 .1 1.4l-2 1.5 2 3.4 2.3-1a7 7 0 002.4 1.4l.4 2.3h4.4l.4-2.3a7 7 0 002.4-1.4l2.3 1 2-3.4-2-1.5c.1-.4.1-.9.1-1.4",
    bell: "M6 16V11a6 6 0 0112 0v5l2 2H4zM9.5 20a2.5 2.5 0 005 0",
    moon: "M20 13.5A8 8 0 119.5 4 6.5 6.5 0 0020 13.5z",
    sun: "M12 6.5V3M12 21v-3.5M6.5 12H3M21 12h-3.5M7 7 4.8 4.8M19.2 19.2 17 17M17 7l2.2-2.2M4.8 19.2 7 17M12 8.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z",
    card: "M3 6h18v12H3zM3 10h18",
    logout: "M9 5H5v14h4M14 8l4 4-4 4M18 12H9"
  };
  const navIcon = { "/": "home", "/chat": "spark", "/apps": "grid", "/settings": "gear" };
  const iconFor = (href) => ICONS[navIcon[href] ?? "home"] ?? ICONS.home;
  const items = [
    { href: "/", label: "ホーム", show: true },
    { href: "/chat", label: "AI", show: true },
    { href: "/apps", label: "アプリ", show: true },
    { href: "/settings", label: "設定", show: true }
  ];
  const ctx = Astro2.locals.ctx;
  const [themeMod, navMod, diagMod, notifMod, clientMod] = await Promise.all([
    import("./theme_DO0iS6ur.mjs"),
    import("./nav_CqD0IXOG.mjs"),
    import("./diag_8r20ZCMR.mjs"),
    import("./notifications_VbMxL3UL.mjs"),
    import("./client_DsX87Mps.mjs")
  ]);
  const [theme, navOv, limitErr, unreadNotif, entitlement, hasClaude, hasGemini] = await Promise.all([
    themeMod.getTheme(ctx).catch(() => ({})),
    navMod.getNavOverrides(ctx).catch(() => null),
    diagMod.hasRecentLimitError(env).catch(() => false),
    ses ? notifMod.countUnread(ctx, ses.uid).catch(() => 0) : Promise.resolve(0),
    ses ? clientMod.cachedEntitlement(env).catch(() => "free") : Promise.resolve("free"),
    ses ? clientMod.hasApiKey(env, "claude").catch(() => false) : Promise.resolve(false),
    ses ? clientMod.hasApiKey(env, "gemini").catch(() => false) : Promise.resolve(false)
  ]);
  const themeStyle = themeMod.themeCss(theme);
  const brand = themeMod.brandName(theme);
  const logoUrl = theme.logoUrl;
  const navItems = navMod.buildNav(items, [], navOv);
  const mascotUrl = theme.mascotUrl || "/mascot/baku.png";
  const agentAwake = atLeast(entitlement, "pro");
  const mascotEngine = hasClaude ? "claude" : hasGemini ? "gemini" : "workers_ai";
  const uname = ses?.name ?? ses?.role ?? "";
  const initial = (uname || "B").slice(0, 1).toUpperCase();
  const firstName = ses?.name ?? (ses?.role ?? "ユーザー");
  const isAdminOrg = ses?.role === "admin" && ses?.ctx === "org";
  return renderTemplate(_a || (_a = __template(['<html lang="ja"> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><meta name="color-scheme" content="light dark"><script>\n      // テーマ・ナビ形態の初期適用（描画前に data-theme / data-nav を確定＝ちらつき防止）。\n      (function () { try {\n        var t = localStorage.getItem("bo_theme"); document.documentElement.setAttribute("data-theme", t === "dark" ? "dark" : "light");\n        var n = localStorage.getItem("bo_nav"); document.documentElement.setAttribute("data-nav", (n === "side" || n === "top") ? n : "bottom");\n        var f = localStorage.getItem("bo_fontsize"); document.documentElement.setAttribute("data-fontsize", (f === "large" || f === "xl") ? f : "std");\n        if (localStorage.getItem("bo_mascot") === "off") document.documentElement.setAttribute("data-mascot", "off");\n      } catch (e) {} })();\n    <\/script><title>', " — ", "</title>", "", '</head> <body> <div id="bo-progress" aria-hidden="true"></div> <div id="bo-nav" aria-hidden="true"><span class="bo-nav-box"><span class="bo-nav-spin"></span>読み込み中…</span></div> <div class="app"> ', ' <div class="shell"> ', " ", " </div> ", " </div> ", ' <div id="toasts" aria-live="polite"></div> <div id="bo-notif" hidden style="position:fixed;top:52px;right:12px;width:320px;max-height:70vh;overflow:auto;background:var(--surface);border:1px solid var(--line);border-radius:10px;box-shadow:var(--shadow-lg);z-index:50;padding:8px"></div> ', " ", " </body></html>"])), title, brand, themeStyle && renderTemplate`<style>${unescapeHTML(themeStyle)}</style>`, renderHead(), auth && ses && renderTemplate`<aside class="sidebar"> <a class="sb-brand" href="/"><span class="mark"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path${addAttribute(ICONS.spark, "d")}></path></svg></span>${brand}</a> <nav class="sb-nav" aria-label="サイドナビ"> ${navItems.map((i) => renderTemplate`<a${addAttribute(i.href, "href")} data-astro-prefetch="viewport"${addAttribute(active === i.href ? "page" : void 0, "aria-current")}> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path${addAttribute(iconFor(i.href), "d")}></path></svg> ${i.label} </a>`)} </nav> </aside>`, auth && renderTemplate`<header class="appbar"> <div class="appbar-inner"> <span class="brand-wrap"> <a class="brand" href="/"> ${logoUrl ? renderTemplate`<img${addAttribute(logoUrl, "src")}${addAttribute(brand, "alt")} style="height:24px;vertical-align:middle">` : renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": async ($$result2) => renderTemplate`<span class="mark"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path${addAttribute(ICONS.spark, "d")}></path></svg></span>${brand}` })}`} </a> ${isAdminOrg && renderTemplate`<span class="beta-badge" title="本サービスは現在ベータ（試験提供）版です。現在は Test ユーザーのみ利用できます。">β版</span>`} </span> <nav class="nav"> ${navItems.map((i) => renderTemplate`<a${addAttribute(i.href, "href")} data-astro-prefetch="viewport"${addAttribute(active === i.href ? "page" : void 0, "aria-current")}> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path${addAttribute(iconFor(i.href), "d")}></path></svg> ${i.label} </a>`)} </nav> <span class="user"> <button class="iconbtn" id="bo-theme" type="button" title="ダーク" aria-label="テーマを切り替え"> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path id="bo-theme-ico"${addAttribute(ICONS.moon, "d")}></path></svg> </button> ${ses && renderTemplate`<a href="#" class="iconbtn" id="bo-bell" title="通知" aria-label="通知"> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path${addAttribute(ICONS.bell, "d")}></path></svg> ${unreadNotif > 0 && renderTemplate`<span id="bo-bell-badge" class="badge-num">${unreadNotif}</span>`} </a>`} ${ses ? renderTemplate`<span style="position:relative"> <button class="userchip" id="bo-user" type="button" aria-haspopup="menu" aria-expanded="false"> <span class="avatar">${initial}</span> <span class="nm">${firstName}${isAdminOrg && renderTemplate`<small>${ses.role}</small>`}</span> </button> <div class="menu-ov" id="bo-user-ov" hidden></div> <div class="usermenu fade-up" id="bo-user-menu" role="menu" hidden> <div class="um-head"><span class="avatar" style="width:38px;height:38px;font-size:.95rem">${initial}</span><div><strong>${firstName}</strong><div class="muted" style="font-size:.8rem">${ses.ctx === "org" ? "組織" : "個人"}・${ses.role}</div></div></div> <a class="um-item" href="/settings" role="menuitem"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path${addAttribute(ICONS.gear, "d")}></path></svg> 設定</a> <a class="um-item" href="/billing" role="menuitem"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path${addAttribute(ICONS.card, "d")}></path></svg> プラン・課金</a> <div class="hr" style="margin:6px 0"></div> <button class="um-item danger" id="bo-logout" type="button" role="menuitem"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path${addAttribute(ICONS.logout, "d")}></path></svg> ログアウト</button> </div> </span>` : renderTemplate`<a class="btn btn-sm" href="/login">ログイン</a>`} </span> </div> </header>`, bare ? renderTemplate`${renderSlot($$result, $$slots["default"])}` : renderTemplate`<main class="wrap"> ${limitErr && isAdminOrg && renderTemplate`<div class="banner banner-danger">
⚠️ 一時的に処理が混み合った可能性があります。重い処理を安定させたい場合は
<a href="/settings/advanced">設定 → 高度なオプション</a> をご確認ください（<a href="/diagnostics">サポート情報</a>）。
</div>`} ${renderSlot($$result, $$slots["default"])} </main>`, auth && ses && renderTemplate`<nav class="tabbar" aria-label="メインナビ"> ${navItems.map((i) => renderTemplate`<a${addAttribute(i.href, "href")} data-astro-prefetch="viewport"${addAttribute(active === i.href ? "page" : void 0, "aria-current")}> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"${addAttribute(active === i.href ? "2.2" : "1.8", "stroke-width")} stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path${addAttribute(iconFor(i.href), "d")}></path></svg> ${i.label} </a>`)} </nav>`, auth && ses && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": async ($$result2) => renderTemplate` <button${addAttribute("bo-agent " + (agentAwake ? "idle" : "asleep") + (mascotUrl !== "/mascot/baku.png" ? " custom" : ""), "class")} id="bo-agent" type="button"${addAttribute(agentAwake ? "1" : "0", "data-awake")}${addAttribute(mascotEngine, "data-engine")} title="相棒（AI・エージェント）" aria-label="相棒（AI・エージェント）の稼働状況"> <span class="bo-agent-dots" aria-hidden="true"><i></i><i></i><i></i></span> <span class="bo-agent-zzz" aria-hidden="true" title="相棒はお休み中（Proで活動します）">💤</span> <span class="bo-agent-sprite-wrap"> <img class="bo-agent-img"${addAttribute(mascotUrl, "src")} alt="相棒" width="88" height="88" decoding="async"> </span> <span class="bo-agent-badge" id="bo-agent-badge"></span> </button> <div class="bo-agent-pop" id="bo-agent-pop" hidden></div> ` })}`, renderScript($$result, "/home/runner/work/baku-office/baku-office/apps/client/src/layouts/App.astro?astro&type=script&index=0&lang.ts"), renderSlot($$result, $$slots["scripts"]));
}, "/home/runner/work/baku-office/baku-office/apps/client/src/layouts/App.astro", void 0);
export {
  $$App as $
};

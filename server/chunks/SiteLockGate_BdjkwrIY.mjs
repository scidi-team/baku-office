globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_Bc18R3r1.mjs";
import { m as maybeRenderHead, a as addAttribute, r as renderTemplate, u as unescapeHTML, F as Fragment, c as renderHead } from "./sequence_BESBTeYg.mjs";
import { r as renderComponent } from "./worker-entry_C_PXI25C.mjs";
import { $ as $$EventPublic } from "./EventPublic_BmS1xwlT.mjs";
import { s as sanitizeHtml } from "./sanitize_jH0WNw2O.mjs";
import { $ as $$EvIcon } from "./EvIcon_C73AYQ38.mjs";
import { env } from "cloudflare:workers";
import { $ as $$EventCard } from "./EventCard_MyALEuHg.mjs";
import { getPublicPage } from "./public-pages_DHQdIiIX.mjs";
const $$HeroBlock = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$HeroBlock;
  const { block } = Astro2.props;
  const p = block.props;
  const hasImg = !!(p.image && p.image.trim());
  const bg = hasImg ? `background-image: linear-gradient(180deg, rgba(16,14,10,.5), rgba(16,14,10,.82) 78%, var(--bg)), url('${p.image}'); background-size: cover; background-position: center;` : "";
  return renderTemplate`${maybeRenderHead()}<section${addAttribute("hero blk-hero" + (hasImg ? " has-img" : ""), "class")}${addAttribute(p.height || "m", "data-h")}${addAttribute(p.align || "left", "data-align")}${addAttribute(bg, "style")} data-astro-cid-zbfxve7n> <div class="wrap" data-astro-cid-zbfxve7n> ${p.eyebrow && renderTemplate`<p class="eyebrow blk-eyebrow" data-astro-cid-zbfxve7n>${p.eyebrow}</p>`} ${p.title && renderTemplate`<h1 class="display" data-astro-cid-zbfxve7n>${p.title}</h1>`} ${p.lead && renderTemplate`<p class="lead" data-astro-cid-zbfxve7n>${p.lead}</p>`} ${(p.primaryLabel || p.secondaryLabel) && renderTemplate`<div class="hero-cta" data-astro-cid-zbfxve7n> ${p.primaryLabel && renderTemplate`<a class="btn btn-primary btn-lg"${addAttribute(p.primaryHref || "#", "href")} data-astro-cid-zbfxve7n>${p.primaryLabel}</a>`} ${p.secondaryLabel && renderTemplate`<a class="btn btn-lg"${addAttribute(p.secondaryHref || "#", "href")} data-astro-cid-zbfxve7n>${p.secondaryLabel}</a>`} </div>`} </div> </section>`;
}, "/home/runner/work/baku-office/baku-office/apps/client/src/components/blocks/HeroBlock.astro", void 0);
const $$RichTextBlock = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$RichTextBlock;
  const { block } = Astro2.props;
  const p = block.props;
  const html = sanitizeHtml(String(p.html ?? ""));
  const wide = p.width === "wide";
  return renderTemplate`${maybeRenderHead()}<section class="section" data-astro-cid-6ikwx6fe><div class="wrap" data-astro-cid-6ikwx6fe><div${addAttribute("lp-rich" + (wide ? " lp-wide" : ""), "class")} data-astro-cid-6ikwx6fe>${unescapeHTML(html)}</div></div></section>`;
}, "/home/runner/work/baku-office/baku-office/apps/client/src/components/blocks/RichTextBlock.astro", void 0);
const $$FeaturesBlock = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$FeaturesBlock;
  const { block } = Astro2.props;
  const p = block.props;
  const items = Array.isArray(p.items) ? p.items : [];
  const cols = String(p.columns || "3");
  return renderTemplate`${maybeRenderHead()}<section class="section" data-astro-cid-qeawnmaz><div class="wrap" data-astro-cid-qeawnmaz> ${p.eyebrow && renderTemplate`<p class="eyebrow blk-eyebrow" data-astro-cid-qeawnmaz>${String(p.eyebrow)}</p>`} ${p.heading && renderTemplate`<h2 class="blk-h" data-astro-cid-qeawnmaz>${String(p.heading)}</h2>`} <div class="feat-grid"${addAttribute(cols, "data-cols")} data-astro-cid-qeawnmaz> ${items.map((it) => renderTemplate`<div class="feat" data-astro-cid-qeawnmaz> ${it.icon && renderTemplate`<span class="feat-ic" data-astro-cid-qeawnmaz>${renderComponent($$result, "EvIcon", $$EvIcon, { "name": it.icon, "size": 22, "data-astro-cid-qeawnmaz": true })}</span>`} ${it.title && renderTemplate`<h3 data-astro-cid-qeawnmaz>${it.title}</h3>`} ${it.body && renderTemplate`<p data-astro-cid-qeawnmaz>${it.body}</p>`} </div>`)} </div> </div></section>`;
}, "/home/runner/work/baku-office/baku-office/apps/client/src/components/blocks/FeaturesBlock.astro", void 0);
const $$ImageTextBlock = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$ImageTextBlock;
  const { block } = Astro2.props;
  const p = block.props;
  const right = p.imageSide === "right";
  return renderTemplate`${maybeRenderHead()}<section class="section" data-astro-cid-uux5bwce><div class="wrap" data-astro-cid-uux5bwce> <div${addAttribute("it-grid" + (right ? " it-right" : "") + (p.image ? "" : " it-noimg"), "class")} data-astro-cid-uux5bwce> ${p.image && renderTemplate`<div class="it-img"${addAttribute(`background-image:url('${p.image}')`, "style")} data-astro-cid-uux5bwce></div>`} <div class="it-body" data-astro-cid-uux5bwce> ${p.title && renderTemplate`<h2 class="blk-h" data-astro-cid-uux5bwce>${p.title}</h2>`} ${p.body && renderTemplate`<p class="it-text" data-astro-cid-uux5bwce>${p.body}</p>`} ${p.buttonLabel && renderTemplate`<a class="btn btn-primary"${addAttribute(p.buttonHref || "#", "href")} style="margin-top:8px" data-astro-cid-uux5bwce>${p.buttonLabel}</a>`} </div> </div> </div></section>`;
}, "/home/runner/work/baku-office/baku-office/apps/client/src/components/blocks/ImageTextBlock.astro", void 0);
const $$EventsBlock = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$EventsBlock;
  const { block } = Astro2.props;
  const p = block.props;
  const { listPublishedEvents, getPublishedEventBySlug } = await import("./events_BTbEujoj.mjs");
  let events = [];
  if (p.mode === "featured" && p.slug) {
    const e = await getPublishedEventBySlug(env, String(p.slug)).catch(() => null);
    events = e ? [e] : [];
  } else {
    const limit = Math.max(1, Math.min(Number(p.limit) || 6, 24));
    events = (await listPublishedEvents(env).catch(() => [])).slice(0, limit);
  }
  return renderTemplate`${maybeRenderHead()}<section class="section"><div class="wrap"> ${p.heading && renderTemplate`<h2 class="blk-h">${String(p.heading)}</h2>`} ${events.length === 0 && renderTemplate`<div class="card pad"><p class="muted" style="margin:0">現在公開中のイベントはありません。</p></div>`} <div class="ev-grid" style="margin-top:24px">${events.map((e) => renderTemplate`${renderComponent($$result, "EventCard", $$EventCard, { "ev": e })}`)}</div> </div></section>`;
}, "/home/runner/work/baku-office/baku-office/apps/client/src/components/blocks/EventsBlock.astro", void 0);
const $$CtaBlock = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$CtaBlock;
  const { block } = Astro2.props;
  const p = block.props;
  return renderTemplate`${maybeRenderHead()}<section class="section" data-astro-cid-2chn5upz><div class="wrap" data-astro-cid-2chn5upz> <div class="cta-box" data-astro-cid-2chn5upz> ${p.heading && renderTemplate`<h2 class="blk-h" style="margin-bottom:.3em" data-astro-cid-2chn5upz>${p.heading}</h2>`} ${p.body && renderTemplate`<p class="cta-body" data-astro-cid-2chn5upz>${p.body}</p>`} ${p.buttonLabel && renderTemplate`<a class="btn btn-primary btn-lg"${addAttribute(p.buttonHref || "#", "href")} data-astro-cid-2chn5upz>${p.buttonLabel}</a>`} </div> </div></section>`;
}, "/home/runner/work/baku-office/baku-office/apps/client/src/components/blocks/CtaBlock.astro", void 0);
const $$StepsBlock = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$StepsBlock;
  const { block } = Astro2.props;
  const p = block.props;
  const items = Array.isArray(p.items) ? p.items : [];
  return renderTemplate`${maybeRenderHead()}<section class="section" data-astro-cid-hqhsjvxl><div class="wrap" data-astro-cid-hqhsjvxl> ${p.heading && renderTemplate`<h2 class="blk-h" data-astro-cid-hqhsjvxl>${String(p.heading)}</h2>`} <ol class="steps" data-astro-cid-hqhsjvxl> ${items.map((it, i) => renderTemplate`<li class="step" data-astro-cid-hqhsjvxl> <span class="step-n" data-astro-cid-hqhsjvxl>${i + 1}</span> <div data-astro-cid-hqhsjvxl>${it.title && renderTemplate`<h3 data-astro-cid-hqhsjvxl>${it.title}</h3>`}${it.body && renderTemplate`<p data-astro-cid-hqhsjvxl>${it.body}</p>`}</div> </li>`)} </ol> </div></section>`;
}, "/home/runner/work/baku-office/baku-office/apps/client/src/components/blocks/StepsBlock.astro", void 0);
const $$StatsBlock = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$StatsBlock;
  const { block } = Astro2.props;
  const p = block.props;
  const items = Array.isArray(p.items) ? p.items : [];
  return renderTemplate`${maybeRenderHead()}<section class="section" data-astro-cid-j4ycmddk><div class="wrap" data-astro-cid-j4ycmddk> ${p.heading && renderTemplate`<h2 class="blk-h" data-astro-cid-j4ycmddk>${String(p.heading)}</h2>`} <div class="stats" data-astro-cid-j4ycmddk> ${items.map((it) => renderTemplate`<div class="stat" data-astro-cid-j4ycmddk> <div class="stat-v" data-astro-cid-j4ycmddk>${it.value}</div> <div class="stat-l" data-astro-cid-j4ycmddk>${it.label}</div> </div>`)} </div> </div></section>`;
}, "/home/runner/work/baku-office/baku-office/apps/client/src/components/blocks/StatsBlock.astro", void 0);
const $$GalleryBlock = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$GalleryBlock;
  const { block } = Astro2.props;
  const p = block.props;
  const items = (Array.isArray(p.items) ? p.items : []).filter((it) => it.image);
  return renderTemplate`${maybeRenderHead()}<section class="section" data-astro-cid-vwdfmq3l><div class="wrap" data-astro-cid-vwdfmq3l> ${p.heading && renderTemplate`<h2 class="blk-h" data-astro-cid-vwdfmq3l>${String(p.heading)}</h2>`} <div class="gallery" data-astro-cid-vwdfmq3l> ${items.map((it) => renderTemplate`<figure class="gphoto" data-astro-cid-vwdfmq3l> <span class="gimg"${addAttribute(`background-image:url('${it.image}')`, "style")} data-astro-cid-vwdfmq3l></span> ${it.caption && renderTemplate`<figcaption data-astro-cid-vwdfmq3l>${it.caption}</figcaption>`} </figure>`)} </div> </div></section>`;
}, "/home/runner/work/baku-office/baku-office/apps/client/src/components/blocks/GalleryBlock.astro", void 0);
const $$FaqBlock = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$FaqBlock;
  const { block } = Astro2.props;
  const p = block.props;
  const items = Array.isArray(p.items) ? p.items : [];
  return renderTemplate`${maybeRenderHead()}<section class="section" data-astro-cid-vqbstbga><div class="wrap" data-astro-cid-vqbstbga> ${p.heading && renderTemplate`<h2 class="blk-h" data-astro-cid-vqbstbga>${String(p.heading)}</h2>`} <div class="faq" data-astro-cid-vqbstbga> ${items.map((it) => renderTemplate`<details class="faq-item" data-astro-cid-vqbstbga> <summary data-astro-cid-vqbstbga>${it.q}</summary> <p data-astro-cid-vqbstbga>${it.a}</p> </details>`)} </div> </div></section>`;
}, "/home/runner/work/baku-office/baku-office/apps/client/src/components/blocks/FaqBlock.astro", void 0);
const $$QuoteBlock = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$QuoteBlock;
  const { block } = Astro2.props;
  const p = block.props;
  return renderTemplate`${maybeRenderHead()}<section class="section" data-astro-cid-bjdpftiu><div class="wrap" data-astro-cid-bjdpftiu> <blockquote class="quote" data-astro-cid-bjdpftiu> ${p.text && renderTemplate`<p class="quote-t" data-astro-cid-bjdpftiu>${p.text}</p>`} ${(p.author || p.role) && renderTemplate`<footer class="quote-f" data-astro-cid-bjdpftiu>— ${p.author}${p.role ? `／${p.role}` : ""}</footer>`} </blockquote> </div></section>`;
}, "/home/runner/work/baku-office/baku-office/apps/client/src/components/blocks/QuoteBlock.astro", void 0);
const $$LogosBlock = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$LogosBlock;
  const { block } = Astro2.props;
  const p = block.props;
  const items = (Array.isArray(p.items) ? p.items : []).filter((it) => it.image);
  return renderTemplate`${maybeRenderHead()}<section class="section" data-astro-cid-lg3scste><div class="wrap" data-astro-cid-lg3scste> ${p.heading && renderTemplate`<h2 class="blk-h" data-astro-cid-lg3scste>${String(p.heading)}</h2>`} <div class="logos" data-astro-cid-lg3scste> ${items.map((it) => renderTemplate`<img class="logo"${addAttribute(it.image, "src")}${addAttribute(it.alt || "", "alt")} loading="lazy" data-astro-cid-lg3scste>`)} </div> </div></section>`;
}, "/home/runner/work/baku-office/baku-office/apps/client/src/components/blocks/LogosBlock.astro", void 0);
const $$EmbedBlock = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$EmbedBlock;
  const { block } = Astro2.props;
  const p = block.props;
  const provider = p.provider === "youtube" ? "youtube" : "map";
  const value = (p.value || "").trim();
  let src = "";
  if (value) {
    if (provider === "map") {
      src = "https://www.google.com/maps?q=" + encodeURIComponent(value.slice(0, 200)) + "&output=embed";
    } else {
      const m = value.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)?([A-Za-z0-9_-]{11})/);
      if (m) src = "https://www.youtube-nocookie.com/embed/" + m[1];
    }
  }
  return renderTemplate`${maybeRenderHead()}<section class="section" data-astro-cid-peykfgah><div class="wrap" data-astro-cid-peykfgah> ${p.heading && renderTemplate`<h2 class="blk-h" data-astro-cid-peykfgah>${String(p.heading)}</h2>`} ${src ? renderTemplate`<div class="embed" data-astro-cid-peykfgah><iframe${addAttribute(src, "src")}${addAttribute(p.heading || "embed", "title")} loading="lazy" sandbox="allow-scripts allow-same-origin allow-popups allow-presentation" referrerpolicy="no-referrer" allowfullscreen data-astro-cid-peykfgah></iframe></div>` : renderTemplate`<div class="card pad" data-astro-cid-peykfgah><p class="muted" style="margin:0" data-astro-cid-peykfgah>埋め込み先が未設定です。</p></div>`} </div></section>`;
}, "/home/runner/work/baku-office/baku-office/apps/client/src/components/blocks/EmbedBlock.astro", void 0);
const $$DividerBlock = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$DividerBlock;
  const { block } = Astro2.props;
  const size = String(block.props.size || "m");
  const pad = size === "s" ? "28px" : size === "l" ? "88px" : "56px";
  return renderTemplate`${maybeRenderHead()}<div class="wrap"${addAttribute(`padding-top:${pad};padding-bottom:0`, "style")}><hr class="rule"></div>`;
}, "/home/runner/work/baku-office/baku-office/apps/client/src/components/blocks/DividerBlock.astro", void 0);
var __freeze$2 = Object.freeze;
var __defProp$2 = Object.defineProperty;
var __template$2 = (cooked, raw) => __freeze$2(__defProp$2(cooked, "raw", { value: __freeze$2(cooked.slice()) }));
var _a$2;
const $$ContactBlock = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$ContactBlock;
  const { block } = Astro2.props;
  const p = block.props;
  const nonce = Astro2.locals.cspNonce;
  const fid = "c" + block.id;
  return renderTemplate(_a$2 || (_a$2 = __template$2(["", '<section style="max-width:640px;margin:0 auto;padding:48px 20px"> ', " ", " <form", ' novalidate> <div style="margin:0 0 12px"><label style="display:block;font-size:.88rem;margin-bottom:4px">お名前</label><input name="name" style="width:100%;padding:11px 13px;border:1px solid var(--line);border-radius:8px;background:var(--surface);color:var(--ink)"></div> <div style="margin:0 0 12px"><label style="display:block;font-size:.88rem;margin-bottom:4px">メールアドレス</label><input name="email" type="email" style="width:100%;padding:11px 13px;border:1px solid var(--line);border-radius:8px;background:var(--surface);color:var(--ink)"></div> <div style="margin:0 0 12px"><label style="display:block;font-size:.88rem;margin-bottom:4px">内容 <span style="color:var(--accent)">*</span></label><textarea name="message" required rows="5" style="width:100%;padding:11px 13px;border:1px solid var(--line);border-radius:8px;background:var(--surface);color:var(--ink)"></textarea></div> <div style="position:absolute;left:-9999px" aria-hidden="true"><input name="_hp" tabindex="-1" autocomplete="off"></div> <button type="submit" style="background:var(--btn-bg);color:var(--btn-fg);border:0;border-radius:8px;padding:12px 22px;font-weight:600;cursor:pointer">', '</button> <span class="c-msg" style="margin-left:10px;font-size:.88rem"></span> </form> </section> <script type="application/json" class="c-fid-data">', "<\/script> <script", '>\n  (function () {\n    var fid = JSON.parse(document.currentScript.previousElementSibling.textContent).fid;\n    var form = document.getElementById(fid);\n    if (!form) return;\n    var msg = form.querySelector(".c-msg");\n    form.addEventListener("submit", async function (e) {\n      e.preventDefault();\n      var fd = new FormData(form);\n      if (!String(fd.get("message") || "").trim()) { msg.textContent = "内容をご入力ください。"; return; }\n      msg.textContent = "送信中…";\n      try {\n        var r = await fetch("/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: fd.get("name"), email: fd.get("email"), message: fd.get("message"), _hp: fd.get("_hp"), page: location.pathname }) });\n        var j = await r.json().catch(function () { return {}; });\n        if (r.ok && j.ok) { form.reset(); msg.textContent = "送信しました。ありがとうございました。"; }\n        else { msg.textContent = j.error || "送信に失敗しました。"; }\n      } catch (_) { msg.textContent = "送信に失敗しました。"; }\n    });\n  })();\n<\/script>'])), maybeRenderHead(), p.heading && renderTemplate`<h2 style="font-family:var(--font-serif);font-size:var(--step);margin:0 0 8px">${p.heading}</h2>`, p.lead && renderTemplate`<p style="color:var(--ink-2);margin:0 0 20px">${p.lead}</p>`, addAttribute(fid, "id"), p.buttonLabel || "送信する", unescapeHTML(JSON.stringify({ fid }).replace(/</g, "\\u003c")), addAttribute(nonce, "nonce"));
}, "/home/runner/work/baku-office/baku-office/apps/client/src/components/blocks/ContactBlock.astro", void 0);
var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(cooked.slice()) }));
var _a$1;
const $$AppBlock = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$AppBlock;
  const { block } = Astro2.props;
  const p = block.props;
  const slug = (p.slug || "").trim().toLowerCase();
  const page = slug ? await getPublicPage(env, slug) : null;
  const heights = { s: "420px", m: "640px", l: "900px" };
  const fixed = heights[p.height ?? ""] || "";
  return renderTemplate(_a$1 || (_a$1 = __template$1(["", '<section class="section" data-astro-cid-wzd4o7xq><div class="wrap" data-astro-cid-wzd4o7xq> ', " ", " ", " </div></section>  <script data-astro-rerun", '>\n  // 子の /embed が通知する高さに外枠 iframe を追従させる（自動高さ時のみ意味を持つ）。\n  (function () {\n    window.addEventListener("message", function (e) {\n      var m = e.data; if (!m || m.__boEmbed !== 1 || !m.height) return;\n      var frames = document.querySelectorAll(".app-embed-frame");\n      for (var i = 0; i < frames.length; i++) {\n        if (frames[i].contentWindow === e.source) { frames[i].style.height = Math.max(200, m.height) + "px"; break; }\n      }\n    });\n  })();\n<\/script>'])), maybeRenderHead(), p.heading && renderTemplate`<h2 class="blk-h" data-astro-cid-wzd4o7xq>${String(p.heading)}</h2>`, p.lead && renderTemplate`<p class="blk-lead" data-astro-cid-wzd4o7xq>${String(p.lead)}</p>`, page ? renderTemplate`<div class="app-embed"${addAttribute(slug, "data-slug")} data-astro-cid-wzd4o7xq> <iframe class="app-embed-frame"${addAttribute(`/embed/${encodeURIComponent(slug)}`, "src")}${addAttribute(p.heading || page.title, "title")} loading="lazy"${addAttribute(fixed ? `height:${fixed}` : "height:480px", "style")} data-astro-cid-wzd4o7xq></iframe> </div>` : renderTemplate`<div class="card pad" data-astro-cid-wzd4o7xq><p class="muted" style="margin:0" data-astro-cid-wzd4o7xq>${slug ? `公開ページ「${slug}」が見つからないか未公開です。設定→公開ページで作成・公開してください。` : "埋め込む公開ページが未設定です。"}</p></div>`, addAttribute(Astro2.locals.cspNonce, "nonce"));
}, "/home/runner/work/baku-office/baku-office/apps/client/src/components/blocks/AppBlock.astro", void 0);
const $$BlockRenderer = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$BlockRenderer;
  const { blocks } = Astro2.props;
  const MAP = {
    hero: $$HeroBlock,
    richText: $$RichTextBlock,
    features: $$FeaturesBlock,
    imageText: $$ImageTextBlock,
    events: $$EventsBlock,
    cta: $$CtaBlock,
    steps: $$StepsBlock,
    stats: $$StatsBlock,
    gallery: $$GalleryBlock,
    faq: $$FaqBlock,
    quote: $$QuoteBlock,
    logos: $$LogosBlock,
    embed: $$EmbedBlock,
    divider: $$DividerBlock,
    contact: $$ContactBlock,
    app: $$AppBlock
  };
  const bgClass = (bg) => bg === "tinted" || bg === "contrast" ? "blk-bg blk-bg-" + bg : "";
  return renderTemplate`${blocks.map((b) => {
    const C = MAP[b.type];
    if (!C) return null;
    const cls = bgClass(b.bg);
    return renderTemplate`${maybeRenderHead()}<div${addAttribute(b.id, "data-block-id")}${addAttribute(cls || void 0, "class")}>${renderComponent($$result, "C", C, { "block": b })}</div>`;
  })}`;
}, "/home/runner/work/baku-office/baku-office/apps/client/src/components/blocks/BlockRenderer.astro", void 0);
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a, _b;
const $$PublicSite = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$PublicSite;
  const { site, preview = false } = Astro2.props;
  const layoutJson = preview ? site.layout_draft ?? site.layout : site.layout;
  let blocks = null;
  if (layoutJson) {
    try {
      const v = JSON.parse(layoutJson);
      if (Array.isArray(v?.blocks)) blocks = v.blocks;
    } catch {
    }
  }
  const safeBody = sanitizeHtml(site.body ?? "");
  return renderTemplate`${renderComponent($$result, "EventPublic", $$EventPublic, { "title": site.title, "eventsHref": "/events", "eventsLabel": "イベント" }, { "default": async ($$result2) => renderTemplate`${blocks ? renderTemplate`${renderComponent($$result2, "BlockRenderer", $$BlockRenderer, { "blocks": blocks })}` : renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` ${maybeRenderHead()}<section class="hero"> <div class="wrap"> <h1 class="display">${site.title}</h1> </div> </section> <section class="wrap section"> <div class="lp-rich">${unescapeHTML(safeBody)}</div> </section> ` })}`}${site.show_join === 1 && renderTemplate`<section class="wrap section"> <div class="card pad join" style="max-width:520px;margin:0 auto"> <h2 style="margin:0 0 4px;font-size:1.3rem">会員のお申し込み</h2> <p class="muted" style="font-size:.88rem;margin:0 0 14px">お名前と連絡先をご記入ください。担当者よりご連絡します。</p> <form id="joinForm"${addAttribute(site.slug, "data-slug")}> <div class="field"><label>お名前</label><input class="input" id="j-name" autocomplete="name"></div> <div class="field"><label>連絡先（メール / 電話）</label><input class="input" id="j-contact" autocomplete="email"></div> <label class="join-consent" style="display:flex;gap:8px;align-items:flex-start;font-size:.85rem;margin:4px 0 12px"><input type="checkbox" id="j-consent" style="margin-top:3px"><span>お申し込み・ご連絡のために、入力いただいた個人情報を取り扱うことに同意します。</span></label> <button class="btn btn-primary" type="submit" style="width:100%">申し込む</button> <div class="formmsg" id="joinMsg" role="status" aria-live="polite"></div> </form> </div> </section>`}  `, "head": async ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "slot": "head" })}`, "scripts": async ($$result2) => renderTemplate(_b || (_b = __template(["", "<script", '>\n    (function () {\n      const f = document.getElementById("joinForm");\n      if (!f) return;\n      const msg = document.getElementById("joinMsg");\n      f.addEventListener("submit", async (e) => {\n        e.preventDefault();\n        const name = document.getElementById("j-name").value.trim();\n        const contact = document.getElementById("j-contact").value.trim();\n        const consent = !!document.getElementById("j-consent")?.checked;\n        if (!name) { msg.textContent = "お名前を入力してください。"; msg.classList.add("err"); return; }\n        if (!contact) { msg.textContent = "連絡先（メール / 電話）を入力してください。"; msg.classList.add("err"); return; }\n        if (!consent) { msg.textContent = "個人情報の取扱いへの同意が必要です。"; msg.classList.add("err"); return; }\n        const btn = f.querySelector("button"); btn.disabled = true; msg.classList.remove("err"); msg.textContent = "送信しています…";\n        try {\n          const r = await fetch("/api/site/join", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name, contact, slug: f.dataset.slug, consent }) });\n          if (r.ok) { msg.classList.remove("err"); msg.textContent = "お申し込みありがとうございます。確認のご連絡をお待ちください。"; f.reset(); }\n          else { msg.classList.add("err"); msg.textContent = "送信に失敗しました。時間をおいてお試しください。"; }\n        } catch (err) { msg.classList.add("err"); msg.textContent = "通信に失敗しました。"; }\n        finally { btn.disabled = false; }\n      });\n    })();\n  <\/script>'])), preview && renderTemplate(_a || (_a = __template(["<script", `>
      (function () {
        let lastHl = null;
        window.addEventListener("message", function (e) {
          // same-origin（エディタ）からのスクロール指示のみ受け付ける。
          if (e.origin !== location.origin) return;
          const d = e.data || {};
          if (d.type !== "bo-preview-scroll" || !d.id) return;
          const t = document.querySelector('[data-block-id="' + String(d.id).replace(/["\\\\]/g, "") + '"]');
          if (!t) return;
          if (lastHl && lastHl !== t) lastHl.classList.remove("bo-preview-hl");
          t.classList.add("bo-preview-hl"); lastHl = t;
          t.scrollIntoView({ behavior: "smooth", block: "center" });
        });
      })();
    <\/script>`], ["<script", `>
      (function () {
        let lastHl = null;
        window.addEventListener("message", function (e) {
          // same-origin（エディタ）からのスクロール指示のみ受け付ける。
          if (e.origin !== location.origin) return;
          const d = e.data || {};
          if (d.type !== "bo-preview-scroll" || !d.id) return;
          const t = document.querySelector('[data-block-id="' + String(d.id).replace(/["\\\\\\\\]/g, "") + '"]');
          if (!t) return;
          if (lastHl && lastHl !== t) lastHl.classList.remove("bo-preview-hl");
          t.classList.add("bo-preview-hl"); lastHl = t;
          t.scrollIntoView({ behavior: "smooth", block: "center" });
        });
      })();
    <\/script>`])), addAttribute(Astro2.locals.cspNonce, "nonce")), addAttribute(Astro2.locals.cspNonce, "nonce")) })}`;
}, "/home/runner/work/baku-office/baku-office/apps/client/src/components/PublicSite.astro", void 0);
const $$SiteLockGate = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$SiteLockGate;
  const { title, slug, error = false } = Astro2.props;
  return renderTemplate`<html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title>${renderHead()}</head> <body style="margin:0;background:#F2F1F4;font-family:system-ui,-apple-system,'Hiragino Sans',sans-serif"> <div style="max-width:380px;margin:16vh auto;padding:28px;background:#fff;border:1px solid #E3E1E6;border-radius:20px"> <h1 style="font-size:1.2rem;color:#1B1D22;margin:0 0 8px">${title}</h1> <p style="color:#6E7179;font-size:.9rem;margin:0 0 16px">このページはパスワードで保護されています。</p> ${error && renderTemplate`<p style="color:#b00020;font-size:.85rem;margin:0 0 10px">パスワードが違います。</p>`} <form method="POST" action="/api/site-unlock"> <input type="hidden" name="slug"${addAttribute(slug, "value")}> <input name="password" type="password" autocomplete="current-password" placeholder="パスワード" style="width:100%;padding:11px 13px;border:1px solid #E3E1E6;border-radius:12px;margin-bottom:12px"> <button type="submit" style="width:100%;background:#1B1D22;color:#fff;border:0;border-radius:12px;padding:12px;font-weight:700;cursor:pointer">表示する</button> </form> </div> </body></html>`;
}, "/home/runner/work/baku-office/baku-office/apps/client/src/components/SiteLockGate.astro", void 0);
export {
  $$SiteLockGate as $,
  $$PublicSite as a
};

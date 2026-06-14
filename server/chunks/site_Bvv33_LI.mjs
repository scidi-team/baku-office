globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_Dn7U0_eq.mjs";
import { r as renderTemplate } from "./sequence_I_kcixDX.mjs";
import { r as renderComponent } from "./worker-entry_Cv5GlnJ5.mjs";
import { env } from "cloudflare:workers";
import { $ as $$SitePublic } from "./SitePublic_CJjwpGek.mjs";
const prerender = false;
const $$Site = createComponent(async ($$result, $$props, $$slots) => {
  const { getPublishedSite } = await import("./sites_xD8oSYrt.mjs");
  const site = await getPublishedSite(env, "home");
  if (!site) return new Response("ページは公開されていません。", { status: 404, headers: { "content-type": "text/plain; charset=utf-8" } });
  return renderTemplate`${renderComponent($$result, "SitePublic", $$SitePublic, { "site": site })}`;
}, "/home/runner/work/baku-office/baku-office/apps/client/src/pages/site.astro", void 0);
const $$file = "/home/runner/work/baku-office/baku-office/apps/client/src/pages/site.astro";
const $$url = "/site";
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

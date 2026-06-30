globalThis.process ??= {};
globalThis.process.env ??= {};
import { g as getMedia } from "./site-media_FjB9pqph.mjs";
import { env } from "cloudflare:workers";
const prerender = false;
const GET = async ({ params }) => {
  const id = String(params.id ?? "");
  const m = await getMedia(env, id).catch(() => null);
  if (!m) return new Response("not found", { status: 404 });
  return new Response(m.buf, { status: 200, headers: { "content-type": m.ct, "cache-control": "public, max-age=86400" } });
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};

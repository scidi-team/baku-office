globalThis.process ??= {};
globalThis.process.env ??= {};
import { getSession } from "./auth_TPDi1U5M.mjs";
import { env } from "cloudflare:workers";
import { setSiteNav } from "./site-nav_XChDIK-s.mjs";
const prerender = false;
const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { "content-type": "application/json" } });
const POST = async ({ request }) => {
  const ses = await getSession(env, request);
  if (!ses || ses.role !== "admin") return json({ error: "管理者のみ" }, 403);
  const b = await request.json().catch(() => ({}));
  const saved = await setSiteNav(env, { menu: b.menu, footer: b.footer, langs: b.langs });
  return json({ ok: true, nav: saved });
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};

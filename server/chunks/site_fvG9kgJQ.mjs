globalThis.process ??= {};
globalThis.process.env ??= {};
import { getSession } from "./auth_BXoLTJDQ.mjs";
import { cachedEntitlement } from "./client_DsX87Mps.mjs";
import { deleteSite, upsertSite } from "./sites_xD8oSYrt.mjs";
import "./stripe_r-RFTlbb.mjs";
import { atLeast } from "./index_CrjiuAkj.mjs";
import { env } from "cloudflare:workers";
const prerender = false;
const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { "content-type": "application/json" } });
const POST = async ({ request, locals }) => {
  const ses = await getSession(env, request);
  if (!ses || ses.role !== "admin" || ses.ctx !== "org") return json({ error: "管理者のみ" }, 403);
  if (!atLeast(await cachedEntitlement(env), "pro")) return json({ error: "HP/LP は Pro プランで利用できます" }, 403);
  const b = await request.json().catch(() => ({}));
  const slug = (b.slug ?? "").trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
  switch (b._action) {
    case "save":
      if (!slug) return json({ error: "slug（英数字）が必要" }, 400);
      if (!b.title) return json({ error: "タイトルが必要" }, 400);
      await upsertSite(env, { slug, title: b.title, body: b.body, published: b.published, show_join: b.show_join });
      return json({ ok: true, slug });
    case "delete":
      if (slug) await deleteSite(env, slug);
      return json({ ok: true });
    default:
      return json({ error: "不明な操作" }, 400);
  }
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

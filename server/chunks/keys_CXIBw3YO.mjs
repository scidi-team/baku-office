globalThis.process ??= {};
globalThis.process.env ??= {};
import { hasApiKey, validateApiKey, saveApiKey } from "./client_DsX87Mps.mjs";
import { requireOrgAdmin } from "./auth_BXoLTJDQ.mjs";
import { env } from "cloudflare:workers";
const prerender = false;
const FIELDS = ["gemini", "line_secret", "line_token", "claude", "notion", "google_client_id", "google_client_secret"];
const GET = async ({ request, locals }) => {
  if (!await requireOrgAdmin(env, request)) return json({ error: "管理者のみ" }, 403);
  const status = {};
  for (const f of FIELDS) status[f] = await hasApiKey(env, f);
  return json({ status });
};
const POST = async ({ request, locals }) => {
  if (!await requireOrgAdmin(env, request)) return json({ error: "管理者のみ" }, 403);
  const b = await request.json().catch(() => ({}));
  const result = {};
  for (const f of FIELDS) {
    const v = b[f];
    if (v === void 0 || v === "") continue;
    const val = await validateApiKey(f, v);
    result[f] = val;
    if (val.ok) await saveApiKey(env, f, v);
  }
  return json({ ok: true, result });
};
const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { "content-type": "application/json" } });
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};

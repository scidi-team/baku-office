globalThis.process ??= {};
globalThis.process.env ??= {};
import { getSession, canAccess } from "./auth_BXoLTJDQ.mjs";
import { approveItem, rejectItem } from "./users_BHOLHxMy.mjs";
import { env } from "cloudflare:workers";
const prerender = false;
const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { "content-type": "application/json" } });
const POST = async ({ request, locals }) => {
  const ses = await getSession(env, request);
  if (!ses) return json({ error: "ログインが必要" }, 401);
  const allowed = canAccess(ses.role, "review_accounting") || canAccess(ses.role, "review_documents");
  if (!allowed) return json({ error: "承認権限がありません" }, 403);
  const b = await request.json().catch(() => ({}));
  if (!b.id) return json({ error: "id が必要" }, 400);
  if (b._action === "approve") await approveItem(env, b.id, ses.uid);
  else if (b._action === "reject") await rejectItem(env, b.id, ses.uid, b.reason ?? "");
  else return json({ error: "不明な操作" }, 400);
  return json({ ok: true });
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

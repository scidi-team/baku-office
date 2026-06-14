globalThis.process ??= {};
globalThis.process.env ??= {};
import { getSession } from "./auth_BXoLTJDQ.mjs";
import { listApprovals, getApproval, decideApproval } from "./approvals_DxT97YqP.mjs";
import { a as runApprovedTool } from "./agent_D4R31rlG.mjs";
import { env } from "cloudflare:workers";
const prerender = false;
const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { "content-type": "application/json" } });
const POST = async ({ request, locals, url }) => {
  const ses = await getSession(env, request);
  if (!ses || ses.role !== "admin" || ses.ctx !== "org") return json({ error: "管理者のみ" }, 403);
  const b = await request.json().catch(() => ({}));
  if (b._action === "list") {
    return json({ ok: true, pending: await listApprovals(env, "pending") });
  }
  if (b._action === "approve" || b._action === "reject") {
    const id = String(b.id ?? "");
    const a = await getApproval(env, id);
    if (!a) return json({ error: "承認が見つかりません" }, 404);
    const r = await decideApproval(
      env,
      id,
      b._action === "approve",
      ses.uid,
      (tool, args) => runApprovedTool(locals.ctx, a.owner, url.origin, "admin", tool, args)
    );
    return r.ok ? json({ ok: true, result: r.result }) : json({ error: r.error }, 400);
  }
  return json({ error: "不明な操作" }, 400);
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

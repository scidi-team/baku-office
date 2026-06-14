globalThis.process ??= {};
globalThis.process.env ??= {};
import { getSession } from "./auth_BXoLTJDQ.mjs";
import { activeAdminCount, deleteUser, setRole, rejectUser, approveUser, createInvite } from "./users_BHOLHxMy.mjs";
import { env } from "cloudflare:workers";
const prerender = false;
const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { "content-type": "application/json" } });
const POST = async ({ request, locals }) => {
  const ses = await getSession(env, request);
  if (!ses || ses.role !== "admin" || ses.ctx !== "org") return json({ error: "権限がありません" }, 403);
  const b = await request.json().catch(() => ({}));
  switch (b._action) {
    case "invite": {
      const code = await createInvite(env, ses.uid, b.role ?? "member");
      return json({ ok: true, code });
    }
    case "approve":
      if (b.id) await approveUser(env, b.id);
      return json({ ok: true });
    case "reject":
    case "leave_approve":
      if (b.id) await rejectUser(env, b.id);
      return json({ ok: true });
    case "role":
      if (b.id && b.role) await setRole(env, b.id, b.role);
      return json({ ok: true });
    case "delete": {
      if (!b.id) return json({ error: "対象がありません" }, 400);
      if (b.id === "org") return json({ error: "システムユーザーは削除できません" }, 400);
      if (b.id === ses.uid) return json({ error: "自分自身は削除できません" }, 400);
      const u = await env.DB.prepare("SELECT role,status FROM users WHERE id=?").bind(b.id).first();
      if (!u) return json({ error: "対象が見つかりません" }, 404);
      if (u.role === "admin" && u.status === "active" && await activeAdminCount(env) <= 1) {
        return json({ error: "最後の管理者は削除できません" }, 400);
      }
      await deleteUser(env, b.id);
      return json({ ok: true });
    }
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

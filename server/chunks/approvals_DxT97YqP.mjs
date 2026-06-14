globalThis.process ??= {};
globalThis.process.env ??= {};
import { kvPut } from "./kv_DEgX1LMf.mjs";
import { r as randomId } from "./stripe_r-RFTlbb.mjs";
import { n as nowSec } from "./accounting_BipJ8jvJ.mjs";
import { audit } from "./storage_C7TJPJmI.mjs";
const A2A_OUTWARD = /* @__PURE__ */ new Set(["call_partner", "broadcast_group", "call_group_member", "call_public", "send_inquiry"]);
async function getApprovalMode(env) {
  return await env.LICENSE.get("agent_approval") !== "off";
}
async function setApprovalMode(env, on) {
  await kvPut(env, "agent_approval", on ? "on" : "off");
  return on;
}
function previewFor(tool, args) {
  const s = (k) => args[k] == null ? "" : String(args[k]);
  switch (tool) {
    case "send_message":
      return `メール送信：宛先「${s("to")}」／件名「${s("subject")}」`;
    case "update_event":
      return `予定の変更：「${s("title") || s("event_id")}」`;
    case "delete_event":
      return `予定の削除：event_id「${s("event_id")}」`;
    case "call_partner":
      return `他団体連携（A2A）：partner=${s("partner")} / action=${s("action")}`;
    case "broadcast_group":
      return `グループ同報（A2A）：group=${s("group")} / action=${s("action")}`;
    case "call_group_member":
      return `グループ内連携（A2A）：group=${s("group")} / partner=${s("partner")} / action=${s("action")}`;
    case "call_public":
      return `公開団体への連絡（A2A）：partner=${s("partner")} / action=${s("action")}`;
    case "send_inquiry":
      return `公開団体への問い合わせ：partner=${s("partner")} / 本文「${s("message").slice(0, 60)}」`;
    default: {
      const j = JSON.stringify(args ?? {});
      return `${tool}（${j.length > 200 ? j.slice(0, 200) + "…" : j}）`;
    }
  }
}
async function createApproval(env, owner, tool, args, preview) {
  const id = randomId();
  await env.DB.prepare("INSERT INTO agent_approvals (id,owner,tool,args,preview,status,created_at) VALUES (?,?,?,?,?, 'pending', ?)").bind(id, owner, tool, JSON.stringify(args ?? {}), preview, nowSec()).run();
  await audit(env, owner, "agent_approval_request", `${tool}:${id}`);
  return id;
}
async function listApprovals(env, status = "pending", limit = 100) {
  return (await env.DB.prepare("SELECT * FROM agent_approvals WHERE status=? ORDER BY created_at DESC LIMIT ?").bind(status, limit).all()).results;
}
async function getApproval(env, id) {
  return await env.DB.prepare("SELECT * FROM agent_approvals WHERE id=?").bind(id).first() ?? null;
}
async function decideApproval(env, id, approve, by, exec) {
  const a = await getApproval(env, id);
  if (!a) return { ok: false, error: "承認が見つかりません" };
  if (a.status !== "pending") return { ok: false, error: "すでに処理済みです" };
  if (!approve) {
    await env.DB.prepare("UPDATE agent_approvals SET status='rejected', decided_at=?, decided_by=? WHERE id=?").bind(nowSec(), by, id).run();
    await audit(env, by, "agent_approval_reject", `${a.tool}:${id}`);
    return { ok: true };
  }
  let parsed = {};
  try {
    parsed = JSON.parse(a.args);
  } catch {
  }
  const result = await exec(a.tool, parsed);
  await env.DB.prepare("UPDATE agent_approvals SET status='approved', result=?, decided_at=?, decided_by=? WHERE id=?").bind(result.slice(0, 4e3), nowSec(), by, id).run();
  await audit(env, by, "agent_approval_approve", `${a.tool}:${id}`);
  return { ok: true, result };
}
export {
  A2A_OUTWARD,
  createApproval,
  decideApproval,
  getApproval,
  getApprovalMode,
  listApprovals,
  previewFor,
  setApprovalMode
};

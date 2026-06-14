globalThis.process ??= {};
globalThis.process.env ??= {};
import { r as randomId } from "./stripe_r-RFTlbb.mjs";
import { n as nowSec } from "./accounting_BipJ8jvJ.mjs";
async function listSessions(ctx, owner) {
  return await ctx.db.all("SELECT id,title,model,updated_at FROM chat_sessions WHERE owner=? ORDER BY updated_at DESC LIMIT 50", [owner]);
}
async function createSession(ctx, owner, model) {
  const id = randomId();
  const now = nowSec();
  await ctx.db.run(
    "INSERT INTO chat_sessions (id,owner,title,model,created_at,updated_at) VALUES (?,?,?,?,?,?)",
    [id, owner, null, model ?? null, now, now]
  );
  return id;
}
async function deleteSession(ctx, owner, id) {
  const s = await ctx.db.first("SELECT id FROM chat_sessions WHERE id=? AND owner=?", [id, owner]);
  if (!s) return;
  await ctx.db.run("DELETE FROM chat_messages WHERE session_id=?", [id]);
  await ctx.db.run("DELETE FROM chat_sessions WHERE id=?", [id]);
}
async function ownedSession(ctx, owner, id) {
  return await ctx.db.first("SELECT id,model FROM chat_sessions WHERE id=? AND owner=?", [id, owner]) ?? null;
}
async function getMessages(ctx, sessionId) {
  return await ctx.db.all("SELECT role,content,created_at FROM chat_messages WHERE session_id=? ORDER BY created_at LIMIT 200", [sessionId]);
}
async function appendMessage(ctx, sessionId, role, content) {
  await ctx.db.run(
    "INSERT INTO chat_messages (id,session_id,role,content,created_at) VALUES (?,?,?,?,?)",
    [randomId(), sessionId, role, content, nowSec()]
  );
  await ctx.db.run("UPDATE chat_sessions SET updated_at=? WHERE id=?", [nowSec(), sessionId]);
}
async function ensureTitle(ctx, sessionId, firstText) {
  await ctx.db.run(
    "UPDATE chat_sessions SET title=? WHERE id=? AND (title IS NULL OR title='')",
    [firstText.slice(0, 40), sessionId]
  );
}
function toTurns(msgs, limit = 20) {
  return msgs.slice(-limit).map((m) => m.role === "assistant" ? { role: "assistant", text: m.content } : { role: "user", text: m.content });
}
export {
  appendMessage,
  createSession,
  deleteSession,
  ensureTitle,
  getMessages,
  listSessions,
  ownedSession,
  toTurns
};

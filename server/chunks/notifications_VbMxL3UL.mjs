globalThis.process ??= {};
globalThis.process.env ??= {};
import { r as randomId } from "./stripe_r-RFTlbb.mjs";
import { n as nowSec } from "./accounting_BipJ8jvJ.mjs";
async function addNotification(ctx, n) {
  await ctx.db.run(
    "INSERT INTO notifications (id,owner,kind,body,link,created_at) VALUES (?,?,?,?,?,?)",
    [randomId(), n.owner, n.kind, n.body, n.link ?? null, nowSec()]
  );
}
async function listNotifications(ctx, owner, opts = {}) {
  const where = opts.unreadOnly ? "owner=? AND read_at IS NULL" : "owner=?";
  return await ctx.db.all(
    `SELECT id,kind,body,link,read_at,created_at FROM notifications WHERE ${where} ORDER BY created_at DESC LIMIT ?`,
    [owner, Math.min(opts.limit ?? 30, 100)]
  );
}
async function countUnread(ctx, owner) {
  const r = await ctx.db.first("SELECT COUNT(*) AS n FROM notifications WHERE owner=? AND read_at IS NULL", [owner]);
  return r?.n ?? 0;
}
async function markNotificationsRead(ctx, owner, id) {
  const now = nowSec();
  if (id) await ctx.db.run("UPDATE notifications SET read_at=? WHERE owner=? AND id=? AND read_at IS NULL", [now, owner, id]);
  else await ctx.db.run("UPDATE notifications SET read_at=? WHERE owner=? AND read_at IS NULL", [now, owner]);
}
async function pushWebhook(url, text) {
  await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ content: text, text }) });
}
export {
  addNotification,
  countUnread,
  listNotifications,
  markNotificationsRead,
  pushWebhook
};

globalThis.process ??= {};
globalThis.process.env ??= {};
import { r as randomId } from "./stripe_r-RFTlbb.mjs";
import { n as nowSec } from "./accounting_D4tRmfws.mjs";
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
async function pushWebhook(gw, url, text) {
  await gw.fetch("webhook", url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ content: text, text }) }, { allowConfigured: true });
}
async function notifyHook(env, text) {
  let sent = false;
  const url = await env.LICENSE.get("notify_webhook_url").catch(() => "") ?? "";
  if (url) {
    const { cfEgressGateway } = await import("./ctx_Bv3SAITG.mjs").then((n) => n.L);
    try {
      await pushWebhook(cfEgressGateway(env), url, text);
      sent = true;
    } catch {
    }
  }
  const lineTo = await env.LICENSE.get("notify_line_to").catch(() => "") ?? "";
  if (lineTo) {
    const { getApiKey } = await import("./client_v-7HzW5v.mjs");
    const token = await getApiKey(env, "line_token").catch(() => null);
    if (token) {
      const [{ cfEgressGateway }, { linePush }] = await Promise.all([import("./ctx_Bv3SAITG.mjs").then((n) => n.L), import("./ctx_Bv3SAITG.mjs").then((n) => n.O)]);
      try {
        await linePush(cfEgressGateway(env), token, lineTo, text);
        sent = true;
      } catch {
      }
    }
  }
  return sent;
}
export {
  addNotification,
  countUnread,
  listNotifications,
  markNotificationsRead,
  notifyHook,
  pushWebhook
};

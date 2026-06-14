globalThis.process ??= {};
globalThis.process.env ??= {};
import { r as randomId } from "./stripe_r-RFTlbb.mjs";
import { n as nowSec } from "./accounting_BipJ8jvJ.mjs";
import { r as runAgent } from "./agent_D4R31rlG.mjs";
import { appendMessage } from "./chat-sessions_sD7fC39m.mjs";
async function enqueueAgentJob(ctx, a) {
  const id = randomId();
  const now = nowSec();
  await ctx.db.run(
    "INSERT INTO agent_jobs (id,owner,session_id,prompt,role,status,created_at,updated_at) VALUES (?,?,?,?,?,'pending',?,?)",
    [id, a.owner, a.sessionId ?? null, a.prompt, a.role ?? "member", now, now]
  );
  return id;
}
async function processAgentJobs(ctx, baseUrl = "", limit = 2) {
  const results = await ctx.db.all("SELECT id,owner,session_id,prompt,role FROM agent_jobs WHERE status='pending' ORDER BY created_at LIMIT ?", [limit]);
  let done = 0;
  for (const j of results) {
    await ctx.db.run("UPDATE agent_jobs SET status='running', updated_at=? WHERE id=?", [nowSec(), j.id]);
    try {
      const reply = await runAgent(ctx, j.owner, j.prompt, void 0, baseUrl, j.role ?? "member", { unattended: true });
      await ctx.db.run("UPDATE agent_jobs SET status='done', result=?, updated_at=? WHERE id=?", [reply, nowSec(), j.id]);
      if (j.session_id) await appendMessage(ctx, j.session_id, "assistant", reply).catch(() => {
      });
      done++;
    } catch (e) {
      await ctx.db.run("UPDATE agent_jobs SET status='error', result=?, updated_at=? WHERE id=?", [String(e.message ?? e), nowSec(), j.id]);
    }
  }
  return done;
}
export {
  enqueueAgentJob,
  processAgentJobs
};

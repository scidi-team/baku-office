globalThis.process ??= {};
globalThis.process.env ??= {};
import { getApiKey } from "./client_DsX87Mps.mjs";
import { l as linePush } from "./agent_D4R31rlG.mjs";
import { d as dueReminders, m as markReminderDone } from "./invoices_BrIqzWU0.mjs";
import { p as processSummaryJobs } from "./media-ai_DCsVDbkH.mjs";
import { pollVideoJobs } from "./capabilities_BJdMR9qo.mjs";
import { processAgentJobs } from "./agent-jobs_D_VyINpB.mjs";
import { guardHeavy } from "./diag_8r20ZCMR.mjs";
import { getDriveBackup, driveConnected, backupToDrive, uploadBufferToDrive } from "./drive_BsB4xfcB.mjs";
import { getBackupSchedule, backupAlert, buildBackup, backupFileName, recordBackupDone } from "./backup_Buj-Jcas.mjs";
import { flushReports } from "./reports_DvW-JGja.mjs";
import { addNotification, pushWebhook } from "./notifications_VbMxL3UL.mjs";
import { getNotifyWebhook } from "./settings_BubM6K6A.mjs";
import { purgeFiles } from "./storage_C7TJPJmI.mjs";
import { env } from "cloudflare:workers";
const prerender = false;
const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { "content-type": "application/json" } });
const POST = async ({ request, locals }) => {
  if (!env.INTERNAL_KEY || request.headers.get("x-internal-key") !== env.INTERNAL_KEY) return json({ error: "forbidden" }, 403);
  const g = await guardHeavy(env, "summary jobs", () => processSummaryJobs(env));
  const summarized = g.ok ? g.value : 0;
  const aj = await guardHeavy(env, "agent jobs", () => processAgentJobs(locals.ctx, new URL(request.url).origin));
  const agentJobs = aj.ok ? aj.value : 0;
  const accessToken = await getApiKey(env, "line_token");
  const vr = await guardHeavy(env, "video jobs", () => pollVideoJobs(env, accessToken ?? void 0));
  const video = vr.ok ? vr.value : { done: 0, pending: 0 };
  let sent = 0, notified = 0;
  const notifyWebhook = await getNotifyWebhook(env);
  for (const r of await dueReminders(locals.ctx)) {
    const userId = r.owner.startsWith("line:") ? r.owner.slice(5) : null;
    if (userId) {
      if (!accessToken) continue;
      await linePush(accessToken, userId, `⏰ リマインド：${r.content}`);
      sent++;
    } else {
      await addNotification(locals.ctx, { owner: r.owner, kind: "reminder", body: `⏰ ${r.content}`, link: "/invoices" });
      if (notifyWebhook) await pushWebhook(notifyWebhook, `⏰ リマインド：${r.content}`).catch(() => {
      });
      notified++;
    }
    await markReminderDone(locals.ctx, r.id);
  }
  let driveBackup = { uploaded: 0 };
  if ((await getDriveBackup(env)).enabled) {
    const dr = await guardHeavy(env, "drive backup", () => backupToDrive(env, 5));
    if (dr.ok) driveBackup = dr.value;
  }
  let fullBackup = { uploaded: false };
  const sched = await getBackupSchedule(env);
  if (sched.enabled && await driveConnected(env) && (await backupAlert(env)).alert) {
    const bk = await guardHeavy(env, "full backup", async () => {
      const { json: body, tables, files } = await buildBackup(env, { decrypt: sched.mode === "decrypted" });
      const up = await uploadBufferToDrive(env, backupFileName(sched.mode === "decrypted"), "application/json", new TextEncoder().encode(body).buffer);
      if (!up.ok) throw new Error(up.error ?? "upload failed");
      await recordBackupDone(env, "drive", sched.mode, tables, files);
      return true;
    });
    fullBackup = bk.ok ? { uploaded: true } : { uploaded: false, error: bk.error };
  }
  const fr = await guardHeavy(env, "flush reports", () => flushReports(env));
  const reportsSent = fr.ok ? fr.value : 0;
  const pf = await guardHeavy(env, "purge files", () => purgeFiles(env));
  const purged = pf.ok ? pf.value : { expired: 0, purged: 0 };
  return json({ ok: true, sent, notified, summarized, video, agentJobs, driveBackup, fullBackup, reportsSent, purged });
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

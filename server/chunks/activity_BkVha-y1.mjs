globalThis.process ??= {};
globalThis.process.env ??= {};
import { getSession } from "./auth_BXoLTJDQ.mjs";
import { env } from "cloudflare:workers";
const prerender = false;
const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { "content-type": "application/json", "cache-control": "no-store" } });
const trunc = (s) => {
  const t = String(s ?? "");
  return t.length > 28 ? t.slice(0, 28) + "…" : t;
};
const GET = async ({ request, locals }) => {
  const ses = await getSession(env, request);
  if (!ses) return json({ active: 0, tasks: [] });
  const tasks = [];
  try {
    const a = (await env.DB.prepare("SELECT owner,prompt,status FROM agent_jobs WHERE status IN ('pending','running') ORDER BY created_at DESC LIMIT 8").all()).results;
    for (const j of a) {
      const mine = j.owner === ses.uid;
      tasks.push({ kind: "agent", status: j.status, label: mine ? trunc(j.prompt) : "AIエージェント", mine });
    }
  } catch {
  }
  try {
    const s = (await env.DB.prepare("SELECT owner,name,status FROM summary_jobs WHERE status='pending' ORDER BY created_at DESC LIMIT 8").all()).results;
    for (const j of s) tasks.push({ kind: "summary", status: "running", label: j.name ? `要約: ${trunc(j.name)}` : "ファイル要約", mine: j.owner === ses.uid });
  } catch {
  }
  try {
    const v = (await env.DB.prepare("SELECT owner,status FROM video_jobs WHERE status='pending' ORDER BY created_at DESC LIMIT 8").all()).results;
    for (const j of v) tasks.push({ kind: "video", status: "running", label: "動画生成", mine: j.owner === ses.uid });
  } catch {
  }
  return json({ active: tasks.length, tasks });
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};

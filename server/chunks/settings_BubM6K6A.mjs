globalThis.process ??= {};
globalThis.process.env ??= {};
import { kvPut } from "./kv_DEgX1LMf.mjs";
import { isValidWorkersAiModel, DEFAULT_MODELS } from "./config_BOdbJfMp.mjs";
const DEFAULT_RECEPTION = { mode: "box", minHostTrust: 0.3, requireVerified: false, requireAiReview: false, requireCertified: false };
async function getReceptionPolicy(env) {
  const raw = await env.LICENSE.get("reception_policy");
  if (!raw) return { ...DEFAULT_RECEPTION };
  try {
    const p = JSON.parse(raw);
    return { ...DEFAULT_RECEPTION, ...p, mode: ["box", "auto", "hybrid"].includes(p.mode) ? p.mode : "box" };
  } catch {
    return { ...DEFAULT_RECEPTION };
  }
}
async function setReceptionPolicy(env, p) {
  const cur = await getReceptionPolicy(env);
  const next = {
    mode: p.mode && ["box", "auto", "hybrid"].includes(p.mode) ? p.mode : cur.mode,
    minHostTrust: typeof p.minHostTrust === "number" ? Math.max(0, Math.min(1, p.minHostTrust)) : cur.minHostTrust,
    requireVerified: typeof p.requireVerified === "boolean" ? p.requireVerified : cur.requireVerified,
    requireAiReview: typeof p.requireAiReview === "boolean" ? p.requireAiReview : cur.requireAiReview,
    requireCertified: typeof p.requireCertified === "boolean" ? p.requireCertified : cur.requireCertified
  };
  await kvPut(env, "reception_policy", JSON.stringify(next));
  return next;
}
async function getBookkeepingMode(env) {
  return await env.LICENSE.get("bookkeeping_mode") === "double" ? "double" : "single";
}
async function setBookkeepingMode(env, m) {
  const v = m === "double" ? "double" : "single";
  await kvPut(env, "bookkeeping_mode", v);
  return v;
}
async function getWorkersAiModel(env) {
  const saved = (await env.LICENSE.get("workers_ai_model"))?.trim();
  if (saved && isValidWorkersAiModel(saved)) return saved;
  return env.WORKERS_AI_MODEL?.trim() || DEFAULT_MODELS.workers_ai;
}
async function setWorkersAiModel(env, id) {
  const v = isValidWorkersAiModel(id) ? id : DEFAULT_MODELS.workers_ai;
  await kvPut(env, "workers_ai_model", v);
  return v;
}
async function getAiEngine(env) {
  return await env.LICENSE.get("ai_engine") === "claude" ? "claude" : "gemini";
}
async function setAiEngine(env, e) {
  const v = e === "claude" ? "claude" : "gemini";
  await kvPut(env, "ai_engine", v);
  return v;
}
const CUSTOM_PROMPT_MAX = 2e3;
async function getCustomPrompt(env) {
  return await env.LICENSE.get("custom_prompt") ?? "";
}
async function setCustomPrompt(env, s) {
  const v = (s ?? "").slice(0, CUSTOM_PROMPT_MAX);
  await kvPut(env, "custom_prompt", v);
  return v;
}
async function getWorkersPaid(env) {
  return await env.LICENSE.get("workers_paid") === "true";
}
async function setWorkersPaid(env, enabled) {
  await kvPut(env, "workers_paid", enabled ? "true" : "false");
  return enabled;
}
async function getNotifyWebhook(env) {
  return await env.LICENSE.get("notify_webhook_url") ?? "";
}
async function setNotifyWebhook(env, url) {
  const v = (url ?? "").trim().slice(0, 500);
  await kvPut(env, "notify_webhook_url", v);
  return v;
}
async function maxParallelAgents(env) {
  return await getWorkersPaid(env) ? 5 : 2;
}
async function agentMaxHops(env) {
  return await getWorkersPaid(env) ? 6 : 4;
}
export {
  agentMaxHops,
  getAiEngine,
  getBookkeepingMode,
  getCustomPrompt,
  getNotifyWebhook,
  getReceptionPolicy,
  getWorkersAiModel,
  getWorkersPaid,
  maxParallelAgents,
  setAiEngine,
  setBookkeepingMode,
  setCustomPrompt,
  setNotifyWebhook,
  setReceptionPolicy,
  setWorkersAiModel,
  setWorkersPaid
};

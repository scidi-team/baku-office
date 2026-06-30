globalThis.process ??= {};
globalThis.process.env ??= {};
import { kvPut } from "./kv_DEN7iKIl.mjs";
import { NEURON_USD, resolvePricing } from "./config_D7WVsdyn.mjs";
import { logDiag } from "./diag_BjrAYDQX.mjs";
function noteRecordFailure(env, provider, e) {
  void logDiag(env, "warn", "usage", `使用量記録に失敗（上限判定が不正確になる恐れ）: ${provider}`, e?.message ?? String(e));
}
const USAGE_PROVIDERS = ["gemini", "claude", "workers_ai", "web_search", "image_gen", "tts", "video_gen", "custom"];
const PROVIDER_LABEL = {
  gemini: "Gemini（AI）",
  claude: "Claude（AI）",
  workers_ai: "Workers AI（CF・ニューロン）",
  web_search: "Web検索",
  image_gen: "画像生成",
  tts: "音声合成",
  video_gen: "動画生成",
  custom: "カスタムAPI"
};
async function monthNeurons(env) {
  const usd = (await monthUsd(env))["workers_ai"] ?? 0;
  return usd > 0 ? Math.round(usd / NEURON_USD) : 0;
}
const todayUtc = () => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
const monthUtc = () => (/* @__PURE__ */ new Date()).toISOString().slice(0, 7);
function estimateUsd(env, provider, inputTokens, outputTokens) {
  const p = resolvePricing(env)[provider];
  if (!p) return 0;
  return inputTokens / 1e6 * p.in + outputTokens / 1e6 * p.out;
}
async function recordUsage(env, provider) {
  try {
    await env.DB.prepare(
      "INSERT INTO api_usage (provider, day, count) VALUES (?,?,1) ON CONFLICT(provider, day) DO UPDATE SET count = count + 1"
    ).bind(provider, todayUtc()).run();
  } catch (e) {
    noteRecordFailure(env, provider, e);
  }
}
async function recordTokens(env, provider, u) {
  const i = Math.max(0, Math.round(u?.inputTokens ?? 0));
  const o = Math.max(0, Math.round(u?.outputTokens ?? 0));
  if (i === 0 && o === 0) return;
  const usd = estimateUsd(env, provider, i, o);
  try {
    await env.DB.prepare(
      "INSERT INTO api_usage (provider, day, count, input_tokens, output_tokens, est_usd) VALUES (?,?,0,?,?,?) ON CONFLICT(provider, day) DO UPDATE SET input_tokens = input_tokens + excluded.input_tokens, output_tokens = output_tokens + excluded.output_tokens, est_usd = est_usd + excluded.est_usd"
    ).bind(provider, todayUtc(), i, o, usd).run();
  } catch (e) {
    noteRecordFailure(env, provider, e);
  }
}
async function dailyTotals(env, days = 14) {
  const since = new Date(Date.now() - (days - 1) * 864e5).toISOString().slice(0, 10);
  let rows = [];
  try {
    rows = (await env.DB.prepare("SELECT day, SUM(count) AS c FROM api_usage WHERE day >= ? GROUP BY day").bind(since).all()).results;
  } catch {
  }
  const map = new Map(rows.map((r) => [r.day, r.c]));
  const out = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 864e5).toISOString().slice(0, 10);
    out.push({ day: d, count: map.get(d) ?? 0 });
  }
  return out;
}
async function monthTotals(env) {
  try {
    const rows = (await env.DB.prepare("SELECT provider, SUM(count) AS c FROM api_usage WHERE day LIKE ? GROUP BY provider").bind(monthUtc() + "%").all()).results;
    return Object.fromEntries(rows.map((r) => [r.provider, r.c]));
  } catch {
    return {};
  }
}
async function todayTotals(env) {
  try {
    const rows = (await env.DB.prepare("SELECT provider, count FROM api_usage WHERE day = ?").bind(todayUtc()).all()).results;
    return Object.fromEntries(rows.map((r) => [r.provider, r.count]));
  } catch {
    return {};
  }
}
async function monthUsd(env) {
  try {
    const rows = (await env.DB.prepare("SELECT provider, SUM(est_usd) AS u FROM api_usage WHERE day LIKE ? GROUP BY provider").bind(monthUtc() + "%").all()).results;
    return Object.fromEntries(rows.map((r) => [r.provider, r.u ?? 0]));
  } catch {
    return {};
  }
}
async function monthTokens(env) {
  try {
    const rows = (await env.DB.prepare("SELECT provider, SUM(input_tokens + output_tokens) AS t FROM api_usage WHERE day LIKE ? GROUP BY provider").bind(monthUtc() + "%").all()).results;
    return Object.fromEntries(rows.map((r) => [r.provider, r.t ?? 0]));
  } catch {
    return {};
  }
}
async function getLimits(env) {
  try {
    return JSON.parse(await env.LICENSE.get("usage_limits") ?? "{}");
  } catch {
    return {};
  }
}
async function setLimits(env, l) {
  await kvPut(env, "usage_limits", JSON.stringify(l ?? {}));
}
async function overBudget(env, provider) {
  const lim = (await getLimits(env))[provider];
  if (!lim) return "ok";
  if (lim.monthlyUsdCap && lim.monthlyUsdCap > 0) {
    const usd = (await monthUsd(env))[provider] ?? 0;
    if (usd >= lim.monthlyUsdCap) return lim.onExceed ?? "pause";
  }
  if (lim.monthlyNeuronCap && lim.monthlyNeuronCap > 0) {
    const usd = (await monthUsd(env))[provider] ?? 0;
    if (usd >= lim.monthlyNeuronCap * NEURON_USD) return lim.onExceed ?? "pause";
  }
  if (lim.monthlyCap && lim.monthlyCap > 0) {
    const used = (await monthTotals(env))[provider] ?? 0;
    if (used >= lim.monthlyCap) return lim.onExceed ?? "pause";
  }
  return "ok";
}
function resetTimes() {
  const now = /* @__PURE__ */ new Date();
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
  const mo = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
  const p = (n) => String(n).padStart(2, "0");
  const fmtJst = (x) => {
    const j = new Date(x.getTime() + 9 * 3600 * 1e3);
    return `${j.getUTCFullYear()}-${p(j.getUTCMonth() + 1)}-${p(j.getUTCDate())} ${p(j.getUTCHours())}:${p(j.getUTCMinutes())}（日本時間）`;
  };
  return { daily: fmtJst(d), monthly: fmtJst(mo) };
}
export {
  PROVIDER_LABEL,
  USAGE_PROVIDERS,
  dailyTotals,
  estimateUsd,
  getLimits,
  monthNeurons,
  monthTokens,
  monthTotals,
  monthUsd,
  overBudget,
  recordTokens,
  recordUsage,
  resetTimes,
  setLimits,
  todayTotals
};

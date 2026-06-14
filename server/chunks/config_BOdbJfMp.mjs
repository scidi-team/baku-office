globalThis.process ??= {};
globalThis.process.env ??= {};
const DEFAULT_MODELS = {
  gemini: "gemini-2.5-flash",
  claude: "claude-sonnet-4-6",
  workers_ai: "@cf/meta/llama-3.1-8b-instruct-fast"
  // Cloudflare Workers AI（CF上で稼働・ニューロン課金）。
  // WHY -fast：無印 @cf/meta/llama-3.1-8b-instruct は 2026-05-30 に廃止。-fast バリアントは存続（プロンプト互換のドロップイン）。
};
const DEFAULT_PRICING = {
  gemini: { in: 0.3, out: 2.5 },
  claude: { in: 3, out: 15 },
  workers_ai: { in: 0.05, out: 0.3 }
};
const NEURON_USD = 0.011 / 1e3;
function neuronsFromUsd(usd) {
  return usd > 0 ? Math.round(usd / NEURON_USD) : 0;
}
function geminiModelId(env) {
  return env.GEMINI_MODEL?.trim() || DEFAULT_MODELS.gemini;
}
function claudeModelId(env) {
  return env.CLAUDE_MODEL?.trim() || DEFAULT_MODELS.claude;
}
function workersAiModelId(env) {
  return env.WORKERS_AI_MODEL?.trim() || DEFAULT_MODELS.workers_ai;
}
const WORKERS_AI_MODELS = [
  { id: "@cf/meta/llama-3.1-8b-instruct-fast", label: "標準", note: "高速・軽量（既定）" },
  { id: "@cf/meta/llama-3.3-70b-instruct-fp8-fast", label: "高性能", note: "賢いが少し遅い（70B）" }
];
function isValidWorkersAiModel(id) {
  return WORKERS_AI_MODELS.some((m) => m.id === id);
}
function hasPricing(env, provider) {
  return Boolean(resolvePricing(env)[provider]);
}
function resolvePricing(env) {
  const merged = { ...DEFAULT_PRICING };
  const raw = env.MODEL_PRICING;
  if (!raw) return merged;
  try {
    const parsed = JSON.parse(raw);
    for (const [k, v] of Object.entries(parsed)) {
      const i = Number(v?.in), o = Number(v?.out);
      if (Number.isFinite(i) && i >= 0 && Number.isFinite(o) && o >= 0) merged[k] = { in: i, out: o };
    }
  } catch {
  }
  return merged;
}
export {
  DEFAULT_MODELS,
  DEFAULT_PRICING,
  NEURON_USD,
  WORKERS_AI_MODELS,
  claudeModelId,
  geminiModelId,
  hasPricing,
  isValidWorkersAiModel,
  neuronsFromUsd,
  resolvePricing,
  workersAiModelId
};

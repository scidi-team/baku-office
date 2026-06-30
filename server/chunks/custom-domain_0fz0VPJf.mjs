globalThis.process ??= {};
globalThis.process.env ??= {};
function sanitizeDomain(input) {
  const s = String(input ?? "").trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  if (!s) return "";
  if (s.length > 253) return "";
  const ok = /^(?=.{1,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/.test(s);
  return ok ? s : "";
}
const KV_DOMAIN = "custom_domain";
async function getCustomDomain(ctx) {
  const raw = await ctx.storage.kv.get(KV_DOMAIN);
  if (!raw) return null;
  try {
    const v = JSON.parse(raw);
    return v && typeof v.domain === "string" ? v : null;
  } catch {
    return null;
  }
}
async function setCustomDomain(ctx, domainInput, nowSec) {
  const domain = sanitizeDomain(domainInput);
  if (!domain) {
    await ctx.storage.kv.delete(KV_DOMAIN);
    return null;
  }
  const cfg = { domain, registeredAt: nowSec };
  await ctx.storage.kv.put(KV_DOMAIN, JSON.stringify(cfg));
  return cfg;
}
export {
  getCustomDomain,
  sanitizeDomain,
  setCustomDomain
};

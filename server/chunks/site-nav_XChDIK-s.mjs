globalThis.process ??= {};
globalThis.process.env ??= {};
import { kvPut } from "./kv_DEN7iKIl.mjs";
const KEY = "site_nav";
function safeHref(h) {
  const s = String(h ?? "").trim();
  if (s.startsWith("/") && !s.startsWith("//")) return s.slice(0, 300);
  if (/^https:\/\//i.test(s)) return s.slice(0, 300);
  return null;
}
function items(v, max) {
  if (!Array.isArray(v)) return [];
  const out = [];
  for (const it of v) {
    const label = String(it?.label ?? "").trim().slice(0, 40);
    const href = safeHref(it?.href);
    if (label && href) out.push({ label, href });
    if (out.length >= max) break;
  }
  return out;
}
function langs(v, max) {
  if (!Array.isArray(v)) return [];
  const out = [];
  for (const it of v) {
    const label = String(it?.label ?? "").trim().slice(0, 24);
    const href = safeHref(it?.href);
    const code = String(it?.code ?? "").trim().toLowerCase().replace(/[^a-z-]/g, "").slice(0, 8);
    if (label && href && code) out.push({ label, href, code });
    if (out.length >= max) break;
  }
  return out;
}
async function getSiteNav(env) {
  try {
    const raw = await env.LICENSE.get(KEY);
    if (raw) {
      const o = JSON.parse(raw);
      return { menu: items(o.menu, 8), footer: items(o.footer, 12), langs: langs(o.langs, 8) };
    }
  } catch {
  }
  return { menu: [], footer: [], langs: [] };
}
async function setSiteNav(env, cfg) {
  const clean = { menu: items(cfg.menu, 8), footer: items(cfg.footer, 12), langs: langs(cfg.langs, 8) };
  await kvPut(env, KEY, JSON.stringify(clean));
  return clean;
}
export {
  getSiteNav,
  setSiteNav
};

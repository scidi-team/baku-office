globalThis.process ??= {};
globalThis.process.env ??= {};
import { kvPut } from "./kv_DEgX1LMf.mjs";
import { d as decryptField, e as encryptField } from "./stripe_r-RFTlbb.mjs";
import { masterKey } from "./client_DsX87Mps.mjs";
const KV_HOOK = "deploy_hook";
const DOMAIN = "deploy-hook";
function cmpVersion(a, b) {
  const pa = a.split(".").map(Number), pb = b.split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) - (pb[i] || 0);
  }
  return 0;
}
function isValidHookUrl(u) {
  try {
    const x = new URL(u);
    return x.protocol === "https:" && /(^|\.)cloudflare\.com$/i.test(x.hostname);
  } catch {
    return false;
  }
}
async function hasDeployHook(env) {
  return await env.LICENSE.get(KV_HOOK) !== null;
}
async function saveDeployHook(env, url) {
  const enc = await encryptField(await masterKey(env), url, DOMAIN);
  await kvPut(env, KV_HOOK, enc);
}
async function getDeployHook(env) {
  const stored = await env.LICENSE.get(KV_HOOK);
  if (!stored) return null;
  return decryptField(await masterKey(env), stored, DOMAIN);
}
async function clearDeployHook(env) {
  await env.LICENSE.delete(KV_HOOK);
}
export {
  clearDeployHook,
  cmpVersion,
  getDeployHook,
  hasDeployHook,
  isValidHookUrl,
  saveDeployHook
};

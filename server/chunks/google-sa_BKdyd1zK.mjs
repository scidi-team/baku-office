globalThis.process ??= {};
globalThis.process.env ??= {};
import { saveApiKey, deleteApiKey, getApiKey } from "./client_DsX87Mps.mjs";
import { kvPut } from "./kv_DEgX1LMf.mjs";
import { n as nowSec } from "./accounting_BipJ8jvJ.mjs";
const SA_KEY = "google_sa_key";
const SA_SUBJECT = "google_sa_subject";
const SA_TOKEN = "google_sa_token";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const enc = new TextEncoder();
const b64url = (buf) => {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};
const b64urlStr = (s) => b64url(enc.encode(s));
function pemToDer(pem) {
  const body = pem.replace(/-----BEGIN [^-]+-----/, "").replace(/-----END [^-]+-----/, "").replace(/\s+/g, "");
  const bin = atob(body);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out.buffer;
}
async function signJwt(privateKeyPem, claims) {
  const key = await crypto.subtle.importKey("pkcs8", pemToDer(privateKeyPem), { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
  const header = b64urlStr(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = b64urlStr(JSON.stringify(claims));
  const data = `${header}.${payload}`;
  const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, enc.encode(data));
  return `${data}.${b64url(sig)}`;
}
async function mintSaToken(key, subject, scope) {
  if (!key.client_email || !key.private_key) return { ok: false, error: "SA鍵に client_email / private_key がありません" };
  const iat = nowSec();
  const assertion = await signJwt(key.private_key, {
    iss: key.client_email,
    sub: subject,
    scope,
    aud: key.token_uri || TOKEN_URL,
    iat,
    exp: iat + 3600
  });
  const r = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion })
  });
  if (!r.ok) return { ok: false, error: `トークン取得に失敗（${r.status}）：${(await r.text()).slice(0, 200)}` };
  const t = await r.json();
  if (!t.access_token) return { ok: false, error: "access_token が返りませんでした" };
  return { ok: true, token: t.access_token, expiresIn: t.expires_in ?? 3600 };
}
async function loadKey(env) {
  const raw = await getApiKey(env, SA_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
async function saveServiceAccount(env, keyJson, subject) {
  let key;
  try {
    key = JSON.parse(keyJson);
  } catch {
    return { ok: false, error: "鍵ファイルが JSON として読み込めません" };
  }
  if (!key.client_email || !key.private_key || !key.client_id) return { ok: false, error: "サービスアカウント鍵（client_email / private_key / client_id を含む JSON）を指定してください" };
  const sub = subject.trim();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(sub)) return { ok: false, error: "代理するユーザーのメールアドレスを正しく入力してください" };
  await saveApiKey(env, SA_KEY, JSON.stringify(key));
  await kvPut(env, SA_SUBJECT, sub);
  await env.LICENSE.delete(SA_TOKEN);
  return { ok: true };
}
async function serviceAccountConfigured(env) {
  return !!await getApiKey(env, SA_KEY) && !!await env.LICENSE.get(SA_SUBJECT);
}
async function getServiceAccountInfo(env) {
  const key = await loadKey(env);
  const subject = await env.LICENSE.get(SA_SUBJECT);
  if (!key?.client_email || !key.client_id || !subject) return null;
  return { clientEmail: key.client_email, clientId: key.client_id, subject };
}
async function clearServiceAccount(env) {
  await deleteApiKey(env, SA_KEY);
  await env.LICENSE.delete(SA_SUBJECT);
  await env.LICENSE.delete(SA_TOKEN);
}
async function serviceAccountAccessToken(env, scope) {
  const key = await loadKey(env);
  const subject = await env.LICENSE.get(SA_SUBJECT);
  if (!key || !subject) return null;
  try {
    const cached = JSON.parse(await env.LICENSE.get(SA_TOKEN) ?? "null");
    if (cached && cached.scope === scope && cached.exp > nowSec() + 60) return cached.token;
  } catch {
  }
  const res = await mintSaToken(key, subject, scope);
  if (!res.ok || !res.token) return null;
  await kvPut(env, SA_TOKEN, JSON.stringify({ token: res.token, exp: nowSec() + (res.expiresIn ?? 3600), scope }));
  return res.token;
}
async function testServiceAccount(env, scope) {
  const key = await loadKey(env);
  const subject = await env.LICENSE.get(SA_SUBJECT);
  if (!key || !subject) return { ok: false, error: "サービスアカウントが未設定です" };
  const res = await mintSaToken(key, subject, scope);
  return res.ok ? { ok: true } : { ok: false, error: res.error };
}
export {
  clearServiceAccount,
  getServiceAccountInfo,
  mintSaToken,
  saveServiceAccount,
  serviceAccountAccessToken,
  serviceAccountConfigured,
  signJwt,
  testServiceAccount
};

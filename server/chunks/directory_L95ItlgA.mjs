globalThis.process ??= {};
globalThis.process.env ??= {};
import { getToken, hostFetch } from "./client_DsX87Mps.mjs";
import { w as webSearch } from "./media-ai_DCsVDbkH.mjs";
import { getOrgProfile, setOrgProfile, listPublicActions } from "./a2a-actions_BnJ6d8hy.mjs";
import { brandName, getTheme } from "./theme_DO0iS6ur.mjs";
async function getPublicProfile(ctx) {
  const p = await getOrgProfile(ctx);
  return { summary: p.summary, tags: p.tags ?? [], contact: p.contact, website: p.website, listed: p.listed === true };
}
async function setPublicProfile(ctx, patch) {
  const cur = await getOrgProfile(ctx);
  const next = { ...cur, ...patch };
  await setOrgProfile(ctx, next);
  return next;
}
async function orgDisplayName(ctx) {
  return brandName(await getTheme(ctx));
}
async function buildEmbedding(env, text) {
  if (!env.AI || !text.trim()) return null;
  try {
    const r = await env.AI.run("@cf/baai/bge-m3", { text: text.slice(0, 2e3) });
    const v = r?.data?.[0];
    if (!Array.isArray(v) || !v.length) return null;
    const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0)) || 1;
    return v.map((x) => x / norm);
  } catch {
    return null;
  }
}
async function verifyOrgExistence(env, info) {
  const now = Math.floor(Date.now() / 1e3);
  const q = `${info.orgName} ${info.website ?? ""} 公式 事業内容 評判 口コミ`.trim();
  const text = await webSearch(env, `次の団体の実在性・事業実態・評判を簡潔に。問題（詐欺/苦情/反社の噂など）があれば明記：${q}`).catch(() => null);
  if (!text) return { exists: false, siteMatch: false, reputation: "unknown", score: 0, summary: "AI(Web検索)未設定のため未検証", checked_at: now };
  const low = text.toLowerCase();
  const bad = /詐欺|被害|苦情|反社|逮捕|行政処分|scam|fraud|complaint/.test(text);
  const exists = !/見つかりません|該当なし|情報が得られ|not found|no result/.test(low) && text.length > 30;
  const reputation = bad ? "mixed" : exists ? "good" : "unknown";
  const score = (exists ? 0.5 : 0) + (info.website ? 0.2 : 0) + (reputation === "good" ? 0.3 : 0);
  return { exists, siteMatch: !!info.website, reputation, score: Math.round(score * 100) / 100, summary: text.slice(0, 400), checked_at: now };
}
async function reviewIncomingPartner(env, fromName) {
  if (!fromName) return { ok: true, reason: "相手名不明（既定許可）" };
  const text = await webSearch(env, `団体「${fromName}」に詐欺・苦情・反社などの問題がないか簡潔に`).catch(() => null);
  if (!text) return { ok: true, reason: "Web検索未設定（既定許可）" };
  const bad = /詐欺|被害|苦情|反社|逮捕|行政処分|scam|fraud/.test(text);
  return { ok: !bad, reason: text.slice(0, 200) };
}
async function publishDirectory(env, ctx, opts) {
  const token = await getToken(env);
  if (!token) return { error: "ライセンス未取得" };
  const profile = await getPublicProfile(ctx);
  const orgName = await orgDisplayName(ctx);
  const publicActions = await listPublicActions(ctx);
  const text = `${orgName} ${profile.summary ?? ""} ${(profile.tags ?? []).join(" ")}`;
  const embedding = await buildEmbedding(env, text);
  const r = await hostFetch(env, "/api/directory/publish", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ token, orgName, profile: { ...profile, public_actions: publicActions }, embedding, verification: opts.verification, listed: opts.listed })
  });
  return await r.json().catch(() => ({ error: "応答不正" }));
}
async function unpublishDirectory(env) {
  const token = await getToken(env);
  if (!token) return { error: "ライセンス未取得" };
  const r = await hostFetch(env, "/api/directory/publish", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token, _action: "unpublish" }) });
  return await r.json().catch(() => ({ error: "応答不正" }));
}
async function myDirectory(env) {
  const token = await getToken(env);
  if (!token) return { error: "ライセンス未取得" };
  const r = await hostFetch(env, "/api/directory/mine", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token }) });
  return await r.json().catch(() => ({ error: "応答不正" }));
}
async function searchDirectory(env, query, tags, certifiedOnly) {
  const token = await getToken(env);
  if (!token) return { ok: false, error: "ライセンス未取得" };
  const queryEmbedding = query ? await buildEmbedding(env, query) : null;
  const r = await hostFetch(env, "/api/directory/search", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token, query, queryEmbedding, tags, certifiedOnly }) });
  return await r.json().catch(() => ({ ok: false, error: "応答不正" }));
}
async function reportDirectory(env, target, reason, detail) {
  const token = await getToken(env);
  if (!token) return { error: "ライセンス未取得" };
  const r = await hostFetch(env, "/api/directory/report", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token, target, reason, detail }) });
  return await r.json().catch(() => ({ error: "応答不正" }));
}
export {
  buildEmbedding,
  getPublicProfile,
  myDirectory,
  orgDisplayName,
  publishDirectory,
  reportDirectory,
  reviewIncomingPartner,
  searchDirectory,
  setPublicProfile,
  unpublishDirectory,
  verifyOrgExistence
};

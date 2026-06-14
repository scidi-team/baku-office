globalThis.process ??= {};
globalThis.process.env ??= {};
import { getApiKey, getToken, hostFetch, getVerifyJwk } from "./client_DsX87Mps.mjs";
import { v as verifyEnvelope, i as importVerifyKey, p as payloadOf, r as randomId } from "./stripe_r-RFTlbb.mjs";
import { n as nowSec } from "./accounting_BipJ8jvJ.mjs";
import { getStorageUsage } from "./storage-usage_J5_c4nFJ.mjs";
import { getLimits, monthUsd, estimateUsd } from "./usage_Uka2N290.mjs";
const ALLOWED_PERMS = /* @__PURE__ */ new Set(["db:read", "db:write", "storage:read", "storage:write", "ai", "agent", "members:read", "net"]);
const PRIVILEGED = ["db:write", "storage:write", "members:read", "net"];
const DESTRUCTIVE = /\b(drop\s+table|delete\s+from|truncate|alter\s+table|attach\s+database|pragma|update\s+\w+\s+set(?![^;]*\bwhere\b))/i;
async function preflight(ctx, d) {
  const env = ctx.env;
  const perms = d.permissions ?? [];
  const defStr = typeof d.definition === "string" ? d.definition : JSON.stringify(d.definition ?? "");
  const checks = [];
  const needsAi = perms.includes("ai") || perms.includes("agent");
  const hasAi = needsAi ? !!await getApiKey(env, "gemini") || !!await getApiKey(env, "claude") || !!env.LOCAL_AI_BASE_URL : true;
  const storage = await getStorageUsage(env).catch(() => []);
  const near = storage.filter((s) => s.enabled && s.limit > 0 && s.used >= 0 && s.used / s.limit >= 0.9);
  if (needsAi && !hasAi) checks.push({ key: "env", label: "環境確認", status: "fail", detail: "AI能力が必要ですが Gemini/Claude/ローカルLLM のいずれも未設定です。" });
  else if (near.length) checks.push({ key: "env", label: "環境確認", status: "warn", detail: `容量が逼迫しています（90%超）：${near.map((s) => s.key.toUpperCase()).join(", ")}。` });
  else checks.push({ key: "env", label: "環境確認", status: "ok", detail: "この環境で実行可能・容量に余裕あり。" });
  const unknown = perms.filter((p) => !ALLOWED_PERMS.has(p));
  const priv = perms.filter((p) => PRIVILEGED.includes(p));
  if (unknown.length) checks.push({ key: "permission", label: "権限確認", status: "fail", detail: `未知/不許可の権限：${unknown.join(", ")}（破壊的・特権操作はアプリに付与されません）。` });
  else if (priv.length) checks.push({ key: "permission", label: "権限確認", status: "warn", detail: `管理者承認が必要な権限を含みます：${priv.join(", ")}。` });
  else checks.push({ key: "permission", label: "権限確認", status: "ok", detail: "クライアント権限内で実行可能。" });
  if (DESTRUCTIVE.test(defStr)) checks.push({ key: "safety", label: "安全確認", status: "fail", detail: "破壊的操作の痕跡（DROP/DELETE/TRUNCATE/ALTER/WHERE無しUPDATE 等）を検出しました。" });
  else if (perms.includes("net")) checks.push({ key: "safety", label: "安全確認", status: "warn", detail: "外部送信（net）を含みます。送信先 allowlist と内容を要確認。" });
  else checks.push({ key: "safety", label: "安全確認", status: "ok", detail: "DB/ストレージへの破壊的操作なし（スコープ済み ctx・owner 限定で動作）。" });
  const tokens = d.estTokens && d.estTokens > 0 ? d.estTokens : Math.min(2e4, Math.ceil(defStr.length / 3) + 2e3);
  const limits = await getLimits(env).catch(() => ({}));
  const month = await monthUsd(env).catch(() => ({}));
  const estJobUsd = Math.max(estimateUsd(env, "claude", tokens, tokens), estimateUsd(env, "gemini", tokens, tokens));
  const usdCap = limits.gemini?.monthlyUsdCap ?? limits.claude?.monthlyUsdCap;
  const usedUsd = (month.gemini ?? 0) + (month.claude ?? 0);
  const fmtUsd = (n) => "$" + n.toFixed(n < 1 ? 4 : 2);
  let costStatus = "ok";
  let costDetail = `推定消費 ~${tokens.toLocaleString()} tokens/実行（推定 ~${fmtUsd(estJobUsd)}）。`;
  if (usdCap && usdCap > 0) {
    const remain = usdCap - usedUsd;
    costDetail += ` 当月予算 残り ~${fmtUsd(Math.max(0, remain))}/${fmtUsd(usdCap)}。`;
    if (remain <= 0) {
      costStatus = "fail";
      costDetail += " 予算超過のため実行不可。";
    } else if (estJobUsd > remain) {
      costStatus = "warn";
      costDetail += " 1実行で予算を超える可能性。";
    }
  } else {
    costDetail += " 月次の費用上限は［高度なオプション → API使用量］で設定・確認できます。";
  }
  checks.push({ key: "cost", label: "コスト計算", status: costStatus, detail: costDetail });
  return { ok: checks.every((c) => c.status !== "fail"), checks };
}
async function fetchAndInstall(ctx, id) {
  const env = ctx.env;
  const token = await getToken(env);
  if (!token) return { ok: false, error: "ライセンス未取得" };
  let r;
  try {
    r = await hostFetch(env, "/api/registry/fetch", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token, id }) });
  } catch {
    return { ok: false, error: "ホストへ接続できません" };
  }
  if (!r.ok) {
    const j2 = await r.json().catch(() => ({}));
    return { ok: false, error: j2.error ?? "取得に失敗しました（承認済み・プラン充足が必要）" };
  }
  const j = await r.json().catch(() => ({}));
  if (!j.pkg) return { ok: false, error: "パッケージがありません" };
  const jwk = await getVerifyJwk(env);
  if (!jwk) return { ok: false, error: "検証鍵を取得できません" };
  let envlp;
  try {
    envlp = JSON.parse(atob(j.pkg));
  } catch {
    return { ok: false, error: "パッケージ形式が不正" };
  }
  if (!await verifyEnvelope(await importVerifyKey(jwk), envlp)) return { ok: false, error: "署名検証に失敗（改竄の可能性）" };
  const p = payloadOf(envlp);
  if (!p.id || !p.exp || p.exp < nowSec()) return { ok: false, error: "パッケージの有効期限切れ" };
  await ctx.db.run(
    `INSERT INTO external_apps (id,name,version,category,description,permissions,definition,installed_at) VALUES (?,?,?,?,?,?,?,?)
     ON CONFLICT(id) DO UPDATE SET name=excluded.name,version=excluded.version,category=excluded.category,
       description=excluded.description,permissions=excluded.permissions,definition=excluded.definition,installed_at=excluded.installed_at`,
    [p.id, p.name, p.version, p.category ?? null, p.description ?? null, JSON.stringify(p.permissions ?? []), p.definition != null ? JSON.stringify(p.definition) : null, nowSec()]
  );
  return { ok: true };
}
async function listExternalApps(ctx) {
  const results = await ctx.db.all("SELECT id,name,version,category,description,permissions FROM external_apps ORDER BY installed_at DESC");
  return results.map((r) => ({ ...r, permissions: JSON.parse(r.permissions || "[]") }));
}
async function uninstallExternal(ctx, id) {
  await ctx.db.run("DELETE FROM external_apps WHERE id=?", [id]);
}
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "app-" + randomId(3);
async function createDraft(ctx, d, by) {
  const id = slug(d.name);
  const pf = await preflight(ctx, { permissions: d.permissions, definition: d.definition, estTokens: d.estTokens });
  const gate = pf.ok ? "ready" : "blocked";
  await ctx.db.run(
    `INSERT INTO app_drafts (id,name,version,description,spec,permissions,definition,est_tokens,preflight,gate_status,status,created_by,created_at)
     VALUES (?,?,?,?,?,?,?,?,?,?, 'pending', ?, ?)
     ON CONFLICT(id) DO UPDATE SET name=excluded.name,version=excluded.version,description=excluded.description,spec=excluded.spec,
       permissions=excluded.permissions,definition=excluded.definition,est_tokens=excluded.est_tokens,preflight=excluded.preflight,gate_status=excluded.gate_status,status='pending'`,
    [id, d.name, d.version ?? "0.1.0", d.description ?? null, d.spec ?? null, JSON.stringify(d.permissions ?? []), d.definition != null ? JSON.stringify(d.definition) : null, d.estTokens ?? null, JSON.stringify(pf), gate, by ?? null, nowSec()]
  );
  return { id, preflight: pf, gate };
}
async function listDrafts(ctx) {
  const results = await ctx.db.all("SELECT id,name,version,description,spec,permissions,status,gate_status,preflight FROM app_drafts ORDER BY created_at DESC");
  return results.map((r) => ({ ...r, permissions: JSON.parse(r.permissions || "[]"), preflight: r.preflight ? JSON.parse(r.preflight) : null }));
}
async function deleteDraft(ctx, id) {
  await ctx.db.run("DELETE FROM app_drafts WHERE id=?", [id]);
}
async function submitDraft(ctx, id) {
  const env = ctx.env;
  const d = await ctx.db.first("SELECT * FROM app_drafts WHERE id=?", [id]);
  if (!d) return { ok: false, error: "ドラフトが見つかりません" };
  if (d.gate_status !== "ready") return { ok: false, error: "事前確認（環境/権限/安全/コスト）に未通過のため公開申請できません。" };
  const token = await getToken(env);
  if (!token) return { ok: false, error: "ライセンス未取得" };
  const app = { id: d.id, name: d.name, version: d.version, description: d.description, permissions: JSON.parse(d.permissions || "[]"), definition: d.definition ? JSON.parse(d.definition) : null };
  let r;
  try {
    r = await hostFetch(env, "/api/registry/submit", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token, app }) });
  } catch {
    return { ok: false, error: "ホストへ接続できません" };
  }
  if (!r.ok) {
    const j = await r.json().catch(() => ({}));
    return { ok: false, error: j.error ?? "申請に失敗" };
  }
  await ctx.db.run("UPDATE app_drafts SET status='submitted' WHERE id=?", [id]);
  return { ok: true };
}
export {
  createDraft,
  deleteDraft,
  fetchAndInstall,
  listDrafts,
  listExternalApps,
  submitDraft,
  uninstallExternal
};

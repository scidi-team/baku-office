globalThis.process ??= {};
globalThis.process.env ??= {};
import { kvPut } from "./kv_DEgX1LMf.mjs";
import { r as randomId } from "./stripe_r-RFTlbb.mjs";
import { getApiKey, saveApiKey } from "./client_DsX87Mps.mjs";
import { listFiles, getFile } from "./storage_C7TJPJmI.mjs";
import { n as nowSec } from "./accounting_BipJ8jvJ.mjs";
const SCOPE = "https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.file";
const REFRESH_KEY = "drive_refresh";
function driveConfigured(env) {
  return !!(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET);
}
function redirectUri(origin) {
  return `${origin}/api/drive/callback`;
}
function driveAuthUrl(env, origin, state) {
  if (!env.GOOGLE_CLIENT_ID) return null;
  const u = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  u.searchParams.set("client_id", env.GOOGLE_CLIENT_ID);
  u.searchParams.set("redirect_uri", redirectUri(origin));
  u.searchParams.set("response_type", "code");
  u.searchParams.set("scope", SCOPE);
  u.searchParams.set("access_type", "offline");
  u.searchParams.set("prompt", "consent");
  u.searchParams.set("state", state);
  return u.toString();
}
async function exchangeDriveCode(env, origin, code) {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) return false;
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: redirectUri(origin), client_id: env.GOOGLE_CLIENT_ID, client_secret: env.GOOGLE_CLIENT_SECRET })
  });
  if (!r.ok) {
    console.log("[drive-token]", r.status, (await r.text()).slice(0, 200));
    return false;
  }
  const t = await r.json();
  if (!t.refresh_token) return false;
  await saveApiKey(env, REFRESH_KEY, t.refresh_token);
  return true;
}
async function driveConnected(env) {
  return !!await getApiKey(env, REFRESH_KEY);
}
async function driveAccessToken(env) {
  const refresh = await getApiKey(env, REFRESH_KEY);
  if (!refresh || !env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) return null;
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refresh, client_id: env.GOOGLE_CLIENT_ID, client_secret: env.GOOGLE_CLIENT_SECRET })
  });
  if (!r.ok) return null;
  return (await r.json()).access_token ?? null;
}
async function syncDriveMetadata(env) {
  const token = await driveAccessToken(env);
  if (!token) return { synced: 0, error: "Google ドライブが未連携です。" };
  let synced = 0;
  let pageToken = "";
  for (let page = 0; page < 5; page++) {
    const u = new URL("https://www.googleapis.com/drive/v3/files");
    u.searchParams.set("fields", "nextPageToken,files(id,name,mimeType,size,modifiedTime,parents)");
    u.searchParams.set("pageSize", "200");
    u.searchParams.set("q", "trashed=false");
    if (pageToken) u.searchParams.set("pageToken", pageToken);
    const r = await fetch(u, { headers: { authorization: `Bearer ${token}` } });
    if (!r.ok) return { synced, error: `Drive ${r.status}` };
    const d = await r.json();
    for (const f of d.files ?? []) {
      await env.DB.prepare(
        "INSERT INTO drive_files (id,name,mime,size,modified,parents,synced_at) VALUES (?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET name=excluded.name,mime=excluded.mime,size=excluded.size,modified=excluded.modified,parents=excluded.parents,synced_at=excluded.synced_at"
      ).bind(f.id, f.name, f.mimeType ?? null, f.size ? Number(f.size) : null, f.modifiedTime ?? null, JSON.stringify(f.parents ?? []), nowSec()).run();
      synced++;
    }
    if (!d.nextPageToken) break;
    pageToken = d.nextPageToken;
  }
  return { synced };
}
async function listDriveFiles(env, q = "") {
  if (q) return (await env.DB.prepare("SELECT id,name,mime,size,modified,synced_at FROM drive_files WHERE name LIKE ? ORDER BY modified DESC LIMIT 200").bind("%" + q + "%").all()).results;
  return (await env.DB.prepare("SELECT id,name,mime,size,modified,synced_at FROM drive_files ORDER BY modified DESC LIMIT 200").all()).results;
}
async function getDriveBackup(env) {
  try {
    return JSON.parse(await env.LICENSE.get("drive_backup") ?? '{"enabled":false}');
  } catch {
    return { enabled: false };
  }
}
async function setDriveBackup(env, enabled) {
  await kvPut(env, "drive_backup", JSON.stringify({ enabled: !!enabled }));
}
async function uploadToDrive(token, name, mime, buf) {
  const boundary = "bo_" + randomId();
  const pre = `--${boundary}\r
Content-Type: application/json; charset=UTF-8\r
\r
${JSON.stringify({ name })}\r
--${boundary}\r
Content-Type: ${mime || "application/octet-stream"}\r
\r
`;
  const post = `\r
--${boundary}--`;
  const body = new Blob([pre, buf, post], { type: `multipart/related; boundary=${boundary}` });
  const r = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", { method: "POST", headers: { authorization: `Bearer ${token}` }, body });
  if (!r.ok) {
    console.log("[drive-upload]", r.status);
    return null;
  }
  return (await r.json()).id ?? null;
}
async function uploadBufferToDrive(env, name, mime, buf) {
  const token = await driveAccessToken(env);
  if (!token) return { ok: false, error: "Google ドライブが未連携です。" };
  const id = await uploadToDrive(token, name, mime, buf);
  return id ? { ok: true, id } : { ok: false, error: "アップロードに失敗しました。" };
}
async function backupToDrive(env, limit = 5) {
  const token = await driveAccessToken(env);
  if (!token) return { uploaded: 0, error: "未連携" };
  const files = await listFiles(env);
  const done = new Set((await env.DB.prepare("SELECT file_id FROM drive_backup_log").all()).results.map((r) => r.file_id));
  let uploaded = 0;
  for (const f of files) {
    if (uploaded >= limit) break;
    if (done.has(f.id)) continue;
    const data = await getFile(env, f.id);
    if (!data) continue;
    const id = await uploadToDrive(token, data.name, data.mime, data.buf);
    if (id) {
      await env.DB.prepare("INSERT OR IGNORE INTO drive_backup_log (file_id,drive_id,at) VALUES (?,?,?)").bind(f.id, id, nowSec()).run();
      uploaded++;
    }
  }
  return { uploaded };
}
export {
  backupToDrive,
  driveAccessToken,
  driveAuthUrl,
  driveConfigured,
  driveConnected,
  exchangeDriveCode,
  getDriveBackup,
  listDriveFiles,
  setDriveBackup,
  syncDriveMetadata,
  uploadBufferToDrive
};

globalThis.process ??= {};
globalThis.process.env ??= {};
import { f as defineMiddleware, s as sequence } from "./chunks/sequence_I_kcixDX.mjs";
import { masterKeySource, masterKeyCtx, getToken } from "./chunks/client_DsX87Mps.mjs";
import { e as ensureSchema } from "./chunks/migrate_CCsCU_X1.mjs";
import { kvPut } from "./chunks/kv_DEgX1LMf.mjs";
import { logDiag } from "./chunks/diag_8r20ZCMR.mjs";
import { sameOrigin, getSession } from "./chunks/auth_BXoLTJDQ.mjs";
import { n as needsConsent } from "./chunks/consent_C9pinaEx.mjs";
import { fileBelongsTo, getFile, saveFile, storageMode } from "./chunks/storage_C7TJPJmI.mjs";
import { b as summarizeTranscript, c as extractInvoiceData, m as makeDocument, w as webSearch, t as transcribeAudio } from "./chunks/media-ai_DCsVDbkH.mjs";
import { googleFetch } from "./chunks/google_BPQSD05g.mjs";
import { r as runAgent } from "./chunks/agent_D4R31rlG.mjs";
import { d as decryptField } from "./chunks/stripe_r-RFTlbb.mjs";
import { verifyPassword } from "./chunks/users_BHOLHxMy.mjs";
import { detectProfile } from "./chunks/profiles_D3vLhBYo.mjs";
import { makeAppsApi } from "./chunks/apps_CY4lyIL1.mjs";
import "./chunks/index_LVLYtqrF.mjs";
import { r as resolveError, a as appendCode } from "./chunks/errors_B9oiVjN8.mjs";
import { env } from "cloudflare:workers";
const KV_FLAG = "bootcheck_done";
function checkProdEnv(env2) {
  const out = [];
  if (env2.ENVIRONMENT !== "production") return out;
  if (!env2.MASTER_KEY) out.push({ level: "error", key: "MASTER_KEY", detail: "未設定。保存時暗号化・セッション署名が停止する（wrangler secret put MASTER_KEY --env production）。" });
  if (!env2.VERIFY_PUBLIC_JWK) out.push({ level: "warn", key: "VERIFY_PUBLIC_JWK", detail: "未設定。A2A受信の署名検証が 503 になる。" });
  if (!env2.INTERNAL_KEY) out.push({ level: "warn", key: "INTERNAL_KEY", detail: "未設定。リマインダー drain の保護が効かない。" });
  if (!env2.GOOGLE_CLIENT_ID || !env2.GOOGLE_CLIENT_SECRET) out.push({ level: "warn", key: "GOOGLE_OAUTH", detail: "GOOGLE_CLIENT_ID/SECRET 未設定。組織ログインが dev 経路にフォールバックする。" });
  return out;
}
let isolateChecked = false;
async function bootCheck(env2) {
  if (isolateChecked) return;
  isolateChecked = true;
  try {
    if (await env2.LICENSE.get(KV_FLAG) === "1") return;
    if (env2.ENVIRONMENT === "production") {
      for (const f of checkProdEnv(env2)) {
        await logDiag(env2, f.level, "bootcheck", `本番設定点検: ${f.key} — ${f.detail}`);
      }
    }
    const src = await masterKeySource(env2);
    if (src === "missing-prod") {
      await logDiag(
        env2,
        "error",
        "security",
        "本番で MASTER_KEY が未投入＝暗号処理をブロック中。`wrangler secret put MASTER_KEY --env production` で投入してください（§10.1）。"
      );
    } else if (src === "kv-autogen" && env2.ENVIRONMENT === "production") {
      await logDiag(
        env2,
        "error",
        "security",
        "本番(自社)で MASTER_KEY が KV 自動生成です＝運用事故（鍵と暗号文が同居）。Worker Secret(MASTER_KEY) を投入してください（§10.1）。"
      );
    }
    if (src !== "unknown") await kvPut(env2, KV_FLAG, "1");
  } catch {
  }
}
function cfSqlStore(env2) {
  const bind = (sql, params = []) => env2.DB.prepare(sql).bind(...params);
  return {
    all: async (sql, params) => (await bind(sql, params).all()).results,
    first: (sql, params) => bind(sql, params).first(),
    run: async (sql, params) => {
      const r = await bind(sql, params).run();
      return { rowsWritten: r.meta?.changes ?? 0, lastRowId: r.meta?.last_row_id ?? null };
    },
    batch: async (stmts) => {
      await env2.DB.batch(stmts.map((s) => env2.DB.prepare(s.sql).bind(...s.params ?? [])));
    }
  };
}
function cfStorage(env2) {
  return {
    kv: {
      get: (k) => env2.LICENSE.get(k),
      put: (k, v, o) => kvPut(env2, k, v, o),
      delete: (k) => env2.LICENSE.delete(k),
      list: async (prefix) => (await env2.LICENSE.list({ prefix })).keys.map((x) => x.name)
    },
    mode: () => storageMode(env2),
    saveFile: (file, by) => saveFile(env2, file, by),
    getFile: (id) => getFile(env2, id),
    ownsFile: (id, owner) => fileBelongsTo(env2, id, owner)
  };
}
function cfAi(env2) {
  return {
    transcribe: (buf, mime) => transcribeAudio(env2, buf, mime),
    webSearch: (q) => webSearch(env2, q),
    makeDocument: (owner, baseUrl, a) => makeDocument(env2, owner, baseUrl, a),
    extractInvoice: (file) => extractInvoiceData(env2, file),
    summarizeTranscript: (text) => summarizeTranscript(env2, text)
  };
}
function cfGoogle(env2) {
  return {
    fetch: (url, init) => googleFetch(env2, url, init)
  };
}
function cfAgent(ctx) {
  return {
    run: (i) => runAgent(ctx, i.owner, i.text, i.image, i.baseUrl ?? "", i.role ?? "member", { history: i.history, model: i.model })
  };
}
function localIdentity(ctx) {
  const memberOf = async (type, externalId) => {
    const idn = await ctx.db.first("SELECT user_id FROM identities WHERE type=? AND external_id=?", [type, externalId]);
    if (!idn) return null;
    return await ctx.db.first("SELECT id, role, status FROM users WHERE id=?", [idn.user_id]) ?? null;
  };
  return {
    memberOf,
    roleOf: async (type, externalId) => (await memberOf(type, externalId))?.role ?? null,
    listMemberNames: async () => {
      const rows = await ctx.db.all("SELECT display_name,role FROM users WHERE status='active'");
      const mk = await masterKeyCtx(ctx);
      const out = [];
      for (const u of rows) {
        let name = "";
        try {
          name = u.display_name ? await decryptField(mk, u.display_name, "member-pii") : "";
        } catch {
        }
        out.push({ name, role: u.role });
      }
      return out;
    },
    authenticate: async (loginId, password) => {
      const idn = await ctx.db.first("SELECT user_id, password_hash FROM identities WHERE type='local' AND external_id=?", [loginId]);
      if (!idn?.password_hash || !await verifyPassword(idn.password_hash, password)) return null;
      return await ctx.db.first("SELECT id, role, status FROM users WHERE id=? AND status='active'", [idn.user_id]) ?? null;
    }
  };
}
function buildCtx(env2) {
  const ctx = { profile: detectProfile(env2).id, env: env2, db: cfSqlStore(env2), storage: cfStorage(env2), ai: cfAi(env2), google: cfGoogle(env2) };
  ctx.identity = localIdentity(ctx);
  ctx.agent = cfAgent(ctx);
  ctx.apps = makeAppsApi(ctx);
  return ctx;
}
const STATIC_EXT = /\.(?:css|js|mjs|map|png|jpe?g|gif|svg|webp|avif|ico|woff2?|ttf|otf|txt|json|xml|webmanifest)$/i;
const UNSAFE_METHODS = /* @__PURE__ */ new Set(["POST", "PUT", "PATCH", "DELETE"]);
const CSRF_EXEMPT = /* @__PURE__ */ new Set([
  "/api/site/stripe-webhook",
  "/api/line/webhook",
  "/api/a2a/inbound",
  "/api/cron/drain"
]);
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'"
].join("; ");
function withSec(res) {
  res.headers.set("Content-Security-Policy", CSP);
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return res;
}
const escHtml = (s) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);
function buildErrorResponse(status, code, message, pathname, accept) {
  const isApi = pathname.startsWith("/api/") || accept.includes("application/json");
  const retry = String(status === 503 ? 3600 : 5);
  if (isApi) {
    return new Response(JSON.stringify({ error: appendCode(message, code), code }), {
      status,
      headers: { "content-type": "application/json", "retry-after": retry }
    });
  }
  const html = `<!doctype html><html lang="ja"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>エラー（${code}）</title><div style="max-width:640px;margin:12vh auto;padding:24px;font-family:system-ui,-apple-system,'Hiragino Kaku Gothic ProN',sans-serif;line-height:1.9;color:#0E1A2B"><h1 style="font-size:1.35rem">問題が発生しました</h1><p style="font-size:1.05rem">${escHtml(message)}</p><p style="font-size:1.02rem">サポートにお問い合わせの際は、次の番号をお伝えください：<br><strong style="font-size:1.25rem;letter-spacing:.04em">エラー番号 ${code}</strong></p><p><a href="javascript:history.back()" style="color:#836528;font-weight:600">← 前の画面に戻る</a></p></div></html>`;
  return new Response(html, { status, headers: { "content-type": "text/html; charset=utf-8", "retry-after": retry } });
}
const onRequest$1 = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  try {
    context.locals.ctx = buildCtx(env);
    await ensureSchema(env);
    await bootCheck(env);
    if (pathname.startsWith("/api/") && UNSAFE_METHODS.has(context.request.method) && !CSRF_EXEMPT.has(pathname) && !sameOrigin(context.request)) {
      return withSec(
        new Response(JSON.stringify({ error: "cross-site request rejected" }), {
          status: 403,
          headers: { "content-type": "application/json" }
        })
      );
    }
    const exempt = pathname.startsWith("/activate") || pathname.startsWith("/api/") || STATIC_EXT.test(pathname);
    if (exempt) return withSec(await next());
    const token = await getToken(env);
    if (!token) {
      if (env.LICENSE_ID) return withSec(context.redirect("/activate?license_id=" + encodeURIComponent(env.LICENSE_ID), 302));
      return withSec(context.redirect("/activate", 302));
    }
    if (pathname !== "/consent") {
      const ses = await getSession(env, context.request);
      if (ses?.ctx === "org" && ses.role === "admin" && await needsConsent(env)) {
        return withSec(context.redirect("/consent", 302));
      }
    }
    return withSec(await next());
  } catch (e) {
    const { status, code, message } = resolveError(e, pathname);
    try {
      await logDiag(env, "error", "exception", `[${code}] ${context.request.method} ${pathname}: ${(e instanceof Error ? e.message : String(e)).slice(0, 200)}`);
    } catch {
    }
    return withSec(buildErrorResponse(status, code, message, pathname, context.request.headers.get("accept") ?? ""));
  }
});
const onRequest = sequence(
  onRequest$1
);
export {
  onRequest
};

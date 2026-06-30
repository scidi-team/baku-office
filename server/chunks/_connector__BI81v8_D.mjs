globalThis.process ??= {};
globalThis.process.env ??= {};
import { cachedEntitlement, getApiKey } from "./client_v-7HzW5v.mjs";
import { DiscordInbound } from "./discord_QiT67BSn.mjs";
import { r as randomId } from "./stripe_r-RFTlbb.mjs";
import { a as atLeast } from "./types_BVJxqWI9.mjs";
import { joinWithInvite } from "./users_BT4mrZN2.mjs";
import { F as transcribeAudio, G as enqueueSummary, H as verifyLineSignature, I as fetchLineImage, J as lineReply, h as cfEgressGateway } from "./ctx_Bv3SAITG.mjs";
import { saveFile } from "./storage_4iye1Zw4.mjs";
import { logDiag, looksLikeLimit, PAID_HINT } from "./diag_BjrAYDQX.mjs";
import { n as nowSec } from "./accounting_D4tRmfws.mjs";
import { env } from "cloudflare:workers";
const ok = () => new Response("ok", { status: 200 });
class SlackInbound {
  id = "slack";
  gw;
  signingSecret;
  botToken;
  constructor(gw, creds) {
    this.gw = gw;
    this.signingSecret = creds.signingSecret;
    this.botToken = creds.botToken;
  }
  async handleInbound(req, ic) {
    const ts = req.headers.get("x-slack-request-timestamp") ?? "";
    const sig = req.headers.get("x-slack-signature") ?? "";
    const body = await req.text();
    if (!ts || !sig || !await verifySlack(this.signingSecret, ts, body, sig)) {
      return new Response("invalid signature", { status: 401 });
    }
    let data;
    try {
      data = JSON.parse(body);
    } catch {
      return new Response("bad request", { status: 400 });
    }
    if (data.type === "url_verification") return new Response(data.challenge ?? "", { status: 200 });
    const ev = data.event;
    const addressed = ev?.type === "app_mention" || ev?.type === "message" && ev.channel_type === "im";
    if (ev && !ev.bot_id && !ev.subtype && addressed) {
      const sender = ev.user;
      const text = stripMention(ev.text ?? "");
      const channel = ev.channel;
      if (sender && text && channel) {
        ic.waitUntil(
          (async () => {
            const out = await ic.respond({ connector: "slack", sender, text, channel });
            await this.postMessage(channel, out.text);
          })()
        );
      }
    }
    return ok();
  }
  async postMessage(channel, text) {
    await this.gw.fetch("slack", "https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${this.botToken}` },
      body: JSON.stringify({ channel, text })
    });
  }
}
function stripMention(text) {
  return text.replace(/<@[^>]+>/g, "").trim();
}
async function verifySlack(signingSecret, timestamp, body, signature, nowSec2) {
  const now = Math.floor(Date.now() / 1e3);
  if (!/^\d+$/.test(timestamp) || Math.abs(now - Number(timestamp)) > 60 * 5) return false;
  try {
    const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(signingSecret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`v0:${timestamp}:${body}`));
    const expected = "v0=" + Array.from(new Uint8Array(mac), (b) => b.toString(16).padStart(2, "0")).join("");
    return timingSafeEqual(expected, signature);
  } catch {
    return false;
  }
}
function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}
const MSG_NOT_MEMBER = "このアシスタントは登録メンバー専用です。管理者から招待コードを受け取り、ログインで参加してください。";
const MSG_PENDING = "参加申請を受け付けています。管理者の承認をお待ちください。承認されると利用できるようになります。";
const MSG_NOT_PRO = "エージェント機能は Pro プランで有効になります（管理画面のプラン・課金から）。";
async function checkAccess(ctx, env2, connector, sender) {
  const member = await ctx.identity.memberOf(connector, sender);
  if (member?.status === "pending") return { ok: false, message: MSG_PENDING, gate: "pending" };
  if (!member || member.status !== "active") return { ok: false, message: MSG_NOT_MEMBER, gate: "not_member" };
  if (!atLeast(await cachedEntitlement(env2), "pro")) return { ok: false, message: MSG_NOT_PRO, gate: "not_pro" };
  return { ok: true, role: member.role, uid: member.id };
}
async function joinViaInvite(env2, connector, externalId, code, name) {
  const r = await joinWithInvite(env2, code, name || `${connector}ユーザー`, { type: connector, externalId });
  if (!r.ok) return { ok: false, message: `参加できませんでした：${r.error}` };
  return { ok: true, message: "参加申請を受け付けました。管理者の承認後に利用できます。" };
}
const SESSION_TTL = 6 * 60 * 60;
const sessionKey = (connector, id) => `chatsess:${connector}:${id}`;
async function loadSession(env2, connector, id) {
  const raw = await env2.LICENSE.get(sessionKey(connector, id));
  if (!raw) return [];
  try {
    const t = JSON.parse(raw);
    if (!Array.isArray(t)) return [];
    await env2.LICENSE.put(sessionKey(connector, id), raw, { expirationTtl: SESSION_TTL }).catch(() => {
    });
    return t;
  } catch {
    return [];
  }
}
async function saveSession(env2, connector, id, turns) {
  await env2.LICENSE.put(sessionKey(connector, id), JSON.stringify(turns.slice(-20)), { expirationTtl: SESSION_TTL });
}
async function clearSession(env2, connector, id) {
  await env2.LICENSE.delete(sessionKey(connector, id)).catch(() => {
  });
}
async function respondInbound(ctx, env2, baseUrl, msg) {
  const acc = await checkAccess(ctx, env2, msg.connector, msg.sender);
  if (!acc.ok) return acc.gate === "pending" ? { text: acc.message } : { text: acc.message, gate: acc.gate };
  if (msg.sessionId && /^(リセット|reset)$/i.test((msg.text ?? "").trim())) {
    await clearSession(env2, msg.connector, msg.sessionId);
    return { text: "会話の文脈をリセットしました。", sessionId: msg.sessionId };
  }
  const owner = `${msg.connector}:${msg.sender}`;
  let prompt = msg.text;
  if (msg.audio) {
    const t = await transcribeAudio(env2, b64ToBytes(msg.audio.dataB64), msg.audio.mimeType).catch(() => null);
    if (t) prompt = prompt ? `${prompt}
${t}` : t;
    else if (!prompt && !msg.image && !msg.files?.length) return { text: "音声を認識できませんでした（Gemini 未設定の可能性があります）。" };
  }
  const savedNote = await saveDocuments(env2, owner, msg.files);
  let answer = "";
  if (prompt || msg.image) {
    const sid = msg.sessionId;
    const history = sid ? await loadSession(env2, msg.connector, sid) : [];
    const { getMemberModel, parseRequestModel } = await import("./settings_C_1axsCz.mjs");
    const { engine: model, modelId } = parseRequestModel(await getMemberModel(env2, acc.uid).catch(() => null) ?? "");
    answer = await ctx.agent.run({ owner, text: prompt, image: msg.image, role: acc.role, baseUrl, history, model, modelId, sessionId: sid });
    if (sid) await saveSession(env2, msg.connector, sid, [...history, { role: "user", text: prompt, image: msg.image }, { role: "assistant", text: answer }]);
    const clean = answer.replace(/<!--\s*bo-[\s\S]*?-->/g, "").trim();
    const text = [clean, savedNote].filter(Boolean).join("\n\n");
    return sid ? { text, sessionId: sid } : { text };
  }
  return { text: savedNote || "メッセージまたはファイルを送ってください。" };
}
async function saveDocuments(env2, owner, files) {
  if (!files?.length) return "";
  let saved = 0;
  for (const f of files) {
    const file = new File([b64ToBytes(f.dataB64)], f.filename || "document", { type: f.mimeType });
    const s = await saveFile(env2, file, owner, "personal").catch(() => null);
    if (!s) continue;
    await enqueueSummary(env2, owner, s.id, f.filename || "document").catch(() => void 0);
    saved++;
  }
  return saved ? `📄 ${saved}件の資料を受け取りました。要約して『資料』に保存します（少し後に反映）。` : "";
}
function b64ToBytes(b64) {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out.buffer;
}
class LineInbound {
  id = "line";
  gw;
  ctx;
  env;
  secret;
  accessToken;
  constructor(gw, ctx, env2, creds) {
    this.gw = gw;
    this.ctx = ctx;
    this.env = env2;
    this.secret = creds.secret;
    this.accessToken = creds.accessToken;
  }
  async handleInbound(req, ic) {
    const body = await req.text();
    if (!await verifyLineSignature(this.secret, body, req.headers.get("x-line-signature") ?? "")) {
      return new Response("invalid signature", { status: 401 });
    }
    let payload;
    try {
      payload = JSON.parse(body);
    } catch {
      return new Response("bad request", { status: 400 });
    }
    ic.waitUntil(this.process(payload.events ?? [], ic));
    return new Response("ok");
  }
  async process(events, ic) {
    for (const ev of events) {
      if (ev.type !== "message" || !ev.replyToken || !ev.source?.userId) continue;
      const userId = ev.source.userId;
      await this.env.LICENSE?.put("line_last_sender", userId, { expirationTtl: 3600 })?.catch(() => {
      });
      const reply = ev.replyToken;
      const m = ev.message;
      const send = (text) => lineReply(this.gw, this.accessToken, reply, text).catch(() => void 0);
      try {
        if (m.type === "text") {
          const text = (m.text ?? "").trim();
          const join = text.match(/^参加[\s　]+(\S+)/);
          if (join) {
            await send((await ic.link(userId, join[1].trim())).message);
            continue;
          }
          if (text === "リセット" || text === "reset") {
            await this.resetSession(userId);
            await send("会話の文脈をリセットしました。");
            continue;
          }
          await send(await this.respond(ic, userId, text));
        } else if (m.type === "image" && m.id) {
          const acc = await checkAccess(this.ctx, this.env, "line", userId);
          if (!acc.ok) {
            await send(acc.message);
            continue;
          }
          const img = await fetchLineImage(this.gw, this.accessToken, m.id);
          await send(await this.respond(ic, userId, "この画像（領収書なら record_expense で記録）を処理してください。", img ?? void 0));
        } else if ((m.type === "file" || m.type === "audio") && m.id) {
          const acc = await checkAccess(this.ctx, this.env, "line", userId);
          if (!acc.ok) {
            await send(acc.message);
            continue;
          }
          const content = await this.fetchContent(m.id);
          if (!content) {
            await send("コンテンツを取得できませんでした。");
            continue;
          }
          if (m.type === "file") {
            const file = new File([content.buf], m.fileName ?? "document", { type: content.mime });
            const saved = await saveFile(this.env, file, `line:${userId}`, "personal").catch(() => null);
            if (!saved) {
              await send("ファイル保存に失敗しました（標準モードは上限あり）。");
              continue;
            }
            if (!await getApiKey(this.env, "gemini")) {
              await send("📄 資料は保存しました。要約には Gemini APIキーが必要です（設定→APIキー）。");
              continue;
            }
            await enqueueSummary(this.env, `line:${userId}`, saved.id, m.fileName ?? "document");
            await send("📄 資料を受け取りました。要約して『資料』に保存します（少し後に反映）。");
          } else {
            const text = await transcribeAudio(this.env, content.buf, content.mime);
            if (!text) {
              await send("音声を認識できませんでした（Gemini未設定の可能性）。");
              continue;
            }
            await this.env.DB.prepare("INSERT INTO knowledge (id,title,body,file_ref,tags,created_by,created_at) VALUES (?,?,?,?,?,?,?)").bind(randomId(), `[議事録] ${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}`, text.slice(0, 1e5), null, "議事録", `line:${userId}`, nowSec()).run();
            await send("🎤 文字起こし・議事録化しました（議事録に保存）。\n\n" + text.slice(0, 1500));
          }
        }
      } catch (e) {
        const msg = e.message ?? String(e);
        const limit = looksLikeLimit(msg);
        await logDiag(this.env, "error", limit ? "limit" : "ai", `line inbound: ${msg}`).catch(() => void 0);
        await send(limit ? "処理が混み合い完了できませんでした。\n" + PAID_HINT : "処理中にエラーが発生しました。時間をおいて再度お試しください。");
      }
    }
  }
  async respond(ic, userId, text, image) {
    return (await ic.respond({ connector: "line", sender: userId, text, image, sessionId: userId })).text;
  }
  // P1-07：会話セッション（直近履歴）を破棄。inbound.ts の sessionKey と同じ規約 `chatsess:line:<userId>`。
  async resetSession(userId) {
    await this.env.LICENSE.delete(`chatsess:line:${userId}`).catch(() => void 0);
  }
  async fetchContent(messageId) {
    const r = await this.gw.fetch("line", `https://api-data.line.me/v2/bot/message/${messageId}/content`, { headers: { authorization: `Bearer ${this.accessToken}` } });
    if (!r.ok) return null;
    return { buf: await r.arrayBuffer(), mime: r.headers.get("content-type") ?? "application/octet-stream" };
  }
}
async function resolveInboundHandler(ctx, env2, gw, connector) {
  if (connector === "discord") {
    const appId = await getApiKey(env2, "discord_app_id");
    const publicKey = await getApiKey(env2, "discord_public_key");
    if (!appId || !publicKey) return null;
    return new DiscordInbound(gw, { appId, publicKey });
  }
  if (connector === "slack") {
    const signingSecret = await getApiKey(env2, "slack_signing_secret");
    const botToken = await getApiKey(env2, "slack_bot_token");
    if (!signingSecret || !botToken) return null;
    return new SlackInbound(gw, { signingSecret, botToken });
  }
  if (connector === "line") {
    const secret = await getApiKey(env2, "line_secret");
    const accessToken = await getApiKey(env2, "line_token");
    if (!secret || !accessToken) return null;
    return new LineInbound(gw, ctx, env2, { secret, accessToken });
  }
  return null;
}
const prerender = false;
const POST = async ({ request, params, locals }) => {
  const connector = params.connector ?? "";
  const gw = cfEgressGateway(env);
  const handler = await resolveInboundHandler(locals.ctx, env, gw, connector);
  if (!handler) return new Response("connector not configured", { status: 404 });
  const origin = new URL(request.url).origin;
  return handler.handleInbound(request, {
    baseUrl: origin,
    waitUntil: (p) => locals.cfContext.waitUntil(p),
    respond: (msg) => respondInbound(locals.ctx, env, origin, msg),
    link: (externalId, code, name) => joinViaInvite(env, connector, externalId, code, name)
  });
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};

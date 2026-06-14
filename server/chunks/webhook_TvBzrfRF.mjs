globalThis.process ??= {};
globalThis.process.env ??= {};
import { getApiKey, cachedEntitlement } from "./client_DsX87Mps.mjs";
import { v as verifyLineSignature, b as lineReply, f as fetchLineImage, l as linePush } from "./agent_D4R31rlG.mjs";
import { d as dueReminders, m as markReminderDone } from "./invoices_BrIqzWU0.mjs";
import { saveFile } from "./storage_C7TJPJmI.mjs";
import { a as enqueueSummary, t as transcribeAudio } from "./media-ai_DCsVDbkH.mjs";
import { r as randomId } from "./stripe_r-RFTlbb.mjs";
import { atLeast } from "./index_CrjiuAkj.mjs";
import { n as nowSec } from "./accounting_BipJ8jvJ.mjs";
import { logDiag, PAID_HINT, looksLikeLimit } from "./diag_8r20ZCMR.mjs";
import { env } from "cloudflare:workers";
const prerender = false;
const POST = async ({ request, locals }) => {
  const origin = new URL(request.url).origin;
  const body = await request.text();
  const secret = await getApiKey(env, "line_secret");
  const accessToken = await getApiKey(env, "line_token");
  if (!secret || !accessToken) return new Response("ok");
  if (!await verifyLineSignature(secret, body, request.headers.get("x-line-signature") ?? "")) return new Response("invalid signature", { status: 401 });
  const entitlement = await cachedEntitlement(env);
  const payload = JSON.parse(body);
  for (const ev of payload.events ?? []) {
    if (ev.type !== "message" || !ev.replyToken) continue;
    const userId = ev.source?.userId ?? "anon";
    const reply = ev.replyToken;
    if (!atLeast(entitlement, "pro")) {
      locals.cfContext.waitUntil(lineReply(accessToken, reply, "エージェント機能は Pro プランで有効になります（管理画面のプラン・課金から）。"));
      continue;
    }
    const member = await locals.ctx.identity.memberOf("line", userId);
    if (!member || member.status !== "active") {
      locals.cfContext.waitUntil(lineReply(accessToken, reply, "このアシスタントは登録メンバー専用です。管理者から招待コードを受け取り、アプリで参加申請してください。"));
      continue;
    }
    const role = member.role;
    const m = ev.message;
    const work = (async () => {
      let out;
      try {
        if (m.type === "image" && m.id) {
          const img = await fetchLineImage(accessToken, m.id);
          out = img ? await locals.ctx.agent.run({ owner: `line:${userId}`, text: "この画像（領収書なら record_expense で記録）を処理してください。", image: img, baseUrl: origin, role }) : "画像を取得できませんでした。";
        } else if (m.type === "file" && m.id) {
          const content = await fetchLineContent(accessToken, m.id);
          if (!content) {
            out = "ファイルを取得できませんでした。";
          } else {
            const file = new File([content.buf], m.fileName ?? "document", { type: content.mime });
            const saved = await saveFile(env, file, `line:${userId}`, "personal").catch(() => null);
            if (!saved) out = "ファイル保存に失敗しました（標準モードは5MBまで）。";
            else {
              await enqueueSummary(env, `line:${userId}`, saved.id, m.fileName ?? "document");
              out = "📄 資料を受け取りました。要約して『資料』に保存します（少し後に反映）。";
            }
          }
        } else if (m.type === "audio" && m.id) {
          const content = await fetchLineContent(accessToken, m.id);
          const text = content ? await transcribeAudio(env, content.buf, content.mime) : null;
          if (!text) out = "音声を認識できませんでした（Gemini未設定の可能性）。";
          else {
            await env.DB.prepare("INSERT INTO knowledge (id,title,body,file_ref,tags,created_by,created_at) VALUES (?,?,?,?,?,?,?)").bind(randomId(), `[議事録] ${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}`, text.slice(0, 1e5), null, "議事録", `line:${userId}`, nowSec()).run();
            out = "🎤 文字起こし・議事録化しました（議事録に保存）。\n\n" + text.slice(0, 1500);
          }
        } else if (m.type === "text") {
          out = await locals.ctx.agent.run({ owner: `line:${userId}`, text: m.text ?? "", baseUrl: origin, role });
        } else return;
        await lineReply(accessToken, reply, out);
        for (const r of await dueReminders(locals.ctx, `line:${userId}`)) {
          await linePush(accessToken, userId, `⏰ リマインド：${r.content}`);
          await markReminderDone(locals.ctx, r.id);
        }
      } catch (e) {
        const msg = e.message ?? String(e);
        const limit = looksLikeLimit(msg);
        await logDiag(env, "error", limit ? "limit" : "ai", `agent webhook: ${msg}`);
        await lineReply(accessToken, reply, limit ? "処理が混み合い完了できませんでした。\n" + PAID_HINT : "処理中にエラーが発生しました。時間をおいて再度お試しください。").catch(() => {
        });
      }
    })();
    locals.cfContext.waitUntil(work);
  }
  return new Response("ok");
};
async function fetchLineContent(accessToken, messageId) {
  const r = await fetch(`https://api-data.line.me/v2/bot/message/${messageId}/content`, { headers: { authorization: `Bearer ${accessToken}` } });
  if (!r.ok) return null;
  return { buf: await r.arrayBuffer(), mime: r.headers.get("content-type") ?? "application/octet-stream" };
}
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};

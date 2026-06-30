globalThis.process ??= {};
globalThis.process.env ??= {};
import "./stripe_r-RFTlbb.mjs";
import { a as atLeast } from "./types_BVJxqWI9.mjs";
import { env } from "cloudflare:workers";
import { isTextAttachmentMime, saveChatAttachment } from "./storage_4iye1Zw4.mjs";
import { d as dedupeActions, f as filterAiActions, n as navGuidance, a as appendMessage } from "./chat-sessions_BLqLinNd.mjs";
import { canDevelopApps } from "./auth_TPDi1U5M.mjs";
import { cachedEntitlement } from "./client_v-7HzW5v.mjs";
import { logDiag } from "./diag_BjrAYDQX.mjs";
const TEXT_ATTACH_MAX = 1e5;
async function prepareAttachment(image, uid, fileCtx) {
  const att = await saveChatAttachment(env, image, uid, fileCtx);
  if (!att.ok) return { ok: false, status: att.status, error: att.error };
  if (isTextAttachmentMime(image.mimeType ?? "")) {
    let txt = "";
    try {
      const bin = atob(image.dataB64 ?? "");
      const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
      txt = new TextDecoder("utf-8", { fatal: false }).decode(bytes).slice(0, TEXT_ATTACH_MAX);
    } catch {
    }
    const promptAdd = txt ? `

【添付ファイルの内容（file_id=${att.id}）】
${txt}` : `

（添付ファイル file_id=${att.id} を保存しましたが、内容を読み取れませんでした）`;
    return { ok: true, promptAdd };
  }
  return {
    ok: true,
    promptAdd: `

（添付ファイルを保存しました: file_id=${att.id}。請求書/領収書なら register_invoice に file_id を渡して登録してください。）`,
    vision: { mimeType: image.mimeType ?? "application/octet-stream", dataB64: image.dataB64 ?? "" }
  };
}
const DEV_REF_MAX = 8e3;
async function prepareDevAttachment(image, uid, fileCtx) {
  const mime = (image.mimeType ?? "").toLowerCase();
  if (!isTextAttachmentMime(mime)) {
    return { ok: false, status: 400, error: "参考資料はテキスト系ファイル（txt / csv / tsv / json / md / yaml / xml）に対応しています。画像・PDF はこの開発チャットでは内容を読み取れません。" };
  }
  const att = await saveChatAttachment(env, image, uid, fileCtx);
  if (!att.ok) return { ok: false, status: att.status, error: att.error };
  let txt = "";
  try {
    const bin = atob(image.dataB64 ?? "");
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    txt = new TextDecoder("utf-8", { fatal: false }).decode(bytes).slice(0, DEV_REF_MAX);
  } catch {
  }
  if (!txt.trim()) return { ok: false, status: 400, error: "参考資料の内容を読み取れませんでした。" };
  const name = (image.fileName ?? "参考資料").slice(0, 80);
  return { ok: true, promptAdd: `

【参考資料「${name}」の内容（これを踏まえて反映する）】
${txt}` };
}
function buildReplyActions(rawAiActions, content, role) {
  return dedupeActions([...filterAiActions(rawAiActions, role), ...navGuidance(content, role)]).slice(0, 6);
}
async function tryHandleAppDelete(ctx, sessionId, role, sesCtx, message, prior) {
  if (!canDevelopApps(role)) return null;
  if (!atLeast(await cachedEntitlement(env), "pro")) return null;
  const { looksLikeAppDelete, looksLikeDeleteConfirmation } = await import("./ctx_Bv3SAITG.mjs").then((n) => n.R);
  const priorAssistant = [...prior].reverse().find((m) => m.role === "assistant")?.content ?? "";
  const wantsDelete = looksLikeAppDelete(message);
  const confirmsDelete = looksLikeDeleteConfirmation(message, priorAssistant);
  if (!wantsDelete && !confirmsDelete) return null;
  const { latestSessionApp } = await import("./ctx_Bv3SAITG.mjs").then((n) => n.Q);
  const appId = await latestSessionApp(ctx, sessionId);
  if (!appId) return null;
  const { getAppDesign, deleteGenApp } = await import("./external-apps_H2ZAmhVv.mjs").then((n) => n.A);
  const design = await getAppDesign(ctx, appId).catch(() => null);
  const appName = design?.name ?? appId;
  if (confirmsDelete) {
    try {
      await deleteGenApp(ctx, appId);
    } catch (e) {
      await logDiag(env, "error", "chat", `deleteGenApp失敗(app=${appId}): ${e?.message ?? e}`).catch(() => {
      });
      throw e;
    }
    const reply2 = `「${appName}」を削除しました。下書き・導入版・公開ページ・蓄積データをまとめて削除しました（元に戻せません）。`;
    await appendMessage(ctx, sessionId, "assistant", reply2);
    return { reply: reply2, actions: [] };
  }
  const reply = `「${appName}」を削除しますか？
アプリ本体に加え、下書き・導入版・公開ページ・蓄積データもまとめて削除され、元に戻せません。よろしければ「削除する」を押してください。`;
  const actions = [
    { label: "削除する", kind: "reply", text: "削除する", style: "ghost" },
    { label: "やめる", kind: "reply", text: "やめる", style: "ghost" }
  ];
  await appendMessage(ctx, sessionId, "assistant", reply, actions);
  return { reply, actions };
}
export {
  buildReplyActions,
  prepareAttachment,
  prepareDevAttachment,
  tryHandleAppDelete
};

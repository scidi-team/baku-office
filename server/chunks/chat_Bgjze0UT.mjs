globalThis.process ??= {};
globalThis.process.env ??= {};
import { getSession } from "./auth_TPDi1U5M.mjs";
import { cachedEntitlement } from "./client_v-7HzW5v.mjs";
import "./stripe_r-RFTlbb.mjs";
import { a as atLeast } from "./types_BVJxqWI9.mjs";
import { o as ownedSession, c as createSession, g as getMessages, a as appendMessage, e as ensureTitle, t as toTurns } from "./chat-sessions_BLqLinNd.mjs";
import { parseRequestModel } from "./settings_C_1axsCz.mjs";
import { env } from "cloudflare:workers";
const prerender = false;
const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { "content-type": "application/json" } });
const POST = async ({ request, locals }) => {
  const ctx = locals.ctx;
  const ses = await getSession(env, request);
  if (!ses) return json({ error: "ログインが必要" }, 401);
  if (!atLeast(await cachedEntitlement(env), "plus")) return json({ error: "AIチャットは Plus 以上のプランで利用できます" }, 403);
  if (Number(request.headers.get("content-length") ?? 0) > 16 * 1024 * 1024) return json({ error: "リクエストが大きすぎます（添付は8MBまでです）。" }, 413);
  const b = await request.json().catch(() => ({}));
  const message = (b.message ?? "").trim();
  if (!message && !b.image?.dataB64) return json({ error: "メッセージが必要" }, 400);
  const { engine: model, modelId } = parseRequestModel(String(b.model ?? ""));
  let prompt = message || "(添付ファイルを確認してください)";
  let visionImage;
  if (b.image?.dataB64) {
    const { prepareAttachment } = await import("./chat-flow_CND9C88D.mjs");
    const att = await prepareAttachment(b.image, ses.uid, ses.ctx);
    if (!att.ok) return json({ error: att.error }, att.status);
    prompt = `${prompt}${att.promptAdd}`;
    visionImage = att.vision;
  }
  let sessionId = b.sessionId && await ownedSession(ctx, ses.uid, b.sessionId) ? b.sessionId : "";
  if (!sessionId) sessionId = await createSession(ctx, ses.uid, model);
  const prior = await getMessages(ctx, sessionId);
  await appendMessage(ctx, sessionId, "user", message || "(画像を添付)");
  await ensureTitle(ctx, sessionId, message || "画像の確認");
  if (b.background) {
    if (!atLeast(await cachedEntitlement(env), "pro")) return json({ error: "バックグラウンド実行は Pro 以上で利用できます" }, 403);
    const { enqueueAgentJob, processAgentJobs } = await import("./agent-jobs_dqb-oYxh.mjs");
    await enqueueAgentJob(ctx, { owner: ses.uid, sessionId, prompt, role: ses.role });
    try {
      locals.cfContext?.waitUntil(processAgentJobs(ctx, new URL(request.url).origin));
    } catch {
    }
    return json({ ok: true, queued: true, sessionId, reply: "バックグラウンドで実行を開始しました。完了するとこの会話に結果が表示され、通知（ベル）でもお知らせします（画面を離れても続行します）。" });
  }
  {
    const priorAssistant = [...prior].reverse().find((m) => m.role === "assistant")?.content ?? "";
    const { looksLikeBuildConfirmation } = await import("./ctx_Bv3SAITG.mjs").then((n) => n.R);
    const { canDevelopApps } = await import("./auth_TPDi1U5M.mjs");
    if (b.mode !== "plan" && !visionImage && canDevelopApps(ses.role, ses.ctx) && looksLikeBuildConfirmation(message, priorAssistant)) {
      const { startAppBuild, processAppBuild } = await import("./ctx_Bv3SAITG.mjs").then((n) => n.Q);
      const { getWorkersPaid } = await import("./settings_C_1axsCz.mjs");
      const origin2 = new URL(request.url).origin;
      const spec = ([...prior].map((m) => `${m.role === "user" ? "利用者" : "AI"}: ${m.content}`).join("\n").slice(-5e3) + "\n利用者: " + message).trim();
      const paid = await getWorkersPaid(env).catch(() => false);
      const buildId = await startAppBuild(ctx, { owner: ses.uid, sessionId, spec, model: modelId || void 0, paid });
      try {
        locals.cfContext?.waitUntil(processAppBuild(ctx, buildId, origin2).then(() => void 0).catch(() => void 0));
      } catch {
      }
      const bgMsg = "承知しました。仕様にそって実装を開始します。工程ごとに順に進め、完了するとこの会話に表示し、ベル（通知）でもお知らせします（画面を離れても続行します）。";
      await appendMessage(ctx, sessionId, "assistant", bgMsg);
      return json({ ok: true, queued: true, sessionId, reply: bgMsg });
    }
  }
  if (b.mode !== "plan" && !visionImage) {
    const { tryHandleAppDelete } = await import("./chat-flow_CND9C88D.mjs");
    const del = await tryHandleAppDelete(ctx, sessionId, ses.role, ses.ctx, message, prior);
    if (del) return json({ ok: true, reply: del.reply, actions: del.actions, sessionId });
  }
  {
    const { canDevelopApps } = await import("./auth_TPDi1U5M.mjs");
    if (b.mode !== "plan" && !visionImage && canDevelopApps(ses.role, ses.ctx) && atLeast(await cachedEntitlement(env), "pro")) {
      const { looksLikeAppEdit } = await import("./ctx_Bv3SAITG.mjs").then((n) => n.R);
      if (looksLikeAppEdit(message)) {
        const { latestSessionApp, resolveAppByName, startAppEdit, processAppBuild } = await import("./ctx_Bv3SAITG.mjs").then((n) => n.Q);
        let appId = await latestSessionApp(ctx, sessionId);
        if (!appId) {
          const res = await resolveAppByName(ctx, message);
          if (res && "appId" in res) appId = res.appId;
          else if (res && "candidates" in res && res.candidates.length) {
            const actions2 = res.candidates.slice(0, 5).map((c) => ({ label: `「${c.name}」を修正`, kind: "reply", text: `「${c.name}」を${message}` }));
            const msg = "どのアプリを修正しますか？候補から選んでください。";
            await appendMessage(ctx, sessionId, "assistant", msg, actions2);
            return json({ ok: true, sessionId, reply: msg, actions: actions2 });
          }
        }
        if (appId) {
          const { getWorkersPaid } = await import("./settings_C_1axsCz.mjs");
          const origin2 = new URL(request.url).origin;
          const instruction = ([...prior].slice(-8).map((m) => `${m.role === "user" ? "利用者" : "AI"}: ${m.content}`).join("\n").slice(-4e3) + "\n利用者: " + message).trim();
          const paid = await getWorkersPaid(env).catch(() => false);
          const buildId = await startAppEdit(ctx, { owner: ses.uid, sessionId, appId, instruction, model: modelId || void 0, paid });
          try {
            locals.cfContext?.waitUntil(processAppBuild(ctx, buildId, origin2).then(() => void 0).catch(() => void 0));
          } catch {
          }
          const bgMsg = "承知しました。アプリの修正を開始します。完了するとこの会話に表示し、ベル（通知）でもお知らせします（画面を離れても続行します）。";
          await appendMessage(ctx, sessionId, "assistant", bgMsg);
          return json({ ok: true, queued: true, sessionId, reply: bgMsg });
        }
      }
    }
  }
  const origin = new URL(request.url).origin;
  let reply;
  try {
    reply = await ctx.agent.run({ owner: ses.uid, text: prompt, image: visionImage, role: ses.role, baseUrl: origin, history: toTurns(prior), model, modelId, sessionId, mode: b.mode });
  } catch (e) {
    const msg = e?.message ?? String(e);
    await (await import("./diag_BjrAYDQX.mjs")).logDiag(env, "error", "chat", `agent.run失敗(model=${b.model ?? "auto"}): ${msg}`);
    const { explainStop } = await import("./errors_Bw4GoHz5.mjs");
    reply = explainStop("system", `内部処理でエラーが発生しました（${msg.slice(0, 120)}）。`, "時間をおいて再度お試しください。続く場合は別のAIモデル（設定→連携 /settings/messaging）に切り替えるか、管理者へご連絡ください。");
  }
  const { HOPS_EXCEEDED } = await import("./ai_DzBIQjTt.mjs");
  if (reply === HOPS_EXCEEDED && atLeast(await cachedEntitlement(env), "pro")) {
    const { enqueueAgentJob, processAgentJobs } = await import("./agent-jobs_dqb-oYxh.mjs");
    await enqueueAgentJob(ctx, { owner: ses.uid, sessionId, prompt, role: ses.role });
    try {
      locals.cfContext?.waitUntil(processAgentJobs(ctx, origin));
    } catch {
    }
    const { getWorkersPaid } = await import("./settings_C_1axsCz.mjs");
    const paidNote = await getWorkersPaid(env).catch(() => false) ? "" : "\n\n※ 長い処理が多い場合は Workers Paid の有効化をおすすめします（一度に長く処理でき、途中で止まりにくくなります）。設定→高度なオプションをご確認ください。";
    reply = "時間がかかっているため、バックグラウンドで続けています。完了するとこの会話に表示し、ベル（通知）でもお知らせします（画面を離れても続行します）。" + paidNote;
    await appendMessage(ctx, sessionId, "assistant", reply);
    return json({ ok: true, queued: true, reply, sessionId });
  }
  if (reply === HOPS_EXCEEDED) {
    const { explainStop } = await import("./errors_Bw4GoHz5.mjs");
    reply = explainStop("ai", "ご依頼が大きく、一度のAI処理回数の上限内で完了できませんでした。", "依頼を小さく分けて（例：1つの機能・画面ずつ）再度お試しください。");
  }
  const { extractActions } = await import("./chat-sessions_BLqLinNd.mjs").then((n) => n.h);
  const { buildReplyActions } = await import("./chat-flow_CND9C88D.mjs");
  const ex = extractActions(reply);
  const actions = buildReplyActions(ex.actions, ex.content, ses.role);
  await appendMessage(ctx, sessionId, "assistant", ex.content, actions);
  return json({ ok: true, reply: ex.content, actions, sessionId });
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

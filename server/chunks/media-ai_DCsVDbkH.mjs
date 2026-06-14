globalThis.process ??= {};
globalThis.process.env ??= {};
import { r as randomId } from "./stripe_r-RFTlbb.mjs";
import { getApiKey } from "./client_DsX87Mps.mjs";
import { getFile, saveFile } from "./storage_C7TJPJmI.mjs";
import { n as nowSec } from "./accounting_BipJ8jvJ.mjs";
import { recordUsage, recordTokens, overBudget } from "./usage_Uka2N290.mjs";
import { claudeModelId, geminiModelId } from "./config_BOdbJfMp.mjs";
async function geminiUpload(key, buf, mime) {
  const start = await fetch(`https://generativelanguage.googleapis.com/upload/v1beta/files?key=${encodeURIComponent(key)}`, {
    method: "POST",
    headers: { "X-Goog-Upload-Protocol": "resumable", "X-Goog-Upload-Command": "start", "X-Goog-Upload-Header-Content-Length": String(buf.byteLength), "X-Goog-Upload-Header-Content-Type": mime, "content-type": "application/json" },
    body: JSON.stringify({ file: { display_name: "doc" } })
  });
  const url = start.headers.get("x-goog-upload-url");
  if (!start.ok || !url) return null;
  const up = await fetch(url, { method: "POST", headers: { "Content-Length": String(buf.byteLength), "X-Goog-Upload-Offset": "0", "X-Goog-Upload-Command": "upload, finalize" }, body: buf });
  if (!up.ok) return null;
  return (await up.json()).file?.uri ?? null;
}
async function geminiGenerate(env, key, parts, tools) {
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(geminiModelId(env))}:generateContent?key=${encodeURIComponent(key)}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ contents: [{ role: "user", parts }], ...tools ? { tools } : {}, generationConfig: { maxOutputTokens: 1200 } })
  });
  if (!r.ok) {
    console.log("[gemini-gen]", r.status, (await r.text()).slice(0, 150));
    return "";
  }
  const d = await r.json();
  await recordTokens(env, "gemini", { inputTokens: d.usageMetadata?.promptTokenCount ?? 0, outputTokens: d.usageMetadata?.candidatesTokenCount ?? 0 });
  return d.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("").trim() ?? "";
}
async function transcribeAudio(env, buf, mime) {
  const key = await getApiKey(env, "gemini");
  if (!key) return null;
  await recordUsage(env, "gemini");
  const prompt = "この音声を日本語で文字起こしし、会議なら話者を区別して要点・決定事項を議事録形式でまとめてください。";
  if (buf.byteLength <= 18 * 1024 * 1024) {
    const b64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
    return geminiGenerate(env, key, [{ text: prompt }, { inlineData: { mimeType: mime, data: b64 } }]);
  }
  const uri = await geminiUpload(key, buf, mime);
  if (!uri) return null;
  return geminiGenerate(env, key, [{ text: prompt }, { file_data: { mime_type: mime, file_uri: uri } }]);
}
async function webSearch(env, query) {
  const key = await getApiKey(env, "gemini");
  if (!key) return null;
  if (await overBudget(env, "web_search") === "pause") return "（Web検索の今月の利用上限に達しました。設定 → API使用量 で変更できます）";
  await recordUsage(env, "web_search");
  const text = await geminiGenerate(env, key, [{ text: query }], [{ googleSearch: {} }]);
  return text || "（検索結果が得られませんでした）";
}
async function enqueueSummary(env, owner, fileId, name) {
  await env.DB.prepare("INSERT INTO summary_jobs (id,owner,name,file_id,status,created_at,updated_at) VALUES (?,?,?,?,'pending',?,?)").bind(randomId(), owner, name, fileId, nowSec(), nowSec()).run();
}
async function processSummaryJobs(env, limit = 3) {
  const key = await getApiKey(env, "gemini");
  if (!key) return 0;
  const { results } = await env.DB.prepare("SELECT id,owner,name,file_id FROM summary_jobs WHERE status='pending' ORDER BY created_at LIMIT ?").bind(limit).all();
  let done = 0;
  for (const job of results) {
    const f = await getFile(env, job.file_id);
    if (!f) {
      await env.DB.prepare("UPDATE summary_jobs SET status='error',updated_at=? WHERE id=?").bind(nowSec(), job.id).run();
      continue;
    }
    await recordUsage(env, "gemini");
    const uri = await geminiUpload(key, f.buf, f.mime);
    const summary = uri ? await geminiGenerate(env, key, [{ text: "この資料の要点・数値・結論を漏れなく日本語で要約してください。" }, { file_data: { mime_type: f.mime, file_uri: uri } }]) : "";
    if (!summary) {
      await env.DB.prepare("UPDATE summary_jobs SET status='error',updated_at=? WHERE id=?").bind(nowSec(), job.id).run();
      continue;
    }
    await env.DB.prepare("UPDATE summary_jobs SET status='done',result=?,updated_at=? WHERE id=?").bind(summary.slice(0, 1e5), nowSec(), job.id).run();
    await env.DB.prepare("INSERT INTO knowledge (id,title,body,file_ref,tags,created_by,created_at) VALUES (?,?,?,?,?,?,?)").bind(randomId(), `[資料要約] ${job.name}`, summary.slice(0, 1e5), job.file_id, "資料要約", job.owner, nowSec()).run();
    done++;
  }
  return done;
}
async function makeDocument(env, owner, baseUrl, a) {
  const key = await getApiKey(env, "claude");
  if (!key) return "資料生成には Claude APIキーが必要です（連携設定で登録してください）。";
  await recordUsage(env, "claude");
  const type = ["md", "csv", "txt"].includes(a.type) ? a.type : "md";
  const sys = `あなたは資料作成アシスタント。指示に従い ${type} 形式の本文だけを出力（前置き・コードフェンス無し）。`;
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({ model: claudeModelId(env), max_tokens: 4e3, system: sys, messages: [{ role: "user", content: `タイトル:${a.title}
要件:${a.content}` }] })
  });
  if (!r.ok) {
    console.log("[claude-doc]", r.status, (await r.text()).slice(0, 150));
    return "資料生成に失敗しました。";
  }
  const data = await r.json();
  await recordTokens(env, "claude", { inputTokens: data.usage?.input_tokens ?? 0, outputTokens: data.usage?.output_tokens ?? 0 });
  const body = data.content?.map((c) => c.text ?? "").join("") ?? "";
  const mime = type === "csv" ? "text/csv" : type === "txt" ? "text/plain" : "text/markdown";
  const file = new File([new TextEncoder().encode(body)], `${a.title}.${type}`, { type: mime });
  const saved = await saveFile(env, file, owner);
  return `資料を作成しました：${a.title}.${type}
ダウンロード：${baseUrl}/files/${saved.id}`;
}
function bufToB64(buf) {
  const bytes = new Uint8Array(buf);
  let s = "";
  const chunk = 32768;
  for (let i = 0; i < bytes.length; i += chunk) s += String.fromCharCode(...bytes.subarray(i, i + chunk));
  return btoa(s);
}
async function extractInvoiceData(env, file) {
  const key = await getApiKey(env, "claude");
  if (!key) return {};
  const isPdf = file.mime === "application/pdf" || /\.pdf$/i.test(file.name);
  const data = bufToB64(file.buf);
  const imgMime = ["image/png", "image/jpeg", "image/gif", "image/webp"].includes(file.mime) ? file.mime : "image/jpeg";
  const block = isPdf ? { type: "document", source: { type: "base64", media_type: "application/pdf", data } } : { type: "image", source: { type: "base64", media_type: imgMime, data } };
  const prompt = 'この請求書/領収書から請求元・金額・発行日・支払期日を読み取り、JSONのみ出力（前置き・コードフェンス無し）：{"vendor":"請求元名 or null","amount":金額の数値(円・整数。不明ならnull),"issued_date":"YYYY-MM-DD or null","due_date":"YYYY-MM-DD or null"}';
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({ model: claudeModelId(env), max_tokens: 500, messages: [{ role: "user", content: [block, { type: "text", text: prompt }] }] })
  });
  await recordUsage(env, "claude");
  if (!r.ok) {
    console.log("[invoice-extract]", r.status, (await r.text()).slice(0, 150));
    return {};
  }
  const d = await r.json();
  await recordTokens(env, "claude", { inputTokens: d.usage?.input_tokens ?? 0, outputTokens: d.usage?.output_tokens ?? 0 });
  const raw = (d.content?.map((c) => c.text ?? "").join("") ?? "").replace(/^```(?:json)?|```$/g, "").trim();
  try {
    const j = JSON.parse(raw);
    return { vendor: j.vendor ?? void 0, amount: typeof j.amount === "number" ? j.amount : void 0, issued_date: j.issued_date ?? void 0, due_date: j.due_date ?? void 0 };
  } catch {
    return {};
  }
}
async function suggestAccountItem(env, input, candidates) {
  const key = await getApiKey(env, "claude");
  if (!key || candidates.length === 0) return null;
  const list = candidates.map((c) => `${c.code}:${c.name}`).join(" / ");
  const prompt = `次の支出に最も適切な勘定科目を、候補から1つだけ選んでJSONのみ出力（前置き・コードフェンス無し）。
候補: ${list}
支払先: ${input.vendor ?? "(不明)"}
内容: ${input.description ?? "(不明)"}
金額: ${input.amount ?? "(不明)"}
出力形式: {"code":"候補のcode","reason":"30字以内の理由"}`;
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model: claudeModelId(env), max_tokens: 120, messages: [{ role: "user", content: prompt }] })
    });
    await recordUsage(env, "claude");
    if (!r.ok) {
      console.log("[suggest-account]", r.status);
      return null;
    }
    const d = await r.json();
    await recordTokens(env, "claude", { inputTokens: d.usage?.input_tokens ?? 0, outputTokens: d.usage?.output_tokens ?? 0 });
    const raw = (d.content?.map((c) => c.text ?? "").join("") ?? "").replace(/^```(?:json)?|```$/g, "").trim();
    const j = JSON.parse(raw);
    const hit = candidates.find((c) => c.code === j.code);
    return hit ? { code: hit.code, reason: String(j.reason ?? "") } : null;
  } catch {
    return null;
  }
}
async function generateOrgProfile(env, info) {
  const prompt = `次の団体の「公開ディレクトリ用の紹介文」と「検索タグ」を作って。紹介文は80〜120字で事業内容が一目で分かるように。タグは5個・日本語の短い語。JSONのみ出力（前置き・コードフェンス無し）：
{"summary":"...","tags":["...","..."]}
団体名: ${info.orgName}
補足: ${info.hints ?? "(なし)"}`;
  const gkey = await getApiKey(env, "gemini");
  try {
    let raw = "";
    if (gkey) {
      await recordUsage(env, "gemini");
      raw = await geminiGenerate(env, gkey, [{ text: prompt }]);
    } else {
      const ckey = await getApiKey(env, "claude");
      if (!ckey) return null;
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "x-api-key": ckey, "anthropic-version": "2023-06-01", "content-type": "application/json" },
        body: JSON.stringify({ model: claudeModelId(env), max_tokens: 400, messages: [{ role: "user", content: prompt }] })
      });
      await recordUsage(env, "claude");
      if (!r.ok) return null;
      const d = await r.json();
      await recordTokens(env, "claude", { inputTokens: d.usage?.input_tokens ?? 0, outputTokens: d.usage?.output_tokens ?? 0 });
      raw = d.content?.map((c) => c.text ?? "").join("") ?? "";
    }
    const j = JSON.parse(raw.replace(/^```(?:json)?|```$/g, "").trim());
    return { summary: String(j.summary ?? ""), tags: Array.isArray(j.tags) ? j.tags.map(String).slice(0, 8) : [] };
  } catch {
    return null;
  }
}
async function estimateDiscrepancy(env, difference, recent) {
  const key = await getApiKey(env, "claude");
  if (!key) return null;
  const lines = recent.slice(0, 30).map((t) => `${t.date} ${t.kind} ${t.amount} ${t.description ?? ""}`).join("\n");
  const prompt = `現金レジ締めで差異が出た。差異額（想定−実査）= ${difference} 円（プラスは現金が想定より不足、マイナスは過剰）。
直近の取引:
${lines}

考えられる原因を、会計初心者にも分かる日本語で1〜2文・具体的に推定して。前置き不要。`;
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model: claudeModelId(env), max_tokens: 200, messages: [{ role: "user", content: prompt }] })
    });
    await recordUsage(env, "claude");
    if (!r.ok) {
      console.log("[closure-estimate]", r.status);
      return null;
    }
    const d = await r.json();
    await recordTokens(env, "claude", { inputTokens: d.usage?.input_tokens ?? 0, outputTokens: d.usage?.output_tokens ?? 0 });
    const txt = (d.content?.map((c) => c.text ?? "").join("") ?? "").trim();
    return txt || null;
  } catch {
    return null;
  }
}
async function summarizeTranscript(env, transcript) {
  const key = await getApiKey(env, "claude");
  if (!key) return null;
  const sys = 'あなたは会議の議事録作成アシスタント。与えられたトランスクリプトから日本語で(1)議事録要約(2)アクションアイテムを抽出し、JSONのみを出力：{"summary":"...","actions":[{"content":"担当と内容","due":"ISO8601日時(任意・無ければ省略)"}]}（前置き・コードフェンス無し）。';
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({ model: claudeModelId(env), max_tokens: 2e3, system: sys, messages: [{ role: "user", content: transcript }] })
  });
  await recordUsage(env, "claude").catch(() => {
  });
  if (!r.ok) {
    console.log("[meet-claude]", r.status, (await r.text()).slice(0, 150));
    return null;
  }
  const data = await r.json();
  await recordTokens(env, "claude", { inputTokens: data.usage?.input_tokens ?? 0, outputTokens: data.usage?.output_tokens ?? 0 }).catch(() => {
  });
  const raw = (data.content?.map((c) => c.text ?? "").join("") ?? "").replace(/^```(?:json)?|```$/g, "").trim();
  try {
    const j = JSON.parse(raw);
    return { summary: String(j.summary ?? ""), actions: Array.isArray(j.actions) ? j.actions : [] };
  } catch {
    return { summary: raw.slice(0, 4e3), actions: [] };
  }
}
export {
  enqueueSummary as a,
  summarizeTranscript as b,
  extractInvoiceData as c,
  estimateDiscrepancy as e,
  generateOrgProfile as g,
  makeDocument as m,
  processSummaryJobs as p,
  suggestAccountItem as s,
  transcribeAudio as t,
  webSearch as w
};

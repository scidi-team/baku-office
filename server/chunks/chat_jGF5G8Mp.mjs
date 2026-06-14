globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_Dn7U0_eq.mjs";
import { r as renderTemplate, m as maybeRenderHead, F as Fragment, a as addAttribute } from "./sequence_I_kcixDX.mjs";
import { r as renderComponent } from "./worker-entry_Cv5GlnJ5.mjs";
import { env } from "cloudflare:workers";
import { $ as $$App } from "./App_ChWwyHiq.mjs";
import "./stripe_r-RFTlbb.mjs";
import { atLeast } from "./index_CrjiuAkj.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const prerender = false;
const $$Chat = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Chat;
  const { getSession } = await import("./auth_BXoLTJDQ.mjs");
  const ses = await getSession(env, Astro2.request);
  if (!ses) return Astro2.redirect("/login", 302);
  const { cachedEntitlement, hasApiKey } = await import("./client_DsX87Mps.mjs");
  const entitlement = await cachedEntitlement(env).catch(() => "free");
  const hasPlus = atLeast(entitlement, "plus");
  const hasPro = atLeast(entitlement, "pro");
  const [hasGemini, hasClaude] = await Promise.all([hasApiKey(env, "gemini").catch(() => false), hasApiKey(env, "claude").catch(() => false)]);
  const defaultModel = !hasGemini && !hasClaude && env.AI ? "local" : hasGemini ? "gemini" : hasClaude ? "claude" : "gemini";
  const { listSessions } = await import("./chat-sessions_sD7fC39m.mjs");
  const sessions = hasPlus ? await listSessions(Astro2.locals.ctx, ses.uid).catch(() => []) : [];
  const isOrgAdmin = ses.role === "admin" && ses.ctx === "org";
  const { listSkills } = await import("./skills_D20jqiiZ.mjs");
  const skills = hasPlus && isOrgAdmin ? await listSkills(env).catch(() => []) : [];
  const { WORKERS_AI_MODELS } = await import("./config_BOdbJfMp.mjs");
  const waModelActive = isOrgAdmin && env.AI ? await (await import("./settings_BubM6K6A.mjs")).getWorkersAiModel(env).catch(() => "") : "";
  return renderTemplate`${renderComponent($$result, "App", $$App, { "title": "AI", "active": "/chat" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<h1>AI</h1> ${!hasPlus && renderTemplate`<div class="card"> <div class="banner banner-warn">この機能は <strong>Plus 以上</strong>のプランで利用できます。</div> <p class="muted">集計・DB／ファイル検索・文書作成を会話で実行し、結果を PDF／TXT／md／HTML／CSV でダウンロードできます。</p> <a class="btn btn-primary" href="/billing">プラン・課金へ</a> </div>`}${hasPlus && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <div class="chat"> <aside class="sbar"> <button class="btn btn-primary" id="new-ses" style="width:100%">＋ 新しい会話</button> <div class="ses-list" id="ses-list"> ${sessions.map((s) => renderTemplate`<div class="ses-row"${addAttribute(s.id, "data-ses")}> <a href="#" class="ses-open"${addAttribute(s.id, "data-id")}>${s.title || "（無題）"}</a> <button class="ses-del"${addAttribute(s.id, "data-id")} title="削除">×</button> </div>`)} ${sessions.length === 0 && renderTemplate`<p class="muted" style="font-size:.82rem;padding:6px">会話はまだありません。</p>`} </div> </aside> <section class="pane"> <div class="cbar">  ${isOrgAdmin && renderTemplate`<div class="model-seg" id="model-seg" role="group" aria-label="AIの種類"> <button${addAttribute("model-opt" + (defaultModel === "gemini" ? " on" : ""), "class")} type="button" data-m="gemini">標準AI<small>無料の範囲</small></button> <button${addAttribute("model-opt" + (defaultModel === "claude" ? " on" : ""), "class")} type="button" data-m="claude">高精度AI<small>キー登録が必要</small></button> <button${addAttribute("model-opt" + (defaultModel === "local" ? " on" : ""), "class")} type="button" data-m="local">クラウドAI<small>標準</small></button> </div>`}  <select id="model" hidden> <option value="gemini"${addAttribute(defaultModel === "gemini", "selected")}>標準AI</option> <option value="claude"${addAttribute(defaultModel === "claude", "selected")}>高精度AI</option> <option value="local"${addAttribute(defaultModel === "local", "selected")}>クラウドAI（標準）</option> </select> <button class="btn btn-sm ses-toggle" type="button" id="ses-toggle">会話履歴</button> </div> ${isOrgAdmin && renderTemplate`<div class="model-note" id="model-note"></div>`} ${isOrgAdmin && env.AI && renderTemplate`<details class="adv" style="margin:.2rem 0 .4rem"> <summary>クラウドAIのモデルを選ぶ（管理者向け）</summary> <div style="padding:.45rem 0"> <label for="wa-model" class="muted" style="display:block;font-size:.85rem;margin-bottom:5px">「クラウドAI」で使うモデルです。上位ほど賢いですが、少し遅く・費用が増えます。</label> <select id="wa-model"> ${WORKERS_AI_MODELS.map((m) => renderTemplate`<option${addAttribute(m.id, "value")}${addAttribute(m.id === waModelActive, "selected")}>${m.label}（${m.note}）</option>`)} </select> </div> </details>`} <div class="ai-examples" aria-label="例文"> <span class="muted" style="font-size:.85rem">かんたん入力：</span> <button class="chip ex" type="button" data-ex="今月の会費の入金状況をまとめて">今月の会費の入金状況をまとめて</button> <button class="chip ex" type="button" data-ex="先月の支出を一覧にして">先月の支出を一覧にして</button> <button class="chip ex" type="button" data-ex="次の定例会の案内文を作って">次の定例会の案内文を作って</button> </div> <div class="chat-dl"> <span class="muted">この会話を保存：</span> <button class="btn btn-sm dlc" type="button" data-ext="txt" title="文字だけのシンプルな形式。どんな端末でも開け、メモ帳などで読めます。" aria-label="TXT形式で保存（文字だけのシンプルな形式）">TXT</button> <button class="btn btn-sm dlc" type="button" data-ext="md" title="見出しや箇条書きの体裁を残せる形式。技術系のメモやNotion等への貼り付け向き。" aria-label="MD（Markdown）形式で保存（見出し・箇条書きを残せる）">MD</button> <button class="btn btn-sm dlc" type="button" data-ext="html" title="ブラウザでそのまま開けて見やすい形式。体裁を保って共有したいとき向き。" aria-label="HTML形式で保存（ブラウザで開け、体裁を保てる）">HTML</button> <button class="btn btn-sm dlc" type="button" data-ext="pdf" title="印刷や正式な配布・保管向き。レイアウトが固定され、改変されにくい形式。" aria-label="PDF形式で保存（印刷・配布向き、レイアウト固定）">PDF</button> </div> <div id="log"></div> ${hasPro && renderTemplate`<label class="muted" style="font-size:.8rem;display:flex;align-items:center;gap:6px;margin-top:8px"> <input type="checkbox" id="bgrun"> バックグラウンドで実行（重い・多段の依頼向け。完了するとこの会話に結果が追記されます）
</label>`} <div class="cinput"> <input type="file" id="att" accept="image/*,application/pdf" hidden aria-label="添付ファイル（画像・PDF）"> <button class="btn" id="att-btn" type="button" title="ファイルを添付（画像・PDF）" style="flex:0 0 auto">📎</button> <textarea id="msg" placeholder="メッセージを入力（Ctrl/⌘+Enter で送信）"></textarea> <button class="btn btn-primary" id="send" style="flex:0 0 auto">送信</button> </div> <p id="att-name" class="muted" style="font-size:.78rem;margin:4px 0 0"></p> ${hasPro && renderTemplate`<p class="muted" style="font-size:.76rem;margin-top:6px">複雑な依頼は内部で役割ごとの子エージェントに分担・並列処理します（無料枠は並列2まで。上限は設定→高度なオプションで拡張）。</p>`} </section> </div> ${isOrgAdmin && renderTemplate`<details class="skills-box adv" style="margin-top:1rem"> <summary><strong>スキル管理</strong></summary> <p class="adv-note">よく使う作業を「スキル」として登録し、AIに任せられます。AIに作らせるか、手動で追加できます。一部は利用量に応じた費用がかかります。</p> <div class="card"> <p class="muted">🤖 <strong>AIに作らせる</strong>：やりたいことを書くと、AI がスキルを設計して<strong>無効状態で自動登録</strong>します。確認して下で有効化してください。</p> <div class="row"><input id="skreq" placeholder="例：月次の会費集計表を作るスキル" aria-label="作りたいスキルの内容"><button class="btn btn-primary" id="skgen" style="flex:0 0 auto">AIに作らせる</button></div> </div> <details style="margin-top:.5rem"><summary>スキルを手動で追加</summary> <div class="field"><label for="sname">スキル名（呼び出し名）</label><input id="sname" placeholder="例：会費集計"></div> <div class="row"><div style="flex:1"><label for="sdesc">説明（任意）</label><input id="sdesc" placeholder="どんな作業か"></div><div style="flex:0 0 200px"><label for="smode">種類</label><select id="smode"><option value="instruction">標準（通常の費用）</option><option value="code">高度（利用量に応じた費用）</option></select></div></div> <div class="field"><label for="smd">手順・テンプレート</label><textarea id="smd" rows="5" placeholder="作業の手順やひな形を書きます"></textarea></div> <button class="btn btn-primary" id="skadd">登録（無効状態で保存）</button> </details> <div class="table-wrap" style="margin-top:.5rem"><table><thead><tr><th>名前</th><th>モード</th><th>状態</th><th>操作</th></tr></thead><tbody> ${skills.map((s) => renderTemplate`<tr${addAttribute(s.id, "data-sid")}><td>${s.name}<div class="muted">${s.description ?? ""}</div></td><td><span class="pill">${s.mode}</span></td><td>${s.enabled ? "有効" : "無効"}</td><td>${s.enabled ? renderTemplate`<button class="btn btn-sm btn-warn sdis">無効化</button>` : renderTemplate`<button class="btn btn-sm btn-ok sen">有効化</button>`} <button class="btn btn-sm btn-danger sdel">削除</button></td></tr>`)} ${skills.length === 0 && renderTemplate`<tr><td colspan="4" class="muted">スキルは未登録です。</td></tr>`} </tbody></table></div> </details>`}` })}`} `, "scripts": async ($$result2) => renderTemplate(_a || (_a = __template([`<script>
    (function () {
        const log = document.getElementById("log");
        if (!log) return;  // Plus未満は要素が無い
        const sel = document.getElementById("model");
        // ホームの相棒プロンプトからの ?q= を入力欄に反映。
        try { const q = new URLSearchParams(location.search).get("q"); if (q) { const m = document.getElementById("msg"); if (m) { m.value = q; m.focus(); } } } catch (e) { /* noop */ }
        // 使用中AIと、できること/できないことの表示。
        const NOTE = {
          gemini: { use: "標準AI（無料の範囲）", can: "会計入力・ファイル/名簿の検索・文書作成・調べもの など", cant: "利用にはキーの登録が必要（未設定時は自動で切替）" },
          claude: { use: "高精度AI", can: "上記に加えて、より高度な作業", cant: "利用にはキーの登録が必要（未設定時は標準AIへ）" },
          local: { use: "クラウドAI（標準）", can: "会話・要約・文章づくり", cant: "会計の登録や検索などの操作（必要なときは管理者が他のAIを設定）" },
        };
        const noteEl = document.getElementById("model-note");
        const engineForModel = (m) => (m === "claude" ? "claude" : m === "gemini" ? "gemini" : "workers_ai");
        const setNote = (m) => {
          // 相棒の動きに、その場で選んだモデルを反映（全ページ共通）。window.bo 未初期化でも安全に。
          window.bo?.setAgentEngine?.(engineForModel(m));
          const n = NOTE[m]; if (!noteEl || !n) return;
          noteEl.innerHTML =
            '<div class="mn-use">使用中：' + n.use + "</div>" +
            '<div class="mn-can">✅ できる：' + n.can + "</div>" +
            '<div class="mn-cant">🚫 できない：' + n.cant + "</div>";
        };
        setNote(sel ? sel.value : "gemini");
        // モデルセグメント：選択を hidden select(#model) に同期（既存ロジック互換）。
        const mseg = document.getElementById("model-seg");
        if (mseg && sel) mseg.querySelectorAll(".model-opt").forEach((b) => b.addEventListener("click", () => {
          mseg.querySelectorAll(".model-opt").forEach((x) => x.classList.toggle("on", x === b));
          sel.value = b.dataset.m;
          setNote(b.dataset.m);
        }));
        // クラウドAIのモデル選択：選んだら即保存（管理者）。次回以降の「クラウドAI」に反映。
        document.getElementById("wa-model")?.addEventListener("change", (e) => {
          window.bo?.api?.("/api/settings", { _action: "workers_ai_model", model: e.target.value }, { successMsg: "クラウドAIのモデルを変更しました" });
        });
        // 例文ボタン：押すと入力欄に文章を入れて整える（高齢ユーザーが何を書けばよいか迷わないように）。
        document.querySelectorAll(".ai-examples .ex").forEach((b) => b.addEventListener("click", () => {
          const m = document.getElementById("msg");
          if (m) { m.value = b.dataset.ex || b.textContent || ""; m.focus(); }
        }));
        // 会話履歴トグル（モバイル）。
        const sesToggle = document.getElementById("ses-toggle");
        const chatBox = document.querySelector(".chat");
        if (sesToggle && chatBox) sesToggle.addEventListener("click", () => chatBox.classList.toggle("show-ses"));
        let sessionId = "";
        const esc = (s) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
        function dload(text, ext, mime) {
          if (ext === "pdf") {
            const w = window.open("", "_blank");
            if (!w) { window.bo.toast("PDF化はポップアップ許可が必要です", "err"); return; }
            w.document.write('<title>baku-office</title><pre style="white-space:pre-wrap;font-family:system-ui,sans-serif;padding:24px">' + esc(text) + "</pre>");
            w.document.close(); w.focus(); w.print(); return;
          }
          let body = text;
          if (ext === "html") body = '<!doctype html><meta charset="utf-8"><title>baku-office</title><pre style="white-space:pre-wrap;font-family:system-ui,sans-serif">' + esc(text) + "</pre>";
          const blob = new Blob([body], { type: mime || "text/plain" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url; a.download = "baku-office-" + Date.now() + "." + ext;
          document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
        }
        // 会話全体をテキスト化（セッション単位のダウンロード用）。
        function conversationText() {
          const out = [];
          log.querySelectorAll(".cmsg").forEach((m) => {
            const who = m.classList.contains("u") ? "あなた" : "相棒";
            const b = m.querySelector(".cbub");
            out.push(who + "： " + (b ? b.innerText.trim() : ""));
          });
          return out.join("\\n\\n");
        }
        // role=u/a。発言者ラベル付き。stream=true（新規AI応答のみ）で段階表示（タイプ風・点滅キャレット）。履歴は即時。
        function addMsg(role, text, stream) {
          const d = document.createElement("div");
          d.className = "cmsg " + role;
          const html = esc(text).replace(/\\n/g, "<br>");
          d.innerHTML = '<div class="cmsg-body"><span class="cmsg-who">' + (role === "a" ? "相棒" : "あなた") + '</span><div class="cbub"></div></div>';
          const bub = d.querySelector(".cbub");
          log.appendChild(d);
          if (stream && role === "a" && text) {
            let i = 0;
            const step = () => {
              i += 3;
              bub.innerHTML = esc(text.slice(0, i)).replace(/\\n/g, "<br>") + '<span class="caret"></span>';
              log.scrollTop = log.scrollHeight;
              if (i < text.length) { setTimeout(step, 18); }
              else { bub.innerHTML = html; log.scrollTop = log.scrollHeight; }
            };
            step();
          } else {
            bub.innerHTML = html;
            log.scrollTop = log.scrollHeight;
          }
        }
        // セッション単位のダウンロード（枠外ツールバー）。
        document.querySelectorAll(".chat-dl .dlc").forEach((b) => b.addEventListener("click", () => {
          const t = conversationText();
          if (!t) { window.bo.toast("まだ会話がありません", "err"); return; }
          const ext = b.dataset.ext;
          const mime = { txt: "text/plain", md: "text/markdown", html: "text/html", pdf: "" }[ext] || "text/plain";
          dload(t, ext, mime);
        }));
        // セッションを開く（履歴ロード）。
        async function openSession(id) {
          sessionId = id; log.innerHTML = "";
          [...document.querySelectorAll(".ses-row")].forEach((r) => r.classList.toggle("on", r.getAttribute("data-ses") === id));
          const r = await window.bo.api("/api/chat-sessions?id=" + encodeURIComponent(id), undefined, { method: "GET", successMsg: null });
          if (r.ok) (r.data.messages || []).forEach((m) => addMsg(m.role === "assistant" ? "a" : "u", m.content));
        }
        // サイドバー再描画。
        function renderSessions(sessions) {
          const list = document.getElementById("ses-list");
          list.innerHTML = sessions.length ? "" : '<p class="muted" style="font-size:.82rem;padding:6px">会話はまだありません。</p>';
          sessions.forEach((s) => {
            const row = document.createElement("div"); row.className = "ses-row"; row.setAttribute("data-ses", s.id);
            if (s.id === sessionId) row.classList.add("on");
            const a = document.createElement("a"); a.href = "#"; a.className = "ses-open"; a.textContent = s.title || "（無題）";
            a.addEventListener("click", (e) => { e.preventDefault(); openSession(s.id); });
            const del = document.createElement("button"); del.className = "ses-del"; del.textContent = "×";
            del.addEventListener("click", async (e) => {
              e.preventDefault();
              if (!(await window.bo.confirm("このチャットセッションを削除しますか？", { confirmLabel: "削除", danger: true, irreversible: true }))) return;
              const rr = await window.bo.api("/api/chat-sessions", { _action: "delete", id: s.id }, { btn: del, successMsg: "削除しました" });
              if (rr.ok) { if (s.id === sessionId) { sessionId = ""; log.innerHTML = ""; } reloadSessions(); }
            });
            row.append(a, del); list.appendChild(row);
          });
        }
        async function reloadSessions() {
          const r = await window.bo.api("/api/chat-sessions", undefined, { method: "GET", successMsg: null });
          if (r.ok) renderSessions(r.data.sessions || []);
        }
        // ファイル添付（画像/PDF）：選択ファイルを base64 化して /api/chat の image に乗せる（API は受領済み）。
        let pendingImage = null;
        let pendingFileName = "";
        const att = document.getElementById("att");
        document.getElementById("att-btn")?.addEventListener("click", () => att?.click());
        att?.addEventListener("change", () => {
          const f = att.files && att.files[0];
          if (!f) return;
          const reader = new FileReader();
          reader.onload = () => {
            const url = String(reader.result);
            pendingImage = { mimeType: f.type || "application/octet-stream", dataB64: url.split(",")[1] || "" };
            pendingFileName = f.name;
            const nm = document.getElementById("att-name"); if (nm) nm.textContent = "📎 " + f.name;
          };
          reader.readAsDataURL(f);
        });
        function clearAttach() {
          pendingImage = null; pendingFileName = "";
          if (att) att.value = "";
          const nm = document.getElementById("att-name"); if (nm) nm.textContent = "";
        }
        async function send() {
          const ta = document.getElementById("msg");
          const text = ta.value.trim(); if (!text && !pendingImage) return;
          addMsg("u", text + (pendingFileName ? \`\\n（添付: \${pendingFileName}）\` : "")); ta.value = "";
          const background = !!document.getElementById("bgrun")?.checked;
          const body = { message: text, sessionId: sessionId || undefined, model: sel.value, background };
          if (pendingImage) body.image = pendingImage;
          const r = await window.bo.api("/api/chat", body, { btn: document.getElementById("send"), successMsg: null });
          clearAttach();
          if (r.ok) {
            window.bo.pollAgent?.(); // 相棒マスコットを即時更新（バックグラウンド実行の可視化）
            addMsg("a", r.data.reply, true);
            const isNew = !sessionId;
            sessionId = r.data.sessionId;
            if (isNew) reloadSessions();
          }
        }
        document.getElementById("new-ses")?.addEventListener("click", () => { sessionId = ""; log.innerHTML = ""; [...document.querySelectorAll(".ses-row")].forEach((r) => r.classList.remove("on")); document.getElementById("msg")?.focus(); });
        document.getElementById("send")?.addEventListener("click", send);
        // マスコット（相棒）からの呼び出し：?greet=1 で相棒が話しかける。
        try { if (new URLSearchParams(location.search).get("greet") === "1" && !log.children.length) addMsg("a", "はい、相棒です。なにか御用ですか？やりたいことを書いてください。"); document.getElementById("msg")?.focus(); } catch (e) { /* noop */ }
        document.getElementById("msg")?.addEventListener("keydown", (e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); send(); } });
        // 既存セッション行（SSR分）の配線。
        document.querySelectorAll(".ses-row").forEach((row) => {
          const id = row.getAttribute("data-ses");
          row.querySelector(".ses-open")?.addEventListener("click", (e) => { e.preventDefault(); openSession(id); });
          row.querySelector(".ses-del")?.addEventListener("click", async (e) => {
            e.preventDefault();
            if (!(await window.bo.confirm("このチャットセッションを削除しますか？", { confirmLabel: "削除", danger: true, irreversible: true }))) return;
            const rr = await window.bo.api("/api/chat-sessions", { _action: "delete", id }, { btn: e.currentTarget, successMsg: "削除しました" });
            if (rr.ok) { if (id === sessionId) { sessionId = ""; log.innerHTML = ""; } reloadSessions(); }
          });
        });
        // --- スキル管理（管理者のみ要素が存在） ---
        const sk = (b, btn) => window.bo.api("/api/skills", b, { btn });
        document.getElementById("skgen")?.addEventListener("click", async (e) => {
          const request = document.getElementById("skreq").value.trim();
          if (!request) { window.bo.toast("作りたいスキルの要望を入力してください", "err"); return; }
          const r = await sk({ _action: "generate", request }, e.currentTarget);
          if (r.ok) { window.bo.toast("スキル「" + (r.data.name || "") + "」を作成しました（無効状態）"); setTimeout(() => location.reload(), 900); }
        });
        document.getElementById("skadd")?.addEventListener("click", async (e) => {
          const r = await sk({ _action: "create", name: document.getElementById("sname").value, description: document.getElementById("sdesc").value, mode: document.getElementById("smode").value, skill_md: document.getElementById("smd").value }, e.currentTarget);
          if (r.ok) { window.bo.toast("登録しました（無効状態）"); setTimeout(() => location.reload(), 600); }
        });
        document.querySelectorAll("tr[data-sid]").forEach((tr) => {
          const id = tr.dataset.sid;
          tr.querySelector(".sen")?.addEventListener("click", async (e) => { const r = await sk({ _action: "enable", id, enabled: true }, e.target); if (r.ok) setTimeout(() => location.reload(), 500); });
          tr.querySelector(".sdis")?.addEventListener("click", async (e) => { const r = await sk({ _action: "enable", id, enabled: false }, e.target); if (r.ok) setTimeout(() => location.reload(), 500); });
          tr.querySelector(".sdel")?.addEventListener("click", async (e) => { if (await window.bo.confirm("このスキルを削除しますか？", { confirmLabel: "削除", danger: true })) { const r = await sk({ _action: "delete", id }, e.target); if (r.ok) setTimeout(() => location.reload(), 500); } });
        });
    })();
  <\/script>`], [`<script>
    (function () {
        const log = document.getElementById("log");
        if (!log) return;  // Plus未満は要素が無い
        const sel = document.getElementById("model");
        // ホームの相棒プロンプトからの ?q= を入力欄に反映。
        try { const q = new URLSearchParams(location.search).get("q"); if (q) { const m = document.getElementById("msg"); if (m) { m.value = q; m.focus(); } } } catch (e) { /* noop */ }
        // 使用中AIと、できること/できないことの表示。
        const NOTE = {
          gemini: { use: "標準AI（無料の範囲）", can: "会計入力・ファイル/名簿の検索・文書作成・調べもの など", cant: "利用にはキーの登録が必要（未設定時は自動で切替）" },
          claude: { use: "高精度AI", can: "上記に加えて、より高度な作業", cant: "利用にはキーの登録が必要（未設定時は標準AIへ）" },
          local: { use: "クラウドAI（標準）", can: "会話・要約・文章づくり", cant: "会計の登録や検索などの操作（必要なときは管理者が他のAIを設定）" },
        };
        const noteEl = document.getElementById("model-note");
        const engineForModel = (m) => (m === "claude" ? "claude" : m === "gemini" ? "gemini" : "workers_ai");
        const setNote = (m) => {
          // 相棒の動きに、その場で選んだモデルを反映（全ページ共通）。window.bo 未初期化でも安全に。
          window.bo?.setAgentEngine?.(engineForModel(m));
          const n = NOTE[m]; if (!noteEl || !n) return;
          noteEl.innerHTML =
            '<div class="mn-use">使用中：' + n.use + "</div>" +
            '<div class="mn-can">✅ できる：' + n.can + "</div>" +
            '<div class="mn-cant">🚫 できない：' + n.cant + "</div>";
        };
        setNote(sel ? sel.value : "gemini");
        // モデルセグメント：選択を hidden select(#model) に同期（既存ロジック互換）。
        const mseg = document.getElementById("model-seg");
        if (mseg && sel) mseg.querySelectorAll(".model-opt").forEach((b) => b.addEventListener("click", () => {
          mseg.querySelectorAll(".model-opt").forEach((x) => x.classList.toggle("on", x === b));
          sel.value = b.dataset.m;
          setNote(b.dataset.m);
        }));
        // クラウドAIのモデル選択：選んだら即保存（管理者）。次回以降の「クラウドAI」に反映。
        document.getElementById("wa-model")?.addEventListener("change", (e) => {
          window.bo?.api?.("/api/settings", { _action: "workers_ai_model", model: e.target.value }, { successMsg: "クラウドAIのモデルを変更しました" });
        });
        // 例文ボタン：押すと入力欄に文章を入れて整える（高齢ユーザーが何を書けばよいか迷わないように）。
        document.querySelectorAll(".ai-examples .ex").forEach((b) => b.addEventListener("click", () => {
          const m = document.getElementById("msg");
          if (m) { m.value = b.dataset.ex || b.textContent || ""; m.focus(); }
        }));
        // 会話履歴トグル（モバイル）。
        const sesToggle = document.getElementById("ses-toggle");
        const chatBox = document.querySelector(".chat");
        if (sesToggle && chatBox) sesToggle.addEventListener("click", () => chatBox.classList.toggle("show-ses"));
        let sessionId = "";
        const esc = (s) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
        function dload(text, ext, mime) {
          if (ext === "pdf") {
            const w = window.open("", "_blank");
            if (!w) { window.bo.toast("PDF化はポップアップ許可が必要です", "err"); return; }
            w.document.write('<title>baku-office</title><pre style="white-space:pre-wrap;font-family:system-ui,sans-serif;padding:24px">' + esc(text) + "</pre>");
            w.document.close(); w.focus(); w.print(); return;
          }
          let body = text;
          if (ext === "html") body = '<!doctype html><meta charset="utf-8"><title>baku-office</title><pre style="white-space:pre-wrap;font-family:system-ui,sans-serif">' + esc(text) + "</pre>";
          const blob = new Blob([body], { type: mime || "text/plain" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url; a.download = "baku-office-" + Date.now() + "." + ext;
          document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
        }
        // 会話全体をテキスト化（セッション単位のダウンロード用）。
        function conversationText() {
          const out = [];
          log.querySelectorAll(".cmsg").forEach((m) => {
            const who = m.classList.contains("u") ? "あなた" : "相棒";
            const b = m.querySelector(".cbub");
            out.push(who + "： " + (b ? b.innerText.trim() : ""));
          });
          return out.join("\\\\n\\\\n");
        }
        // role=u/a。発言者ラベル付き。stream=true（新規AI応答のみ）で段階表示（タイプ風・点滅キャレット）。履歴は即時。
        function addMsg(role, text, stream) {
          const d = document.createElement("div");
          d.className = "cmsg " + role;
          const html = esc(text).replace(/\\\\n/g, "<br>");
          d.innerHTML = '<div class="cmsg-body"><span class="cmsg-who">' + (role === "a" ? "相棒" : "あなた") + '</span><div class="cbub"></div></div>';
          const bub = d.querySelector(".cbub");
          log.appendChild(d);
          if (stream && role === "a" && text) {
            let i = 0;
            const step = () => {
              i += 3;
              bub.innerHTML = esc(text.slice(0, i)).replace(/\\\\n/g, "<br>") + '<span class="caret"></span>';
              log.scrollTop = log.scrollHeight;
              if (i < text.length) { setTimeout(step, 18); }
              else { bub.innerHTML = html; log.scrollTop = log.scrollHeight; }
            };
            step();
          } else {
            bub.innerHTML = html;
            log.scrollTop = log.scrollHeight;
          }
        }
        // セッション単位のダウンロード（枠外ツールバー）。
        document.querySelectorAll(".chat-dl .dlc").forEach((b) => b.addEventListener("click", () => {
          const t = conversationText();
          if (!t) { window.bo.toast("まだ会話がありません", "err"); return; }
          const ext = b.dataset.ext;
          const mime = { txt: "text/plain", md: "text/markdown", html: "text/html", pdf: "" }[ext] || "text/plain";
          dload(t, ext, mime);
        }));
        // セッションを開く（履歴ロード）。
        async function openSession(id) {
          sessionId = id; log.innerHTML = "";
          [...document.querySelectorAll(".ses-row")].forEach((r) => r.classList.toggle("on", r.getAttribute("data-ses") === id));
          const r = await window.bo.api("/api/chat-sessions?id=" + encodeURIComponent(id), undefined, { method: "GET", successMsg: null });
          if (r.ok) (r.data.messages || []).forEach((m) => addMsg(m.role === "assistant" ? "a" : "u", m.content));
        }
        // サイドバー再描画。
        function renderSessions(sessions) {
          const list = document.getElementById("ses-list");
          list.innerHTML = sessions.length ? "" : '<p class="muted" style="font-size:.82rem;padding:6px">会話はまだありません。</p>';
          sessions.forEach((s) => {
            const row = document.createElement("div"); row.className = "ses-row"; row.setAttribute("data-ses", s.id);
            if (s.id === sessionId) row.classList.add("on");
            const a = document.createElement("a"); a.href = "#"; a.className = "ses-open"; a.textContent = s.title || "（無題）";
            a.addEventListener("click", (e) => { e.preventDefault(); openSession(s.id); });
            const del = document.createElement("button"); del.className = "ses-del"; del.textContent = "×";
            del.addEventListener("click", async (e) => {
              e.preventDefault();
              if (!(await window.bo.confirm("このチャットセッションを削除しますか？", { confirmLabel: "削除", danger: true, irreversible: true }))) return;
              const rr = await window.bo.api("/api/chat-sessions", { _action: "delete", id: s.id }, { btn: del, successMsg: "削除しました" });
              if (rr.ok) { if (s.id === sessionId) { sessionId = ""; log.innerHTML = ""; } reloadSessions(); }
            });
            row.append(a, del); list.appendChild(row);
          });
        }
        async function reloadSessions() {
          const r = await window.bo.api("/api/chat-sessions", undefined, { method: "GET", successMsg: null });
          if (r.ok) renderSessions(r.data.sessions || []);
        }
        // ファイル添付（画像/PDF）：選択ファイルを base64 化して /api/chat の image に乗せる（API は受領済み）。
        let pendingImage = null;
        let pendingFileName = "";
        const att = document.getElementById("att");
        document.getElementById("att-btn")?.addEventListener("click", () => att?.click());
        att?.addEventListener("change", () => {
          const f = att.files && att.files[0];
          if (!f) return;
          const reader = new FileReader();
          reader.onload = () => {
            const url = String(reader.result);
            pendingImage = { mimeType: f.type || "application/octet-stream", dataB64: url.split(",")[1] || "" };
            pendingFileName = f.name;
            const nm = document.getElementById("att-name"); if (nm) nm.textContent = "📎 " + f.name;
          };
          reader.readAsDataURL(f);
        });
        function clearAttach() {
          pendingImage = null; pendingFileName = "";
          if (att) att.value = "";
          const nm = document.getElementById("att-name"); if (nm) nm.textContent = "";
        }
        async function send() {
          const ta = document.getElementById("msg");
          const text = ta.value.trim(); if (!text && !pendingImage) return;
          addMsg("u", text + (pendingFileName ? \\\`\\\\n（添付: \\\${pendingFileName}）\\\` : "")); ta.value = "";
          const background = !!document.getElementById("bgrun")?.checked;
          const body = { message: text, sessionId: sessionId || undefined, model: sel.value, background };
          if (pendingImage) body.image = pendingImage;
          const r = await window.bo.api("/api/chat", body, { btn: document.getElementById("send"), successMsg: null });
          clearAttach();
          if (r.ok) {
            window.bo.pollAgent?.(); // 相棒マスコットを即時更新（バックグラウンド実行の可視化）
            addMsg("a", r.data.reply, true);
            const isNew = !sessionId;
            sessionId = r.data.sessionId;
            if (isNew) reloadSessions();
          }
        }
        document.getElementById("new-ses")?.addEventListener("click", () => { sessionId = ""; log.innerHTML = ""; [...document.querySelectorAll(".ses-row")].forEach((r) => r.classList.remove("on")); document.getElementById("msg")?.focus(); });
        document.getElementById("send")?.addEventListener("click", send);
        // マスコット（相棒）からの呼び出し：?greet=1 で相棒が話しかける。
        try { if (new URLSearchParams(location.search).get("greet") === "1" && !log.children.length) addMsg("a", "はい、相棒です。なにか御用ですか？やりたいことを書いてください。"); document.getElementById("msg")?.focus(); } catch (e) { /* noop */ }
        document.getElementById("msg")?.addEventListener("keydown", (e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); send(); } });
        // 既存セッション行（SSR分）の配線。
        document.querySelectorAll(".ses-row").forEach((row) => {
          const id = row.getAttribute("data-ses");
          row.querySelector(".ses-open")?.addEventListener("click", (e) => { e.preventDefault(); openSession(id); });
          row.querySelector(".ses-del")?.addEventListener("click", async (e) => {
            e.preventDefault();
            if (!(await window.bo.confirm("このチャットセッションを削除しますか？", { confirmLabel: "削除", danger: true, irreversible: true }))) return;
            const rr = await window.bo.api("/api/chat-sessions", { _action: "delete", id }, { btn: e.currentTarget, successMsg: "削除しました" });
            if (rr.ok) { if (id === sessionId) { sessionId = ""; log.innerHTML = ""; } reloadSessions(); }
          });
        });
        // --- スキル管理（管理者のみ要素が存在） ---
        const sk = (b, btn) => window.bo.api("/api/skills", b, { btn });
        document.getElementById("skgen")?.addEventListener("click", async (e) => {
          const request = document.getElementById("skreq").value.trim();
          if (!request) { window.bo.toast("作りたいスキルの要望を入力してください", "err"); return; }
          const r = await sk({ _action: "generate", request }, e.currentTarget);
          if (r.ok) { window.bo.toast("スキル「" + (r.data.name || "") + "」を作成しました（無効状態）"); setTimeout(() => location.reload(), 900); }
        });
        document.getElementById("skadd")?.addEventListener("click", async (e) => {
          const r = await sk({ _action: "create", name: document.getElementById("sname").value, description: document.getElementById("sdesc").value, mode: document.getElementById("smode").value, skill_md: document.getElementById("smd").value }, e.currentTarget);
          if (r.ok) { window.bo.toast("登録しました（無効状態）"); setTimeout(() => location.reload(), 600); }
        });
        document.querySelectorAll("tr[data-sid]").forEach((tr) => {
          const id = tr.dataset.sid;
          tr.querySelector(".sen")?.addEventListener("click", async (e) => { const r = await sk({ _action: "enable", id, enabled: true }, e.target); if (r.ok) setTimeout(() => location.reload(), 500); });
          tr.querySelector(".sdis")?.addEventListener("click", async (e) => { const r = await sk({ _action: "enable", id, enabled: false }, e.target); if (r.ok) setTimeout(() => location.reload(), 500); });
          tr.querySelector(".sdel")?.addEventListener("click", async (e) => { if (await window.bo.confirm("このスキルを削除しますか？", { confirmLabel: "削除", danger: true })) { const r = await sk({ _action: "delete", id }, e.target); if (r.ok) setTimeout(() => location.reload(), 500); } });
        });
    })();
  <\/script>`]))) })}`;
}, "/home/runner/work/baku-office/baku-office/apps/client/src/pages/chat.astro", void 0);
const $$file = "/home/runner/work/baku-office/baku-office/apps/client/src/pages/chat.astro";
const $$url = "/chat";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Chat,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};

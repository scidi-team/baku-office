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
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const prerender = false;
const $$Drive = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Drive;
  const { getSession } = await import("./auth_BXoLTJDQ.mjs");
  const ses = await getSession(env, Astro2.request);
  if (!ses) return Astro2.redirect("/login", 302);
  const isAdmin = ses.role === "admin" && ses.ctx === "org";
  const { cachedEntitlement } = await import("./client_DsX87Mps.mjs");
  const hasPlus = atLeast(await cachedEntitlement(env), "plus");
  const { driveConfigured, driveConnected, listDriveFiles, getDriveBackup } = await import("./drive_BsB4xfcB.mjs");
  const q = Astro2.url.searchParams.get("q") ?? "";
  let configured = false, connected = false, files = [];
  let backup = { enabled: false };
  if (hasPlus) {
    configured = driveConfigured(env);
    connected = await driveConnected(env);
    files = connected ? await listDriveFiles(env, q) : [];
    backup = await getDriveBackup(env);
  }
  const fmtSize = (n) => n == null ? "—" : n < 1024 ? n + "B" : n < 1048576 ? Math.round(n / 1024) + "KB" : (n / 1048576).toFixed(1) + "MB";
  const fmtDate = (s) => s ? s.slice(0, 16).replace("T", " ") : "—";
  return renderTemplate`${renderComponent($$result, "App", $$App, { "title": "Google ドライブ", "active": "/drive" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<h1>Google ドライブ連携</h1> ${!hasPlus && renderTemplate`<div class="card"> <div class="banner banner-warn">この機能は <strong>Plus 以上</strong>のプランで利用できます。</div> <p class="muted">ドライブ内ファイルのメタ情報を同期して検索・参照し、KV／R2 をドライブへ定期バックアップできます。</p> <a class="btn btn-primary" href="/billing">プラン・課金へ</a> </div>`}${hasPlus && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate`${!configured && renderTemplate`<div class="banner banner-warn">Google OAuth（GOOGLE_CLIENT_ID/SECRET）が未設定のため連携できません。連携設定の管理者にご確認ください。</div>`}<div class="card"> <p>連携状態：<span class="pill">${connected ? "連携済み" : "未連携"}</span></p> ${isAdmin && configured && !connected && renderTemplate`<a class="btn btn-primary" href="/api/drive/start">Google ドライブを連携</a>`} ${isAdmin && connected && renderTemplate`<div class="row"><button class="btn btn-primary" id="sync">メタ情報を同期</button><a class="btn" href="/api/drive/start">再連携</a></div>`} ${!isAdmin && renderTemplate`<p class="muted">連携・同期の操作は管理者のみ可能です。</p>`} </div> ${connected && renderTemplate`${renderComponent($$result3, "Fragment", Fragment, {}, { "default": async ($$result4) => renderTemplate` <div class="card"> <h2 style="margin-top:0;border:0">自動バックアップ（任意）</h2> <p class="muted">クライアントの KV／R2 に保存したファイルを、定期実行で Google ドライブへバックアップします（顧客自身のドライブへ退避）。</p> <label><input type="checkbox" id="bkEnabled"${addAttribute(backup.enabled, "checked")}${addAttribute(!isAdmin, "disabled")}> 自動バックアップを有効にする</label> ${isAdmin && renderTemplate`<div class="row" style="margin-top:.5rem"><button class="btn btn-primary" id="bkSave">設定を保存</button><button class="btn" id="bkNow">今すぐバックアップ</button></div>`} </div> <h2>ドライブ内ファイル（メタ情報）</h2> <form method="get" class="row" style="margin-bottom:.5rem"> <input name="q"${addAttribute(q, "value")} placeholder="ファイル名で検索"> <button class="btn" type="submit" style="flex:0 0 auto">検索</button> </form> <div class="table-wrap"><table> <thead><tr><th>名前</th><th>種類</th><th>サイズ</th><th>更新</th></tr></thead> <tbody> ${files.map((f) => renderTemplate`<tr><td>${f.name}</td><td class="muted" style="font-size:.8rem">${f.mime ?? "—"}</td><td>${fmtSize(f.size)}</td><td>${fmtDate(f.modified)}</td></tr>`)} ${files.length === 0 && renderTemplate`<tr><td colspan="4" class="muted">${q ? "該当なし" : "未同期です。「メタ情報を同期」を実行してください。"}</td></tr>`} </tbody> </table></div> ` })}`} `, "scripts": async ($$result3) => renderTemplate(_a || (_a = __template(['<script slot="scripts">\n        const sync = document.getElementById("sync");\n        if (sync) sync.addEventListener("click", async (e) => {\n          const r = await window.bo.api("/api/drive", { _action: "sync" }, { btn: e.currentTarget, successMsg: null });\n          if (r.ok) { window.bo.toast((r.data.synced ?? 0) + " 件を同期しました"); setTimeout(() => location.reload(), 800); }\n        });\n        const bkSave = document.getElementById("bkSave");\n        if (bkSave) bkSave.addEventListener("click", async (e) => {\n          await window.bo.api("/api/drive", { _action: "backup_settings", enabled: document.getElementById("bkEnabled").checked }, { btn: e.currentTarget, successMsg: "保存しました" });\n        });\n        const bkNow = document.getElementById("bkNow");\n        if (bkNow) bkNow.addEventListener("click", async (e) => {\n          const r = await window.bo.api("/api/drive", { _action: "backup_now" }, { btn: e.currentTarget, successMsg: null });\n          if (r.ok) window.bo.toast((r.data.uploaded ?? 0) + " 件をバックアップしました");\n        });\n      <\/script>']))) })}`}` })}`;
}, "/home/runner/work/baku-office/baku-office/apps/client/src/pages/drive.astro", void 0);
const $$file = "/home/runner/work/baku-office/baku-office/apps/client/src/pages/drive.astro";
const $$url = "/drive";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Drive,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};

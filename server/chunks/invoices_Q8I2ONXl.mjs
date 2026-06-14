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
const $$Invoices = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Invoices;
  const ctx = Astro2.locals.ctx;
  const { getSession } = await import("./auth_BXoLTJDQ.mjs");
  const ses = await getSession(env, Astro2.request);
  if (!ses) return Astro2.redirect("/login", 302);
  const isAdmin = ses.role === "admin" && ses.ctx === "org";
  const { cachedEntitlement } = await import("./client_DsX87Mps.mjs");
  const hasPro = atLeast(await cachedEntitlement(env), "pro");
  let invoices = [];
  if (hasPro) {
    const { listInvoices } = await import("./invoices_BrIqzWU0.mjs").then((n) => n.c);
    invoices = await listInvoices(ctx, { limit: 300 });
  }
  const STATUSES = ["unpaid", "paid", "overdue", "canceled"];
  const STATUS_LABEL = { unpaid: "未払", paid: "支払済", overdue: "期限超過", canceled: "取消" };
  const yen = (n) => n == null ? "—" : "¥" + n.toLocaleString();
  return renderTemplate`${renderComponent($$result, "App", $$App, { "title": "請求書管理", "active": "/invoices" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<h1>請求書管理</h1> ${!hasPro && renderTemplate`<div class="card"> <div class="banner banner-warn">この機能は <strong>Pro 以上</strong>のプランで利用できます。</div> <p class="muted">請求書/領収書の画像・PDFから請求元・金額・期日を自動抽出し、支払いステータスを管理します。未払の期日が近づくと通知します。</p> <a class="btn btn-primary" href="/billing">プラン・課金へ</a> </div>`}${hasPro && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate`${isAdmin && renderTemplate`<div class="card"> <h2 style="margin-top:0;border:0">請求書をアップロード</h2> <p class="muted">PDF または画像（JPEG/PNG）を選んでアップロードすると、内容を自動抽出して登録します。メール添付・AIチャットからも登録できます。</p> <div class="row"> <input type="file" id="invfile" accept="application/pdf,image/*" aria-label="アップロードする請求書ファイル（PDFまたは画像）"> <button class="btn btn-primary" id="invup" style="flex:0 0 auto">アップロードして抽出</button> </div> </div>`}<h2>請求書一覧</h2> <div class="table-wrap"><table> <thead><tr><th>請求元</th><th>金額</th><th>発行日</th><th>期日</th><th>状態</th><th>元ファイル</th></tr></thead> <tbody> ${invoices.map((r) => renderTemplate`<tr${addAttribute(r.id, "data-id")}> <td>${r.vendor ?? "(請求元不明)"}<div class="muted" style="font-size:.7rem">${r.source ?? ""}</div></td> <td>${yen(r.amount)}</td> <td class="muted" style="font-size:.8rem">${r.issued_date ?? "—"}</td> <td class="muted" style="font-size:.8rem">${r.due_date ?? "—"}</td> <td> ${isAdmin ? renderTemplate`<select class="inv-status" aria-label="請求の状態">${STATUSES.map((v) => renderTemplate`<option${addAttribute(v, "value")}${addAttribute(r.status === v, "selected")}>${STATUS_LABEL[v]}</option>`)}</select>` : renderTemplate`<span class="pill">${STATUS_LABEL[r.status] ?? r.status}</span>`} </td> <td>${r.file_id ? renderTemplate`<a${addAttribute(`/files/${r.file_id}`, "href")} target="_blank" rel="noreferrer">表示</a>` : "—"}</td> </tr>`)} ${invoices.length === 0 && renderTemplate`<tr><td colspan="6" class="muted" style="text-align:center;padding:1.2rem">まだ請求書がありません。</td></tr>`} </tbody> </table></div> ` })}`} `, "scripts": async ($$result2) => renderTemplate(_a || (_a = __template(['<script>\n    const up = document.getElementById("invup");\n    if (up) up.addEventListener("click", async () => {\n      const input = document.getElementById("invfile");\n      const f = input.files && input.files[0];\n      if (!f) { window.bo.toast("ファイルを選んでください"); return; }\n      up.disabled = true;\n      try {\n        const fd = new FormData();\n        fd.append("file", f);\n        const r = await fetch("/api/invoices", { method: "POST", body: fd });\n        const data = await r.json();\n        if (r.ok && data.ok) { window.bo.toast(`登録：${data.vendor ?? "請求元不明"} ${data.amount ? "¥" + data.amount.toLocaleString() : ""}`); setTimeout(() => location.reload(), 900); }\n        else window.bo.toast(data.error ?? "アップロードに失敗しました");\n      } finally { up.disabled = false; }\n    });\n    document.querySelectorAll("tr[data-id] .inv-status").forEach((sel) => {\n      sel.addEventListener("change", async (e) => {\n        const id = e.currentTarget.closest("tr[data-id]").getAttribute("data-id");\n        await window.bo.api("/api/invoices", { _action: "status", id, status: e.currentTarget.value }, { successMsg: "更新しました" });\n      });\n    });\n  <\/script>'], ['<script>\n    const up = document.getElementById("invup");\n    if (up) up.addEventListener("click", async () => {\n      const input = document.getElementById("invfile");\n      const f = input.files && input.files[0];\n      if (!f) { window.bo.toast("ファイルを選んでください"); return; }\n      up.disabled = true;\n      try {\n        const fd = new FormData();\n        fd.append("file", f);\n        const r = await fetch("/api/invoices", { method: "POST", body: fd });\n        const data = await r.json();\n        if (r.ok && data.ok) { window.bo.toast(\\`登録：\\${data.vendor ?? "請求元不明"} \\${data.amount ? "¥" + data.amount.toLocaleString() : ""}\\`); setTimeout(() => location.reload(), 900); }\n        else window.bo.toast(data.error ?? "アップロードに失敗しました");\n      } finally { up.disabled = false; }\n    });\n    document.querySelectorAll("tr[data-id] .inv-status").forEach((sel) => {\n      sel.addEventListener("change", async (e) => {\n        const id = e.currentTarget.closest("tr[data-id]").getAttribute("data-id");\n        await window.bo.api("/api/invoices", { _action: "status", id, status: e.currentTarget.value }, { successMsg: "更新しました" });\n      });\n    });\n  <\/script>']))) })}`;
}, "/home/runner/work/baku-office/baku-office/apps/client/src/pages/invoices.astro", void 0);
const $$file = "/home/runner/work/baku-office/baku-office/apps/client/src/pages/invoices.astro";
const $$url = "/invoices";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Invoices,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};

globalThis.process ??= {};
globalThis.process.env ??= {};
import { getSession } from "./auth_BXoLTJDQ.mjs";
import { cachedEntitlement } from "./client_DsX87Mps.mjs";
import "./stripe_r-RFTlbb.mjs";
import { atLeast } from "./index_CrjiuAkj.mjs";
import { saveFile } from "./storage_C7TJPJmI.mjs";
import { r as registerInvoiceFromFile, s as setInvoiceStatus } from "./invoices_BrIqzWU0.mjs";
import { env } from "cloudflare:workers";
const prerender = false;
const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { "content-type": "application/json" } });
const POST = async ({ request, locals }) => {
  const ctx = locals.ctx;
  const ses = await getSession(env, request);
  if (!ses || ses.role !== "admin" || ses.ctx !== "org") return json({ error: "管理者のみ" }, 403);
  if (!atLeast(await cachedEntitlement(env), "pro")) return json({ error: "請求書管理は Pro 以上のプランで利用できます" }, 403);
  const ct = request.headers.get("content-type") ?? "";
  if (ct.includes("multipart/form-data")) {
    const fd = await request.formData();
    const file = fd.get("file");
    if (!(file instanceof File)) return json({ error: "ファイルが必要です" }, 400);
    const saved = await saveFile(env, file, ses.uid, ses.ctx);
    const r = await registerInvoiceFromFile(ctx, ses.uid, saved.id, "manual");
    if (r.error) return json({ error: r.error }, 400);
    return json({ ok: true, ...r });
  }
  const b = await request.json().catch(() => ({}));
  if (b._action === "status") {
    if (!b.id || !b.status) return json({ error: "id・status が必要" }, 400);
    const r = await setInvoiceStatus(ctx, b.id, b.status);
    return r.ok ? json({ ok: true }) : json({ error: r.error }, 400);
  }
  return json({ error: "不明な操作" }, 400);
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

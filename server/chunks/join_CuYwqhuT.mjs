globalThis.process ??= {};
globalThis.process.env ??= {};
import { kvPut } from "./kv_DEgX1LMf.mjs";
import { createMember } from "./membership_BhF2x4wx.mjs";
import { env } from "cloudflare:workers";
const prerender = false;
const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { "content-type": "application/json" } });
const POST = async ({ request, locals }) => {
  const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
  const rlKey = `joinrl:${ip}`;
  const cur = Number(await env.LICENSE.get(rlKey) ?? "0");
  if (cur >= 10) return json({ error: "短時間に申込が集中しています。時間をおいて再度お試しください。" }, 429);
  await kvPut(env, rlKey, String(cur + 1), { expirationTtl: 3600 });
  const b = await request.json().catch(() => ({}));
  const name = (b.name ?? "").trim();
  if (!name) return json({ error: "お名前が必要です" }, 400);
  if (name.length > 100) return json({ error: "入力が長すぎます" }, 400);
  await createMember(env, { name, contact: (b.contact ?? "").slice(0, 200), fee_status: "unpaid", extra: "公開フォームからの申込" });
  return json({ ok: true });
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

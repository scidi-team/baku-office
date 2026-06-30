globalThis.process ??= {};
globalThis.process.env ??= {};
import { getSession } from "./auth_TPDi1U5M.mjs";
import { s as storeMedia } from "./site-media_FjB9pqph.mjs";
import { env } from "cloudflare:workers";
const prerender = false;
const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { "content-type": "application/json" } });
const MAX = 3 * 1024 * 1024;
const b64ToBuf = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0)).buffer;
const POST = async ({ request }) => {
  const ses = await getSession(env, request);
  if (!ses || ses.role !== "admin") return json({ error: "管理者のみ" }, 403);
  const b = await request.json().catch(() => ({}));
  if (b._action !== "upload") return json({ error: "不明な操作" }, 400);
  const mime = String(b.mime || "");
  if (!/^image\/(png|jpeg|webp|gif)$/.test(mime)) return json({ error: "画像（PNG/JPEG/WebP/GIF）のみ対応" }, 400);
  let buf;
  try {
    buf = b64ToBuf(b.dataB64 || "");
  } catch {
    return json({ error: "画像データが不正です" }, 400);
  }
  if (buf.byteLength === 0) return json({ error: "画像が空です" }, 400);
  if (buf.byteLength > MAX) return json({ error: "画像が大きすぎます（3MBまで）" }, 400);
  const id = await storeMedia(env, buf, mime);
  return json({ ok: true, url: "/api/site-media/" + id });
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

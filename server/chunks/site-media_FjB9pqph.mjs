globalThis.process ??= {};
globalThis.process.env ??= {};
import { r as randomId } from "./stripe_r-RFTlbb.mjs";
const kv = (env) => env.MEDIA ?? env.LICENSE;
async function storeMedia(env, buf, ct) {
  const id = randomId(12);
  await kv(env).put("media:" + id, buf, { metadata: { ct } });
  return id;
}
async function getMedia(env, id) {
  const key = "media:" + id.replace(/[^a-zA-Z0-9]/g, "").slice(0, 32);
  const r = await kv(env).getWithMetadata(key, { type: "arrayBuffer" });
  if (!r || !r.value) return null;
  const ct = r.metadata?.ct || "application/octet-stream";
  return { buf: r.value, ct };
}
export {
  getMedia as g,
  storeMedia as s
};

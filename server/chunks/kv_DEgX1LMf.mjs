globalThis.process ??= {};
globalThis.process.env ??= {};
const KV_WRITE_FREE_LIMIT = 1e3;
const todayUtc = () => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
async function recordKvWrite(env, n = 1) {
  try {
    await env.DB.prepare(
      "INSERT INTO op_usage (op, day, count) VALUES ('kv_write', ?, ?) ON CONFLICT(op, day) DO UPDATE SET count = count + excluded.count"
    ).bind(todayUtc(), n).run();
  } catch {
  }
}
async function kvWritesToday(env) {
  try {
    const r = await env.DB.prepare("SELECT count FROM op_usage WHERE op='kv_write' AND day=?").bind(todayUtc()).first();
    return r?.count ?? 0;
  } catch {
    return 0;
  }
}
async function kvPut(env, key, value, options) {
  const p = env.LICENSE.put(key, value, options);
  await recordKvWrite(env);
  return p;
}
export {
  KV_WRITE_FREE_LIMIT,
  kvPut,
  kvWritesToday,
  recordKvWrite
};

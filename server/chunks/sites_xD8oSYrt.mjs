globalThis.process ??= {};
globalThis.process.env ??= {};
import { n as nowSec } from "./accounting_BipJ8jvJ.mjs";
async function listSites(env) {
  return (await env.DB.prepare("SELECT * FROM sites ORDER BY (slug='home') DESC, updated_at DESC").all()).results;
}
async function getPublishedSite(env, slug) {
  return await env.DB.prepare("SELECT * FROM sites WHERE slug=? AND published=1").bind(slug).first() ?? null;
}
async function upsertSite(env, a) {
  const now = nowSec();
  await env.DB.prepare(
    "INSERT INTO sites (slug,title,body,published,show_join,created_at,updated_at) VALUES (?,?,?,?,?,?,?) ON CONFLICT(slug) DO UPDATE SET title=excluded.title,body=excluded.body,published=excluded.published,show_join=excluded.show_join,updated_at=excluded.updated_at"
  ).bind(a.slug, a.title, a.body ?? null, a.published ? 1 : 0, a.show_join ? 1 : 0, now, now).run();
}
async function deleteSite(env, slug) {
  await env.DB.prepare("DELETE FROM sites WHERE slug=?").bind(slug).run();
}
export {
  deleteSite,
  getPublishedSite,
  listSites,
  upsertSite
};

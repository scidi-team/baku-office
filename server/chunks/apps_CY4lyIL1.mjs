globalThis.process ??= {};
globalThis.process.env ??= {};
import { e as enabledPartIds, r as registeredParts, s as setEnabledPartIds, a as scopeCtx } from "./parts_D1i9CXVc.mjs";
import { disabledBuiltins } from "./client_DsX87Mps.mjs";
function appCatalog() {
  return registeredParts().map((p) => ({
    id: p.id,
    name: p.name,
    version: p.version,
    description: p.description,
    category: p.category,
    minPlan: p.minPlan,
    permissions: p.permissions ?? [],
    actions: (p.actions ?? []).map((a) => a.name)
  }));
}
const MANDATORY_APPS = ["chat"];
async function installedAppIds(ctx) {
  const known = new Set(registeredParts().map((p) => p.id));
  const stored = await enabledPartIds(ctx);
  const ids = stored ?? [...known];
  for (const m of MANDATORY_APPS) if (known.has(m) && !ids.includes(m)) ids.push(m);
  const disabled = new Set((await disabledBuiltins(ctx.env)).filter((id) => !MANDATORY_APPS.includes(id)));
  return ids.filter((id) => known.has(id) && !disabled.has(id));
}
async function installApp(ctx, id) {
  const base = await enabledPartIds(ctx) ?? registeredParts().map((p) => p.id);
  return setEnabledPartIds(ctx, base.includes(id) ? base : [...base, id]);
}
async function uninstallApp(ctx, id) {
  if (MANDATORY_APPS.includes(id)) throw new Error("このアプリは必須のため削除できません。");
  const base = await enabledPartIds(ctx) ?? registeredParts().map((p) => p.id);
  return setEnabledPartIds(ctx, base.filter((x) => x !== id));
}
function makeAppsApi(ctx) {
  return {
    list: () => registeredParts().map((p) => ({ id: p.id, name: p.name, actions: (p.actions ?? []).map((a) => a.name) })),
    call: async (appId, action, args = {}, caller) => {
      const app = registeredParts().find((p) => p.id === appId);
      if (!app) throw new Error(`アプリが見つかりません: ${appId}`);
      const act = (app.actions ?? []).find((a) => a.name === action);
      if (!act) throw new Error(`操作が見つかりません: ${appId}.${action}`);
      if (act.requiredPermission && caller) {
        const callerApp = registeredParts().find((p) => p.id === caller);
        const granted = callerApp?.permissions ?? [];
        if (!granted.includes(act.requiredPermission)) throw new Error(`権限がありません: ${caller} は ${act.requiredPermission} を保有していません`);
      }
      return act.run(scopeCtx(ctx, app.permissions), args, caller);
    }
  };
}
export {
  MANDATORY_APPS,
  appCatalog,
  installApp,
  installedAppIds,
  makeAppsApi,
  uninstallApp
};

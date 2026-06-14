globalThis.process ??= {};
globalThis.process.env ??= {};
import { b, d, a, e, g, i, p, r, v, c } from "./stripe_r-RFTlbb.mjs";
const ENTITLEMENT_RANK = { free: 0, plus: 1, pro: 2, nonprofit: 40, enterprise: 50, test: 99 };
function atLeast(e2, min) {
  return ENTITLEMENT_RANK[e2] >= ENTITLEMENT_RANK[min];
}
function planLabel(p2) {
  return p2 === "test" ? "テスト（全機能解放）" : p2 === "enterprise" ? "エンタープライズ（個別相談・全機能）" : p2 === "nonprofit" ? "NonProfit（非営利・全機能・要審査）" : p2 === "pro" ? "Pro（エージェント）" : p2 === "plus" ? "Plus（AI）" : "Free（無料）";
}
export {
  ENTITLEMENT_RANK,
  atLeast,
  b as decryptBytes,
  d as decryptField,
  a as encryptBytes,
  e as encryptField,
  g as generateMasterKey,
  i as importVerifyKey,
  p as payloadOf,
  planLabel,
  r as randomId,
  v as verifyEnvelope,
  c as verifyStripeSig
};

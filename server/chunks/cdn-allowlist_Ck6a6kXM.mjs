globalThis.process ??= {};
globalThis.process.env ??= {};
const CDN_HOSTS = /* @__PURE__ */ new Set([
  "cdnjs.cloudflare.com",
  // SRI 付きカタログの主配信元
  "cdn.jsdelivr.net",
  // npm/gh パッケージ（版固定URL）
  "unpkg.com",
  // npm パッケージ（版固定URL）
  "esm.sh"
  // ESM 配信（版固定URL）
]);
function isCuratedHost(host) {
  return CDN_HOSTS.has(String(host).trim().toLowerCase());
}
function isVersionPinned(url) {
  const u = String(url).toLowerCase();
  if (/(?:@latest\b|\/latest\/)/.test(u)) return false;
  if (/@\d+\.\d+\.\d+/.test(u)) return true;
  if (/@[0-9a-f]{7,40}\b/.test(u)) return true;
  if (/\/ajax\/libs\/[^/]+\/\d+\.\d+(?:\.\d+)?[^/]*\//.test(u)) return true;
  return false;
}
const LIB_CATALOG = [
  { kind: "script", url: "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.5.0/chart.umd.min.js", integrity: "sha512-Y51n9mtKTVBh3Jbx5pZSJNDDMyY+yGe77DGtBPzRlgsf/YLCh13kSZ3JmfHGzYFCmOndraf0sQgfM654b7dJ3w==" },
  { kind: "script", url: "https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js", integrity: "sha512-vc58qvvBdrDR4etbxMdlTt4GBQk1qjvyORR2nrsPsFPyrs+/u5c3+1Ct6upOgdZoIl7eq6k3a1UPDSNAQi/32A==" },
  { kind: "script", url: "https://cdnjs.cloudflare.com/ajax/libs/alpinejs/3.15.12/cdn.min.js", integrity: "sha512-xHBdoP9GVH6jVtCb+8CLAqjcFcSUS2FZXXi9Ok/nyaaEhcH0ffHsSuXOuLvha8K9yiZ3uptMO8gzhbk30xiyvg==" },
  { kind: "script", url: "https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.11.21/dayjs.min.js", integrity: "sha512-7BnHO0aSsTKlbnXz+vFHMpPBHu2+ObLXRYEFwlf78OxmDxnicV505aojIreJMgZ709oDafpTHkm03/ySCjI3/Q==" },
  { kind: "script", url: "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.44/katex.min.js", integrity: "sha512-LV0dhHi1nGl/i/Z9ix7C8FYefB5Vabm8931179LhFcfzFAhqdWgNNpnBIqaTgX7F9rN1vbxCaRDHsOjEkyhpNg==" },
  { kind: "style", url: "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.44/katex.min.css", integrity: "sha512-Wejrt2k+KQnYZXKfoTssRNkow4yPGVJFkb0tFIdedjQ/EphBYUouzY2kOWUExrKIHP0lAB6NMoEiin1RpFO1nw==" },
  { kind: "script", url: "https://cdnjs.cloudflare.com/ajax/libs/mermaid/11.12.0/mermaid.min.js", integrity: "sha512-5TKaYvhenABhlGIKSxAWLFJBZCSQw7HTV7aL1dJcBokM/+3PNtfgJFlv8E6Us/B1VMlQ4u8sPzjudL9TEQ06ww==" }
];
const SRI_BY_URL = new Map(LIB_CATALOG.map((e) => [e.url.toLowerCase(), e]));
function catalogEntryForUrl(url) {
  return SRI_BY_URL.get(String(url).trim().toLowerCase()) ?? null;
}
function catalogPromptHint() {
  const lines = LIB_CATALOG.map((e) => `${e.kind === "style" ? "CSS" : "JS"} ${e.url}`);
  return "厳選CDN（relaxed で読込可・版固定済み・SRIはプラットフォームが自動付与）：\n" + lines.join("\n");
}
function injectCatalogSri(html) {
  if (typeof html !== "string" || !html) return html;
  return html.replace(/<(script|link)\b[^>]*>/gi, (tag, _name) => {
    if (/\bintegrity\s*=/i.test(tag)) return tag;
    const m = tag.match(/\b(?:src|href)\s*=\s*["']([^"']+)["']/i);
    if (!m) return tag;
    const entry = catalogEntryForUrl(m[1]);
    if (!entry) return tag;
    const add = ` integrity="${entry.integrity}" crossorigin="anonymous"`;
    return tag.replace(/\s*\/?>$/, (end) => add + end);
  });
}
export {
  isCuratedHost as a,
  injectCatalogSri as b,
  catalogPromptHint as c,
  isVersionPinned as i
};

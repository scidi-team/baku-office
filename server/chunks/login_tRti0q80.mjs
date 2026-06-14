globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_Dn7U0_eq.mjs";
import { r as renderTemplate, m as maybeRenderHead, a as addAttribute, F as Fragment } from "./sequence_I_kcixDX.mjs";
import { r as renderComponent } from "./worker-entry_Cv5GlnJ5.mjs";
import { env } from "cloudflare:workers";
import { $ as $$App } from "./App_ChWwyHiq.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const prerender = false;
const $$Login = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Login;
  const { providerEnabled } = await import("./oauth_BORwkPcz.mjs");
  const google = providerEnabled(env, "google") || !!env.HOST_BASE_URL;
  const line = providerEnabled(env, "line");
  const discord = providerEnabled(env, "discord");
  const e = Astro2.url.searchParams.get("e");
  const activated = Astro2.url.searchParams.get("activated");
  const emsg = { state: "セッションが切れました。再度お試しください。", oauth: "認証に失敗しました。", notorg: "この組織のGoogleアカウントではありません。", pending: "登録は管理者の承認待ちです。", noapply: "このGoogleアカウント（メール）に対応する申込が見つかりません。申込時のメールのGoogleアカウントでログインしてください。" };
  const SPARK = "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z";
  const CHECK = "M5 12.5l4.5 4.5L19 7";
  const promises = [
    { t: "所有する", d: "データもAIも自社のクラウドの中。借り物ではありません。" },
    { t: "作る", d: "必要な機能は、AI相棒と一緒に作れます。" },
    { t: "育てる", d: "使うほど手になじむ、自社専用の相棒に。" }
  ];
  return renderTemplate`${renderComponent($$result, "App", $$App, { "title": "ログイン", "auth": false, "bare": true, "data-astro-cid-sgpqyurt": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="login" data-astro-cid-sgpqyurt> <!-- 左：ブランドパネル --> <div class="login-brand" data-astro-cid-sgpqyurt> <div class="login-orbs" aria-hidden="true" data-astro-cid-sgpqyurt><span data-astro-cid-sgpqyurt></span><span data-astro-cid-sgpqyurt></span><span data-astro-cid-sgpqyurt></span></div> <div class="lb-top" data-astro-cid-sgpqyurt> <span class="lb-mark" data-astro-cid-sgpqyurt><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-astro-cid-sgpqyurt><path${addAttribute(SPARK, "d")} data-astro-cid-sgpqyurt></path></svg></span> <strong data-astro-cid-sgpqyurt>baku-office</strong> <span class="beta-badge" data-astro-cid-sgpqyurt>β版</span> </div> <div class="login-brand-mid" data-astro-cid-sgpqyurt> <div class="eyebrow" style="color:var(--brand)" data-astro-cid-sgpqyurt>合同会社 貘</div> <h1 class="display" style="margin:.5rem 0 0" data-astro-cid-sgpqyurt><span class="nb" data-astro-cid-sgpqyurt>自社の</span><span class="nb" data-astro-cid-sgpqyurt>クラウドと</span><span class="nb" data-astro-cid-sgpqyurt><span style="color:var(--brand)" data-astro-cid-sgpqyurt>相棒</span>を、</span><span class="nb" data-astro-cid-sgpqyurt>ひとつに。</span></h1> <div class="promises" data-astro-cid-sgpqyurt> ${promises.map((p) => renderTemplate`<div class="promise" data-astro-cid-sgpqyurt> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-astro-cid-sgpqyurt><path${addAttribute(CHECK, "d")} data-astro-cid-sgpqyurt></path></svg> <div data-astro-cid-sgpqyurt><strong data-astro-cid-sgpqyurt>${p.t}</strong><span data-astro-cid-sgpqyurt>${p.d}</span></div> </div>`)} </div> </div> <div class="lb-foot" data-astro-cid-sgpqyurt>© 合同会社 貘（Baku LLC）</div> </div> <!-- 右：操作パネル --> <div class="login-main" data-astro-cid-sgpqyurt> <div class="login-card" data-astro-cid-sgpqyurt> <h1 class="h1" data-astro-cid-sgpqyurt>おかえりなさい</h1> <p class="muted" style="margin:.3rem 0 0" data-astro-cid-sgpqyurt>baku-office にサインインしてください。</p> <div class="banner warn" style="margin-top:1.1rem" data-astro-cid-sgpqyurt> <div class="b-body" data-astro-cid-sgpqyurt>🧪 本サービスは現在<strong data-astro-cid-sgpqyurt>ベータ（試験提供）版</strong>です。現在ログインできるのは<strong data-astro-cid-sgpqyurt>Test ユーザーのみ</strong>です。</div> </div> ${activated && renderTemplate`<div class="banner info" style="margin-top:.7rem" data-astro-cid-sgpqyurt><div class="b-body" data-astro-cid-sgpqyurt>✅ アクティベーションが完了しました。続けて Google でログインしてください。</div></div>`} ${e && renderTemplate`<div class="banner danger" style="margin-top:.7rem" data-astro-cid-sgpqyurt><div class="b-body" data-astro-cid-sgpqyurt>${emsg[e] ?? "エラー"}</div></div>`} <div class="card" style="margin-top:1.1rem" data-astro-cid-sgpqyurt> <h2 class="h2" style="margin:0 0 .2rem" data-astro-cid-sgpqyurt>組織（管理者）</h2> ${google ? renderTemplate`<a class="g-btn" href="/api/auth/google/start" data-astro-cid-sgpqyurt><span class="g-mark" data-astro-cid-sgpqyurt>G</span> Google でサインイン</a>` : renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-sgpqyurt": true }, { "default": async ($$result3) => renderTemplate`<p class="muted" style="font-size:.85rem" data-astro-cid-sgpqyurt>本番は組織のGoogleアカウントで認証（§6.2）。dev：</p><button class="btn btn-primary btn-block" id="org" data-astro-cid-sgpqyurt>組織管理者としてログイン（dev）</button>` })}`} </div> <div class="card" style="margin-top:1rem" data-astro-cid-sgpqyurt> <h2 class="h2" style="margin:0 0 .4rem" data-astro-cid-sgpqyurt>個人（メンバー）</h2> ${line || discord ? renderTemplate`<div class="row" style="display:flex;gap:.5rem;flex-wrap:wrap" data-astro-cid-sgpqyurt>${line && renderTemplate`<a class="btn btn-block" style="background:#06c755;color:#fff" href="/api/auth/line/start" data-astro-cid-sgpqyurt>LINEでサインイン</a>`} ${discord && renderTemplate`<a class="btn btn-block" style="background:#5865f2;color:#fff" href="/api/auth/discord/start" data-astro-cid-sgpqyurt>Discordでサインイン</a>`}</div>` : renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-sgpqyurt": true }, { "default": async ($$result3) => renderTemplate`<p class="muted" style="font-size:.85rem" data-astro-cid-sgpqyurt>本番はLINEログイン等（§6.2）。dev：ID/パスワード。</p><div class="field" data-astro-cid-sgpqyurt><label for="lid" data-astro-cid-sgpqyurt>ログインID</label><input class="input" id="lid" name="lid" autocomplete="username" placeholder="ログインID" data-astro-cid-sgpqyurt></div><div class="field" data-astro-cid-sgpqyurt><label for="lpw" data-astro-cid-sgpqyurt>パスワード</label><input class="input" id="lpw" name="lpw" type="password" autocomplete="current-password" placeholder="パスワード" data-astro-cid-sgpqyurt></div><button class="btn btn-primary btn-block" id="local" data-astro-cid-sgpqyurt>個人ログイン</button>` })}`} <p class="muted" style="margin-top:.8rem;font-size:.85rem" data-astro-cid-sgpqyurt>招待コードをお持ちの方は <a href="/join" data-astro-cid-sgpqyurt>こちらから参加</a></p> </div> <p class="faint" style="font-size:.76rem;margin-top:1rem;text-align:center" data-astro-cid-sgpqyurt>続行すると<a href="/legal" data-astro-cid-sgpqyurt>利用規約・プライバシーポリシー</a>に同意したものとみなされます。</p> </div> </div> </div>   `, "scripts": async ($$result2) => renderTemplate(_a || (_a = __template(['<script>\n    const org=document.getElementById("org");\n    if(org)org.addEventListener("click",async(e)=>{const r=await window.bo.api("/api/login",{mode:"org"},{btn:e.currentTarget,successMsg:"ログインしました"});if(r.ok)location.href="/";});\n    const lc=document.getElementById("local");\n    if(lc)lc.addEventListener("click",async(e)=>{const r=await window.bo.api("/api/login",{mode:"local",loginId:document.getElementById("lid").value,password:document.getElementById("lpw").value},{btn:e.currentTarget,successMsg:"ログインしました"});if(r.ok)location.href="/";});\n  <\/script>']))) })}`;
}, "/home/runner/work/baku-office/baku-office/apps/client/src/pages/login.astro", void 0);
const $$file = "/home/runner/work/baku-office/baku-office/apps/client/src/pages/login.astro";
const $$url = "/login";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};

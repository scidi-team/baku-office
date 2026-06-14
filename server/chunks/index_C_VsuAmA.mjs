globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_Dn7U0_eq.mjs";
import { r as renderTemplate, e as renderSlot, m as maybeRenderHead, a as addAttribute } from "./sequence_I_kcixDX.mjs";
import { r as renderComponent } from "./worker-entry_Cv5GlnJ5.mjs";
import { kvPut } from "./kv_DEgX1LMf.mjs";
import { env } from "cloudflare:workers";
import { $ as $$App } from "./App_ChWwyHiq.mjs";
import "./stripe_r-RFTlbb.mjs";
import { planLabel } from "./index_CrjiuAkj.mjs";
const mods = /* @__PURE__ */ Object.assign({});
const keyOf = (name) => `/src/overrides/${name}.astro`;
function overrideComponent(name) {
  return mods[keyOf(name)]?.default ?? null;
}
const $$Slot = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Slot;
  const { name } = Astro2.props;
  const Override = overrideComponent(name);
  return renderTemplate`${Override ? renderTemplate`${renderComponent($$result, "Override", Override, {})}` : renderTemplate`${renderSlot($$result, $$slots["default"])}`}`;
}, "/home/runner/work/baku-office/baku-office/apps/client/src/components/Slot.astro", void 0);
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Index;
  const { getSession } = await import("./auth_BXoLTJDQ.mjs");
  const ses = await getSession(env, Astro2.request);
  if (!ses) return Astro2.redirect("/login", 302);
  const ctx = Astro2.locals.ctx;
  const isOrgAdmin = ses.role === "admin" && ses.ctx === "org";
  const isOrg = ses.ctx === "org";
  const homeActions = isOrg ? [
    { href: "/accounting", label: "お金の記録", sub: "入金・出金・残高", icon: "M3 6h18v12H3zM3 10h18M7 15h4" },
    { href: "/schedule", label: "予定", sub: "行事・スケジュール", icon: "M4 5h16v15H4zM4 9h16M8 3v4M16 3v4" },
    { href: "/membership", label: "名簿", sub: "会員の一覧・管理", icon: "M9 11a3 3 0 100-6 3 3 0 000 6M3 19a6 6 0 0112 0M17 11a3 3 0 000-6M21 19a6 6 0 00-4-5.7" },
    { href: "/import", label: "書類の取り込み", sub: "ファイル・資料を取込", icon: "M12 3v10M8 9l4 4 4-4M5 21h14" }
  ] : [
    { href: "/personal", label: "個人の作業領域", sub: "領収書・メモ・予定", icon: "M12 12a4 4 0 100-8 4 4 0 000 8M4 21a8 8 0 0116 0" },
    { href: "/schedule", label: "予定", sub: "行事・スケジュール", icon: "M4 5h16v15H4zM4 9h16M8 3v4M16 3v4" },
    { href: "/chat", label: "AI", sub: "質問・相談・作成", icon: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" },
    { href: "/apps", label: "アプリ", sub: "使えるアプリ一覧", icon: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" }
  ];
  const { pollHost, cachedEntitlement, APP_VERSION, nowSec } = await import("./client_DsX87Mps.mjs");
  const { cmpVersion } = await import("./update_B1dUuu-z.mjs");
  await import("./index_LVLYtqrF.mjs");
  const { appCatalog, installedAppIds } = await import("./apps_CY4lyIL1.mjs");
  const { getStorageUsage, fmtBytes } = await import("./storage-usage_J5_c4nFJ.mjs");
  const { kvWritesToday, KV_WRITE_FREE_LIMIT } = await import("./kv_DEgX1LMf.mjs");
  const { scopedWidgets, enabledParts } = await import("./parts_D1i9CXVc.mjs").then((n) => n.f);
  const { getHomeLayout, orderedSections, HOME_SECTIONS } = await import("./home_g2cvhiOl.mjs");
  const { brandName, getTheme } = await import("./theme_DO0iS6ur.mjs");
  const { reviewQueue } = await import("./users_BHOLHxMy.mjs");
  const { backupAlert } = await import("./backup_Buj-Jcas.mjs");
  const onboardingDismissed = isOrgAdmin ? await env.LICENSE.get("onboarding_dismissed").catch(() => null) === "1" : true;
  const instSet = new Set(await installedAppIds(ctx).catch(() => []));
  const ym = (/* @__PURE__ */ new Date()).toISOString().slice(0, 7);
  const _apps = appCatalog().filter((a) => instSet.has(a.id)).map((a) => ({ id: a.id, version: a.version }));
  try {
    Astro2.locals.cfContext.waitUntil(pollHost(env, Astro2.url.origin, _apps).catch(() => {
    }));
  } catch {
    pollHost(env, Astro2.url.origin, _apps).catch(() => {
    });
  }
  const widgetDefs = scopedWidgets(enabledParts([...instSet]));
  const [entitlement, homeLayout, theme, latestVersion, noticesRaw, lastAtRaw, backupAlertState, widgetData, kpiRaw] = await Promise.all([
    cachedEntitlement(env).catch(() => "free"),
    getHomeLayout(ctx).catch(() => null),
    getTheme(ctx).catch(() => ({})),
    env.LICENSE.get("latest_version").catch(() => null),
    env.LICENSE.get("notices_cache").catch(() => null),
    env.LICENSE.get("entitlement_at").catch(() => null),
    isOrgAdmin ? backupAlert(env).catch(() => ({ alert: false, never: false, lastAt: null })) : Promise.resolve({ alert: false, never: false, lastAt: null }),
    Promise.all(widgetDefs.map(async (w) => {
      try {
        return { title: w.title, span: w.span, ...await w.run(ctx, ses.uid) };
      } catch {
        return null;
      }
    })).then((a) => a.filter(Boolean)),
    env.LICENSE.get("kpi_cache").catch(() => null)
  ]);
  const monthStart = ym + "-01";
  const _d = /* @__PURE__ */ new Date();
  const nextMonthStart = new Date(Date.UTC(_d.getUTCFullYear(), _d.getUTCMonth() + 1, 1)).toISOString().slice(0, 10);
  let kpi = null;
  try {
    if (kpiRaw) {
      const o = JSON.parse(kpiRaw);
      if (nowSec() - o.at < 120) kpi = o;
    }
  } catch {
  }
  if (!kpi) {
    const [balanceRow, monthAgg, pending, st] = await Promise.all([
      env.DB.prepare("SELECT COALESCE(SUM(opening_balance),0) AS b FROM wallets").first().catch(() => null),
      env.DB.prepare("SELECT kind, COALESCE(SUM(amount),0) AS s FROM transactions WHERE deleted_at IS NULL AND kind IN ('income','expense') AND date >= ? AND date < ? GROUP BY kind").bind(monthStart, nextMonthStart).all().catch(() => ({ results: [] })),
      reviewQueue(env).then((r) => r.length).catch(() => 0),
      getStorageUsage(env).catch(() => [])
    ]);
    let mi = 0, me = 0;
    for (const row of monthAgg.results) {
      if (row.kind === "income") mi = row.s;
      else if (row.kind === "expense") me = row.s;
    }
    kpi = { balance: balanceRow?.b ?? 0, monthIncome: mi, monthExpense: me, pending, storage: st, at: nowSec() };
    const blob = JSON.stringify(kpi);
    try {
      Astro2.locals.cfContext.waitUntil(kvPut(env, "kpi_cache", blob).catch(() => {
      }));
    } catch {
    }
  }
  const balance = kpi.balance;
  const monthIncome = kpi.monthIncome, monthExpense = kpi.monthExpense;
  const monthNet = monthIncome - monthExpense;
  const pendingCount = kpi.pending;
  const storage = kpi.storage;
  const updateAvailable = !!latestVersion && cmpVersion(latestVersion, APP_VERSION) > 0;
  let notices = [];
  try {
    notices = JSON.parse(noticesRaw ?? "[]");
  } catch {
  }
  const lastAt = Number(lastAtRaw);
  const online = Number.isFinite(lastAt) && nowSec() - lastAt < 86400;
  const pct = (u, l) => u < 0 || l <= 0 ? 0 : Math.min(100, Math.round(u / l * 100));
  const kvWrites = isOrgAdmin ? await kvWritesToday(env).catch(() => 0) : 0;
  const kvPct = KV_WRITE_FREE_LIMIT > 0 ? Math.min(100, Math.round(kvWrites / KV_WRITE_FREE_LIMIT * 100)) : 0;
  const measurable = storage.filter((s) => s.enabled && s.used >= 0 && s.limit > 0);
  const totalUsed = measurable.reduce((a, s) => a + s.used, 0);
  const totalLimit = measurable.reduce((a, s) => a + s.limit, 0);
  const totalPct = pct(totalUsed, totalLimit);
  const yen = (n) => "¥" + n.toLocaleString("ja-JP");
  const fmtDay = (s) => new Date(s * 1e3).toISOString().slice(0, 10);
  const jstHour = ((/* @__PURE__ */ new Date()).getUTCHours() + 9) % 24;
  const greeting = jstHour < 11 ? "おはようございます" : jstHour < 18 ? "こんにちは" : "おつかれさまです";
  const dispName = ses.name ? `${ses.name} さん` : "";
  const brandLabel = brandName(theme);
  const sections = orderedSections(homeLayout);
  const hiddenSet = new Set(homeLayout?.hidden ?? []);
  const clampSpan = (n) => Math.max(1, Math.min(3, Number(n) || 1));
  return renderTemplate`${renderComponent($$result, "App", $$App, { "title": "ホーム", "active": "/", "data-astro-cid-j7pv25f6": true }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Slot", $$Slot, { "name": "home-hero", "data-astro-cid-j7pv25f6": true })} ${maybeRenderHead()}<div class="home-head" data-astro-cid-j7pv25f6> <div data-astro-cid-j7pv25f6> <div class="eyebrow" data-astro-cid-j7pv25f6>${brandLabel}</div> <h1 class="h1" style="margin:.25rem 0 0" data-astro-cid-j7pv25f6>${greeting}${dispName && renderTemplate`<span style="color:var(--muted);font-weight:600" data-astro-cid-j7pv25f6>、${dispName}</span>`}</h1> </div> <div class="home-head-right" data-astro-cid-j7pv25f6> ${isOrgAdmin && renderTemplate`<span class="pill brand" data-astro-cid-j7pv25f6>${planLabel(entitlement)}</span>`} <span class="pill" data-astro-cid-j7pv25f6><span class="dot"${addAttribute(`background:${online ? "var(--ok)" : "var(--faint)"}`, "style")} data-astro-cid-j7pv25f6></span>${online ? "オンライン" : "未接続"}</span> ${isOrgAdmin && renderTemplate`<button class="btn btn-ghost btn-sm" id="editHome" data-astro-cid-j7pv25f6>ホームを編集</button>`} </div> </div>  <nav class="home-actions" aria-label="よく使う操作" data-astro-cid-j7pv25f6> ${homeActions.map((a) => renderTemplate`<a class="ha"${addAttribute(a.href, "href")} data-astro-cid-j7pv25f6> <span class="ha-ico" data-astro-cid-j7pv25f6><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-astro-cid-j7pv25f6><path${addAttribute(a.icon, "d")} data-astro-cid-j7pv25f6></path></svg></span> <span class="ha-txt" data-astro-cid-j7pv25f6><strong data-astro-cid-j7pv25f6>${a.label}</strong><small data-astro-cid-j7pv25f6>${a.sub}</small></span> </a>`)} </nav>  <section class="home-fixed" data-astro-cid-j7pv25f6> ${isOrgAdmin && !onboardingDismissed && renderTemplate`<div class="banner banner-info" data-astro-cid-j7pv25f6>🚀 はじめにいくつか設定すると、もっと便利に使えます。<a href="/setup" data-astro-cid-j7pv25f6>はじめの設定ガイド</a>（AI・ブランド・Google連携・バックアップ）を開く。</div>`} <h2 data-astro-cid-j7pv25f6>お知らせ</h2> ${notices.length === 0 && !updateAvailable && renderTemplate`<p class="muted" data-astro-cid-j7pv25f6>現在、新しいお知らせはありません。</p>`} ${notices.map((n) => renderTemplate`<div${addAttribute(`banner ${n.severity === "critical" ? "banner-danger" : n.severity === "important" ? "banner-warn" : "banner-info"}`, "class")}${addAttribute(n.severity, "data-sev")}${addAttribute(n.id, "data-id")} data-astro-cid-j7pv25f6>${n.body}</div>`)} ${updateAvailable && renderTemplate`<div class="banner banner-warn" data-astro-cid-j7pv25f6>🔔 新しいバージョン <strong data-astro-cid-j7pv25f6>${latestVersion}</strong> があります（現在 ${APP_VERSION}）。${isOrgAdmin ? renderTemplate`<a href="/settings/update" data-astro-cid-j7pv25f6>更新する</a>` : "管理者にアプリの更新をご依頼ください。"}</div>`} ${backupAlertState.alert && renderTemplate`<div class="banner banner-warn" data-astro-cid-j7pv25f6>💾 ${backupAlertState.never ? "データのバックアップがまだ実行されていません。" : `最終バックアップから7日以上経過しています（最終：${backupAlertState.lastAt ? fmtDay(backupAlertState.lastAt) : "—"}）。`}<a href="/backup" data-astro-cid-j7pv25f6>今すぐバックアップ</a></div>`} </section> ${sections.map((sec) => sec === "summary" ? renderTemplate`<section data-sec="summary" data-astro-cid-j7pv25f6> <div class="grid" data-astro-cid-j7pv25f6> <a class="card link" href="/accounting" data-astro-cid-j7pv25f6><div class="label" data-astro-cid-j7pv25f6>口座残高（期首合計）</div><div class="num" data-astro-cid-j7pv25f6>${yen(balance)}</div></a> <a class="card link" href="/accounting" data-astro-cid-j7pv25f6><div class="label" data-astro-cid-j7pv25f6>当月収支（${ym}）</div><div class="num"${addAttribute(`color:${monthNet < 0 ? "var(--danger)" : monthNet > 0 ? "var(--ok)" : "inherit"}`, "style")} data-astro-cid-j7pv25f6>${(monthNet < 0 ? "-¥" : "¥") + Math.abs(monthNet).toLocaleString("ja-JP")}</div><div class="muted" style="font-size:.78rem" data-astro-cid-j7pv25f6>収入 ${yen(monthIncome)}／支出 ${yen(monthExpense)}</div></a> <a class="card link" href="/review" data-astro-cid-j7pv25f6><div class="label" data-astro-cid-j7pv25f6>未処理伝票（承認待ち）</div><div class="num" data-astro-cid-j7pv25f6>${pendingCount}</div><div class="muted" style="font-size:.78rem" data-astro-cid-j7pv25f6>${pendingCount > 0 ? "確認してください" : "なし"}</div></a> <div class="card" data-astro-cid-j7pv25f6><div class="label" data-astro-cid-j7pv25f6>プラン / ライセンス</div><div class="num" style="font-size:1.1rem" data-astro-cid-j7pv25f6>${planLabel(entitlement)}</div></div> </div> </section>` : sec === "widgets" ? widgetData.length > 0 && renderTemplate`<section data-sec="widgets" data-astro-cid-j7pv25f6> <h2 data-astro-cid-j7pv25f6>アプリの状況</h2> <div class="grid wgrid" data-astro-cid-j7pv25f6> ${widgetData.map((w) => renderTemplate`<div class="card"${addAttribute(`grid-column:span ${clampSpan(w.span)}`, "style")} data-astro-cid-j7pv25f6><div class="label" data-astro-cid-j7pv25f6>${w.title}</div><div class="num" data-astro-cid-j7pv25f6>${w.value}</div>${w.sub && renderTemplate`<div class="muted" style="font-size:.82rem" data-astro-cid-j7pv25f6>${w.sub}</div>`}</div>`)} </div> </section>` : sec === "storage" ? renderTemplate`<section data-sec="storage" data-astro-cid-j7pv25f6> <h2 data-astro-cid-j7pv25f6>保存できる容量</h2> ${totalPct >= 80 && renderTemplate`<div class="banner banner-warn" data-astro-cid-j7pv25f6>⚠️ 保存できる容量が残りわずかです（${totalPct}% 使用）。${isOrgAdmin ? "下の「内訳」から拡張をご検討ください。" : "管理者にご相談ください。"}</div>`} <div class="card" data-astro-cid-j7pv25f6> <div class="label" data-astro-cid-j7pv25f6>いまの使用状況</div> <div class="gauge" data-astro-cid-j7pv25f6><div${addAttribute(`gfill ${totalPct >= 80 ? "hot" : ""}`, "class")}${addAttribute(`width:${totalPct}%`, "style")} data-astro-cid-j7pv25f6></div></div> <div class="muted" style="margin-top:6px" data-astro-cid-j7pv25f6>${totalLimit > 0 ? `${fmtBytes(totalUsed)} / ${fmtBytes(totalLimit)}（${totalPct}%）` : "計測中"}</div> </div> ${isOrgAdmin && renderTemplate`<div class="card" style="margin-top:.6rem" data-astro-cid-j7pv25f6> <div class="label" data-astro-cid-j7pv25f6>通信量（保存・更新の回数）${kvPct >= 80 && renderTemplate`<span class="muted" style="font-weight:400" data-astro-cid-j7pv25f6> ⚠️ 残りわずか</span>`}</div> <div class="gauge" data-astro-cid-j7pv25f6><div${addAttribute(`gfill ${kvPct >= 80 ? "hot" : ""}`, "class")}${addAttribute(`width:${kvPct}%`, "style")} data-astro-cid-j7pv25f6></div></div> <div class="muted" style="margin-top:6px" data-astro-cid-j7pv25f6>本日 ${kvWrites.toLocaleString()} / ${KV_WRITE_FREE_LIMIT.toLocaleString()} 回（${kvPct}%）・毎日UTC0時にリセット ・ <a href="/usage" data-astro-cid-j7pv25f6>使用量を見る</a></div> </div>`} ${isOrgAdmin && renderTemplate`<details class="adv" data-astro-cid-j7pv25f6> <summary data-astro-cid-j7pv25f6>保存容量の内訳・拡張（管理者向け）</summary> <p class="adv-note" data-astro-cid-j7pv25f6>保存先ごとの内訳です。容量の拡張・外部ストレージの有効化はこちらから行えます。</p> <div class="grid" data-astro-cid-j7pv25f6> ${storage.map((s) => renderTemplate`<div class="card" data-astro-cid-j7pv25f6> <div class="label" data-astro-cid-j7pv25f6>${s.label}${!s.enabled && (s.key === "r2" ? "（未使用）" : s.key === "drive" ? "（未連携）" : "")}</div> <div class="gauge" data-astro-cid-j7pv25f6><div${addAttribute(`gfill ${pct(s.used, s.limit) >= 80 ? "hot" : ""}`, "class")}${addAttribute(`width:${pct(s.used, s.limit)}%`, "style")} data-astro-cid-j7pv25f6></div></div> <div class="muted" style="font-size:.85rem;margin-top:4px" data-astro-cid-j7pv25f6>${s.used < 0 ? "計測不可" : `${fmtBytes(s.used)} / ${fmtBytes(s.limit)}（${pct(s.used, s.limit)}%）`}</div> ${(s.hint === "paid" || s.hint === "r2") && renderTemplate`<div class="muted" style="font-size:.85rem;margin-top:2px" data-astro-cid-j7pv25f6><a href="/settings/advanced" data-astro-cid-j7pv25f6>${s.hint === "r2" ? "外部ストレージを有効化" : "容量プランを拡張"}</a></div>`} ${s.key === "drive" && !s.enabled && renderTemplate`<div class="muted" style="font-size:.85rem;margin-top:2px" data-astro-cid-j7pv25f6><a href="/drive" data-astro-cid-j7pv25f6>連携する</a></div>`} </div>`)} </div> </details>`} </section>` : sec === "quicklinks" ? renderTemplate`<section data-sec="quicklinks" data-astro-cid-j7pv25f6> <h2 data-astro-cid-j7pv25f6>そのほかの機能</h2> <div class="grid" data-astro-cid-j7pv25f6> <a class="card" href="/files" style="text-decoration:none;color:inherit" data-astro-cid-j7pv25f6><strong data-astro-cid-j7pv25f6>ファイル</strong><div class="muted" data-astro-cid-j7pv25f6>アップロード・共有</div></a> <a class="card" href="/minutes" style="text-decoration:none;color:inherit" data-astro-cid-j7pv25f6><strong data-astro-cid-j7pv25f6>議事録</strong><div class="muted" data-astro-cid-j7pv25f6>作成・一覧</div></a> <a class="card" href="/apps" style="text-decoration:none;color:inherit" data-astro-cid-j7pv25f6><strong data-astro-cid-j7pv25f6>アプリ</strong><div class="muted" data-astro-cid-j7pv25f6>機能の追加</div></a> <a class="card" href="/settings" style="text-decoration:none;color:inherit" data-astro-cid-j7pv25f6><strong data-astro-cid-j7pv25f6>設定</strong><div class="muted" data-astro-cid-j7pv25f6>表示・アカウント</div></a> </div> </section>` : null)}${isOrgAdmin && renderTemplate`<div class="modal" id="homeModal" data-astro-cid-j7pv25f6><div class="box" data-astro-cid-j7pv25f6> <h2 style="margin-top:0;border:0" data-astro-cid-j7pv25f6>ホームの表示を編集</h2> <p class="muted" style="font-size:.85rem" data-astro-cid-j7pv25f6>セクションの表示/非表示と並び順を変更します（お知らせは固定）。</p> <div id="secList" class="sec-list" data-astro-cid-j7pv25f6> ${HOME_SECTIONS.map((s) => renderTemplate`<div class="sec-row"${addAttribute(s.id, "data-id")} data-astro-cid-j7pv25f6> <label style="flex:1" data-astro-cid-j7pv25f6><input type="checkbox" class="sec-on"${addAttribute(!hiddenSet.has(s.id), "checked")} data-astro-cid-j7pv25f6> ${s.label}</label> <button class="btn btn-sm sec-up" title="上へ" data-astro-cid-j7pv25f6>↑</button> <button class="btn btn-sm sec-down" title="下へ" data-astro-cid-j7pv25f6>↓</button> </div>`)} </div> <div class="row" style="margin-top:1rem" data-astro-cid-j7pv25f6> <button class="btn btn-primary" id="saveHome" style="flex:1" data-astro-cid-j7pv25f6>保存</button> <button class="btn btn-ghost" id="closeHome" style="flex:0 0 auto" data-astro-cid-j7pv25f6>閉じる</button> </div> </div></div>`}<div class="modal" id="critModal" data-astro-cid-j7pv25f6><div class="box" data-astro-cid-j7pv25f6><h2 style="margin-top:0;border:0" data-astro-cid-j7pv25f6>重要なお知らせ</h2><div id="critBody" data-astro-cid-j7pv25f6></div><button class="btn btn-primary" id="critAck" style="margin-top:1rem" data-astro-cid-j7pv25f6>確認しました</button></div></div>   `, "scripts": async ($$result2) => renderTemplate(_a || (_a = __template([`<script>
    (function () {
      // 重要なお知らせの確認モーダル。
      const crit = [...document.querySelectorAll('.banner[data-sev="critical"]')].filter((n) => !localStorage.getItem("ack:" + n.dataset.id));
      if (crit.length) {
        const m = document.getElementById("critModal");
        document.getElementById("critBody").innerHTML = crit.map((n) => "<p>" + n.textContent + "</p>").join("");
        m.classList.add("open");
        document.getElementById("critAck").onclick = () => { crit.forEach((n) => localStorage.setItem("ack:" + n.dataset.id, "1")); m.classList.remove("open"); window.bo.toast("確認しました"); };
      }
      // ホーム編集（管理者のみ要素が存在）。
      const edit = document.getElementById("editHome");
      const modal = document.getElementById("homeModal");
      if (edit && modal) {
        const list = document.getElementById("secList");
        const refresh = () => list.querySelectorAll(".sec-row").forEach((r) => r.classList.toggle("off", !r.querySelector(".sec-on").checked));
        edit.addEventListener("click", () => { modal.classList.add("open"); refresh(); });
        document.getElementById("closeHome")?.addEventListener("click", () => modal.classList.remove("open"));
        list.querySelectorAll(".sec-row").forEach((row) => {
          row.querySelector(".sec-on")?.addEventListener("change", refresh);
          row.querySelector(".sec-up")?.addEventListener("click", () => { const p = row.previousElementSibling; if (p) list.insertBefore(row, p); });
          row.querySelector(".sec-down")?.addEventListener("click", () => { const n = row.nextElementSibling; if (n) list.insertBefore(n, row); });
        });
        document.getElementById("saveHome")?.addEventListener("click", async (e) => {
          const rows = [...list.querySelectorAll(".sec-row")];
          const order = rows.map((r) => r.dataset.id);
          const hidden = rows.filter((r) => !r.querySelector(".sec-on").checked).map((r) => r.dataset.id);
          const r = await window.bo.api("/api/settings", { _action: "home_layout", layout: { order, hidden } }, { btn: e.currentTarget, successMsg: "ホームの表示を保存しました" });
          if (r.ok) setTimeout(() => location.reload(), 600);
        });
      }
    })();
  <\/script>`]))) })}`;
}, "/home/runner/work/baku-office/baku-office/apps/client/src/pages/index.astro", void 0);
const $$file = "/home/runner/work/baku-office/baku-office/apps/client/src/pages/index.astro";
const $$url = "";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};

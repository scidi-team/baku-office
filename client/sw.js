// baku-office 最小 Service Worker（PWA：インストール可能化＋オフライン時のフォールバック）。
// WHY 安全設計：業務データ・認証ページは絶対にキャッシュしない（古い内容や他人のセッションを出さないため）。
//   静的アセット（/_astro/・アイコン）だけ stale-while-revalidate で速くする。ページ遷移はネット優先で、
//   失敗時のみオフライン用の簡易HTMLを返す。
const STATIC = "baku-static-v1";
const OFFLINE_HTML =
  '<!doctype html><html lang="ja"><meta charset="utf-8">' +
  '<meta name="viewport" content="width=device-width,initial-scale=1"><title>オフライン</title>' +
  '<div style="max-width:480px;margin:18vh auto;padding:24px;font-family:system-ui,-apple-system,sans-serif;line-height:1.9;color:#0E1A2B;text-align:center">' +
  '<h1 style="font-size:1.2rem">オフラインです</h1>' +
  "<p>インターネットに接続すると baku-office を利用できます。</p>" +
  '<p><a href="/" style="color:#C9A86A;font-weight:600">再読み込み</a></p></div>';

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

// Web Push（B9）：プッシュ受信→通知表示／クリック→アプリを開く。
self.addEventListener("push", (event) => {
  let data = { title: "baku-office", body: "新しいお知らせがあります", url: "/" };
  try { if (event.data) data = Object.assign(data, event.data.json()); } catch (_) { /* ペイロードなし＝既定文言 */ }
  event.waitUntil(self.registration.showNotification(data.title, { body: data.body, icon: "/mascot/baku.png", badge: "/favicon.svg", data: { url: data.url || "/" } }));
});
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "/";
  event.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((ws) => {
    for (const w of ws) { if ("focus" in w) { w.navigate && w.navigate(url); return w.focus(); } }
    return self.clients.openWindow(url);
  }));
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // 静的アセットのみキャッシュ（stale-while-revalidate）。
  if (url.pathname.startsWith("/_astro/") || url.pathname === "/favicon.svg" || url.pathname.startsWith("/mascot/")) {
    event.respondWith(
      caches.open(STATIC).then(async (cache) => {
        const hit = await cache.match(req);
        const net = fetch(req)
          .then((res) => { if (res.ok) cache.put(req, res.clone()); return res; })
          .catch(() => hit);
        return hit || net;
      }),
    );
    return;
  }

  // ページ遷移はネットワーク優先。失敗時のみオフライン表示（認証/データはキャッシュしない）。
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(() => new Response(OFFLINE_HTML, { headers: { "content-type": "text/html; charset=utf-8" } })),
    );
  }
});

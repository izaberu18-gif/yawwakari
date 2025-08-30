// site-sw.js
// 版本を上げるだけで古いキャッシュを一掃できる
//更新を配りたいときは、この数字を1つ上げる
const CACHE = 'yawwakari-v3';

const ASSETS = [
  './',
  './index.html',
  './css/style.css',
  // 必要に応じて下を追加
  './html/about.html',
  './html/contact.html',
  './images/background.png',
  './images/icon-192.png',
  './images/icon-512.png',
  './images/apple-touch-icon.png',
  './manifest.webmanifest'
];

// インストール時に静的アセットをキャッシュ（キャッシュファースト用）
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

// 古いキャッシュを掃除
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// フェッチ戦略
self.addEventListener('fetch', (e) => {
  const req = e.request;

  // HTML は「ネットワーク優先」：更新が届きやすい
  const isHTML =
    req.mode === 'navigate' ||
    (req.headers.get('accept') || '').includes('text/html');

  if (isHTML) {
    e.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // それ以外（CSS/画像/JS）は「キャッシュ優先」
  e.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy));
      return res;
    }))
  );
});

const CACHE = 'yawwakari-v6'; // ← バージョン上げる
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './images/background.png',   // ← ここを background.png に統一
  './images/icon-192.png',
  './images/icon-512.png',
  './images/apple-touch-icon.png',
  './manifest.webmanifest'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});

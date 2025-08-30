const CACHE = 'yawwakari-v3';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './images/background.jpg', // 背景をキャッシュしたいなら
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

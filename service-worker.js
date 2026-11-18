const CACHE_NAME = 'cat-game-touch-v1';
const CORE_ASSETS = [
  './',
  './index.html',
  './style.css',
  './manifest.json',
  './images/icon-192.png',
  './images/icon-512.png',
  './images/cat-sprite-clean.png',
  './js/audio.js',
  './js/particles.js',
  './js/art.js',
  './js/cat.js',
  './js/level1.js',
  './js/level2.js',
  './js/level3.js',
  './js/level4.js',
  './js/level5.js',
  './js/level6.js',
  './js/level7.js',
  './js/level8.js',
  './js/game.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  // Skip partial range requests (e.g. MP4 video streaming)
  if (req.headers.get('range')) return;

  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req))
  );
});

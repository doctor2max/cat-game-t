const CACHE_NAME = 'cat-game-touch-v17';
const CORE_ASSETS = [
  './',
  './index.html',
  './style.css?v=16',
  './manifest.json',
  './images/icon-192.png',
  './images/icon-512.png',
  './images/cat-sprite-clean.png',
  './images/image-crown-clean.png',
  './images/image-scarf-clean.png',
  './images/image-glass-clean.png',
  './images/image-wings-clean.png',
  './sounds/save-point.wav',
  './js/store.js?v=14',
  './js/audio.js?v=15',
  './js/particles.js?v=5',
  './js/art.js?v=10',
  './js/art-extended.js?v=13',
  './js/enemies-extended.js?v=10',
  './js/cat-procedural.js?v=17',
  './js/cat.js?v=15',
  './js/level1.js?v=5',
  './js/level2.js?v=5',
  './js/level3.js?v=11',
  './js/level4.js?v=5',
  './js/level5.js?v=5',
  './js/level6.js?v=5',
  './js/level7.js?v=5',
  './js/level8.js?v=5',
  './js/level9.js?v=5',
  './js/level10.js?v=5',
  './js/level11.js?v=5',
  './js/level12.js?v=5',
  './js/level13.js?v=5',
  './js/level14.js?v=5',
  './js/level15.js?v=9',
  './js/game.js?v=15'
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

const CACHE_NAME = 'cat-game-touch-v163';
const CORE_ASSETS = [
  './',
  './index.html',
  './style.css?v=24',
  './manifest.json',
  './images/icon-192.png',
  './images/icon-512.png',
  './sounds/Cat.wav',
  './sounds/cat-damage.wav',
  './sounds/Dog.wav',
  './sounds/Lion.wav',
  './sounds/save-point.wav',
  './js/i18n.js?v=41',
  './js/store.js?v=45',
  './js/audio.js?v=34',
  './js/particles.js?v=18',
  './js/art.js?v=23',
  './js/art-extended.js?v=130',
  './js/enemies-extended.js?v=54',
  './js/cat-procedural.js?v=47',
  './js/cat.js?v=58',
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
  './js/level16.js?v=3',
  './js/level17.js?v=2',
  './js/level18.js?v=5',
  './js/level19.js?v=5',
  './js/level20.js?v=3',
  './js/level21.js?v=2',
  './js/level22.js?v=3',
  './js/level23.js?v=1',
  './js/level24.js?v=5',
  './js/level25.js?v=4',
  './js/level26.js?v=10',
  './js/level27.js?v=2',
  './js/game.js?v=57'
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

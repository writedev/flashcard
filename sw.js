/* Service worker : permet d'utiliser l'application hors ligne.
   Tous les chemins sont relatifs : ça marche sous https://user.github.io/depot/.
   Après chaque déploiement, incrémente VERSION pour forcer la mise à jour du cache. */
const VERSION = "v1";
const CACHE = "flashcards-" + VERSION;
const PRECACHE = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "assets/fuse.min.js",
  "assets/fonts/fraunces-latin-600-normal.woff2",
  "assets/fonts/fraunces-latin-700-normal.woff2",
  "assets/fonts/manrope-latin-500-normal.woff2",
  "assets/fonts/manrope-latin-700-normal.woff2",
  "assets/fonts/jetbrains-mono-latin-400-normal.woff2",
  "assets/fonts/jetbrains-mono-latin-600-normal.woff2",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/maskable-512.png",
  "icons/apple-touch-icon.png",
  "icons/favicon-32.png"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith("flashcards-") && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  // Pages : réseau d'abord (contenu à jour), cache si hors ligne.
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put("index.html", copy));
          return res;
        })
        .catch(() => caches.match("index.html").then(r => r || caches.match("./")))
    );
    return;
  }

  // Ressources : cache d'abord, puis réseau (et mise en cache).
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res && res.ok) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
      }
      return res;
    }))
  );
});

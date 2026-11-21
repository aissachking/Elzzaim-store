/* cache léger : fichiers statiques seulement, l'API reste toujours en ligne */
const C = "elz-v1";
const CORE = ["/", "/style.css", "/app.js", "/img/logo.png", "/fonts/cairo-arabic-400-normal.woff2", "/fonts/cairo-arabic-900-normal.woff2"];
self.addEventListener("install", e => { e.waitUntil(caches.open(C).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin || u.pathname.startsWith("/api") || u.pathname.startsWith("/admin")) return;
  if (/\.(woff2|webp|png|jpg)$/.test(u.pathname) || u.pathname.startsWith("/img/")) {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => { if (res.ok) { const cl = res.clone(); caches.open(C).then(c => c.put(e.request, cl)); } return res; })));
  } else {
    e.respondWith(fetch(e.request).then(res => { if (res.ok) { const cl = res.clone(); caches.open(C).then(c => c.put(e.request, cl)); } return res; }).catch(() => caches.match(e.request).then(r => r || caches.match("/"))));
  }
});

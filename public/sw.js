self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // PWA requiere un handler de 'fetch' para ser considerada instalable.
  // Simplemente pasamos la solicitud a la red para mantener funcionalidad estándar.
  event.respondWith(fetch(event.request));
});

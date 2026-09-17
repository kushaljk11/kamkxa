const CACHE_NAME = 'gotaskmanager-cache-v1';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
];

// Install: pre-cache application shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Network first for navigation & APIs; Cache first / stale-while-revalidate for static assets
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Skip cross-origin requests (e.g. backend API on different domain)
  if (url.origin !== self.location.origin) return;

  // Skip local API calls
  if (url.pathname.startsWith('/api')) return;

  // SPA navigation fallback to cached index.html when offline
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(async () => {
        const cached = await caches.match('/index.html');
        return cached || new Response('Offline', { status: 503, statusText: 'Offline' });
      })
    );
    return;
  }

  // Static assets: cache-first with network refresh
  event.respondWith(
    caches.match(request).then(async (cachedResponse) => {
      if (cachedResponse) {
        // Fetch background update for cache
        fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, networkResponse.clone());
              });
            }
          })
          .catch(() => {});
        return cachedResponse;
      }

      try {
        const response = await fetch(request);
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return response;
      } catch (err) {
        // Fallback for image/icon requests if offline
        if (request.destination === 'image') {
          const iconFallback = await caches.match('/icon.svg');
          if (iconFallback) return iconFallback;
        }
        return new Response('Resource unavailable offline', { status: 503 });
      }
    })
  );
});

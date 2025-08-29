// Basic runtime-caching Service Worker for Vite build outputs
const CACHE_NAME = 'week4-lab-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // Only handle same-origin requests
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(event.request);
        const networkFetch = fetch(event.request)
          .then((response) => {
            // Cache successful responses for future offline use
            if (response && response.status === 200 && response.type === 'basic') {
              cache.put(event.request, response.clone());
            }
            return response;
          })
          .catch(() => {
            // If offline and have a cached version, serve it
            if (cached) return cached;
            // Fallback to index for navigation requests (SPA)
            if (event.request.mode === 'navigate') {
              return cache.match('/index.html');
            }
          });

        // Return cached first, then update in background (stale-while-revalidate)
        return cached || networkFetch;
      })
    );
  }
});

// worker/index.js
/**
 * Kaino Custom Service Worker Extension
 * 
 * Intercepts all page navigation requests.
 * If the Kaino backend server is offline/down (Cloudflare returns 502/521/500 errors)
 * or if the network is completely down, it falls back to the locally cached
 * App shell ('/'), enabling full Local-First / Offline-First operation!
 */

self.addEventListener('fetch', (event) => {
  const request = event.request;

  // We only intercept page navigation requests (e.g., opening '/' or '/lists/[id]')
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // If the network request succeeds but returns a server error status (500, 502, 521, etc.)
          // we treat it as an offline scenario and fallback to the cached app shell!
          if (response.status >= 500) {
            console.log(`[PWA Service Worker] Server error ${response.status} detected. Serving local cached dashboard.`);
            return caches.match('/').then((cachedResponse) => {
              // Fall back to the cached start URL, or return the original error if not cached yet
              return cachedResponse || response;
            });
          }
          return response;
        })
        .catch((error) => {
          // If the network is completely down (completely offline)
          console.log('[PWA Service Worker] Network request failed. Serving local cached dashboard.');
          return caches.match('/').then((cachedResponse) => {
            return cachedResponse || Response.error();
          });
        })
    );
  }
});

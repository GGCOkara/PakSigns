const CACHE_NAME = 'paksigns-cache-v1';
const STATIC_ASSETS = [
    './',
    './index.html',
    './css/index.css',
    './js/index.js',
    './js/db.json',
    './db.json',
    'https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&family=Noto+Sans+Arabic:wght@300;400;500;700&family=Noto+Sans:wght@300;400;500;700&display=swap'
];

// Cache core assets on installation
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Static assets pre-cached.');
            return cache.addAll(STATIC_ASSETS);
        }).then(() => self.skipWaiting())
    );
});

// Clean up old caches on activation
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((name) => {
                    if (name !== CACHE_NAME) {
                        console.log('Clearing old cache:', name);
                        return caches.delete(name);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Stale-While-Revalidate fetch strategy
self.addEventListener('fetch', (event) => {
    const requestUrl = new URL(event.request.url);

    // Focus caching strictly on local application assets and Google Fonts
    if (requestUrl.origin === location.origin || requestUrl.origin.includes('fonts.googleapis.com') || requestUrl.origin.includes('fonts.gstatic.com')) {
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) => {
                return cache.match(event.request).then((cachedResponse) => {
                    const fetchPromise = fetch(event.request).then((networkResponse) => {
                        // Cache a clone of successfully retrieved network assets
                        if (networkResponse.status === 200) {
                            cache.put(event.request, networkResponse.clone());
                        }
                        return networkResponse;
                    }).catch(() => {
                        // Fallback gracefully to cache if offline
                        return cachedResponse;
                    });

                    return cachedResponse || fetchPromise;
                });
            })
        );
    }
});
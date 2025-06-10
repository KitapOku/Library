const CACHE_NAME = 'bibliothek-v1.2.0';
const STATIC_CACHE = 'bibliothek-static-v1.2.0';
const DYNAMIC_CACHE = 'bibliothek-dynamic-v1.2.0';

// Dateien, die beim ersten Laden gecacht werden sollen
const STATIC_FILES = [
  '/',
  '/index.html',
  '/admin.html',
  '/js/app.js',
  '/js/admin.js',
  '/styles/main.css',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css',
  'https://unpkg.com/aos@2.3.1/dist/aos.css',
  'https://unpkg.com/aos@2.3.1/dist/aos.js'
];

// URLs, die nie gecacht werden sollen
const NEVER_CACHE = [
  '/admin.html',
  'https://docs.google.com',
  'https://firebase.google.com',
  'https://www.gstatic.com/firebasejs'
];

self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .catch(error => {
        console.error('Service Worker: Error caching static files:', error);
      })
  );
  // Neue Service Worker Version sofort aktivieren
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Alte Caches löschen
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Service Worker für alle Tabs aktivieren
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Nie zu cachende URLs sofort durchlassen
  if (NEVER_CACHE.some(pattern => url.href.includes(pattern) || url.pathname === pattern)) {
    return;
  }

  // Statische Dateien: Cache First
  if (STATIC_FILES.includes(url.pathname) || STATIC_FILES.includes(url.href)) {
    event.respondWith(
      caches.match(request).then(response => {
        return response || fetch(request);
      })
    );
    return;
  }

  // Dynamische Dateien: Network First mit Fallback auf Cache
  event.respondWith(
    fetch(request)
      .then(networkResponse => {
        return caches.open(DYNAMIC_CACHE).then(cache => {
          cache.put(request, networkResponse.clone());
          return networkResponse;
        });
      })
      .catch(() => {
        return caches.match(request);
      })
  );
});

const CACHE_NAME = 'mamanzen-pwa-cache-v3';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg'
];

// Install Event - Pre-cache Critical App Shell Assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching Critical App Shell & Routes');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean Up Stale Caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Deleting old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Network-First for navigations, Cache-First for hashed assets
self.addEventListener('fetch', (event) => {
  // Only handle GET requests and skip API / WebSocket / extension calls
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  if (
    url.protocol.startsWith('chrome-extension') ||
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/ws') ||
    url.hostname.includes('supabase.co')
  ) {
    return;
  }

  // Navigations: always try network first so new deploys appear immediately.
  // Fall back to cached app shell only when offline.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put('/index.html', responseToCache));
          }
          return networkResponse;
        })
        .catch(() => caches.match('/index.html') || caches.match('/'))
    );
    return;
  }

  // Hashed assets (JS/CSS/fonts/images): stale-while-revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && (networkResponse.type === 'basic' || networkResponse.type === 'cors')) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});

// ==========================================
// BACKGROUND SYNC QUEUE FOR TRACKER DATA
// ==========================================

// Background Sync Event: Triggered automatically by browser when network recovers
self.addEventListener('sync', (event) => {
  console.log('[ServiceWorker] Background Sync Event:', event.tag);
  if (event.tag === 'sync-tracker-logs' || event.tag === 'sync-offline-queue') {
    event.waitUntil(notifyClientsAndSync());
  }
});

// Broadcast sync command to active window clients so they can flush queue with Auth context
async function notifyClientsAndSync() {
  const windowClients = await clients.matchAll({ type: 'window', includeUncontrolled: true });
  for (let client of windowClients) {
    client.postMessage({
      type: 'BACKGROUND_SYNC_TRIGGERED'
    });
  }

  // Show a status notification if permission is granted
  try {
    self.registration.showNotification('🌸 Synchronisation MamanZen', {
      body: 'Réseau rétabli : Vos données de suivi sont en cours de synchronisation.',
      icon: '/icon.svg',
      badge: '/icon.svg',
      tag: 'sync-status-notification'
    });
  } catch (err) {}
}

// ==========================================
// PWA WEB PUSH NOTIFICATIONS & REMINDERS
// ==========================================

// Push Event: Triggered when receiving a remote Web Push message
self.addEventListener('push', (event) => {
  console.log('[ServiceWorker] Push Received:', event);

  let payload = {
    title: 'MamanZen 🌸',
    body: 'Nouveau conseil pour votre grossesse !',
    url: '/dashboard',
    tag: 'mamanzen-reminder'
  };

  if (event.data) {
    try {
      payload = { ...payload, ...event.data.json() };
    } catch (err) {
      payload.body = event.data.text();
    }
  }

  const options = {
    body: payload.body,
    icon: '/icon.svg',
    badge: '/icon.svg',
    vibrate: [100, 50, 100, 50, 100],
    data: {
      url: payload.url || '/dashboard',
      timestamp: Date.now()
    },
    actions: [
      { action: 'open', title: 'Ouvrir MamanZen 🌸' },
      { action: 'close', title: 'Fermer' }
    ],
    tag: payload.tag || 'pregnancy-notification',
    renotify: true
  };

  event.waitUntil(
    self.registration.showNotification(payload.title, options)
  );
});

// Notification Click Event: Navigate to app tab or specific view when clicked
self.addEventListener('notificationclick', (event) => {
  console.log('[ServiceWorker] Notification click:', event.notification);
  event.notification.close();

  if (event.action === 'close') return;

  const targetUrl = (event.notification.data && event.notification.data.url) || '/dashboard';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // If a tab is already open, focus and navigate it
      for (let client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          if ('navigate' in client) {
            client.navigate(targetUrl);
          }
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// Message Event: Listen to app commands for push tests or sync notifications
self.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.type === 'SHOW_PUSH_NOTIFICATION') {
    const { title, body, url, tag } = event.data;
    self.registration.showNotification(title || 'MamanZen 🌸', {
      body: body || 'Rappel de votre suivi de grossesse',
      icon: '/icon.svg',
      badge: '/icon.svg',
      vibrate: [100, 50, 100],
      data: { url: url || '/dashboard' },
      tag: tag || 'local-push-test',
      renotify: true
    });
  } else if (event.data.type === 'SYNC_QUEUE_UPDATED') {
    console.log(`[ServiceWorker] Client reports ${event.data.count} items in offline sync queue`);
  }
});

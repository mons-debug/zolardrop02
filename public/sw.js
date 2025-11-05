// Service Worker for Push Notifications
const CACHE_NAME = 'zolar-v1'
const urlsToCache = [
  '/',
  '/admin',
  '/icon-192x192.png',
  '/icon-512x512.png'
]

// Install service worker
self.addEventListener('install', (event) => {
  console.log('✅ Service Worker: Installing...')
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Service Worker: Caching files')
        return cache.addAll(urlsToCache)
      })
      .catch(err => console.log('Cache error:', err))
  )
  self.skipWaiting()
})

// Activate service worker
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker: Activated')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Service Worker: Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  return self.clients.claim()
})

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request)
      })
      .catch(() => {
        // Return offline page if available
        return caches.match('/')
      })
  )
})

// Push notification event
self.addEventListener('push', (event) => {
  console.log('📬 Push notification received:', event)
  
  let data = {
    title: 'New Order Received! 🎉',
    body: 'You have a new order',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    tag: 'order-notification',
    requireInteraction: true,
    data: {
      url: '/admin/orders'
    }
  }

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() }
    } catch (e) {
      console.error('Error parsing push data:', e)
    }
  }

  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    tag: data.tag,
    requireInteraction: data.requireInteraction,
    vibrate: [200, 100, 200, 100, 200],
    data: data.data,
    actions: [
      {
        action: 'view',
        title: 'View Order',
        icon: '/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-192x192.png'
      }
    ]
  }

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
})

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Notification clicked:', event)
  
  event.notification.close()

  if (event.action === 'view' || !event.action) {
    const urlToOpen = event.notification.data?.url || '/admin/orders'
    
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientList) => {
          // Check if there's already a window open
          for (let i = 0; i < clientList.length; i++) {
            const client = clientList[i]
            if (client.url === urlToOpen && 'focus' in client) {
              return client.focus()
            }
          }
          // If no window is open, open a new one
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen)
          }
        })
    )
  }
})

// Background sync event (for offline support)
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync:', event.tag)
  
  if (event.tag === 'sync-orders') {
    event.waitUntil(
      // Sync logic here
      fetch('/api/admin/orders')
        .then(response => response.json())
        .then(data => {
          console.log('✅ Synced orders:', data)
        })
        .catch(err => {
          console.error('❌ Sync failed:', err)
        })
    )
  }
})

// Message event (for communication with main app)
self.addEventListener('message', (event) => {
  console.log('📨 Message received:', event.data)
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

console.log('🚀 Service Worker loaded successfully!')


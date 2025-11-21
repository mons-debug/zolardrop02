// Service Worker for Push Notifications
const CACHE_NAME = 'zolar-admin-v1'

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...')
  self.skipWaiting()
})

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    })
  )
  return self.clients.claim()
})

// Push notification event
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event)
  
  let data = {
    title: 'Zolar Admin',
    body: 'New notification',
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    tag: 'default',
    requireInteraction: true,
    vibrate: [200, 100, 200, 100, 200], // Longer vibration pattern
    silent: false, // Ensure notification is NOT silent
    data: {
      url: '/admin'
    }
  }

  if (event.data) {
    try {
      const payload = event.data.json()
      data = {
        ...data,
        ...payload,
        data: {
          url: payload.url || '/admin',
          orderId: payload.orderId
        }
      }
    } catch (e) {
      console.error('Failed to parse push data:', e)
      data.body = event.data.text()
    }
  }

  event.waitUntil(
    // Always show notification, even if app is open
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: data.badge,
      tag: data.tag,
      requireInteraction: data.requireInteraction,
      vibrate: data.vibrate,
      silent: false, // Play system sound
      data: data.data,
      actions: [
        {
          action: 'view',
          title: 'View Order',
          icon: '/icon-72x72.png'
        },
        {
          action: 'close',
          title: 'Dismiss'
        }
      ]
    }).then(() => {
      // Send message to all open clients (for in-app notification + sound)
      return self.clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then(clients => {
          clients.forEach(client => {
            client.postMessage({
              type: 'NEW_ORDER_NOTIFICATION',
              data: data
            })
          })
        })
    })
  )
})

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event)
  
  event.notification.close()
  
  if (event.action === 'close') {
    return
  }

  const urlToOpen = event.notification.data?.url || '/admin'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window open
        for (const client of clientList) {
          if (client.url.includes('/admin') && 'focus' in client) {
            return client.focus().then(client => {
              // Send message to navigate to specific URL
              return client.postMessage({
                type: 'NAVIGATE',
                url: urlToOpen
              })
            })
          }
        }
        // If no window is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen)
        }
      })
  )
})

// Message event - handle messages from clients
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data)
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

// Background sync for offline functionality (future enhancement)
self.addEventListener('sync', (event) => {
  console.log('Background sync event:', event.tag)
  
  if (event.tag === 'sync-orders') {
    event.waitUntil(
      // Sync orders when back online
      fetch('/api/admin/orders')
        .then(response => response.json())
        .then(data => {
          // Notify clients about updated data
          return self.clients.matchAll({ type: 'window' })
            .then(clients => {
              clients.forEach(client => {
                client.postMessage({
                  type: 'ORDERS_SYNCED',
                  data: data
                })
              })
            })
        })
        .catch(err => console.error('Sync failed:', err))
    )
  }
})

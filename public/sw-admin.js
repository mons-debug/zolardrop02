// Admin Service Worker for Push Notifications

self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim())
})

// Handle push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return

  try {
    const data = event.data.json()
    const title = data.title || 'Zolar Admin'
    const options = {
      body: data.message || data.body,
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      data: data.data || {},
      tag: data.tag || 'admin-notification',
      requireInteraction: true,
      actions: [
        {
          action: 'view',
          title: 'View'
        },
        {
          action: 'dismiss',
          title: 'Dismiss'
        }
      ]
    }

    event.waitUntil(
      self.registration.showNotification(title, options)
    )
  } catch (error) {
    // Silently handle error
  }
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'dismiss') {
    return
  }

  // Open or focus the admin panel
  const urlToOpen = event.notification.data?.url || '/zr-control-2024'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        // Check if there's already a window open
        for (let client of windowClients) {
          if (client.url.includes('/zr-control-2024') && 'focus' in client) {
            return client.focus().then(() => {
              if ('navigate' in client) {
                return client.navigate(urlToOpen)
              }
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


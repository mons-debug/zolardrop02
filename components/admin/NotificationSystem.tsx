'use client'

import { useEffect, useState, useRef } from 'react'
import { pusherClient } from '@/lib/pusher-client'

interface Notification {
  id: string
  title: string
  message: string
  type: 'success' | 'info' | 'warning' | 'error'
  timestamp: Date
  read: boolean
  data?: any
}

interface NotificationSystemProps {
  userId: string
  onNewOrder?: (data: any) => void
}

export default function NotificationSystem({ userId, onNewOrder }: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [pushEnabled, setPushEnabled] = useState(false)
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false)
  const [pusherConnected, setPusherConnected] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [showSoundPrompt, setShowSoundPrompt] = useState(false)
  const audioRef = useRef<any>(null)

  // Check push notification support and permission
  useEffect(() => {
    if ('Notification' in window) {
      setPushEnabled(Notification.permission === 'granted')
      
      // Show permission prompt if not decided yet
      if (Notification.permission === 'default') {
        setTimeout(() => setShowPermissionPrompt(true), 3000)
      }
    }

    // Check if sound was previously enabled
    const soundPref = localStorage.getItem('zolar-sound-enabled')
    if (soundPref === 'true') {
      setSoundEnabled(true)
    } else {
      // Show sound prompt after a delay
      setTimeout(() => setShowSoundPrompt(true), 5000)
    }
  }, [])

  // Monitor Pusher connection state
  useEffect(() => {
    console.log('🔌 Setting up Pusher connection monitoring...')
    
    const handleConnected = () => {
      console.log('✅ Pusher connected!')
      setPusherConnected(true)
    }

    const handleDisconnected = () => {
      console.warn('⚠️ Pusher disconnected')
      setPusherConnected(false)
    }

    const handleError = (err: any) => {
      console.error('❌ Pusher connection error:', err)
      setPusherConnected(false)
    }

    pusherClient.connection.bind('connected', handleConnected)
    pusherClient.connection.bind('disconnected', handleDisconnected)
    pusherClient.connection.bind('error', handleError)

    // Check initial state
    if (pusherClient.connection.state === 'connected') {
      setPusherConnected(true)
    }

    return () => {
      pusherClient.connection.unbind('connected', handleConnected)
      pusherClient.connection.unbind('disconnected', handleDisconnected)
      pusherClient.connection.unbind('error', handleError)
    }
  }, [])

  // Initialize audio for notifications - Cash register "cha-ching" sale sound
  useEffect(() => {
    // Cash register sale sound for desktop notifications
    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGe+7+ilTQ0OUKXh8LZkHAU7k9jxy3grBSF1yPLaizsKFFyz6OyrWBELTKXh8bllHgU7ldnyy3YqBRtusunppmERDVGl4PG2ZRsEPJPX88p3KwUdd8rx2oo4CAReturqpmMQDFGj4PC0ZBwFOpTZ88p5LAQYb7Ls6KpfEgtOouDxtWYdBTqV2/HLdywFGG+17.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')
    audioRef.current.volume = 0.7 // Louder for desktop sale notifications
    console.log('🔊 Audio initialized for notifications')
  }, [])

  // Enable sound on user interaction
  const enableSound = () => {
    setSoundEnabled(true)
    setShowSoundPrompt(false)
    localStorage.setItem('zolar-sound-enabled', 'true')
    console.log('🔊 Sound enabled for notifications')
    
    // Test play
    if (audioRef.current) {
      audioRef.current.play().catch((err: any) => {
        console.warn('Could not test play audio:', err)
      })
    }
  }

  // Listen for real-time orders via Pusher
  useEffect(() => {
    console.log('📡 Subscribing to Pusher channel: admin-orders')
    const channel = pusherClient.subscribe('admin-orders')

    channel.bind('pusher:subscription_succeeded', () => {
      console.log('✅ Successfully subscribed to admin-orders channel')
    })

    channel.bind('pusher:subscription_error', (error: any) => {
      console.error('❌ Failed to subscribe to admin-orders:', error)
    })

    channel.bind('new-order', (data: any) => {
      console.log('🎉 NEW ORDER received via Pusher:', data)
      
      // Extract customer info from data
      const customerName = data.customer?.name || data.customer || 'Customer'
      const customerPhone = data.customer?.phone || ''
      const customerCity = data.customer?.city || ''
      const loyaltyBadge = data.customer?.totalOrders >= 10 ? '👑' : 
                          data.customer?.totalOrders >= 5 ? '💎' : 
                          data.customer?.totalOrders >= 2 ? '⭐' : '🆕'
      
      // Create notification
      const notification: Notification = {
        id: data.id || Date.now().toString(),
        title: `${loyaltyBadge} New Order from ${customerName}`,
        message: `${customerPhone} • ${customerCity ? customerCity + ' • ' : ''}${formatPrice(data.totalCents || 0)}`,
        type: 'success',
        timestamp: new Date(),
        read: false,
        data
      }

      setNotifications(prev => [notification, ...prev])

      // Play sound if enabled
      if (soundEnabled && audioRef.current) {
        console.log('🔊 Playing notification sound...')
        audioRef.current.play().catch((err: any) => {
          console.warn('⚠️ Could not play notification sound (user interaction may be required):', err)
          setShowSoundPrompt(true)
        })
      } else if (!soundEnabled) {
        console.log('🔇 Sound is disabled. Showing sound prompt...')
        setShowSoundPrompt(true)
      }

      // Show browser notification if permission granted
      if (pushEnabled && 'Notification' in window && Notification.permission === 'granted') {
        const browserNotification = new Notification(notification.title, {
          body: notification.message,
          icon: '/icon-192x192.png',
          badge: '/icon-192x192.png',
          tag: 'order-' + notification.id,
          requireInteraction: true,
          vibrate: [200, 100, 200]
        })

        browserNotification.onclick = () => {
          window.focus()
          browserNotification.close()
        }
      }

      // Callback to parent component
      if (onNewOrder) {
        onNewOrder(data)
      }

      // Dispatch custom event for other components to listen
      const customEvent = new CustomEvent('new-order-event', { detail: data })
      window.dispatchEvent(customEvent)
    })

    // Listen for low stock alerts
    channel.bind('low-stock', (data: any) => {
      console.log('⚠️ LOW STOCK alert received via Pusher:', data)
      const notification: Notification = {
        id: 'stock-' + (data.id || Date.now().toString()),
        title: '⚠️ Low Stock Alert',
        message: data.message || `${data.productTitle} (${data.variantColor}) - Only ${data.stock} left`,
        type: 'warning',
        timestamp: new Date(),
        read: false,
        data
      }

      setNotifications(prev => [notification, ...prev])

      // Show browser notification
      if (pushEnabled && 'Notification' in window && Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/icon-192x192.png',
          tag: 'stock-' + data.id
        })
      }
    })

    return () => {
      console.log('🔌 Unsubscribing from Pusher channel: admin-orders')
      channel.unbind('new-order')
      channel.unbind('low-stock')
      channel.unbind('pusher:subscription_succeeded')
      channel.unbind('pusher:subscription_error')
      pusherClient.unsubscribe('admin-orders')
    }
  }, [pushEnabled, soundEnabled, onNewOrder])

  // Request push notification permission
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      setPushEnabled(permission === 'granted')
      setShowPermissionPrompt(false)

      if (permission === 'granted') {
        // Register service worker and subscribe to push
        registerPushNotification()
        
        // Show success notification
        new Notification('Notifications Enabled! 🎉', {
          body: 'You will now receive real-time order notifications',
          icon: '/icon-192x192.png'
        })
      }
    }
  }

  // Register push notification with service worker  
  const registerPushNotification = async () => {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready
        
        // Check if push is supported
        if ('PushManager' in window) {
          // Subscribe to push notifications
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(
              process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
            )
          })

          // Send subscription to server
          await fetch('/api/admin/push-subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              subscription,
              userId 
            })
          })

          console.log('✅ Push notification registered')
        }
      }
    } catch (error) {
      console.error('Failed to register push notification:', error)
    }
  }

  // Helper function to convert VAPID key
  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  const formatPrice = (cents: number) => {
    return `${(cents / 100).toFixed(2)} MAD`
  }

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    )
  }

  const clearAll = () => {
    setNotifications([])
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <>
      {/* Permission Prompt Banner */}
      {showPermissionPrompt && (
        <div className="fixed top-0 left-0 right-0 bg-blue-600 text-white px-6 py-4 z-50 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <div>
                <p className="font-semibold">Enable Push Notifications</p>
                <p className="text-sm opacity-90">Get instant alerts for new orders on your device</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={requestNotificationPermission}
                className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Enable
              </button>
              <button
                onClick={() => setShowPermissionPrompt(false)}
                className="text-white hover:text-blue-100 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sound Enable Prompt Banner */}
      {showSoundPrompt && !soundEnabled && (
        <div className="fixed top-0 left-0 right-0 bg-orange-600 text-white px-6 py-4 z-50 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
              <div>
                <p className="font-semibold">Enable Notification Sound</p>
                <p className="text-sm opacity-90">Click to enable the "cha-ching" sound for new orders</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={enableSound}
                className="bg-white text-orange-600 px-6 py-2 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
              >
                Enable Sound
              </button>
              <button
                onClick={() => setShowSoundPrompt(false)}
                className="text-white hover:text-orange-100 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pusher Connection Status Indicator (in dropdown header) */}

      {/* Notification Bell Icon */}
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Notification Dropdown */}
        {showDropdown && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowDropdown(false)}
            />

            {/* Dropdown Panel */}
            <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-[600px] flex flex-col">
              {/* Header */}
              <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                  <p className="text-xs text-gray-500">
                    {unreadCount} unread
                    {!pushEnabled && (
                      <button
                        onClick={requestNotificationPermission}
                        className="ml-2 text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Enable Push
                      </button>
                    )}
                  </p>
                  {/* Pusher Connection Status */}
                  <div className="flex items-center space-x-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${pusherConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                    <span className={`text-xs ${pusherConnected ? 'text-green-600' : 'text-red-600'}`}>
                      {pusherConnected ? 'Live connection active' : 'Connection unavailable'}
                    </span>
                  </div>
                </div>
                {notifications.length > 0 && (
                  <div className="flex space-x-2">
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Mark all read
                    </button>
                    <button
                      onClick={clearAll}
                      className="text-xs text-gray-600 hover:text-gray-800 font-medium"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>

              {/* Notification List */}
              <div className="flex-1 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <svg className="w-16 h-16 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <p className="text-gray-500 font-medium">No notifications yet</p>
                    <p className="text-sm text-gray-400 mt-1">You'll see new order alerts here</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => markAsRead(notification.id)}
                        className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                          !notification.read ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                            notification.type === 'success' ? 'bg-green-100' :
                            notification.type === 'info' ? 'bg-blue-100' :
                            notification.type === 'warning' ? 'bg-yellow-100' :
                            'bg-red-100'
                          }`}>
                            <svg className={`w-5 h-5 ${
                              notification.type === 'success' ? 'text-green-600' :
                              notification.type === 'info' ? 'text-blue-600' :
                              notification.type === 'warning' ? 'text-yellow-600' :
                              'text-red-600'
                            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900">
                              {notification.title}
                              {!notification.read && (
                                <span className="ml-2 inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                              )}
                            </p>
                            <p className="text-sm text-gray-600 mt-0.5">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {notification.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between text-xs">
                  {pushEnabled && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>Push enabled</span>
                    </div>
                  )}
                  {soundEnabled && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                      <span>Sound enabled</span>
                    </div>
                  )}
                  {!soundEnabled && (
                    <button
                      onClick={enableSound}
                      className="text-orange-600 hover:text-orange-800 font-medium"
                    >
                      Enable Sound
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}


'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { pusherClient } from '@/lib/pusher-client'

interface DbNotification {
  id: string
  type: string
  title: string
  message: string
  data: string | null
  isRead: boolean
  readAt: Date | null
  createdAt: Date
}

interface NotificationSystemProps {
  userId: string
  onNewOrder?: (data: any) => void
}

export default function NotificationSystem({ userId, onNewOrder }: NotificationSystemProps) {
  const router = useRouter()
  const [notifications, setNotifications] = useState<DbNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showDropdown, setShowDropdown] = useState(false)
  const [filter, setFilter] = useState<'all' | 'unread' | 'orders' | 'stock'>('all')
  const [loading, setLoading] = useState(true)
  const [pusherConnected, setPusherConnected] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [showSoundPrompt, setShowSoundPrompt] = useState(false)
  const [pushEnabled, setPushEnabled] = useState(false)
  const [showPushPrompt, setShowPushPrompt] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)
  const swRegistrationRef = useRef<ServiceWorkerRegistration | null>(null)

  // Fetch notifications from database
  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/admin/notifications')
      if (response.ok) {
        const data = await response.json()
        const notifs = data.notifications || []
        const count = data.unreadCount || 0
        
        setNotifications(notifs)
        setUnreadCount(count)
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ Fetched ${notifs.length} notifications (${count} unread)`)
        }
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.error('❌ Failed to fetch notifications:', response.status, response.statusText)
        }
      }
    } catch (error) {
      console.error('❌ Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  // Register Service Worker
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          swRegistrationRef.current = registration
          if (process.env.NODE_ENV === 'development') {
            console.log('✅ Service Worker registered')
          }
          
          // Check if push is already enabled
          registration.pushManager.getSubscription()
            .then(subscription => {
              if (subscription) {
                setPushEnabled(true)
                if (process.env.NODE_ENV === 'development') {
                  console.log('✅ Push notifications already enabled')
                }
              }
            })
        })
        .catch(err => {
          if (process.env.NODE_ENV === 'development') {
            console.error('❌ Service Worker registration failed:', err)
          }
        })
      
      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'NEW_ORDER_NOTIFICATION') {
          // Show in-app notification when app is open
          const notificationData = event.data.data
          
          // Play sound
          if (soundEnabled) {
            playNotificationSound().catch(() => {
              console.log('Sound failed to play')
            })
          }
          
          // Fetch latest notifications to update UI
          fetchNotifications()
          
          // Call parent callback if provided
          if (onNewOrder) {
            onNewOrder(notificationData)
          }
          
          // Dispatch custom event for other components
          const customEvent = new CustomEvent('new-order-event', { detail: notificationData })
          window.dispatchEvent(customEvent)
          
        } else if (event.data.type === 'PLAY_SOUND') {
          if (soundEnabled) {
            playNotificationSound()
          }
        } else if (event.data.type === 'NAVIGATE') {
          router.push(event.data.url)
        }
      })
    }
  }, [soundEnabled, onNewOrder])

  // Initial fetch on mount
  useEffect(() => {
    fetchNotifications()

    // Check if sound was previously enabled
    const soundPref = localStorage.getItem('zolar-sound-enabled')
    if (soundPref === 'true') {
      setSoundEnabled(true)
    } else if (soundPref === null) {
      // Auto-enable sound for push notification users
      if (pushEnabled || localStorage.getItem('zolar-push-prompted') === 'true') {
        setSoundEnabled(true)
        localStorage.setItem('zolar-sound-enabled', 'true')
      } else {
        // Show sound prompt after a delay if not set
        setTimeout(() => {
          if (!soundPref) {
            setShowSoundPrompt(true)
          }
        }, 3000)
      }
    }

    // Check if push should be prompted
    const pushPref = localStorage.getItem('zolar-push-prompted')
    if (!pushPref && 'Notification' in window) {
      setTimeout(() => {
        if (Notification.permission === 'default') {
          setShowPushPrompt(true)
        }
      }, 5000)
    }
  }, [pushEnabled])

  // Monitor Pusher connection
  useEffect(() => {
    const handleConnected = () => {
      setPusherConnected(true)
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Pusher connected')
      }
    }
    
    const handleDisconnected = () => {
      setPusherConnected(false)
      if (process.env.NODE_ENV === 'development') {
        console.log('⚠️ Pusher disconnected')
      }
    }
    
    const handleError = (err: any) => {
      setPusherConnected(false)
      console.error('❌ Pusher connection error:', err)
    }

    pusherClient.connection.bind('connected', handleConnected)
    pusherClient.connection.bind('disconnected', handleDisconnected)
    pusherClient.connection.bind('error', handleError)

    // Check initial state
    if (pusherClient.connection.state === 'connected') {
      setPusherConnected(true)
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Pusher already connected')
      }
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.log('⏳ Pusher connecting...')
      }
    }

    return () => {
      pusherClient.connection.unbind('connected', handleConnected)
      pusherClient.connection.unbind('disconnected', handleDisconnected)
      pusherClient.connection.unbind('error', handleError)
    }
  }, [])

  // Initialize Web Audio Context
  useEffect(() => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      if (AudioContext) {
        audioContextRef.current = new AudioContext()
        // Try to resume immediately (may fail on some browsers until user interaction)
        audioContextRef.current.resume().catch(() => {
          // Will be resumed on user interaction
        })
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to initialize Audio Context:', error)
      }
    }
  }, [])

  // Play cash register sound (cha-ching)
  const playNotificationSound = async () => {
    try {
      // Try using HTML5 Audio first (more reliable across browsers)
      try {
        const audio = new Audio()
        // Create cash register sound using data URI (base64 encoded short cash register sound)
        // Using a simple "cha-ching" sound pattern
        audio.volume = 0.6
        audio.playbackRate = 1.0
        
        // Try cash register sound file first, then fallback to existing notification.mp3, then Web Audio API
        const cashSoundUrl = '/notification-cash.mp3'
        const fallbackSoundUrl = '/notification.mp3'
        
        // Try to load the cash register sound file
        audio.src = cashSoundUrl
        audio.load()
        
        const playPromise = audio.play()
        
        if (playPromise !== undefined) {
          await playPromise.catch(async (error) => {
            // If cash sound file doesn't exist, try fallback notification.mp3
            if (error.name !== 'NotAllowedError' && error.name !== 'NotSupportedError') {
              try {
                audio.src = fallbackSoundUrl
                audio.load()
                const fallbackPromise = audio.play()
                if (fallbackPromise !== undefined) {
                  await fallbackPromise.catch(async () => {
                    // If fallback also fails, generate cash register sound with Web Audio API
                    await playCashRegisterSound()
                  })
                }
              } catch {
                // If fallback fails, use Web Audio API
                await playCashRegisterSound()
              }
            } else {
              // Permission error, fallback to Web Audio API
              await playCashRegisterSound()
            }
          })
        }
      } catch (audioError) {
        // Fallback to Web Audio API if HTML5 Audio fails
        await playCashRegisterSound()
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to play sound:', error)
      }
    }
  }

  // Generate cash register sound using Web Audio API
  const playCashRegisterSound = async () => {
    try {
      if (!audioContextRef.current) {
        // Try to create audio context if it doesn't exist
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext
        if (AudioContext) {
          audioContextRef.current = new AudioContext()
        } else {
          return
        }
      }

      const audioContext = audioContextRef.current
      
      // Resume audio context if suspended (required by browser autoplay policies)
      if (audioContext.state === 'suspended') {
        await audioContext.resume()
      }

      const now = audioContext.currentTime
      
      // Create "cha-ching" cash register sound
      // First "cha" - quick high-pitched sound
      const cha1 = audioContext.createOscillator()
      const gain1 = audioContext.createGain()
      cha1.type = 'sine'
      cha1.frequency.setValueAtTime(800, now)
      cha1.frequency.exponentialRampToValueAtTime(1200, now + 0.05)
      gain1.gain.setValueAtTime(0, now)
      gain1.gain.linearRampToValueAtTime(0.4, now + 0.01)
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.1)
      cha1.connect(gain1)
      gain1.connect(audioContext.destination)
      cha1.start(now)
      cha1.stop(now + 0.1)

      // Second "cha" - slightly lower
      const cha2 = audioContext.createOscillator()
      const gain2 = audioContext.createGain()
      cha2.type = 'sine'
      cha2.frequency.setValueAtTime(600, now + 0.08)
      cha2.frequency.exponentialRampToValueAtTime(900, now + 0.13)
      gain2.gain.setValueAtTime(0, now + 0.08)
      gain2.gain.linearRampToValueAtTime(0.4, now + 0.09)
      gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.18)
      cha2.connect(gain2)
      gain2.connect(audioContext.destination)
      cha2.start(now + 0.08)
      cha2.stop(now + 0.18)

      // "Ching" - bell-like sound
      const ching = audioContext.createOscillator()
      const gain3 = audioContext.createGain()
      ching.type = 'sine'
      ching.frequency.setValueAtTime(1000, now + 0.15)
      ching.frequency.exponentialRampToValueAtTime(800, now + 0.35)
      gain3.gain.setValueAtTime(0, now + 0.15)
      gain3.gain.linearRampToValueAtTime(0.5, now + 0.16)
      gain3.gain.exponentialRampToValueAtTime(0.01, now + 0.35)
      ching.connect(gain3)
      gain3.connect(audioContext.destination)
      ching.start(now + 0.15)
      ching.stop(now + 0.35)

      // Add a subtle "ding" at the end
      const ding = audioContext.createOscillator()
      const gain4 = audioContext.createGain()
      ding.type = 'sine'
      ding.frequency.setValueAtTime(1200, now + 0.3)
      ding.frequency.exponentialRampToValueAtTime(600, now + 0.45)
      gain4.gain.setValueAtTime(0, now + 0.3)
      gain4.gain.linearRampToValueAtTime(0.3, now + 0.31)
      gain4.gain.exponentialRampToValueAtTime(0.01, now + 0.45)
      ding.connect(gain4)
      gain4.connect(audioContext.destination)
      ding.start(now + 0.3)
      ding.stop(now + 0.45)
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to play cash register sound:', error)
      }
    }
  }

  // Enable sound
  const enableSound = async () => {
    setSoundEnabled(true)
    setShowSoundPrompt(false)
    localStorage.setItem('zolar-sound-enabled', 'true')
    
    try {
      await playNotificationSound()
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Could not test play audio:', err)
      }
    }
  }

  // Enable push notifications
  const enablePushNotifications = async () => {
    try {
      console.log('🔔 Starting push notification setup...')
      
      // Check if service worker is supported
      if (!('serviceWorker' in navigator)) {
        throw new Error('Service Workers are not supported in this browser')
      }

      if (!('PushManager' in window)) {
        throw new Error('Push notifications are not supported in this browser')
      }

      // Request notification permission
      console.log('📝 Requesting notification permission...')
      const permission = await Notification.requestPermission()
      console.log('Permission result:', permission)
      
      if (permission !== 'granted') {
        alert('❌ Push notifications permission denied. Please allow notifications in your browser settings.')
        localStorage.setItem('zolar-push-prompted', 'true')
        setShowPushPrompt(false)
        return
      }

      // Wait for service worker if not ready
      if (!swRegistrationRef.current) {
        console.log('⏳ Waiting for service worker...')
        const registration = await navigator.serviceWorker.ready
        swRegistrationRef.current = registration
      }

      if (!swRegistrationRef.current) {
        throw new Error('Service Worker not registered')
      }

      // Get VAPID public key from environment
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      console.log('🔑 VAPID key available:', !!vapidPublicKey)
      
      if (!vapidPublicKey) {
        throw new Error('VAPID public key not configured. Please contact administrator.')
      }

      // Subscribe to push notifications
      console.log('📲 Subscribing to push manager...')
      const subscription = await swRegistrationRef.current.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      })
      console.log('✅ Push subscription created')

      // Send subscription to server
      console.log('💾 Saving subscription to server...')
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ subscription })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
        throw new Error(`Server error: ${errorData.message || response.statusText}`)
      }

      console.log('✅ Subscription saved to server')
      setPushEnabled(true)
      setShowPushPrompt(false)
      localStorage.setItem('zolar-push-prompted', 'true')
      
      // Auto-enable sound when push is enabled
      setSoundEnabled(true)
      localStorage.setItem('zolar-sound-enabled', 'true')
      
      alert('✅ Push notifications enabled! You will now receive order alerts with sound.')
    } catch (error: any) {
      console.error('❌ Failed to enable push notifications:', error)
      const errorMessage = error.message || 'Unknown error'
      alert(`Failed to enable push notifications:\n\n${errorMessage}\n\nPlease try again or contact support.`)
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

  // Disable push notifications
  const disablePushNotifications = async () => {
    try {
      if (!swRegistrationRef.current) return

      const subscription = await swRegistrationRef.current.pushManager.getSubscription()
      if (subscription) {
        await subscription.unsubscribe()
        
        // Remove from server
        await fetch('/api/push/subscribe', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ endpoint: subscription.endpoint })
        })

        setPushEnabled(false)
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ Push notifications disabled')
        }
      }
    } catch (error) {
      console.error('Failed to disable push notifications:', error)
    }
  }

  // Listen for real-time notifications via Pusher
  useEffect(() => {
    const channel = pusherClient.subscribe('admin-orders')

    channel.bind('pusher:subscription_error', (error: any) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to subscribe to admin-orders:', error)
      }
    })

    channel.bind('new-order', (data: any) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔔 New order event received via Pusher', data)
      }
      
      // Refresh notifications from database
      fetchNotifications()

      // Play sound
      if (soundEnabled) {
        playNotificationSound().catch(() => {
          setShowSoundPrompt(true)
        })
      } else if (process.env.NODE_ENV === 'development') {
        console.log('🔕 Sound disabled, showing prompt')
        setShowSoundPrompt(true)
      }

      // Callback to parent
      if (onNewOrder) {
        onNewOrder(data)
      }

      // Dispatch event
      const customEvent = new CustomEvent('new-order-event', { detail: data })
      window.dispatchEvent(customEvent)
    })

    channel.bind('low-stock', (data: any) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('⚠️ Low stock event received via Pusher', data)
      }
      
      // Refresh notifications from database
      fetchNotifications()

      // Play sound for low stock alerts
      if (soundEnabled) {
        playNotificationSound().catch(() => {
          if (process.env.NODE_ENV === 'development') {
            console.log('Sound failed to play for low stock alert')
          }
        })
      } else if (process.env.NODE_ENV === 'development') {
        console.log('🔕 Sound disabled, showing prompt')
        setShowSoundPrompt(true)
      }
    })

    return () => {
      channel.unbind('new-order')
      channel.unbind('low-stock')
      channel.unbind('pusher:subscription_error')
      pusherClient.unsubscribe('admin-orders')
    }
  }, [soundEnabled, onNewOrder])

  // Mark as read
  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/notifications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true })
      })

      if (response.ok) {
        setNotifications(prev =>
          prev.map(notif =>
            notif.id === id ? { ...notif, isRead: true, readAt: new Date() } : notif
          )
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error marking as read:', error)
      }
    }
  }

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/admin/notifications/mark-all-read', {
        method: 'POST'
      })

      if (response.ok) {
        setNotifications(prev =>
          prev.map(notif => ({ ...notif, isRead: true, readAt: new Date() }))
        )
        setUnreadCount(0)
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error marking all as read:', error)
      }
    }
  }

  // Filter notifications
  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.isRead
    if (filter === 'orders') return notif.type === 'new-order'
    if (filter === 'stock') return notif.type === 'low-stock'
    return true
  })

  // Format time ago
  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)
    
    if (seconds < 60) return 'Just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  // Handle notification click
  const handleNotificationClick = (notif: DbNotification) => {
    if (!notif.isRead) {
      markAsRead(notif.id)
    }
    
    if (notif.type === 'new-order' && notif.data) {
      try {
        const data = JSON.parse(notif.data)
        router.push(`/admin/orders/${data.id}`)
      } catch (e) {
        // Invalid data
      }
    }
    
    setShowDropdown(false)
  }

  return (
    <>
      {/* Sound Prompt */}
      {showSoundPrompt && !soundEnabled && (
        <div className="fixed top-20 right-4 left-4 sm:left-auto bg-white border-2 border-orange-500 shadow-2xl rounded-lg p-4 sm:p-6 z-50 max-w-sm animate-slide-in">
          <div className="flex items-start space-x-3 sm:space-x-4">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m8-10a9 9 0 00-12.728 0" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2">Enable Order Sounds?</h3>
              <p className="text-xs text-gray-600 mb-3 sm:mb-4">Hear a notification sound when new orders arrive</p>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <button
                  onClick={enableSound}
                  className="px-3 sm:px-4 py-2 bg-orange-500 text-white text-xs font-medium rounded hover:bg-orange-600 transition-colors"
              >
                  Enable Sound
              </button>
              <button
                  onClick={() => setShowSoundPrompt(false)}
                  className="px-3 sm:px-4 py-2 bg-gray-200 text-gray-700 text-xs font-medium rounded hover:bg-gray-300 transition-colors"
              >
                  Maybe Later
              </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Push Notification Prompt */}
      {showPushPrompt && !pushEnabled && (
        <div className="fixed top-40 right-4 left-4 sm:left-auto bg-white border-2 border-blue-500 shadow-2xl rounded-lg p-4 sm:p-6 z-50 max-w-sm animate-slide-in">
          <div className="flex items-start space-x-3 sm:space-x-4">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2">Get Push Notifications?</h3>
              <p className="text-xs text-gray-600 mb-3 sm:mb-4">Receive order alerts even when the browser is closed or in background</p>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <button
                  onClick={enablePushNotifications}
                  className="px-3 sm:px-4 py-2 bg-blue-500 text-white text-xs font-medium rounded hover:bg-blue-600 transition-colors"
              >
                  Enable Push
              </button>
              <button
                  onClick={() => {
                    setShowPushPrompt(false)
                    localStorage.setItem('zolar-push-prompted', 'true')
                  }}
                  className="px-3 sm:px-4 py-2 bg-gray-200 text-gray-700 text-xs font-medium rounded hover:bg-gray-300 transition-colors"
              >
                  No Thanks
              </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Bell */}
      <div className="relative">
        <button
          onClick={async () => {
            // Enable audio context on user interaction (required by browsers)
            if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
              try {
                await audioContextRef.current.resume()
              } catch (error) {
                if (process.env.NODE_ENV === 'development') {
                  console.error('Failed to resume audio context:', error)
                }
              }
            }
            setShowDropdown(!showDropdown)
          }}
          className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-orange-500 rounded-full animate-pulse">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        {/* Dropdown */}
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-[600px] overflow-hidden flex flex-col">
              {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                <div className="flex items-center space-x-2 flex-wrap">
                  <span className={`text-xs px-2 py-1 rounded-full ${pusherConnected ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {pusherConnected ? '● Live' : '○ Offline'}
                  </span>
                  {soundEnabled && (
                      <button
                      onClick={() => playNotificationSound()}
                      className="text-xs text-orange-600 hover:text-orange-800 font-medium underline"
                      >
                      🔊
                      </button>
                    )}
                  {pushEnabled ? (
                    <button
                      onClick={disablePushNotifications}
                      className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                      title="Push notifications enabled"
                    >
                      🔔 Push ON
                    </button>
                  ) : (
                    <button
                      onClick={enablePushNotifications}
                      className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                      title="Enable push notifications"
                    >
                      🔕 Push OFF
                    </button>
                  )}
                </div>
              </div>

              {/* Filters */}
                  <div className="flex space-x-2">
                {(['all', 'unread', 'orders', 'stock'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                      filter === f
                        ? 'bg-orange-500 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {f === 'all' && 'All'}
                    {f === 'unread' && `Unread (${unreadCount})`}
                    {f === 'orders' && 'Orders'}
                    {f === 'stock' && 'Stock'}
                  </button>
                ))}
              </div>

              {filteredNotifications.length > 0 && (
                    <button
                      onClick={markAllAsRead}
                  className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Mark all read
                    </button>
                )}
              </div>

            {/* Notifications List */}
            <div className="overflow-y-auto flex-1">
              {loading ? (
                <div className="p-8 text-center text-gray-500">Loading...</div>
              ) : filteredNotifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  <p className="text-sm">No notifications</p>
                  </div>
                ) : (
                filteredNotifications.map((notif) => (
                  <button
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`w-full text-left p-4 hover:bg-gray-50 border-b border-gray-100 transition-colors ${
                      !notif.isRead ? 'bg-orange-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-sm font-semibold text-gray-900">{notif.title}</h4>
                          {!notif.isRead && (
                            <span className="inline-block w-2 h-2 bg-orange-500 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{notif.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{formatTimeAgo(notif.createdAt)}</p>
                      </div>
                  </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}


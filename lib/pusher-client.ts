import PusherClient from 'pusher-js'

// Enable Pusher logging in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  PusherClient.logToConsole = true
}

// Validate environment variables
const PUSHER_KEY = process.env.NEXT_PUBLIC_PUSHER_KEY
const PUSHER_CLUSTER = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'us2'

if (typeof window !== 'undefined') {
  if (!PUSHER_KEY) {
    console.error('❌ PUSHER ERROR: NEXT_PUBLIC_PUSHER_KEY is not set!')
  } else {
    console.log('✅ Pusher client initializing with key:', PUSHER_KEY.substring(0, 10) + '...')
    console.log('📍 Pusher cluster:', PUSHER_CLUSTER)
  }
}

// Client-side Pusher instance
export const pusherClient = new PusherClient(
  PUSHER_KEY || '',
  {
    cluster: PUSHER_CLUSTER,
    enabledTransports: ['ws', 'wss'],
    authEndpoint: '/api/pusher/auth',
  }
)

// Connection state logging
if (typeof window !== 'undefined') {
  pusherClient.connection.bind('connecting', () => {
    console.log('🔄 Pusher: Connecting...')
  })

  pusherClient.connection.bind('connected', () => {
    console.log('✅ Pusher: Connected!')
    console.log('🆔 Socket ID:', pusherClient.connection.socket_id)
  })

  pusherClient.connection.bind('unavailable', () => {
    console.error('❌ Pusher: Connection unavailable')
  })

  pusherClient.connection.bind('failed', () => {
    console.error('❌ Pusher: Connection failed')
  })

  pusherClient.connection.bind('disconnected', () => {
    console.warn('⚠️ Pusher: Disconnected')
  })

  pusherClient.connection.bind('error', (err: any) => {
    console.error('❌ Pusher Error:', err)
  })
}


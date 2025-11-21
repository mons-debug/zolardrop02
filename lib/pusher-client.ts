import PusherClient from 'pusher-js'

// Enable Pusher logging in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  PusherClient.logToConsole = true
}

// Validate environment variables
const PUSHER_KEY = process.env.NEXT_PUBLIC_PUSHER_KEY
const PUSHER_CLUSTER = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'us2'

// Client-side Pusher instance
export const pusherClient = new PusherClient(
  PUSHER_KEY || '',
  {
    cluster: PUSHER_CLUSTER,
    enabledTransports: ['ws', 'wss'],
    // No authEndpoint needed for public channels
  }
)

// Connection state logging (development only)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  pusherClient.connection.bind('unavailable', () => {
    console.error('Pusher: Connection unavailable')
  })

  pusherClient.connection.bind('failed', () => {
    console.error('Pusher: Connection failed')
  })

  pusherClient.connection.bind('error', (err: any) => {
    console.error('Pusher Error:', err)
  })
}


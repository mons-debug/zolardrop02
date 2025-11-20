import Pusher from 'pusher'

// Validate environment variables
const PUSHER_APP_ID = process.env.PUSHER_APP_ID
const PUSHER_KEY = process.env.PUSHER_KEY
const PUSHER_SECRET = process.env.PUSHER_SECRET
const PUSHER_CLUSTER = process.env.PUSHER_CLUSTER || 'us2'

// Log configuration status (only in development)
if (process.env.NODE_ENV === 'development') {
  if (!PUSHER_APP_ID || !PUSHER_KEY || !PUSHER_SECRET) {
    console.error('❌ PUSHER SERVER ERROR: Missing environment variables!')
    console.error('  - PUSHER_APP_ID:', PUSHER_APP_ID ? '✅' : '❌')
    console.error('  - PUSHER_KEY:', PUSHER_KEY ? '✅' : '❌')
    console.error('  - PUSHER_SECRET:', PUSHER_SECRET ? '✅' : '❌')
  } else {
    console.log('✅ Pusher server configured')
    console.log('📍 Cluster:', PUSHER_CLUSTER)
  }
}

// Server-side Pusher instance
export const pusherServer = new Pusher({
  appId: PUSHER_APP_ID || '',
  key: PUSHER_KEY || '',
  secret: PUSHER_SECRET || '',
  cluster: PUSHER_CLUSTER,
  useTLS: true
})

// Helper function to trigger events with error handling
export const triggerPusherEvent = async (
  channel: string,
  event: string,
  data: any
) => {
  try {
    await pusherServer.trigger(channel, event, data)
    if (process.env.NODE_ENV === 'development') {
      console.log(`📤 Pusher event triggered: ${channel}/${event}`)
    }
    return { success: true }
  } catch (error) {
    console.error(`❌ Failed to trigger Pusher event ${channel}/${event}:`, error)
    return { success: false, error }
  }
}


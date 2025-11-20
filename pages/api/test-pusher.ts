import { NextApiRequest, NextApiResponse } from 'next'
import { pusherServer } from '@/lib/pusher'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Check environment variables
    const hasAppId = !!process.env.PUSHER_APP_ID
    const hasKey = !!process.env.PUSHER_KEY
    const hasSecret = !!process.env.PUSHER_SECRET
    const hasCluster = !!process.env.PUSHER_CLUSTER

    console.log('🔍 Pusher Environment Check:')
    console.log('  - PUSHER_APP_ID:', hasAppId ? '✅' : '❌')
    console.log('  - PUSHER_KEY:', hasKey ? '✅' : '❌')
    console.log('  - PUSHER_SECRET:', hasSecret ? '✅' : '❌')
    console.log('  - PUSHER_CLUSTER:', hasCluster ? '✅' : '❌')

    // Try to send a test event
    console.log('📤 Attempting to trigger test Pusher event...')
    
    const result = await pusherServer.trigger('admin-orders', 'new-order', {
      id: 'test-' + Date.now(),
      totalCents: 5000,
      paymentMethod: 'TEST',
      customer: {
        name: 'Test Customer',
        phone: '0612345678',
        city: 'Test City',
        totalOrders: 1
      },
      createdAt: new Date().toISOString(),
      itemCount: 1
    })

    console.log('✅ Pusher event sent successfully:', result)

    res.status(200).json({
      success: true,
      message: 'Pusher test event sent!',
      env: {
        hasAppId,
        hasKey,
        hasSecret,
        hasCluster,
        cluster: process.env.PUSHER_CLUSTER
      },
      result
    })
  } catch (error: any) {
    console.error('❌ Pusher test failed:', error)
    res.status(500).json({
      success: false,
      error: error.message,
      env: {
        hasAppId: !!process.env.PUSHER_APP_ID,
        hasKey: !!process.env.PUSHER_KEY,
        hasSecret: !!process.env.PUSHER_SECRET,
        hasCluster: !!process.env.PUSHER_CLUSTER
      }
    })
  }
}


import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import webpush from 'web-push'

// Configure web-push with VAPID keys
// You'll need to generate these keys - run: npx web-push generate-vapid-keys
const vapidKeys = {
  publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
  privateKey: process.env.VAPID_PRIVATE_KEY || ''
}

if (vapidKeys.publicKey && vapidKeys.privateKey) {
  webpush.setVapidDetails(
    'mailto:admin@zolar.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
  )
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { title, body, url, icon, userId } = req.body

    if (!title || !body) {
      return res.status(400).json({ message: 'Title and body are required' })
    }

    // Check if web-push is configured
    if (!vapidKeys.publicKey || !vapidKeys.privateKey) {
      console.warn('Web push not configured - skipping push notifications')
      return res.status(200).json({
        message: 'Push notifications not configured',
        sent: 0
      })
    }

    // Get all push subscriptions (or filter by userId if provided)
    const where = userId ? { userId } : {}
    const subscriptions = await prisma.pushSubscription.findMany({
      where
    })

    if (subscriptions.length === 0) {
      return res.status(200).json({
        message: 'No subscriptions found',
        sent: 0
      })
    }

    const payload = JSON.stringify({
      title,
      body,
      icon: icon || '/favicon.png',
      badge: '/favicon.png',
      url: url || '/zolargestion',
      tag: 'new-order',
      requireInteraction: true,
      vibrate: [200, 100, 200]
    })

    // Send push notification to all subscriptions
    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        try {
          const pushSubscription = {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth
            }
          }

          await webpush.sendNotification(pushSubscription, payload)
          return { success: true, endpoint: sub.endpoint }
        } catch (error: any) {
          console.error('Failed to send push to:', sub.endpoint, error)

          // If subscription is invalid (410 or 404), remove it
          if (error.statusCode === 410 || error.statusCode === 404) {
            await prisma.pushSubscription.delete({
              where: { id: sub.id }
            }).catch(err => console.error('Failed to delete invalid subscription:', err))
          }

          return { success: false, endpoint: sub.endpoint, error: error.message }
        }
      })
    )

    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length
    const failed = results.length - successful

    res.status(200).json({
      message: 'Push notifications sent',
      sent: successful,
      failed: failed,
      total: subscriptions.length
    })
  } catch (error) {
    console.error('Error sending push notifications:', error)
    res.status(500).json({ message: 'Failed to send push notifications' })
  }
}


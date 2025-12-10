import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import webpush from 'web-push'

// Configure VAPID
const vapidKeys = {
    publicKey: process.env.VAPID_PUBLIC_KEY || process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
    privateKey: process.env.VAPID_PRIVATE_KEY || ''
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        // Check VAPID configuration
        const hasVapidPublic = !!vapidKeys.publicKey
        const hasVapidPrivate = !!vapidKeys.privateKey

        if (!hasVapidPublic || !hasVapidPrivate) {
            return res.status(200).json({
                success: false,
                error: 'VAPID keys not configured',
                config: {
                    hasVapidPublic,
                    hasVapidPrivate
                }
            })
        }

        // Configure webpush
        webpush.setVapidDetails(
            'mailto:admin@zolar.ma',
            vapidKeys.publicKey,
            vapidKeys.privateKey
        )

        // Get all push subscriptions
        const subscriptions = await prisma.pushSubscription.findMany()

        if (subscriptions.length === 0) {
            return res.status(200).json({
                success: false,
                error: 'No push subscriptions found. Please enable push notifications in the admin dashboard first.',
                subscriptionCount: 0
            })
        }

        // Send test notification to all subscriptions
        const payload = JSON.stringify({
            title: '🔔 Test Notification',
            body: 'Push notifications are working!',
            icon: '/zolar-icon.svg',
            badge: '/zolar-icon.svg',
            url: '/zolargestion',
            tag: 'test',
            requireInteraction: true,
            vibrate: [200, 100, 200]
        })

        let sent = 0
        let failed = 0
        const errors: string[] = []

        for (const sub of subscriptions) {
            try {
                await webpush.sendNotification(
                    {
                        endpoint: sub.endpoint,
                        keys: {
                            p256dh: sub.p256dh,
                            auth: sub.auth
                        }
                    },
                    payload
                )
                sent++
            } catch (error: any) {
                failed++
                errors.push(error.message)

                // Remove invalid subscription
                if (error.statusCode === 410 || error.statusCode === 404) {
                    await prisma.pushSubscription.delete({
                        where: { id: sub.id }
                    }).catch(() => { })
                }
            }
        }

        res.status(200).json({
            success: sent > 0,
            message: sent > 0 ? 'Test notification sent!' : 'Failed to send notifications',
            sent,
            failed,
            total: subscriptions.length,
            errors: errors.length > 0 ? errors.slice(0, 3) : undefined
        })
    } catch (error: any) {
        console.error('Test push failed:', error)
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

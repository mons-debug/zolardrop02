import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

// Clear all push subscriptions (for when VAPID keys change)
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Use POST to clear subscriptions' })
    }

    try {
        // Delete all push subscriptions
        const result = await prisma.pushSubscription.deleteMany()

        res.status(200).json({
            success: true,
            message: 'All push subscriptions cleared',
            deleted: result.count
        })
    } catch (error: any) {
        console.error('Failed to clear subscriptions:', error)
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

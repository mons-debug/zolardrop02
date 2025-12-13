import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Only allow POST requests with secret key for safety
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    // Simple secret check to prevent accidental calls
    const { secret } = req.body
    if (secret !== 'clean-zolar-2024') {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    try {
        // Delete orders first (has foreign key to Customer)
        const deletedOrders = await prisma.order.deleteMany({})

        // Delete customers
        const deletedCustomers = await prisma.customer.deleteMany({})

        // Clear admin notifications for a fresh start
        const deletedNotifications = await prisma.adminNotification.deleteMany({})

        return res.status(200).json({
            success: true,
            deleted: {
                orders: deletedOrders.count,
                customers: deletedCustomers.count,
                notifications: deletedNotifications.count
            },
            message: 'Database cleaned successfully!'
        })
    } catch (error) {
        console.error('Error cleaning data:', error)
        return res.status(500).json({
            message: 'Error cleaning data',
            error: error instanceof Error ? error.message : 'Unknown error'
        })
    }
}

import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check authentication
  const user = await requireAdmin(req, res)
  if (!user) {
    return // requireAdmin already sent the error response
  }

  if (req.method === 'POST') {
    try {
      const { subscription } = req.body

      if (!subscription || !subscription.endpoint) {
        return res.status(400).json({ message: 'Invalid subscription data' })
      }

      // Check if subscription already exists
      const existing = await prisma.pushSubscription.findFirst({
        where: {
          endpoint: subscription.endpoint
        }
      })

      if (existing) {
        // Update existing subscription
        await prisma.pushSubscription.update({
          where: { id: existing.id },
          data: {
            p256dh: subscription.keys.p256dh,
            auth: subscription.keys.auth,
            userId: user.id,
            updatedAt: new Date()
          }
        })
      } else {
        // Create new subscription
        await prisma.pushSubscription.create({
          data: {
            endpoint: subscription.endpoint,
            p256dh: subscription.keys.p256dh,
            auth: subscription.keys.auth,
            userId: user.id
          }
        })
      }

      res.status(200).json({ 
        message: 'Subscription saved successfully',
        success: true
      })
    } catch (error) {
      console.error('Error saving push subscription:', error)
      res.status(500).json({ message: 'Failed to save subscription' })
    }
  } else if (req.method === 'DELETE') {
    try {
      const { endpoint } = req.body

      if (!endpoint) {
        return res.status(400).json({ message: 'Endpoint is required' })
      }

      await prisma.pushSubscription.deleteMany({
        where: {
          endpoint: endpoint
        }
      })

      res.status(200).json({ 
        message: 'Subscription removed successfully',
        success: true
      })
    } catch (error) {
      console.error('Error removing push subscription:', error)
      res.status(500).json({ message: 'Failed to remove subscription' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}


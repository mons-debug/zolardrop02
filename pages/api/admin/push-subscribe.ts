import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { subscription, userId } = req.body

    if (!subscription || !userId) {
      return res.status(400).json({ message: 'Subscription and userId are required' })
    }

    // Store the push subscription in database
    // For now, we'll just log it. You can extend this to store in DB
    console.log('📱 Push subscription received for user:', userId)
    console.log('Subscription:', JSON.stringify(subscription))

    // Optional: Store in database
    // await prisma.pushSubscription.create({
    //   data: {
    //     userId,
    //     endpoint: subscription.endpoint,
    //     keys: JSON.stringify(subscription.keys),
    //   }
    // })

    res.status(200).json({ 
      success: true,
      message: 'Push subscription saved successfully' 
    })
  } catch (error) {
    console.error('Error saving push subscription:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}


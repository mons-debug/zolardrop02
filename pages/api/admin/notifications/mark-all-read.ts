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
      const result = await prisma.adminNotification.updateMany({
        where: { isRead: false },
        data: {
          isRead: true,
          readAt: new Date()
        }
      })

      res.status(200).json({ 
        message: 'All notifications marked as read',
        count: result.count
      })
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error marking all as read:', error)
      }
      res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}


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

  const { id } = req.query

  if (typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid notification ID' })
  }

  if (req.method === 'PATCH') {
    // Mark notification as read
    try {
      const { isRead } = req.body

      const notification = await prisma.adminNotification.update({
        where: { id },
        data: {
          isRead: isRead ?? true,
          readAt: isRead ? new Date() : null
        }
      })

      res.status(200).json({ notification })
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error updating notification:', error)
      }
      res.status(500).json({ message: 'Internal server error' })
    }
  } else if (req.method === 'DELETE') {
    // Delete notification
    try {
      await prisma.adminNotification.delete({
        where: { id }
      })

      res.status(200).json({ message: 'Notification deleted' })
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error deleting notification:', error)
      }
      res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}


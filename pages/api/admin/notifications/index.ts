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

  if (req.method === 'GET') {
    try {
      const { limit = '50', unreadOnly = 'false' } = req.query

      const where = unreadOnly === 'true' ? { isRead: false } : {}

      const notifications = await prisma.adminNotification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit as string)
      })

      const unreadCount = await prisma.adminNotification.count({
        where: { isRead: false }
      })

      res.status(200).json({
        notifications,
        unreadCount
      })
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching notifications:', error)
      }
      res.status(500).json({ message: 'Internal server error' })
    }
  } else if (req.method === 'POST') {
    // Create a new notification (used by system/checkout to store notifications)
    try {
      const { type, title, message, data } = req.body

      if (!type || !title || !message) {
        return res.status(400).json({ message: 'Missing required fields' })
      }

      const notification = await prisma.adminNotification.create({
        data: {
          type,
          title,
          message,
          data: data ? JSON.stringify(data) : null
        }
      })

      res.status(201).json({ notification })
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error creating notification:', error)
      }
      res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}


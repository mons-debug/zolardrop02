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
      const { status } = req.query

      // Build query based on status filter
      const where = status && status !== 'all' 
        ? { status: status as string }
        : {}

      const subscribers = await prisma.newsletter.findMany({
        where,
        orderBy: {
          subscribedAt: 'desc'
        }
      })

      // Generate CSV content
      const csvHeaders = 'Email,Status,Source,Subscribed At,IP Address\n'
      const csvRows = subscribers.map(sub => {
        const subscribedAt = new Date(sub.subscribedAt).toISOString()
        return `"${sub.email}","${sub.status}","${sub.source || 'N/A'}","${subscribedAt}","${sub.ipAddress || 'N/A'}"`
      }).join('\n')

      const csv = csvHeaders + csvRows

      // Set headers for file download
      res.setHeader('Content-Type', 'text/csv')
      res.setHeader('Content-Disposition', `attachment; filename="newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv"`)
      
      res.status(200).send(csv)
    } catch (error) {
      console.error('Error exporting newsletter subscribers:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}


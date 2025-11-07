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
      // Fetch all orders sorted by createdAt desc, include customer data
      const orders = await prisma.order.findMany({
        include: {
          customer: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      res.status(200).json({ orders })
    } catch (error) {
      console.error('Error fetching orders:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}


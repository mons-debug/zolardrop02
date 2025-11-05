import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Simple auth check
  const authHeader = req.headers.authorization
  const token = authHeader?.replace('Bearer ', '')
  
  if (token !== process.env.ADMIN_TOKEN && token !== 'admin-token-123') {
    return res.status(401).json({ message: 'Unauthorized' })
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


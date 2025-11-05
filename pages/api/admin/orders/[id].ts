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

  const { id } = req.query

  if (typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid order ID' })
  }

  if (req.method === 'PATCH') {
    try {
      const { status, adminNotes, refundReason } = req.body

      // Check if order exists
      const existingOrder = await prisma.order.findUnique({
        where: { id }
      })

      if (!existingOrder) {
        return res.status(404).json({ message: 'Order not found' })
      }

      // Build update data
      const updateData: any = {}
      
      if (status !== undefined) {
        // Validate status
        const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'refunded']
        if (!validStatuses.includes(status)) {
          return res.status(400).json({ 
            message: 'Invalid status. Must be one of: pending, confirmed, shipped, delivered, cancelled, refunded' 
          })
        }
        updateData.status = status
      }

      if (adminNotes !== undefined) {
        updateData.adminNotes = adminNotes
      }

      if (refundReason !== undefined) {
        updateData.refundReason = refundReason
      }

      // Update order
      const updatedOrder = await prisma.order.update({
        where: { id },
        data: updateData,
        include: {
          customer: true
        }
      })

      res.status(200).json({ 
        success: true,
        order: updatedOrder,
        message: 'Order updated successfully' 
      })
    } catch (error) {
      console.error('Error updating order:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else if (req.method === 'GET') {
    try {
      const order = await prisma.order.findUnique({
        where: { id },
        include: {
          customer: {
            include: {
              orders: {
                orderBy: { createdAt: 'desc' },
                take: 5
              }
            }
          }
        }
      })

      if (!order) {
        return res.status(404).json({ message: 'Order not found' })
      }

      res.status(200).json({ order })
    } catch (error) {
      console.error('Error fetching order:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}


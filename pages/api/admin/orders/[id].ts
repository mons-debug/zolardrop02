import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { logAdminAction } from '@/lib/audit-logger'

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
        
        // Add audit fields for status changes
        switch (status) {
          case 'confirmed':
            updateData.confirmedBy = user.id
            updateData.confirmedAt = new Date()
            break
          case 'shipped':
            updateData.shippedBy = user.id
            updateData.shippedAt = new Date()
            break
          case 'delivered':
            updateData.deliveredBy = user.id
            updateData.deliveredAt = new Date()
            break
          case 'cancelled':
            updateData.cancelledBy = user.id
            updateData.cancelledAt = new Date()
            break
          case 'refunded':
            updateData.refundedBy = user.id
            updateData.refundedAt = new Date()
            break
        }
      }

      if (adminNotes !== undefined) {
        updateData.adminNotes = adminNotes
      }

      if (refundReason !== undefined) {
        updateData.refundReason = refundReason
      }

      // Always track who updated
      updateData.updatedBy = user.id

      // Update order
      const updatedOrder = await prisma.order.update({
        where: { id },
        data: updateData,
        include: {
          customer: true
        }
      })

      // Log the action
      if (status !== undefined && existingOrder.status !== status) {
        await logAdminAction({
          userId: user.id,
          action: `order.${status}`,
          entityType: 'order',
          entityId: id,
          oldValue: { status: existingOrder.status },
          newValue: { status },
          description: `Changed order ${id} status from ${existingOrder.status} to ${status}`
        })
      }

      if (adminNotes !== undefined && existingOrder.adminNotes !== adminNotes) {
        await logAdminAction({
          userId: user.id,
          action: 'order.update',
          entityType: 'order',
          entityId: id,
          oldValue: { adminNotes: existingOrder.adminNotes },
          newValue: { adminNotes },
          description: `Updated admin notes for order ${id}`
        })
      }

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


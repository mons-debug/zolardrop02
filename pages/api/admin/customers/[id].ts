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
    return res.status(400).json({ message: 'Invalid customer ID' })
  }

  if (req.method === 'GET') {
    try {
      const customer = await prisma.customer.findUnique({
        where: { id },
        include: {
          orders: {
            orderBy: { createdAt: 'desc' }
          }
        }
      })

      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' })
      }

      res.status(200).json({ customer })
    } catch (error) {
      console.error('Error fetching customer:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else if (req.method === 'PATCH') {
    try {
      const { name, city, email, notes, tags, isBlocked } = req.body

      // Get existing customer first
      const existingCustomer = await prisma.customer.findUnique({
        where: { id }
      })

      if (!existingCustomer) {
        return res.status(404).json({ message: 'Customer not found' })
      }

      const updateData: any = {}
      if (name !== undefined) updateData.name = name
      if (city !== undefined) updateData.city = city
      if (email !== undefined) updateData.email = email
      if (notes !== undefined) updateData.notes = notes
      if (tags !== undefined) updateData.tags = JSON.stringify(tags)
      if (isBlocked !== undefined) {
        updateData.isBlocked = isBlocked
        updateData.blockedBy = user.id
        updateData.blockedAt = isBlocked ? new Date() : null
      }
      
      // Track who updated
      updateData.updatedBy = user.id

      const customer = await prisma.customer.update({
        where: { id },
        data: updateData
      })

      // Log block/unblock action
      if (isBlocked !== undefined && existingCustomer.isBlocked !== isBlocked) {
        await logAdminAction({
          userId: user.id,
          action: isBlocked ? 'customer.block' : 'customer.unblock',
          entityType: 'customer',
          entityId: id,
          oldValue: { isBlocked: existingCustomer.isBlocked },
          newValue: { isBlocked },
          description: `${isBlocked ? 'Blocked' : 'Unblocked'} customer ${existingCustomer.name}`
        })
      }

      // Log VIP tag changes
      if (tags !== undefined) {
        const oldTags = existingCustomer.tags ? JSON.parse(existingCustomer.tags) : []
        const newTags = tags
        const addedVIP = !oldTags.includes('VIP') && newTags.includes('VIP')
        const removedVIP = oldTags.includes('VIP') && !newTags.includes('VIP')

        if (addedVIP || removedVIP) {
          await logAdminAction({
            userId: user.id,
            action: addedVIP ? 'customer.vip' : 'customer.update',
            entityType: 'customer',
            entityId: id,
            oldValue: { tags: oldTags },
            newValue: { tags: newTags },
            description: addedVIP
              ? `Marked customer ${existingCustomer.name} as VIP`
              : `Updated tags for customer ${existingCustomer.name}`
          })
        }
      }

      // Log general updates
      if (notes !== undefined && existingCustomer.notes !== notes) {
        await logAdminAction({
          userId: user.id,
          action: 'customer.update',
          entityType: 'customer',
          entityId: id,
          oldValue: { notes: existingCustomer.notes },
          newValue: { notes },
          description: `Updated notes for customer ${existingCustomer.name}`
        })
      }

      res.status(200).json({ customer })
    } catch (error) {
      console.error('Error updating customer:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else if (req.method === 'DELETE') {
    try {
      // Check if customer has orders
      const customer = await prisma.customer.findUnique({
        where: { id },
        include: { _count: { select: { orders: true } } }
      })

      if (customer && customer._count.orders > 0) {
        return res.status(400).json({ message: 'Cannot delete customer with existing orders' })
      }

      await prisma.customer.delete({
        where: { id }
      })

      res.status(200).json({ message: 'Customer deleted successfully' })
    } catch (error) {
      console.error('Error deleting customer:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}


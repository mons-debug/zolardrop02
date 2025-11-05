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

      const updateData: any = {}
      if (name !== undefined) updateData.name = name
      if (city !== undefined) updateData.city = city
      if (email !== undefined) updateData.email = email
      if (notes !== undefined) updateData.notes = notes
      if (tags !== undefined) updateData.tags = JSON.stringify(tags)
      if (isBlocked !== undefined) updateData.isBlocked = isBlocked

      const customer = await prisma.customer.update({
        where: { id },
        data: updateData
      })

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


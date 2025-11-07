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
      const { filter, search } = req.query

      let where: any = {}

      // Apply filters
      if (filter === 'vip') {
        where.totalOrders = { gte: 5 }
      } else if (filter === 'new') {
        where.totalOrders = { lt: 2 }
      } else if (filter === 'regular') {
        where.totalOrders = { gte: 2, lt: 5 }
      } else if (filter === 'blocked') {
        where.isBlocked = true
      } else if (filter === 'premium') {
        where.totalOrders = { gte: 10 }
      }

      // Apply search
      if (search && typeof search === 'string') {
        where.OR = [
          { name: { contains: search } },
          { phone: { contains: search } },
          { city: { contains: search } }
        ]
      }

      // Fetch customers with their order count
      const customers = await prisma.customer.findMany({
        where,
        include: {
          _count: {
            select: { orders: true }
          }
        },
        orderBy: { totalSpent: 'desc' }
      })

      res.status(200).json({ customers })
    } catch (error) {
      console.error('Error fetching customers:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else if (req.method === 'POST') {
    try {
      const { name, phone, city, email, notes } = req.body

      if (!name || !phone) {
        return res.status(400).json({ message: 'Name and phone are required' })
      }

      // Check if customer already exists
      const existing = await prisma.customer.findUnique({
        where: { phone }
      })

      if (existing) {
        return res.status(400).json({ message: 'Customer with this phone number already exists' })
      }

      const customer = await prisma.customer.create({
        data: {
          name,
          phone,
          city,
          email,
          notes,
          tags: JSON.stringify(['New'])
        }
      })

      res.status(201).json({ customer })
    } catch (error) {
      console.error('Error creating customer:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}


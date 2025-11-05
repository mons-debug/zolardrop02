import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { page = '1', limit = '10' } = req.query

    const pageNum = parseInt(page as string, 10)
    const limitNum = parseInt(limit as string, 10)
    const skip = (pageNum - 1) * limitNum

    if (isNaN(pageNum) || pageNum < 1) {
      return res.status(400).json({ message: 'Invalid page number' })
    }

    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({ message: 'Invalid limit (1-100)' })
    }

    const products = await prisma.product.findMany({
      skip,
      take: limitNum,
      include: {
        variants: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const total = await prisma.product.count()

    res.status(200).json({
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

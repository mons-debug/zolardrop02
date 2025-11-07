import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { q } = req.query

  if (!q || typeof q !== 'string') {
    return res.status(400).json({ error: 'Search query is required' })
  }

  const searchTerm = q.trim().toLowerCase()

  if (searchTerm.length < 2) {
    return res.status(400).json({ error: 'Search query must be at least 2 characters' })
  }

  try {
    // Search products by title, description, or SKU
    const products = await prisma.product.findMany({
      where: {
        OR: [
          {
            title: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
          {
            sku: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        ],
      },
      include: {
        variants: {
          select: {
            id: true,
            color: true,
            priceCents: true,
          },
        },
      },
      take: 20, // Limit results
      orderBy: {
        createdAt: 'desc',
      },
    })

    return res.status(200).json({
      products,
      count: products.length,
      query: q,
    })
  } catch (error) {
    console.error('Search error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}






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
    const { id } = req.query

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Product ID or SKU is required' })
    }

    // Try to find by ID first, then by SKU (only published products)
    let product = await prisma.product.findFirst({
      where: { 
        id,
        status: 'published'
      },
      include: {
        variants: {
          orderBy: {
            color: 'asc'
          }
        }
      }
    })

    // If not found by ID, try to find by SKU
    if (!product) {
      product = await prisma.product.findFirst({
        where: { 
          sku: id,
          status: 'published'
        },
        include: {
          variants: {
            orderBy: {
              color: 'asc'
            }
          }
        }
      })
    }

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.status(200).json({ product })
  } catch (error) {
    console.error('Error fetching product:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

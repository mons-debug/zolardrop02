import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'admin-token-123'

function isAdmin(req: NextApiRequest): boolean {
  const token = req.headers.authorization?.replace('Bearer ', '') ||
                req.headers['x-admin-token'] as string
  return token === ADMIN_TOKEN
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  if (!isAdmin(req)) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const { sku, title, description, images, priceCents, salePriceCents, currency, stock, variants } = req.body

    // Validation
    if (!sku || !title || !priceCents) {
      return res.status(400).json({
        message: 'Missing required fields: sku, title, priceCents'
      })
    }

    if (priceCents < 0 || stock < 0) {
      return res.status(400).json({
        message: 'Price and stock must be non-negative'
      })
    }

    if (variants && !Array.isArray(variants)) {
      return res.status(400).json({
        message: 'Variants must be an array'
      })
    }

    // Check if SKU already exists
    const existingProduct = await prisma.product.findUnique({
      where: { sku }
    })

    if (existingProduct) {
      return res.status(409).json({ message: 'Product SKU already exists' })
    }

    // Create product with variants
    const product = await prisma.product.create({
      data: {
        sku,
        title,
        description,
        images: images ? JSON.stringify(images) : undefined,
        priceCents,
        salePriceCents,
        currency: currency || 'USD',
        stock,
        variants: variants ? {
          create: variants.map((variant: any) => ({
            color: variant.color,
            sku: variant.sku,
            priceCents: variant.priceCents,
            stock: variant.stock,
            images: variant.images ? JSON.stringify(variant.images) : undefined,
            metadata: variant.metadata ? JSON.stringify(variant.metadata) : null
          }))
        } : undefined
      },
      include: {
        variants: true
      }
    })

    res.status(201).json({ product })
  } catch (error) {
    console.error('Error creating product:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

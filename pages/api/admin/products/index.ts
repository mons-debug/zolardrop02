import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { trackProductAction } from '@/lib/audit-logger'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  // Check authentication
  const user = await requireAdmin(req, res)
  if (!user) {
    return // requireAdmin already sent the error response
  }

  try {
    const { sku, title, description, images, priceCents, salePriceCents, currency, stock, sizeInventory, category, variants } = req.body

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
        sizeInventory: sizeInventory || null,
        category,
        status: 'published',
        variants: variants ? {
          create: variants.map((variant: any) => ({
            color: variant.color,
            size: variant.size || null,
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

    // Log the product creation
    await trackProductAction(
      product.id,
      user.id,
      'create',
      null,
      {
        title: product.title,
        sku: product.sku,
        priceCents: product.priceCents,
        stock: product.stock
      },
      { 
        variantCount: product.variants.length,
        category: product.category
      }
    )

    res.status(201).json({ product })
  } catch (error) {
    console.error('Error creating product:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

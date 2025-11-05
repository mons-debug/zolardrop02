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
  if (req.method !== 'PUT' && req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  if (!isAdmin(req)) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Product ID is required' })
  }

  // Handle DELETE request
  if (req.method === 'DELETE') {
    try {
      // Check if product exists
      const existingProduct = await prisma.product.findUnique({
        where: { id },
        include: { variants: true }
      })

      if (!existingProduct) {
        return res.status(404).json({ message: 'Product not found' })
      }

      // Delete all variants first (cascade)
      await prisma.variant.deleteMany({
        where: { productId: id }
      })

      // Delete the product
      await prisma.product.delete({
        where: { id }
      })

      return res.status(200).json({
        success: true,
        message: 'Product and all variants deleted successfully'
      })
    } catch (error) {
      console.error('Error deleting product:', error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  // Handle PUT request (update)
  try {
    const { sku, title, description, images, priceCents, salePriceCents, currency, stock, variants } = req.body

    // Validation
    if (priceCents !== undefined && priceCents < 0) {
      return res.status(400).json({
        message: 'Price must be non-negative'
      })
    }

    if (stock !== undefined && stock < 0) {
      return res.status(400).json({
        message: 'Stock must be non-negative'
      })
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: { variants: true }
    })

    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' })
    }

    // Check if new SKU conflicts with existing products (excluding current product)
    if (sku && sku !== existingProduct.sku) {
      const skuConflict = await prisma.product.findUnique({
        where: { sku }
      })

      if (skuConflict) {
        return res.status(409).json({ message: 'Product SKU already exists' })
      }
    }

    // Update product
    const updateData: any = {}
    if (sku !== undefined) updateData.sku = sku
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
      if (images !== undefined) updateData.images = images ? JSON.stringify(images) : undefined
    if (priceCents !== undefined) updateData.priceCents = priceCents
    if (salePriceCents !== undefined) updateData.salePriceCents = salePriceCents
    if (currency !== undefined) updateData.currency = currency
    if (stock !== undefined) updateData.stock = stock

    // Handle variants update
    if (variants !== undefined) {
      if (!Array.isArray(variants)) {
        return res.status(400).json({
          message: 'Variants must be an array'
        })
      }

      // Delete existing variants and create new ones
      await prisma.variant.deleteMany({
        where: { productId: id }
      })

      updateData.variants = {
        create: variants.map((variant: any) => ({
          color: variant.color,
          sku: variant.sku,
          priceCents: variant.priceCents,
          stock: variant.stock,
            images: variant.images ? JSON.stringify(variant.images) : undefined,
          metadata: variant.metadata ? JSON.stringify(variant.metadata) : null
        }))
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        variants: true
      }
    })

    res.status(200).json({ product })
  } catch (error) {
    console.error('Error updating product:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

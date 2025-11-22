import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { getCacheHeader } from '@/lib/api-cache'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  // Set cache headers for dynamic content
  res.setHeader('Cache-Control', getCacheHeader('dynamic'))

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

    // Fetch regular products
    const products = await prisma.product.findMany({
      where: {
        status: 'published'
      },
      skip,
      take: limitNum,
      include: {
        variants: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Fetch standalone variants that should appear as separate products
    const standaloneVariants = await prisma.variant.findMany({
      where: {
        showAsProduct: true,
        product: {
          status: 'published'
        }
      },
      include: {
        product: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform standalone variants to look like products
    const variantProducts = standaloneVariants.map((variant: any) => ({
      id: variant.id,
      sku: variant.sku,
      title: `${variant.product.title} - ${variant.color}`,
      description: variant.description || variant.product.description,
      images: variant.images,
      priceCents: variant.priceCents,
      stock: variant.stock,
      sizeInventory: variant.sizeInventory,
      category: variant.product.category,
      variants: [variant],
      _isVariantProduct: true,
      _parentProductSku: variant.product.sku,
      _variantId: variant.id,
      createdAt: variant.createdAt
    }))

    // Combine regular products and variant products
    const allProducts = [...products, ...variantProducts]
    const total = products.length + variantProducts.length

    res.status(200).json({
      products: allProducts,
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

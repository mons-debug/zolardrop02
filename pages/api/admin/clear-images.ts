import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    const { secret } = req.body
    if (secret !== 'clear-images-2024') {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    try {
        // Clear all product images
        const products = await prisma.product.updateMany({
            data: { images: '[]' }
        })

        // Clear all variant images
        const variants = await prisma.variant.updateMany({
            data: { images: '[]' }
        })

        // Clear hero slides
        const heroSlides = await prisma.heroSlide.updateMany({
            data: { mediaUrl: '' }
        })

        // Clear collection stack images
        const stacks = await prisma.collectionStack.updateMany({
            data: { images: '[]' }
        })

        return res.status(200).json({
            success: true,
            cleared: {
                products: products.count,
                variants: variants.count,
                heroSlides: heroSlides.count,
                collectionStacks: stacks.count
            },
            message: 'All images cleared! You can now upload fresh images from the dashboard.'
        })
    } catch (error) {
        console.error('Error clearing images:', error)
        return res.status(500).json({
            message: 'Error clearing images',
            error: error instanceof Error ? error.message : 'Unknown error'
        })
    }
}

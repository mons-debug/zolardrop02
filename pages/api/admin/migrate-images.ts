import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

async function uploadToCloudinary(blobUrl: string): Promise<string | null> {
    try {
        // Upload directly from URL to Cloudinary
        const result = await cloudinary.uploader.upload(blobUrl, {
            folder: 'zolar-products',
            resource_type: 'auto',
        })
        return result.secure_url
    } catch (error) {
        console.error(`Failed to upload ${blobUrl}:`, error)
        return null
    }
}

function isBlobUrl(url: string): boolean {
    return url.includes('blob.vercel-storage.com')
}

async function migrateImageArray(imagesJson: string): Promise<{ newJson: string; migrated: number }> {
    try {
        const images = JSON.parse(imagesJson)
        if (!Array.isArray(images)) return { newJson: imagesJson, migrated: 0 }

        let migrated = 0
        const newImages = await Promise.all(
            images.map(async (url: string) => {
                if (isBlobUrl(url)) {
                    const newUrl = await uploadToCloudinary(url)
                    if (newUrl) {
                        migrated++
                        return newUrl
                    }
                }
                return url
            })
        )
        return { newJson: JSON.stringify(newImages), migrated }
    } catch {
        return { newJson: imagesJson, migrated: 0 }
    }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    // Security check
    const { secret } = req.body
    if (secret !== 'migrate-zolar-2024') {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const results = {
        products: { total: 0, migrated: 0, images: 0 },
        variants: { total: 0, migrated: 0, images: 0 },
        heroSlides: { total: 0, migrated: 0 },
        fashionCarousel: { total: 0, migrated: 0 },
        collectionStacks: { total: 0, migrated: 0, images: 0 },
        errors: [] as string[],
    }

    try {
        // 1. Migrate Products
        const products = await prisma.product.findMany()
        results.products.total = products.length

        for (const product of products) {
            if (product.images && isBlobUrl(product.images)) {
                const { newJson, migrated } = await migrateImageArray(product.images)
                if (migrated > 0) {
                    await prisma.product.update({
                        where: { id: product.id },
                        data: { images: newJson }
                    })
                    results.products.migrated++
                    results.products.images += migrated
                }
            }
        }

        // 2. Migrate Variants
        const variants = await prisma.variant.findMany()
        results.variants.total = variants.length

        for (const variant of variants) {
            if (variant.images && isBlobUrl(variant.images)) {
                const { newJson, migrated } = await migrateImageArray(variant.images)
                if (migrated > 0) {
                    await prisma.variant.update({
                        where: { id: variant.id },
                        data: { images: newJson }
                    })
                    results.variants.migrated++
                    results.variants.images += migrated
                }
            }
        }

        // 3. Migrate Hero Slides
        const heroSlides = await prisma.heroSlide.findMany()
        results.heroSlides.total = heroSlides.length

        for (const slide of heroSlides) {
            if (isBlobUrl(slide.mediaUrl)) {
                const newUrl = await uploadToCloudinary(slide.mediaUrl)
                if (newUrl) {
                    await prisma.heroSlide.update({
                        where: { id: slide.id },
                        data: { mediaUrl: newUrl }
                    })
                    results.heroSlides.migrated++
                }
            }
        }

        // 4. Migrate Fashion Carousel
        const carouselImages = await prisma.fashionCarousel.findMany()
        results.fashionCarousel.total = carouselImages.length

        for (const item of carouselImages) {
            if (isBlobUrl(item.url)) {
                const newUrl = await uploadToCloudinary(item.url)
                if (newUrl) {
                    await prisma.fashionCarousel.update({
                        where: { id: item.id },
                        data: { url: newUrl }
                    })
                    results.fashionCarousel.migrated++
                }
            }
        }

        // 5. Migrate Collection Stacks
        const stacks = await prisma.collectionStack.findMany()
        results.collectionStacks.total = stacks.length

        for (const stack of stacks) {
            if (stack.images && isBlobUrl(stack.images)) {
                const { newJson, migrated } = await migrateImageArray(stack.images)
                if (migrated > 0) {
                    await prisma.collectionStack.update({
                        where: { id: stack.id },
                        data: { images: newJson }
                    })
                    results.collectionStacks.migrated++
                    results.collectionStacks.images += migrated
                }
            }
        }

        return res.status(200).json({
            success: true,
            message: 'Migration completed!',
            results
        })
    } catch (error) {
        console.error('Migration error:', error)
        return res.status(500).json({
            success: false,
            message: 'Migration failed',
            error: error instanceof Error ? error.message : 'Unknown error',
            results
        })
    }
}

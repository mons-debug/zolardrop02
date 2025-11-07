import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixImageUrls() {
  console.log('🔧 Fixing image URLs...')

  // Update all products with proper Unsplash URLs
  const products = await prisma.product.findMany({
    include: { variants: true }
  })

  for (const product of products) {
    try {
      const images = JSON.parse(product.images)
      const fixedImages = images.map((url: string) => {
        // Fix Unsplash URLs
        if (url.includes('unsplash.com')) {
          // Extract photo ID
          const match = url.match(/photo-([a-zA-Z0-9_-]+)/)
          if (match) {
            const photoId = match[1]
            return `https://images.unsplash.com/photo-${photoId}?w=800&q=80&auto=format&fit=crop`
          }
        }
        return url
      })

      await prisma.product.update({
        where: { id: product.id },
        data: { images: JSON.stringify(fixedImages) }
      })

      console.log(`✅ Fixed images for: ${product.title}`)

      // Fix variant images
      for (const variant of product.variants) {
        try {
          const variantImages = JSON.parse(variant.images)
          const fixedVariantImages = variantImages.map((url: string) => {
            if (url.includes('unsplash.com')) {
              const match = url.match(/photo-([a-zA-Z0-9_-]+)/)
              if (match) {
                const photoId = match[1]
                return `https://images.unsplash.com/photo-${photoId}?w=800&q=80&auto=format&fit=crop`
              }
            }
            return url
          })

          await prisma.variant.update({
            where: { id: variant.id },
            data: { images: JSON.stringify(fixedVariantImages) }
          })

          console.log(`  ✅ Fixed images for variant: ${variant.color}`)
        } catch (error) {
          console.error(`  ❌ Error fixing variant ${variant.id}:`, error)
        }
      }
    } catch (error) {
      console.error(`❌ Error fixing product ${product.id}:`, error)
    }
  }

  console.log('\n🎉 All image URLs fixed!')
}

fixImageUrls()
  .catch(console.error)
  .finally(() => prisma.$disconnect())


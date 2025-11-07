import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔧 Adding variants to products without any...')

  // Find all products
  const products = await prisma.product.findMany({
    include: { variants: true }
  })

  for (const product of products) {
    if (product.variants.length === 0) {
      console.log(`\n📦 Adding variants for: ${product.title} (${product.sku})`)
      
      // Add default variants based on product type
      const colors = ['Black', 'White', 'Gray']
      
      for (const color of colors) {
        const variantSku = `${product.sku}-${color.toUpperCase().substring(0, 3)}`
        
        await prisma.variant.create({
          data: {
            productId: product.id,
            color: color,
            sku: variantSku,
            priceCents: product.priceCents,
            stock: 50, // Default stock
            images: product.images, // Use same images as product
            metadata: null
          }
        })
        
        console.log(`  ✓ Added ${color} variant (${variantSku})`)
      }
    } else {
      console.log(`✅ ${product.title} already has ${product.variants.length} variant(s)`)
    }
  }

  console.log('\n✅ All products now have variants!')
}

main()
  .catch((e) => {
    console.error('❌ Error adding variants:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


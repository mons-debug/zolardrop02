const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Verifying seed data...')

  const products = await prisma.product.findMany({
    include: {
      variants: true
    }
  })

  console.log(`📦 Found ${products.length} products`)

  products.forEach(product => {
    console.log(`\n📋 ${product.title} (${product.sku})`)
    console.log(`   Variants: ${product.variants.length}`)
    product.variants.forEach(variant => {
      console.log(`   - ${variant.color} (${variant.sku}): $${(variant.priceCents / 100).toFixed(2)} | Stock: ${variant.stock}`)
    })
  })

  console.log(`\n✅ Verification complete!`)
  console.log(`Total products: ${products.length}`)
  console.log(`Total variants: ${products.reduce((sum, p) => sum + p.variants.length, 0)}`)
}

main()
  .catch((e) => {
    console.error('❌ Error during verification:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

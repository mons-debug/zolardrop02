const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function addSizeGuide() {
  console.log('🔄 Adding size guide to Eclipse Black product...')
  
  const sizeGuideContent = `S | 50 | 68 | 19
M | 52 | 70 | 20
L | 54 | 72 | 21
XL | 56 | 74 | 22`
  
  const product = await prisma.product.update({
    where: { id: 'bd7b925c-4f68-493e-b952-db071e07f99d' },
    data: {
      sizeGuide: sizeGuideContent
    }
  })
  
  console.log('✅ Size guide added successfully!')
  console.log(`   Product: ${product.title}`)
  console.log(`   SKU: ${product.sku}`)
  console.log('\n📏 Size Guide Content:')
  console.log(product.sizeGuide)
  
  await prisma.$disconnect()
}

addSizeGuide()
  .then(() => {
    console.log('\n✅ Done! The ruler icon should now appear on the product page.')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })


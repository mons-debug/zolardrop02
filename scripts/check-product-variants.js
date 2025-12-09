const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkProduct() {
  const product = await prisma.product.findUnique({
    where: { id: 'bd7b925c-4f68-493e-b952-db071e07f99d' },
    include: { variants: true }
  })
  
  console.log('\n📦 Product: ESSENCE-SWEATSHIRT')
  console.log(`   ID: ${product.id}`)
  console.log(`   SKU: ${product.sku}`)
  console.log(`   Color: ${product.color}`)
  console.log(`   Stock: ${product.stock}`)
  console.log(`   SizeGuide: ${product.sizeGuide ? 'EXISTS' : 'NULL'}`)
  console.log(`\n   Variants: ${product.variants.length}`)
  
  product.variants.forEach((v, i) => {
    console.log(`\n   Variant ${i + 1}:`)
    console.log(`     Color: ${v.color}`)
    console.log(`     SKU: ${v.sku}`)
    console.log(`     Stock: ${v.stock}`)
    console.log(`     Show as Product: ${v.showAsProduct}`)
  })
  
  await prisma.$disconnect()
}

checkProduct()








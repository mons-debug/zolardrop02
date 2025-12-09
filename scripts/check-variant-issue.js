require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkProduct() {
  try {
    const product = await prisma.product.findFirst({
      where: { sku: 'PROD-01-EB' },
      include: { 
        variants: {
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    if (!product) {
      console.log('❌ Product not found!')
      return
    }

    console.log('\n📦 Product Info:')
    console.log('ID:', product.id)
    console.log('SKU:', product.sku)
    console.log('Title:', product.title)
    console.log('Color:', product.color)
    console.log('Has size inventory:', product.sizeInventory)
    console.log('Total Variants:', product.variants.length)

    console.log('\n🎨 Variants:')
    product.variants.forEach((v, i) => {
      console.log(`\n  Variant ${i + 1}:`)
      console.log('    ID:', v.id)
      console.log('    SKU:', v.sku)
      console.log('    Color:', v.color)
      console.log('    Size:', v.size || 'N/A')
      console.log('    Stock:', v.stock)
      console.log('    Price:', v.priceCents / 100, 'DH')
      console.log('    Description:', v.description ? v.description.substring(0, 50) + '...' : 'N/A')
      console.log('    Show as product:', v.showAsProduct)
    })

    // Check for size L + ECLIPSE BLACK combination
    console.log('\n🔍 Looking for: Size L + Color ECLIPSE BLACK')
    const matchingVariant = product.variants.find(v => 
      v.size === 'L' && v.color === 'ECLIPSE BLACK'
    )
    
    if (matchingVariant) {
      console.log('✅ Found matching variant:', matchingVariant.id)
    } else {
      console.log('❌ No matching variant found!')
      console.log('\nAvailable combinations:')
      product.variants.forEach(v => {
        console.log(`  - Color: "${v.color}", Size: "${v.size || 'N/A'}"`)
      })
    }

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkProduct()


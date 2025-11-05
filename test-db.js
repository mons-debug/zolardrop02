const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testDB() {
  try {
    console.log('Testing database connection...')

    // Test variant query
    const variant = await prisma.variant.findUnique({
      where: { id: 'cc284000-5f92-423e-a023-e8fc6df519fb' },
      include: { product: true }
    })

    if (variant) {
      console.log('✅ Found variant:', variant.id)
      console.log('Product:', variant.product.title)
      console.log('Stock:', variant.stock)
    } else {
      console.log('❌ Variant not found')
    }

    // Test order creation
    const order = await prisma.order.create({
      data: {
        subtotalCents: 1000,
        taxCents: 0,
        shippingCents: 0,
        totalCents: 1000,
        paymentMethod: 'COD',
        status: 'pending',
        items: JSON.stringify([{ test: 'item' }])
      }
    })

    console.log('✅ Created order:', order.id)

    // Clean up
    await prisma.order.delete({ where: { id: order.id } })
    console.log('✅ Deleted test order')

  } catch (error) {
    console.error('❌ Database error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testDB()

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function migrateCustomers() {
  console.log('🔄 Starting customer migration from existing orders...\n')

  try {
    // Get all orders
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'asc' }
    })

    console.log(`Found ${orders.length} orders to process\n`)

    const customerMap = new Map<string, any>()

    // Extract customer data from order items
    for (const order of orders) {
      try {
        const items = JSON.parse(order.items)
        
        // For existing orders, we don't have customer data
        // Create generic customer based on order
        const phone = `unknown-${order.id.substring(0, 8)}`
        const name = `Customer ${order.id.substring(0, 8)}`
        
        if (!customerMap.has(phone)) {
          customerMap.set(phone, {
            phone,
            name,
            city: 'Unknown',
            totalOrders: 0,
            totalSpent: 0,
            orders: []
          })
        }

        const customer = customerMap.get(phone)
        customer.totalOrders += 1
        customer.totalSpent += order.totalCents
        customer.orders.push(order.id)
      } catch (error) {
        console.error(`Error processing order ${order.id}:`, error)
      }
    }

    console.log(`Creating ${customerMap.size} customer records...\n`)

    // Create customers and link orders
    for (const [phone, customerData] of customerMap) {
      try {
        const customer = await prisma.customer.create({
          data: {
            name: customerData.name,
            phone: customerData.phone,
            city: customerData.city,
            totalOrders: customerData.totalOrders,
            totalSpent: customerData.totalSpent,
            tags: JSON.stringify(['Migrated']),
            notes: 'Customer created from historical order data'
          }
        })

        // Link orders to customer
        for (const orderId of customerData.orders) {
          await prisma.order.update({
            where: { id: orderId },
            data: { customerId: customer.id }
          })
        }

        console.log(`✅ Created customer: ${customer.name} (${customer.phone}) with ${customerData.totalOrders} orders`)
      } catch (error) {
        console.error(`Error creating customer ${phone}:`, error)
      }
    }

    console.log('\n✨ Migration completed successfully!')
  } catch (error) {
    console.error('Migration failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

migrateCustomers()


/**
 * Backfill notifications for existing orders
 * Run this once to create notifications for orders that were placed before the notification system
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Backfilling notifications for existing orders...')

  // Get all orders that don't have notifications yet
  const orders = await prisma.order.findMany({
    include: {
      customer: true
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 50 // Last 50 orders
  })

  console.log(`Found ${orders.length} orders`)

  let created = 0

  for (const order of orders) {
    if (!order.customer) continue

    const loyaltyBadge = order.customer.totalOrders >= 10 ? '👑' : 
                        order.customer.totalOrders >= 5 ? '💎' : 
                        order.customer.totalOrders >= 2 ? '⭐' : '🆕'

    try {
      // Check if notification already exists for this order
      const existing = await prisma.adminNotification.findFirst({
        where: {
          type: 'new-order',
          data: {
            contains: order.id
          }
        }
      })

      if (!existing) {
        await prisma.adminNotification.create({
          data: {
            type: 'new-order',
            title: `${loyaltyBadge} New Order from ${order.customer.name}`,
            message: `${order.customer.phone} • ${order.customer.city || 'N/A'} • ${(order.totalCents / 100).toFixed(2)} MAD`,
            data: JSON.stringify({
              id: order.id,
              totalCents: order.totalCents,
              paymentMethod: order.paymentMethod,
              customer: {
                id: order.customer.id,
                name: order.customer.name,
                phone: order.customer.phone,
                city: order.customer.city,
                totalOrders: order.customer.totalOrders,
                tags: order.customer.tags
              },
              createdAt: order.createdAt,
              itemCount: 1
            }),
            createdAt: order.createdAt // Use order's creation time
          }
        })
        created++
        console.log(`✅ Created notification for order ${order.id}`)
      }
    } catch (error) {
      console.error(`❌ Failed to create notification for order ${order.id}:`, error)
    }
  }

  console.log(`\n🎉 Done! Created ${created} notifications`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


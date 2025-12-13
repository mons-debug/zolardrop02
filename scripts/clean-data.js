// Script to clean orders and customers data
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function cleanData() {
    console.log('🧹 Cleaning orders and customers data...\n')

    try {
        // Delete orders first (has foreign key to Customer)
        const deletedOrders = await prisma.order.deleteMany({})
        console.log(`✅ Deleted ${deletedOrders.count} orders`)

        // Delete customers
        const deletedCustomers = await prisma.customer.deleteMany({})
        console.log(`✅ Deleted ${deletedCustomers.count} customers`)

        // Also clear admin notifications for a fresh start
        const deletedNotifications = await prisma.adminNotification.deleteMany({})
        console.log(`✅ Deleted ${deletedNotifications.count} admin notifications`)

        console.log('\n🎉 Database cleaned successfully!')
    } catch (error) {
        console.error('Error cleaning data:', error)
    } finally {
        await prisma.$disconnect()
    }
}

cleanData()

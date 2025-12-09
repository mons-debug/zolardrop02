const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function cleanDatabase() {
  console.log('🧹 Starting database cleanup...\n')
  
  try {
    // Backup first
    console.log('📦 Creating backup before cleanup...')
    const backup = {
      timestamp: new Date().toISOString(),
      orders: await prisma.order.findMany(),
      customers: await prisma.customer.findMany(),
      newsletters: await prisma.newsletter.findMany(),
      notifications: await prisma.adminNotification.findMany()
    }
    
    const fs = require('fs')
    const path = require('path')
    const backupDir = path.join(__dirname, '..', 'backups')
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true })
    }
    const backupFile = path.join(backupDir, `backup-before-cleanup-${Date.now()}.json`)
    fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2))
    console.log(`✅ Backup saved: ${backupFile}\n`)
    
    // Show what will be deleted
    const orderCount = await prisma.order.count()
    const customerCount = await prisma.customer.count()
    const newsletterCount = await prisma.newsletter.count()
    const notificationCount = await prisma.adminNotification.count()
    
    console.log('📊 Current Data:')
    console.log(`   Orders: ${orderCount}`)
    console.log(`   Customers: ${customerCount}`)
    console.log(`   Newsletter Subscribers: ${newsletterCount}`)
    console.log(`   Notifications: ${notificationCount}\n`)
    
    console.log('⚠️  WARNING: This will DELETE all of the above data!')
    console.log('   Products and variants will NOT be affected.\n')
    
    // Delete data
    console.log('🗑️  Deleting orders...')
    await prisma.order.deleteMany({})
    console.log('✅ Orders deleted')
    
    console.log('🗑️  Deleting customers...')
    await prisma.customer.deleteMany({})
    console.log('✅ Customers deleted')
    
    console.log('🗑️  Deleting newsletter subscribers...')
    await prisma.newsletter.deleteMany({})
    console.log('✅ Newsletter subscribers deleted')
    
    console.log('🗑️  Deleting notifications...')
    await prisma.adminNotification.deleteMany({})
    console.log('✅ Notifications deleted')
    
    console.log('\n✅ Database cleaned successfully!')
    console.log('📦 Your data is backed up in: ' + backupFile)
    console.log('\n🎉 You now have a fresh, clean database!')
    
  } catch (error) {
    console.error('❌ Error cleaning database:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run cleanup
console.log('\n' + '='.repeat(60))
console.log('  DATABASE CLEANUP UTILITY')
console.log('='.repeat(60) + '\n')

cleanDatabase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })








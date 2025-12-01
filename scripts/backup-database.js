const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function backupDatabase() {
  console.log('🔄 Starting database backup...')
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupDir = path.join(__dirname, '..', 'backups')
  
  // Create backups directory if it doesn't exist
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true })
  }
  
  const backupFile = path.join(backupDir, `backup-${timestamp}.json`)
  
  try {
    // Fetch all data
    console.log('📦 Fetching products...')
    const products = await prisma.product.findMany({
      include: {
        variants: true
      }
    })
    
    console.log('📦 Fetching orders...')
    const orders = await prisma.order.findMany()
    
    console.log('📦 Fetching customers...')
    const customers = await prisma.customer.findMany()
    
    console.log('📦 Fetching newsletter subscribers...')
    const newsletters = await prisma.newsletter.findMany()
    
    console.log('📦 Fetching hero slides...')
    const heroSlides = await prisma.heroSlide.findMany()
    
    console.log('📦 Fetching notifications...')
    const notifications = await prisma.adminNotification.findMany()
    
    // Create backup object
    const backup = {
      timestamp: new Date().toISOString(),
      database_url: process.env.DATABASE_URL ? 'CONFIGURED' : 'NOT_CONFIGURED',
      counts: {
        products: products.length,
        variants: products.reduce((sum, p) => sum + p.variants.length, 0),
        orders: orders.length,
        customers: customers.length,
        newsletters: newsletters.length,
        heroSlides: heroSlides.length,
        notifications: notifications.length
      },
      data: {
        products,
        orders,
        customers,
        newsletters,
        heroSlides,
        notifications
      }
    }
    
    // Write to file
    fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2))
    
    console.log('\n✅ Backup completed successfully!')
    console.log(`📁 Backup file: ${backupFile}`)
    console.log('\n📊 Database Summary:')
    console.log(`   Products: ${backup.counts.products}`)
    console.log(`   Variants: ${backup.counts.variants}`)
    console.log(`   Orders: ${backup.counts.orders}`)
    console.log(`   Customers: ${backup.counts.customers}`)
    console.log(`   Newsletter Subscribers: ${backup.counts.newsletters}`)
    console.log(`   Hero Slides: ${backup.counts.heroSlides}`)
    console.log(`   Notifications: ${backup.counts.notifications}`)
    
    // Check for missing data
    console.log('\n⚠️  Checking for potential issues...')
    if (backup.counts.variants === 0 && backup.counts.products > 0) {
      console.log('   ⚠️  WARNING: No variants found! This might indicate data loss.')
    }
    if (backup.counts.products === 0) {
      console.log('   ⚠️  WARNING: No products found!')
    }
    
  } catch (error) {
    console.error('❌ Backup failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run backup
backupDatabase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })


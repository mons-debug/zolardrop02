const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function restoreBackup(backupFilePath) {
  console.log(`🔄 Starting database restore from: ${backupFilePath}`)
  
  try {
    // Read backup file
    const backupData = JSON.parse(fs.readFileSync(backupFilePath, 'utf8'))
    
    console.log(`\n📅 Backup Date: ${backupData.timestamp}`)
    console.log('\n📊 Backup Contains:')
    console.log(`   Products: ${backupData.counts.products}`)
    console.log(`   Variants: ${backupData.counts.variants}`)
    console.log(`   Orders: ${backupData.counts.orders}`)
    console.log(`   Customers: ${backupData.counts.customers}`)
    console.log(`   Newsletter Subscribers: ${backupData.counts.newsletters}`)
    console.log(`   Hero Slides: ${backupData.counts.heroSlides}`)
    
    console.log('\n⚠️  WARNING: This will restore data to the database.')
    console.log('   For variants, this will ADD missing variants back.')
    console.log('   For products, this will UPDATE existing products.')
    
    // Restore variants only (safer approach)
    console.log('\n🔄 Restoring variants...')
    let variantsRestored = 0
    
    for (const product of backupData.data.products) {
      if (product.variants && product.variants.length > 0) {
        for (const variant of product.variants) {
          // Check if variant exists
          const exists = await prisma.variant.findUnique({
            where: { id: variant.id }
          })
          
          if (!exists) {
            // Restore variant
            await prisma.variant.create({
              data: {
                id: variant.id,
                productId: variant.productId,
                color: variant.color,
                size: variant.size,
                sku: variant.sku,
                priceCents: variant.priceCents,
                stock: variant.stock,
                images: variant.images,
                sizeInventory: variant.sizeInventory,
                description: variant.description,
                showAsProduct: variant.showAsProduct,
                metadata: variant.metadata,
                createdAt: new Date(variant.createdAt),
                updatedAt: new Date(variant.updatedAt)
              }
            })
            variantsRestored++
            console.log(`   ✅ Restored variant: ${variant.color} (${variant.sku})`)
          }
        }
      }
    }
    
    console.log(`\n✅ Restore completed!`)
    console.log(`   Variants restored: ${variantsRestored}`)
    
  } catch (error) {
    console.error('❌ Restore failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Get backup file from command line argument
const backupFile = process.argv[2]

if (!backupFile) {
  console.error('❌ Please provide a backup file path')
  console.log('Usage: node restore-backup.js <backup-file-path>')
  process.exit(1)
}

if (!fs.existsSync(backupFile)) {
  console.error(`❌ Backup file not found: ${backupFile}`)
  process.exit(1)
}

// Run restore
restoreBackup(backupFile)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })


const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function setupMetaPixel() {
    try {
        // Check for existing tracking settings
        const existing = await prisma.trackingSettings.findFirst()

        const pixelId = '757530543681902'

        if (existing) {
            // Update existing settings with Meta Pixel ID
            const updated = await prisma.trackingSettings.update({
                where: { id: existing.id },
                data: {
                    facebookPixelId: pixelId,
                    isActive: true
                }
            })
            console.log('✅ Meta Pixel ID updated successfully!')
            console.log('   Pixel ID:', updated.facebookPixelId)
        } else {
            // Create new tracking settings with Meta Pixel ID
            const created = await prisma.trackingSettings.create({
                data: {
                    facebookPixelId: pixelId,
                    isActive: true
                }
            })
            console.log('✅ Meta Pixel ID created successfully!')
            console.log('   Pixel ID:', created.facebookPixelId)
        }

        console.log('\n🚀 Your Meta Pixel is now active on the website!')
        console.log('   It will track PageViews automatically on all pages.')

    } catch (error) {
        console.error('❌ Error setting up Meta Pixel:', error)
    } finally {
        await prisma.$disconnect()
    }
}

setupMetaPixel()

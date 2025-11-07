import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedArchive() {
  console.log('🎨 Seeding Archive Collection...\n')

  try {
    // Create default archive collection with placeholder images
    const archive = await prisma.archiveCollection.create({
      data: {
        title: 'BORDERLINE',
        subtitle: 'DROP 01',
        images: JSON.stringify([
          {
            url: 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=800&q=80',
            alt: 'Borderline Collection - Model 1'
          },
          {
            url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80',
            alt: 'Borderline Collection - Model 2'
          }
        ]),
        isActive: true
      }
    })

    console.log('✅ Archive Collection created:')
    console.log(`   Title: ${archive.title}`)
    console.log(`   Subtitle: ${archive.subtitle}`)
    console.log(`   Images: 2`)
    console.log('\n✨ Done! Archive Collection is ready.')
    console.log('\n📝 To customize:')
    console.log('   1. Go to /admin/archive')
    console.log('   2. Upload your Drop 01 Borderline images')
    console.log('   3. Save changes')
  } catch (error) {
    console.error('Error seeding archive:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedArchive()



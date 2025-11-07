import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding hero slides...')

  // Check if any hero slides exist
  const existingSlides = await prisma.heroSlide.findMany()
  
  if (existingSlides.length > 0) {
    console.log(`✅ Found ${existingSlides.length} existing hero slides. Skipping seed.`)
    return
  }

  // Create default hero slides
  const slides = [
    {
      title: 'ESSENTIAL TEE',
      subtitle: 'DROP 02',
      mediaUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1920&q=80',
      mediaType: 'image',
      linkUrl: '/products',
      order: 0,
      isActive: true
    },
    {
      title: 'CLASSIC HOODIE',
      subtitle: 'DROP 02',
      mediaUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1920&q=80',
      mediaType: 'image',
      linkUrl: '/products',
      order: 1,
      isActive: true
    },
    {
      title: 'CREW SWEATSHIRT',
      subtitle: 'DROP 02',
      mediaUrl: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=1920&q=80',
      mediaType: 'image',
      linkUrl: '/products',
      order: 2,
      isActive: true
    },
    {
      title: 'PREMIUM JACKET',
      subtitle: 'DROP 02',
      mediaUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1920&q=80',
      mediaType: 'image',
      linkUrl: '/products',
      order: 3,
      isActive: true
    }
  ]

  for (const slide of slides) {
    await prisma.heroSlide.create({ data: slide })
    console.log(`✓ Created slide: ${slide.title}`)
  }

  console.log('✅ Hero slides seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding hero slides:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


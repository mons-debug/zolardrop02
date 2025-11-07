import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🎨 Seeding themed hero slides for DROP 02...')

  // Delete existing slides
  await prisma.heroSlide.deleteMany({})
  console.log('✓ Cleared existing slides')

  // Create 4 themed slides for DROP 02 sweatshirts
  const themedSlides = [
    {
      title: 'Eclipse Black',
      subtitle: 'DROP 02',
      mediaUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1920&q=80',
      mediaType: 'image',
      linkUrl: '/products',
      backgroundColor: '#000000',  // Pure black
      textColor: '#FFFFFF',        // White text
      accentColor: '#666666',      // Gray accent
      order: 0,
      isActive: true
    },
    {
      title: 'Forest Dusk',
      subtitle: 'DROP 02',
      mediaUrl: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=1920&q=80',
      mediaType: 'image',
      linkUrl: '/products',
      backgroundColor: '#1a4d2e',  // Deep forest green
      textColor: '#FFFFFF',        // White text
      accentColor: '#10b981',      // Emerald accent
      order: 1,
      isActive: true
    },
    {
      title: 'Ocean Deep',
      subtitle: 'DROP 02',
      mediaUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1920&q=80',
      mediaType: 'image',
      linkUrl: '/products',
      backgroundColor: '#1e3a8a',  // Deep ocean blue
      textColor: '#FFFFFF',        // White text
      accentColor: '#3b82f6',      // Blue accent
      order: 2,
      isActive: true
    },
    {
      title: 'Cloud Mist',
      subtitle: 'DROP 02',
      mediaUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1920&q=80',
      mediaType: 'image',
      linkUrl: '/products',
      backgroundColor: '#6b7280',  // Gray mist
      textColor: '#FFFFFF',        // White text
      accentColor: '#9ca3af',      // Light gray accent
      order: 3,
      isActive: true
    }
  ]

  for (const slide of themedSlides) {
    await prisma.heroSlide.create({ data: slide })
    console.log(`✓ Created themed slide: ${slide.title} (${slide.backgroundColor})`)
  }

  console.log('\n✨ All 4 themed DROP 02 slides created successfully!')
  console.log('\nThemes:')
  console.log('  1. Eclipse Black   - Pure darkness meets premium comfort')
  console.log('  2. Forest Dusk     - Nature-inspired tranquility')
  console.log('  3. Ocean Deep      - Depths of sophisticated style')
  console.log('  4. Cloud Mist      - Ethereal softness redefined')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding themed slides:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


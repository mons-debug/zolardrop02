import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding collections...')

  // Essence Collection (4 products)
  const essenceProducts = [
    {
      sku: 'ESS-SW-001',
      title: 'Essence Classic Sweatshirt - Black',
      description: 'Clean, minimal design. Everyday essential built for your rhythm. Premium cotton blend for comfort.',
      category: 'essence',
      priceCents: 4500, // $45
      stock: 50,
      images: JSON.stringify(['/products/essence-black.jpg']),
      tags: JSON.stringify(['sweatshirt', 'essence', 'black', 'classic']),
      status: 'published'
    },
    {
      sku: 'ESS-SW-002',
      title: 'Essence Classic Sweatshirt - White',
      description: 'Simple. Clean. Easy to wear. A timeless piece for your everyday wardrobe.',
      category: 'essence',
      priceCents: 4500,
      stock: 50,
      images: JSON.stringify(['/products/essence-white.jpg']),
      tags: JSON.stringify(['sweatshirt', 'essence', 'white', 'classic']),
      status: 'published'
    },
    {
      sku: 'ESS-SW-003',
      title: 'Essence Classic Sweatshirt - Gray',
      description: 'Minimal aesthetic meets maximum comfort. Perfect for building your essential wardrobe.',
      category: 'essence',
      priceCents: 4500,
      stock: 50,
      images: JSON.stringify(['/products/essence-gray.jpg']),
      tags: JSON.stringify(['sweatshirt', 'essence', 'gray', 'classic']),
      status: 'published'
    },
    {
      sku: 'ESS-SW-004',
      title: 'Essence Classic Sweatshirt - Navy',
      description: 'Everyday essentials built for your rhythm. Clean lines and premium materials.',
      category: 'essence',
      priceCents: 4500,
      stock: 50,
      images: JSON.stringify(['/products/essence-navy.jpg']),
      tags: JSON.stringify(['sweatshirt', 'essence', 'navy', 'classic']),
      status: 'published'
    },
  ]

  // Fragment Collection (4 products)
  const fragmentProducts = [
    {
      sku: 'FRAG-SW-001',
      title: 'Fragment Shattered Sweatshirt - White',
      description: 'Bold without trying. Shattered graphics for a confident, effortless look.',
      category: 'fragment',
      priceCents: 4800,
      stock: 50,
      images: JSON.stringify(['/products/fragment-white.jpg']),
      tags: JSON.stringify(['sweatshirt', 'fragment', 'white', 'graphic']),
      status: 'published'
    },
    {
      sku: 'FRAG-SW-002',
      title: 'Fragment Shattered Sweatshirt - Black',
      description: 'Where excuses end. Bold shattered graphics that make a statement.',
      category: 'fragment',
      priceCents: 4800,
      stock: 50,
      images: JSON.stringify(['/products/fragment-black.jpg']),
      tags: JSON.stringify(['sweatshirt', 'fragment', 'black', 'graphic']),
      status: 'published'
    },
    {
      sku: 'FRAG-SW-003',
      title: 'Fragment Shattered Sweatshirt - Orange',
      description: 'Confident style that speaks without words. Signature shattered motifs.',
      category: 'fragment',
      priceCents: 4800,
      stock: 50,
      images: JSON.stringify(['/products/fragment-orange.jpg']),
      tags: JSON.stringify(['sweatshirt', 'fragment', 'orange', 'graphic']),
      status: 'published'
    },
    {
      sku: 'FRAG-SW-004',
      title: 'Fragment Shattered Sweatshirt - Gray',
      description: 'The break. Shattered motifs symbolizing your disconnection from the old.',
      category: 'fragment',
      priceCents: 4800,
      stock: 50,
      images: JSON.stringify(['/products/fragment-gray.jpg']),
      tags: JSON.stringify(['sweatshirt', 'fragment', 'gray', 'graphic']),
      status: 'published'
    },
  ]

  // Recode Collection (4 products - marked as coming soon)
  const recodeProducts = [
    {
      sku: 'REC-SW-001',
      title: 'Recode Text Sweatshirt - Gray',
      description: 'Made for the new you. Text-driven pieces that reflect your direction.',
      category: 'recode',
      priceCents: 5000,
      stock: 0, // Coming soon
      images: JSON.stringify(['/products/recode-gray.jpg']),
      tags: JSON.stringify(['sweatshirt', 'recode', 'gray', 'text']),
      status: 'draft' // Not published yet
    },
    {
      sku: 'REC-SW-002',
      title: 'Recode Text Sweatshirt - Black',
      description: 'The mindset rebuilt. Text-driven design for the generation rewriting its future.',
      category: 'recode',
      priceCents: 5000,
      stock: 0,
      images: JSON.stringify(['/products/recode-black.jpg']),
      tags: JSON.stringify(['sweatshirt', 'recode', 'black', 'text']),
      status: 'draft'
    },
    {
      sku: 'REC-SW-003',
      title: 'Recode Text Sweatshirt - White',
      description: 'Built for those who rewrite their own code. The new identity.',
      category: 'recode',
      priceCents: 5000,
      stock: 0,
      images: JSON.stringify(['/products/recode-white.jpg']),
      tags: JSON.stringify(['sweatshirt', 'recode', 'white', 'text']),
      status: 'draft'
    },
    {
      sku: 'REC-SW-004',
      title: 'Recode Text Sweatshirt - Navy',
      description: 'Text-driven pieces that reflect your direction. The uniform of self-evolution.',
      category: 'recode',
      priceCents: 5000,
      stock: 0,
      images: JSON.stringify(['/products/recode-navy.jpg']),
      tags: JSON.stringify(['sweatshirt', 'recode', 'navy', 'text']),
      status: 'draft'
    },
  ]

  // Create all products
  let created = 0
  let skipped = 0

  for (const product of [...essenceProducts, ...fragmentProducts, ...recodeProducts]) {
    try {
      // Check if product already exists
      const existing = await prisma.product.findUnique({
        where: { sku: product.sku }
      })

      if (existing) {
        console.log(`⏭️  Skipped: ${product.title} (already exists)`)
        skipped++
        continue
      }

      // Create product
      const createdProduct = await prisma.product.create({
        data: product
      })

      // Create variants (sizes S, M, L, XL)
      const sizes = ['S', 'M', 'L', 'XL']
      for (const size of sizes) {
        await prisma.variant.create({
          data: {
            productId: createdProduct.id,
            color: product.title.split(' - ')[1] || 'Black',
            sku: `${product.sku}-${size}`,
            priceCents: product.priceCents,
            stock: product.stock > 0 ? Math.floor(product.stock / 4) : 0,
            images: product.images,
            metadata: JSON.stringify({ size })
          }
        })
      }

      console.log(`✅ Created: ${product.title}`)
      created++
    } catch (error) {
      console.error(`❌ Error creating ${product.title}:`, error)
    }
  }

  console.log(`\n🎉 Seeding complete!`)
  console.log(`   Created: ${created} products`)
  console.log(`   Skipped: ${skipped} products`)
  console.log(`   Total variants: ${created * 4}`)
}

main()
  .catch((error) => {
    console.error('Error seeding database:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })









import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const seedProducts = [
  {
    sku: 'TS-BASIC-001',
    title: 'Classic Cotton T-Shirt',
    description: 'Premium 100% cotton t-shirt with a comfortable fit. Perfect for everyday wear.',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f2f95230?w=800&q=80'
    ]),
    priceCents: 2999, // $29.99
    stock: 100,
    variants: [
      {
        color: 'Black',
        sku: 'TS-BASIC-001-BLK',
        priceCents: 2999,
        stock: 25,
        images: JSON.stringify(['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80']),
      },
      {
        color: 'White',
        sku: 'TS-BASIC-001-WHT',
        priceCents: 2999,
        stock: 30,
        images: JSON.stringify(['https://images.unsplash.com/photo-1583743814966-8936f2f95230?w=800&q=80'])
      },
      {
        color: 'Navy',
        sku: 'TS-BASIC-001-NVY',
        priceCents: 2999,
        stock: 20,
        images: JSON.stringify(['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80'])
      },
      {
        color: 'Gray',
        sku: 'TS-BASIC-001-GRY',
        priceCents: 2999,
        stock: 25,
        images: JSON.stringify(['https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80'])
      }
    ]
  },
  {
    sku: 'HD-ZIP-002',
    title: 'Zip-Up Hoodie',
    description: 'Cozy fleece hoodie with full zip closure. Features kangaroo pocket and adjustable drawstring hood.',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500'
    ]),
    priceCents: 5999, // $59.99
    stock: 75,
    variants: [
      {
        color: 'Black',
        sku: 'HD-ZIP-002-BLK',
        priceCents: 5999,
        stock: 20,
        images: JSON.stringify(['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500'])
      },
      {
        color: 'Gray',
        sku: 'HD-ZIP-002-GRY',
        priceCents: 5999,
        stock: 15,
        images: JSON.stringify(['https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500'])
      },
      {
        color: 'Navy',
        sku: 'HD-ZIP-002-NVY',
        priceCents: 5999,
        stock: 20,
        images: JSON.stringify(['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500'])
      },
      {
        color: 'Forest Green',
        sku: 'HD-ZIP-002-FGN',
        priceCents: 6499, // $64.99 - premium color
        stock: 20,
        images: JSON.stringify(['https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500'])
      }
    ]
  },
  {
    sku: 'SW-CREW-003',
    title: 'Crew Neck Sweatshirt',
    description: 'Soft and comfortable crew neck sweatshirt made from organic cotton blend.',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500'
    ]),
    priceCents: 4999, // $49.99
    stock: 60,
    variants: [
      {
        color: 'Heather Gray',
        sku: 'SW-CREW-003-HGR',
        priceCents: 4999,
        stock: 15,
        images: JSON.stringify(['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500'])
      },
      {
        color: 'Black',
        sku: 'SW-CREW-003-BLK',
        priceCents: 4999,
        stock: 15,
        images: JSON.stringify(['https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500'])
      },
      {
        color: 'Burgundy',
        sku: 'SW-CREW-003-BUR',
        priceCents: 5499, // $54.99 - premium color
        stock: 15,
        images: JSON.stringify(['https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500'])
      },
      {
        color: 'Cream',
        sku: 'SW-CREW-003-CRM',
        priceCents: 4999,
        stock: 15,
        images: JSON.stringify(['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500'])
      }
    ]
  },
  {
    sku: 'TK-SLIM-004',
    title: 'Slim Fit Chinos',
    description: 'Versatile slim fit chinos perfect for work or casual wear. Made from stretch cotton twill.',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500'
    ]),
    priceCents: 6999, // $69.99
    stock: 80,
    variants: [
      {
        color: 'Khaki',
        sku: 'TK-SLIM-004-KHK',
        priceCents: 6999,
        stock: 20,
        images: JSON.stringify(['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500'])
      },
      {
        color: 'Navy',
        sku: 'TK-SLIM-004-NVY',
        priceCents: 6999,
        stock: 20,
        images: JSON.stringify(['https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500'])
      },
      {
        color: 'Black',
        sku: 'TK-SLIM-004-BLK',
        priceCents: 6999,
        stock: 20,
        images: JSON.stringify(['https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500'])
      },
      {
        color: 'Olive',
        sku: 'TK-SLIM-004-OLV',
        priceCents: 7499, // $74.99 - premium color
        stock: 20,
        images: JSON.stringify(['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500'])
      }
    ]
  }
]

async function main() {
  console.log('🌱 Starting seed...')

  // Create super admin user if not exists
  console.log('👤 Creating super admin user...')
  const adminEmail = 'admin@zolar.com'
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  })

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('Admin123!', 10)
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'Super Admin',
        passwordHash,
        role: 'SUPER_ADMIN',
        isActive: true
      }
    })
    console.log(`✅ Created super admin user: ${admin.email}`)
    console.log(`   Password: Admin123! (CHANGE THIS IN PRODUCTION!)`)
  } else {
    console.log(`ℹ️  Super admin user already exists: ${adminEmail}`)
  }

  // Delete existing seeded products and their variants to make it idempotent
  const seededSkus = seedProducts.flatMap(product => [
    product.sku,
    ...product.variants.map(variant => variant.sku)
  ])

  console.log('🗑️  Deleting existing seeded products and variants...')
  await prisma.variant.deleteMany({
    where: {
      sku: { in: seededSkus }
    }
  })

  await prisma.product.deleteMany({
    where: {
      sku: { in: seedProducts.map(p => p.sku) }
    }
  })

  // Create products with their variants
  for (const productData of seedProducts) {
    console.log(`📦 Creating product: ${productData.title}`)

    const product = await prisma.product.create({
      data: {
        sku: productData.sku,
        title: productData.title,
        description: productData.description,
        images: productData.images,
        priceCents: productData.priceCents,
        stock: productData.stock,
        variants: {
          create: productData.variants.map(variant => ({
            color: variant.color,
            sku: variant.sku,
            priceCents: variant.priceCents,
            stock: variant.stock,
            images: variant.images
          }))
        }
      },
      include: {
        variants: true
      }
    })

    console.log(`✅ Created product "${product.title}" with ${product.variants.length} variants`)
  }

  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

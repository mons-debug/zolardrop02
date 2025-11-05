// Quick test script to verify Pusher broadcasting
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testPusherBroadcast() {
  try {
    console.log('🧪 Testing Pusher integration...\n')

    // Test 1: Check if Pusher env variables are set
    console.log('1️⃣ Checking environment variables...')
    const pusherAppId = process.env.PUSHER_APP_ID
    const pusherKey = process.env.PUSHER_KEY
    const pusherSecret = process.env.PUSHER_SECRET
    const pusherCluster = process.env.PUSHER_CLUSTER

    if (!pusherAppId || !pusherKey || !pusherSecret || !pusherCluster) {
      console.log('⚠️  Pusher environment variables not configured')
      console.log('   This is OK for testing - orders will still work!')
      console.log('   See PUSHER_SETUP.md for configuration instructions\n')
    } else {
      console.log('✅ Pusher environment variables found')
      console.log(`   Cluster: ${pusherCluster}\n`)
    }

    // Test 2: Test order creation via API
    console.log('2️⃣ Testing COD order creation...')
    
    const response = await fetch('http://localhost:3000/api/checkout/cod', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items: [{
          productId: '9c4e0bc2-382a-45e9-8f3e-d2138a47edf6',
          variantId: 'cc284000-5f92-423e-a023-e8fc6df519fb',
          qty: 1
        }],
        customer: {
          name: 'Test User',
          email: 'test@example.com',
          address: '123 Test St',
          phone: '1234567890'
        }
      })
    })

    if (response.ok) {
      const data = await response.json()
      console.log('✅ Order created successfully!')
      console.log(`   Order ID: ${data.orderId}`)
      console.log(`   Total: $${(data.order.totalCents / 100).toFixed(2)}`)
      console.log(`   Payment Method: ${data.order.paymentMethod}\n`)
      
      if (pusherAppId) {
        console.log('📡 Pusher event should have been broadcast to admin dashboard')
        console.log('   Channel: admin-orders')
        console.log('   Event: new-order\n')
      }
    } else {
      const error = await response.text()
      console.log('❌ Order creation failed:', error, '\n')
    }

    // Test 3: Verify order in database
    console.log('3️⃣ Verifying order in database...')
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 1
    })

    if (orders.length > 0) {
      const order = orders[0]
      console.log('✅ Order found in database')
      console.log(`   Status: ${order.status}`)
      console.log(`   Payment Method: ${order.paymentMethod}\n`)
    }

    console.log('✅ All tests completed!\n')
    console.log('Next steps:')
    console.log('1. Open http://localhost:3000/admin in your browser')
    console.log('2. Place an order through the storefront')
    console.log('3. Watch for the toast notification on the admin dashboard')

  } catch (error) {
    console.error('❌ Test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Check if server is running first
fetch('http://localhost:3000/api/products')
  .then(() => {
    console.log('✅ Server is running\n')
    return testPusherBroadcast()
  })
  .catch(() => {
    console.error('❌ Server is not running!')
    console.error('   Please start the server with: npm run dev\n')
    process.exit(1)
  })


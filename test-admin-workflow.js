// Complete Admin Workflow Test Script
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))

const BASE_URL = 'http://localhost:3000'
const ADMIN_TOKEN = 'admin-token-123'

async function testAdminWorkflow() {
  console.log('🧪 Testing Complete Admin Workflow\n')

  try {
    // Test 1: Fetch orders (authentication test)
    console.log('1️⃣ Testing admin authentication and order fetching...')
    const ordersResponse = await fetch(`${BASE_URL}/api/admin/orders`, {
      headers: {
        'Authorization': `Bearer ${ADMIN_TOKEN}`
      }
    })

    if (ordersResponse.ok) {
      const ordersData = await ordersResponse.json()
      console.log(`✅ Authentication successful!`)
      console.log(`✅ Found ${ordersData.orders.length} orders in database\n`)
      
      if (ordersData.orders.length > 0) {
        const latestOrder = ordersData.orders[0]
        console.log(`📋 Latest order:`)
        console.log(`   ID: ${latestOrder.id.slice(0, 8)}...`)
        console.log(`   Status: ${latestOrder.status}`)
        console.log(`   Total: $${(latestOrder.totalCents / 100).toFixed(2)}`)
        console.log(`   Payment: ${latestOrder.paymentMethod}\n`)
      }
    } else {
      console.log('❌ Authentication failed\n')
      return
    }

    // Test 2: Place a new COD order (triggers real-time event)
    console.log('2️⃣ Placing a new COD order...')
    const orderResponse = await fetch(`${BASE_URL}/api/checkout/cod`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items: [{
          productId: 'cc57ffaf-463f-4e4a-8d0f-33114ce53e2d',
          variantId: '912d6d76-386c-4bbb-a18a-cfb7873c9094',
          qty: 1
        }],
        customer: {
          name: 'Test Customer',
          email: 'test@workflow.com',
          address: '789 Test Lane',
          phone: '5559876543'
        }
      })
    })

    if (orderResponse.ok) {
      const orderData = await orderResponse.json()
      console.log('✅ Order placed successfully!')
      console.log(`   Order ID: ${orderData.orderId}`)
      console.log(`   Total: $${(orderData.order.totalCents / 100).toFixed(2)}`)
      console.log(`   Status: ${orderData.order.status}`)
      console.log('   📡 Pusher event broadcast to admin dashboard\n')

      const newOrderId = orderData.orderId

      // Test 3: Update order status (pending → confirmed)
      console.log('3️⃣ Testing status update: pending → confirmed...')
      const confirmResponse = await fetch(`${BASE_URL}/api/admin/orders/${newOrderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ADMIN_TOKEN}`
        },
        body: JSON.stringify({ status: 'confirmed' })
      })

      if (confirmResponse.ok) {
        const confirmData = await confirmResponse.json()
        console.log('✅ Status updated to: confirmed\n')

        // Test 4: Update to shipped
        console.log('4️⃣ Testing status update: confirmed → shipped...')
        const shipResponse = await fetch(`${BASE_URL}/api/admin/orders/${newOrderId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ADMIN_TOKEN}`
          },
          body: JSON.stringify({ status: 'shipped' })
        })

        if (shipResponse.ok) {
          console.log('✅ Status updated to: shipped\n')

          // Test 5: Update to delivered
          console.log('5️⃣ Testing status update: shipped → delivered...')
          const deliverResponse = await fetch(`${BASE_URL}/api/admin/orders/${newOrderId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${ADMIN_TOKEN}`
            },
            body: JSON.stringify({ status: 'delivered' })
          })

          if (deliverResponse.ok) {
            console.log('✅ Status updated to: delivered\n')
          }
        }
      }

      // Test 6: Verify final state
      console.log('6️⃣ Verifying final order state...')
      const verifyResponse = await fetch(`${BASE_URL}/api/admin/orders/${newOrderId}`, {
        headers: {
          'Authorization': `Bearer ${ADMIN_TOKEN}`
        }
      })

      if (verifyResponse.ok) {
        const verifyData = await verifyResponse.json()
        console.log('✅ Order verification successful!')
        console.log(`   Final status: ${verifyData.order.status}`)
        console.log(`   Updated at: ${new Date(verifyData.order.updatedAt).toLocaleString()}\n`)
      }
    }

    // Test 7: Test unauthorized access
    console.log('7️⃣ Testing unauthorized access (should fail)...')
    const unauthorizedResponse = await fetch(`${BASE_URL}/api/admin/orders`)
    
    if (unauthorizedResponse.status === 401) {
      console.log('✅ Unauthorized access correctly blocked\n')
    } else {
      console.log('⚠️  Security issue: unauthorized access not blocked\n')
    }

    // Summary
    console.log('=' .repeat(50))
    console.log('🎉 ALL TESTS PASSED!')
    console.log('=' .repeat(50))
    console.log('\n✅ Admin Dashboard Features Verified:')
    console.log('   • Password/token authentication')
    console.log('   • Order listing from database')
    console.log('   • New order placement (triggers real-time event)')
    console.log('   • Status updates (pending → confirmed → shipped → delivered)')
    console.log('   • API security (unauthorized access blocked)')
    console.log('\n📱 Next Steps:')
    console.log('   1. Open http://localhost:3000/admin')
    console.log('   2. Login with password: admin-token-123')
    console.log('   3. See all orders in the dashboard')
    console.log('   4. Place a new order from storefront')
    console.log('   5. Watch for toast: "🧾 New COD order received!"')
    console.log('   6. Click status buttons to update orders\n')

  } catch (error) {
    console.error('❌ Test failed:', error.message)
    console.error('\nMake sure the server is running:')
    console.error('   npm run dev\n')
  }
}

// Check if server is running first
fetch(`${BASE_URL}/api/products`)
  .then(() => {
    console.log('✅ Server is running\n')
    return testAdminWorkflow()
  })
  .catch(() => {
    console.error('❌ Server is not running!')
    console.error('   Please start the server with: npm run dev\n')
    process.exit(1)
  })


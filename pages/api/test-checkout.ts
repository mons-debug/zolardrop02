import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Test 1: Check database connection
    const customerCount = await prisma.customer.count()
    console.log('✅ Database connected. Customers:', customerCount)

    // Test 2: Get a product variant to test with
    const variant = await prisma.variant.findFirst({
      where: { stock: { gt: 0 } },
      include: { product: true }
    })

    if (!variant) {
      return res.status(500).json({
        success: false,
        error: 'No products with stock available',
        tests: {
          database: '✅ Connected',
          products: '❌ No products found'
        }
      })
    }

    console.log('✅ Found product:', variant.product.title)

    // Test 3: Try to create a test order
    const testCustomer = {
      name: 'Test Customer',
      email: '0612345678@placeholder.com',
      phone: '0612345678',
      address: 'Test City'
    }

    const testOrderData = {
      items: [{
        productId: variant.productId,
        variantId: variant.id,
        qty: 1
      }],
      customer: testCustomer,
      shippingCents: 0
    }

    // Make a real API call to checkout
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000'
    
    console.log('📤 Testing checkout API at:', `${baseUrl}/api/checkout/cod`)
    
    const checkoutResponse = await fetch(`${baseUrl}/api/checkout/cod`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testOrderData)
    })

    const checkoutData = await checkoutResponse.json()
    console.log('📥 Checkout response:', checkoutResponse.status, checkoutData)

    res.status(200).json({
      success: true,
      message: 'Checkout API test completed',
      tests: {
        database: '✅ Connected',
        products: `✅ Found: ${variant.product.title}`,
        checkout: checkoutResponse.ok ? '✅ Working' : '❌ Failed'
      },
      checkoutResponse: {
        status: checkoutResponse.status,
        data: checkoutData
      },
      testData: testOrderData
    })

  } catch (error: any) {
    console.error('❌ Test failed:', error)
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    })
  }
}


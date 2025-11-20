import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { pusherServer } from '@/lib/pusher'

interface CheckoutItem {
  productId: string
  variantId: string
  qty: number
}

interface CustomerInfo {
  name: string
  email: string
  address: string
  phone: string
}

interface CheckoutRequest {
  items: CheckoutItem[]
  customer: CustomerInfo
  shippingCents?: number
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequest = await request.json()
    const { items, customer, shippingCents = 0 } = body

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { message: 'Items array is required and cannot be empty' },
        { status: 400 }
      )
    }

    if (!customer || !customer.name || !customer.email || !customer.address || !customer.phone) {
      return NextResponse.json(
        { message: 'Customer information is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(customer.email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Calculate subtotal and validate stock for each item
    let subtotalCents = 0
    const stockValidationPromises = items.map(async (item) => {
      const variant = await prisma.variant.findUnique({
        where: { id: item.variantId },
        include: { product: true }
      })

      if (!variant) {
        throw new Error(`Variant ${item.variantId} not found`)
      }

      if (variant.stock < item.qty) {
        throw new Error(`Insufficient stock for ${variant.product.title} (${variant.color}). Available: ${variant.stock}, requested: ${item.qty}`)
      }

      subtotalCents += variant.priceCents * item.qty
      return { variant, qty: item.qty }
    })

    const stockResults = await Promise.all(stockValidationPromises)

    // Calculate totals
    const taxCents = 0 // No tax for COD
    const totalCents = subtotalCents + taxCents + shippingCents

    // Find or create customer
    let dbCustomer = await prisma.customer.findUnique({
      where: { phone: customer.phone }
    })

    if (!dbCustomer) {
      // Create new customer
      dbCustomer = await prisma.customer.create({
        data: {
          name: customer.name,
          phone: customer.phone,
          city: customer.address, // Using address field as city
          email: customer.email !== `${customer.phone}@placeholder.com` ? customer.email : null,
          totalOrders: 1,
          totalSpent: totalCents,
          tags: JSON.stringify(['New'])
        }
      })
    } else {
      // Update existing customer stats
      const newTotalOrders = dbCustomer.totalOrders + 1
      const newTotalSpent = dbCustomer.totalSpent + totalCents
      
      // Auto-assign loyalty tags
      let tags = ['New']
      if (newTotalOrders >= 10) {
        tags = ['Premium', 'VIP']
      } else if (newTotalOrders >= 5) {
        tags = ['VIP']
      } else if (newTotalOrders >= 2) {
        tags = ['Regular']
      }
      
      if (newTotalSpent > 50000) { // $500+
        tags.push('High Value')
      }

      dbCustomer = await prisma.customer.update({
        where: { id: dbCustomer.id },
        data: {
          totalOrders: newTotalOrders,
          totalSpent: newTotalSpent,
          tags: JSON.stringify(tags),
          // Update name/city if provided (in case customer info changed)
          name: customer.name,
          city: customer.address
        }
      })
    }

    // Create order linked to customer
    const order = await prisma.order.create({
      data: {
        customerId: dbCustomer.id,
        subtotalCents,
        taxCents,
        shippingCents,
        totalCents,
        paymentMethod: 'COD',
        status: 'pending',
        // Store items as JSON string for now (could be improved with proper relations)
        items: JSON.stringify(items.map(item => ({
          productId: item.productId,
          variantId: item.variantId,
          qty: item.qty,
          priceCents: stockResults.find(r => r.variant.id === item.variantId)?.variant.priceCents || 0
        })))
      }
    })

    // Update stock for each variant (decrement)
    const stockUpdatePromises = stockResults.map(({ variant, qty }) =>
      prisma.variant.update({
        where: { id: variant.id },
        data: { stock: { decrement: qty } }
      })
    )

    await Promise.all(stockUpdatePromises)

    // Check for low stock and send notifications
    try {
      const updatedVariants = await prisma.variant.findMany({
        where: {
          id: { in: items.map(item => item.variantId) }
        },
        include: {
          product: {
            select: { title: true, sku: true }
          }
        }
      })

      const lowStockItems = updatedVariants.filter(v => v.stock < 5 && v.stock > 0)
      
      if (lowStockItems.length > 0) {
        console.log(`⚠️ Low stock detected for ${lowStockItems.length} item(s)`)
        for (const item of lowStockItems) {
          try {
            await pusherServer.trigger('admin-orders', 'low-stock', {
              id: item.id,
              productTitle: item.product.title,
              productSku: item.product.sku,
              variantColor: item.color,
              stock: item.stock,
              message: `Low stock alert: ${item.product.title} (${item.color}) - Only ${item.stock} left`
            })
            console.log(`📤 Low stock alert sent for: ${item.product.title} (${item.color})`)
          } catch (stockError) {
            console.error('❌ Failed to send low stock alert:', stockError)
          }
        }
      }
    } catch (error) {
      console.error('❌ Error checking/sending low stock alerts:', error)
    }

    // Broadcast new order to admin dashboard via Pusher
    console.log('🔔 Attempting to send Pusher notification...')
    console.log('📍 Pusher Config Check:', {
      hasAppId: !!process.env.PUSHER_APP_ID,
      hasKey: !!process.env.PUSHER_KEY,
      hasSecret: !!process.env.PUSHER_SECRET,
      cluster: process.env.PUSHER_CLUSTER
    })
    
    try {
      const pusherPayload = {
        id: order.id,
        totalCents: order.totalCents,
        paymentMethod: 'COD',
        customer: {
          id: dbCustomer.id,
          name: dbCustomer.name,
          phone: dbCustomer.phone,
          city: dbCustomer.city,
          totalOrders: dbCustomer.totalOrders,
          tags: dbCustomer.tags
        },
        createdAt: order.createdAt,
        itemCount: items.length
      }
      
      console.log('📤 Triggering Pusher event with payload:', JSON.stringify(pusherPayload, null, 2))
      
      await pusherServer.trigger('admin-orders', 'new-order', pusherPayload)
      console.log('✅ Pusher event sent successfully!')
    } catch (pusherError) {
      console.error('❌ Failed to send Pusher notification:', pusherError)
      // Don't fail the order if Pusher fails
    }

    // Send success response
    return NextResponse.json({
      success: true,
      orderId: order.id,
      message: 'Order placed successfully',
      order: {
        id: order.id,
        subtotalCents,
        taxCents,
        shippingCents,
        totalCents,
        status: order.status,
        paymentMethod: order.paymentMethod
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating COD order:', error)

    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return NextResponse.json({ message: error.message }, { status: 404 })
      }

      if (error.message.includes('Insufficient stock')) {
        return NextResponse.json({ message: error.message }, { status: 400 })
      }

      // Return the actual error message for debugging
      return NextResponse.json({ message: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}


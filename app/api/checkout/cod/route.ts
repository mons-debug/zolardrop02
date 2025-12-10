import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { pusherServer } from '@/lib/pusher'
import { rateLimit, getClientIdentifier } from '@/lib/rate-limit'

interface CheckoutItem {
  productId: string
  variantId: string
  qty: number
  size?: string
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
  // Rate limiting: 5 checkouts per minute per IP
  const identifier = getClientIdentifier(request)
  const rateLimitResult = rateLimit(identifier, { limit: 5, windowSeconds: 60 })

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { message: 'Too many checkout attempts. Please try again later.' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': '5',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
        }
      }
    )
  }

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
      // First try to find as a variant
      let variant = await prisma.variant.findUnique({
        where: { id: item.variantId },
        include: { product: true }
      })

      // Track if we're using product data directly (no variant)
      let useProductDirectly = false
      let productData: any = null

      // If not found, check if it's a product ID (fallback for products without variants)
      if (!variant) {
        const product = await prisma.product.findUnique({
          where: { id: item.variantId },
          include: {
            variants: {
              take: 1,
              orderBy: { createdAt: 'asc' }
            }
          }
        })

        if (product && product.variants.length > 0) {
          // Use the first variant of the product
          const firstVariant = await prisma.variant.findUnique({
            where: { id: product.variants[0].id },
            include: { product: true }
          })
          variant = firstVariant
        } else if (product) {
          // Product exists but has no variants - use product data directly
          // This is valid for products with sizeInventory directly on the product
          useProductDirectly = true
          productData = product
        }
      }

      // Handle the case where we're using product data directly
      if (useProductDirectly && productData) {
        // Check stock at product level
        if (productData.stock < item.qty) {
          throw new Error(`Insufficient stock for ${productData.title}. Available: ${productData.stock}, requested: ${item.qty}`)
        }

        subtotalCents += productData.priceCents * item.qty
        return {
          variant: null,
          product: productData,
          qty: item.qty,
          useProductDirectly: true
        }
      }

      if (!variant) {
        throw new Error(`Product or variant not found. Please refresh your cart and try again.`)
      }

      if (variant.stock < item.qty) {
        throw new Error(`Insufficient stock for ${variant.product.title} (${variant.color}). Available: ${variant.stock}, requested: ${item.qty}`)
      }

      subtotalCents += variant.priceCents * item.qty
      return { variant, qty: item.qty, useProductDirectly: false }
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

    // Generate unique order ID (e.g., ORD-20251201-A1B2C3)
    const generateOrderId = () => {
      const date = new Date()
      const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
      const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase()
      return `ORD-${dateStr}-${randomStr}`
    }

    const uniqueOrderId = generateOrderId()

    // Create order linked to customer
    const order = await prisma.order.create({
      data: {
        orderId: uniqueOrderId,
        customerId: dbCustomer.id,
        subtotalCents,
        taxCents,
        shippingCents,
        totalCents,
        paymentMethod: 'COD',
        status: 'pending',
        // Store items as JSON string for now (could be improved with proper relations)
        items: JSON.stringify(items.map(item => {
          const result = stockResults.find(r =>
            (r.variant && r.variant.id === item.variantId) ||
            (r.product && r.product.id === item.variantId)
          )
          const priceCents = result?.variant?.priceCents || result?.product?.priceCents || 0
          return {
            productId: item.productId,
            variantId: item.variantId,
            qty: item.qty,
            priceCents,
            size: item.size // Include size if available
          }
        }))
      }
    })

    // Update stock for each variant or product (decrement)
    const stockUpdatePromises = stockResults.map((result) => {
      if (result.useProductDirectly && result.product) {
        // Product without variants - update product stock directly
        return prisma.product.update({
          where: { id: result.product.id },
          data: { stock: { decrement: result.qty } }
        })
      } else if (result.variant) {
        // Normal variant - update variant stock
        return prisma.variant.update({
          where: { id: result.variant.id },
          data: { stock: { decrement: result.qty } }
        })
      }
      return null
    }).filter(Boolean)

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
        for (const item of lowStockItems) {
          // Store low stock notification in database
          try {
            await prisma.adminNotification.create({
              data: {
                type: 'low-stock',
                title: '⚠️ Low Stock Alert',
                message: `${item.product.title} (${item.color}) - Only ${item.stock} left`,
                data: JSON.stringify({
                  id: item.id,
                  productTitle: item.product.title,
                  productSku: item.product.sku,
                  variantColor: item.color,
                  stock: item.stock
                })
              }
            })
          } catch (dbError) {
            if (process.env.NODE_ENV === 'development') {
              console.error('Failed to store low stock notification:', dbError)
            }
          }

          // Send real-time Pusher notification
          try {
            await pusherServer.trigger('admin-orders', 'low-stock', {
              id: item.id,
              productTitle: item.product.title,
              productSku: item.product.sku,
              variantColor: item.color,
              stock: item.stock,
              message: `Low stock alert: ${item.product.title} (${item.color}) - Only ${item.stock} left`
            })
          } catch (stockError) {
            if (process.env.NODE_ENV === 'development') {
              console.error('Failed to send low stock alert:', stockError)
            }
          }

          // Send push notification for low stock
          try {
            await fetch(`${process.env.NEXTAUTH_URL || 'https://zolar.ma'}/api/push/send`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                title: '⚠️ Low Stock Alert',
                body: `${item.product.title} (${item.color}) - Only ${item.stock} left`,
                url: `/zolargestion/products/${item.product.sku}`,
                tag: 'low-stock'
              })
            })
          } catch (pushError) {
            if (process.env.NODE_ENV === 'development') {
              console.error('Failed to send low stock push notification:', pushError)
            }
            // Don't fail the order if push fails
          }
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error checking/sending low stock alerts:', error)
      }
    }

    // Store notification in database (persists even if admin is offline)
    const loyaltyBadge = dbCustomer.totalOrders >= 10 ? '👑' :
      dbCustomer.totalOrders >= 5 ? '💎' :
        dbCustomer.totalOrders >= 2 ? '⭐' : '🆕'

    try {
      await prisma.adminNotification.create({
        data: {
          type: 'new-order',
          title: `${loyaltyBadge} New Order from ${dbCustomer.name}`,
          message: `${dbCustomer.phone} • ${dbCustomer.city || 'N/A'} • ${(order.totalCents / 100).toFixed(2)} MAD`,
          data: JSON.stringify({
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
          })
        }
      })
    } catch (dbError) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to store notification in database:', dbError)
      }
    }

    // Broadcast new order to admin dashboard via Pusher (for real-time updates)
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

      await pusherServer.trigger('admin-orders', 'new-order', pusherPayload)
    } catch (pusherError) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to send Pusher notification:', pusherError)
      }
      // Don't fail the order if Pusher fails
    }

    // Send push notification to admin devices
    try {
      await fetch(`${process.env.NEXTAUTH_URL || 'https://zolar.ma'}/api/push/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: '🎉 New Order Received!',
          body: `Order from ${dbCustomer.name} - ${(totalCents / 100).toFixed(2)} MAD`,
          url: `/zolargestion/orders/${order.id}`,
          orderId: order.id
        })
      })
    } catch (pushError) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to send push notification:', pushError)
      }
      // Don't fail the order if push fails
    }

    // Send success response
    return NextResponse.json({
      success: true,
      orderId: order.orderId,  // Human-readable ID like ORD-20251201-A1B2C3
      internalId: order.id,    // Database UUID for API lookups
      message: 'Order placed successfully',
      order: {
        id: order.id,
        orderId: order.orderId,
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


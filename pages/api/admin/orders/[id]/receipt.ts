import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

interface OrderItem {
  productId: string
  variantId: string
  qty: number
  priceCents: number
  title?: string
  variantName?: string
  size?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  // Check authentication (optional - can be public for customers)
  // For now, we'll allow it without auth since it's accessed from thank you page
  // If you want to restrict, uncomment:
  // const user = await requireAdmin(req, res)
  // if (!user) return

  try {
    const { id } = req.query
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Order ID is required' })
    }

    // Fetch order
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: true
      }
    })

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    // Parse order items
    const items: OrderItem[] = JSON.parse(order.items || '[]')
    
    // Fetch product details for items
    const itemsWithDetails = await Promise.all(
      items.map(async (item) => {
        try {
          const product = await prisma.product.findUnique({
            where: { id: item.productId },
            select: { title: true, sku: true }
          })
          return {
            ...item,
            title: product?.title || 'Unknown Product',
            sku: product?.sku || 'N/A'
          }
        } catch (err) {
          return item
        }
      })
    )

    // Generate HTML receipt
    const receiptHtml = generateReceiptHTML(order, itemsWithDetails, order.customer)

    // Set headers for PDF download
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.setHeader('Content-Disposition', `attachment; filename="receipt-${order.id.slice(0, 8).toUpperCase()}.html"`)
    
    res.status(200).send(receiptHtml)
  } catch (error) {
    console.error('Error generating receipt:', error)
    res.status(500).json({ message: 'Failed to generate receipt' })
  }
}

function generateReceiptHTML(order: any, items: OrderItem[], customer: any) {
  const formatPrice = (cents: number) => {
    return `${(cents / 100).toFixed(2)} DH`
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Receipt - Order ${order.id.slice(0, 8).toUpperCase()}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      padding: 40px;
      background: #f5f5f5;
      color: #333;
    }
    .receipt {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #ff5b00;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      font-size: 32px;
      color: #000;
      margin-bottom: 10px;
      font-weight: bold;
    }
    .header p {
      color: #666;
      font-size: 14px;
    }
    .order-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 30px;
    }
    .info-section h3 {
      font-size: 12px;
      text-transform: uppercase;
      color: #999;
      margin-bottom: 8px;
      letter-spacing: 1px;
    }
    .info-section p {
      font-size: 16px;
      color: #333;
      font-weight: 500;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    .items-table thead {
      background: #f9f9f9;
      border-bottom: 2px solid #eee;
    }
    .items-table th {
      padding: 12px;
      text-align: left;
      font-size: 12px;
      text-transform: uppercase;
      color: #666;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    .items-table td {
      padding: 16px 12px;
      border-bottom: 1px solid #eee;
      font-size: 14px;
    }
    .items-table tbody tr:last-child td {
      border-bottom: none;
    }
    .total-section {
      border-top: 2px solid #eee;
      padding-top: 20px;
      margin-top: 20px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 14px;
    }
    .total-row.grand-total {
      font-size: 20px;
      font-weight: bold;
      padding-top: 16px;
      border-top: 2px solid #ff5b00;
      margin-top: 16px;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      text-align: center;
      color: #999;
      font-size: 12px;
    }
    @media print {
      body {
        background: white;
        padding: 0;
      }
      .receipt {
        box-shadow: none;
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="header">
      <h1>ZOLAR</h1>
      <p>Order Receipt</p>
    </div>
    
    <div class="order-info">
      <div class="info-section">
        <h3>Order ID</h3>
        <p>#${order.id.slice(0, 8).toUpperCase()}</p>
      </div>
      <div class="info-section">
        <h3>Order Date</h3>
        <p>${formatDate(order.createdAt)}</p>
      </div>
      <div class="info-section">
        <h3>Customer</h3>
        <p>${customer?.name || 'N/A'}</p>
      </div>
      <div class="info-section">
        <h3>Phone</h3>
        <p>${customer?.phone || 'N/A'}</p>
      </div>
      <div class="info-section">
        <h3>City</h3>
        <p>${customer?.city || 'N/A'}</p>
      </div>
      <div class="info-section">
        <h3>Status</h3>
        <p>${order.status.toUpperCase()}</p>
      </div>
    </div>
    
    <table class="items-table">
      <thead>
        <tr>
          <th>Item</th>
          <th>Variant</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${items.map(item => `
          <tr>
            <td>${item.title || 'Product'}</td>
            <td>${item.variantName || item.size || 'N/A'}</td>
            <td>${item.qty}</td>
            <td>${formatPrice(item.priceCents)}</td>
            <td>${formatPrice(item.priceCents * item.qty)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    
    <div class="total-section">
      <div class="total-row">
        <span>Subtotal:</span>
        <span>${formatPrice(order.subtotalCents)}</span>
      </div>
      <div class="total-row">
        <span>Tax:</span>
        <span>${formatPrice(order.taxCents)}</span>
      </div>
      <div class="total-row">
        <span>Shipping:</span>
        <span>${formatPrice(order.shippingCents)}</span>
      </div>
      <div class="total-row grand-total">
        <span>Total:</span>
        <span>${formatPrice(order.totalCents)}</span>
      </div>
    </div>
    
    <div class="footer">
      <p>Thank you for your purchase!</p>
      <p>Payment Method: ${order.paymentMethod}</p>
      <p>For any inquiries, please contact us.</p>
    </div>
  </div>
</body>
</html>
  `
}


'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import CustomerBadge from '@/components/admin/CustomerBadge'

interface Product {
  id: string
  title: string
  images?: string
  sku: string
}

interface OrderItem {
  productId: string
  variantId: string
  qty: number
  priceCents: number
  product?: Product
  color?: string
}

interface Customer {
  id: string
  name: string
  phone: string
  city: string | null
  email: string | null
  totalOrders: number
  totalSpent: number
  tags: string | null
  orders?: Order[]
}

interface Order {
  id: string
  customerId: string | null
  customer: Customer | null
  items: string
  subtotalCents: number
  taxCents: number
  shippingCents: number
  totalCents: number
  status: string
  paymentMethod: string
  paymentId: string | null
  refundReason: string | null
  adminNotes: string | null
  createdAt: string
  updatedAt: string
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string

  const [order, setOrder] = useState<Order | null>(null)
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [editingNotes, setEditingNotes] = useState(false)
  const [adminNotes, setAdminNotes] = useState('')
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    if (orderId) {
      fetchOrder()
    }
  }, [orderId])

  const fetchOrder = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/orders/${orderId}`)
      
      if (response.ok) {
        const data = await response.json()
        setOrder(data.order)
        setAdminNotes(data.order.adminNotes || '')
        
        // Parse items and fetch product details
        const items = JSON.parse(data.order.items) as OrderItem[]
        
        // Fetch product details for each item
        const itemsWithProducts = await Promise.all(
          items.map(async (item) => {
            try {
              const productRes = await fetch(`/api/products/${item.productId}`)
              if (productRes.ok) {
                const productData = await productRes.json()
                return { ...item, product: productData.product }
              }
            } catch (err) {
              console.error('Failed to fetch product:', err)
            }
            return item
          })
        )
        
        setOrderItems(itemsWithProducts)
      } else {
        showToast('Failed to load order')
      }
    } catch (error) {
      console.error('Error fetching order:', error)
      showToast('Error loading order')
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (newStatus: string) => {
    if (!confirm(`Are you sure you want to mark this order as ${newStatus}?`)) {
      return
    }

    try {
      setUpdating(true)
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        const data = await response.json()
        setOrder(data.order)
        showToast(`Order marked as ${newStatus}`)
      } else {
        const error = await response.json()
        showToast(error.message || 'Failed to update order')
      }
    } catch (error) {
      console.error('Error updating order:', error)
      showToast('Error updating order')
    } finally {
      setUpdating(false)
    }
  }

  const saveAdminNotes = async () => {
    try {
      setUpdating(true)
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminNotes })
      })

      if (response.ok) {
        const data = await response.json()
        setOrder(data.order)
        setEditingNotes(false)
        showToast('Notes saved successfully')
      } else {
        showToast('Failed to save notes')
      }
    } catch (error) {
      console.error('Error saving notes:', error)
      showToast('Error saving notes')
    } finally {
      setUpdating(false)
    }
  }

  const refundOrder = async () => {
    const reason = prompt('Please enter a refund reason:')
    if (!reason) return

    try {
      setUpdating(true)
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'refunded',
          refundReason: reason
        })
      })

      if (response.ok) {
        const data = await response.json()
        setOrder(data.order)
        showToast('Order refunded successfully')
      } else {
        showToast('Failed to refund order')
      }
    } catch (error) {
      console.error('Error refunding order:', error)
      showToast('Error refunding order')
    } finally {
      setUpdating(false)
    }
  }

  const cancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return

    try {
      setUpdating(true)
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' })
      })

      if (response.ok) {
        const data = await response.json()
        setOrder(data.order)
        showToast('Order cancelled successfully')
      } else {
        showToast('Failed to cancel order')
      }
    } catch (error) {
      console.error('Error cancelling order:', error)
      showToast('Error cancelling order')
    } finally {
      setUpdating(false)
    }
  }

  const showToast = (message: string) => {
    setToast(message)
    setTimeout(() => setToast(null), 3000)
  }

  const formatPrice = (cents: number) => {
    return `${(cents / 100).toFixed(2)} MAD`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-300'
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'refunded':
        return 'bg-red-100 text-red-800 border-red-300'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-600">Loading order...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Order not found</p>
          <Link href="/admin/orders" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
            ← Back to Orders
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg">
            {toast}
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/admin/orders"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
                <p className="text-gray-600 mt-1">Order #{order.id.slice(0, 8)}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className={`px-4 py-2 rounded-lg text-sm font-semibold border ${getStatusColor(order.status)}`}>
                {order.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Products */}
            <div className="bg-white rounded-lg shadow border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Products ({orderItems.length})</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {orderItems.map((item, index) => {
                  const images = item.product?.images ? JSON.parse(item.product.images) : []
                  const firstImage = images[0] || '/placeholder.png'
                  
                  return (
                    <div key={index} className="px-6 py-4 flex items-center space-x-4">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={firstImage}
                          alt={item.product?.title || 'Product'}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/product/${item.product?.sku || item.productId}`}
                          className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                        >
                          {item.product?.title || 'Unknown Product'}
                        </Link>
                        <p className="text-sm text-gray-500 mt-0.5">
                          Color: {item.color || 'N/A'} • SKU: {item.product?.sku || item.productId.slice(0, 8)}
                        </p>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {formatPrice(item.priceCents)} × {item.qty}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">
                          {formatPrice(item.priceCents * item.qty)}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
              
              {/* Order Totals */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900 font-medium">{formatPrice(order.subtotalCents)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900 font-medium">{formatPrice(order.shippingCents)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="text-gray-900 font-medium">{formatPrice(order.taxCents)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-300">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">{formatPrice(order.totalCents)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Notes */}
            <div className="bg-white rounded-lg shadow border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Admin Notes</h2>
                {!editingNotes && (
                  <button
                    onClick={() => setEditingNotes(true)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Edit
                  </button>
                )}
              </div>
              <div className="px-6 py-4">
                {editingNotes ? (
                  <div className="space-y-3">
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Add internal notes about this order..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
                      rows={4}
                    />
                    <div className="flex space-x-3">
                      <button
                        onClick={saveAdminNotes}
                        disabled={updating}
                        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 font-medium"
                      >
                        Save Notes
                      </button>
                      <button
                        onClick={() => {
                          setEditingNotes(false)
                          setAdminNotes(order.adminNotes || '')
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600 text-sm whitespace-pre-wrap">
                    {order.adminNotes || 'No notes yet'}
                  </p>
                )}
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-lg shadow border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Order Timeline</h2>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Order Created</p>
                    <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
                
                {order.updatedAt !== order.createdAt && (
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Last Updated</p>
                      <p className="text-sm text-gray-500">{formatDate(order.updatedAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Customer & Actions */}
          <div className="space-y-6">
            {/* Customer Info */}
            {order.customer && (
              <div className="bg-white rounded-lg shadow border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Customer</h2>
                </div>
                <div className="px-6 py-4 space-y-4">
                  <div>
                    <Link
                      href={`/admin/customers/${order.customer.id}`}
                      className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      {order.customer.name}
                    </Link>
                    <div className="mt-2">
                      <CustomerBadge
                        totalOrders={order.customer.totalOrders}
                        totalSpent={order.customer.totalSpent}
                        size="md"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <a href={`tel:${order.customer.phone}`} className="text-gray-600 hover:text-blue-600">
                        {order.customer.phone}
                      </a>
                    </div>
                    
                    {order.customer.city && (
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-gray-600">{order.customer.city}</span>
                      </div>
                    )}
                    
                    {order.customer.email && (
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <a href={`mailto:${order.customer.email}`} className="text-gray-600 hover:text-blue-600">
                          {order.customer.email}
                        </a>
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-3 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{order.customer.totalOrders}</p>
                        <p className="text-xs text-gray-500 mt-1">Orders</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{formatPrice(order.customer.totalSpent)}</p>
                        <p className="text-xs text-gray-500 mt-1">Total Spent</p>
                      </div>
                    </div>
                  </div>
                  
                  <Link
                    href={`/admin/customers/${order.customer.id}`}
                    className="block text-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    View Full Profile →
                  </Link>
                </div>
              </div>
            )}

            {/* Payment Info */}
            <div className="bg-white rounded-lg shadow border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Payment</h2>
              </div>
              <div className="px-6 py-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Method</span>
                  <span className="text-gray-900 font-medium">{order.paymentMethod}</span>
                </div>
                {order.paymentId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment ID</span>
                    <span className="text-gray-900 font-mono text-xs">{order.paymentId}</span>
                  </div>
                )}
                {order.refundReason && (
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-gray-600 font-medium mb-1">Refund Reason:</p>
                    <p className="text-gray-900">{order.refundReason}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="px-6 py-4 space-y-2">
                {order.status === 'pending' && (
                  <button
                    onClick={() => updateOrderStatus('confirmed')}
                    disabled={updating}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
                  >
                    ✓ Confirm Order
                  </button>
                )}
                
                {order.status === 'confirmed' && (
                  <button
                    onClick={() => updateOrderStatus('shipped')}
                    disabled={updating}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 font-medium"
                  >
                    📦 Mark as Shipped
                  </button>
                )}
                
                {order.status === 'shipped' && (
                  <button
                    onClick={() => updateOrderStatus('delivered')}
                    disabled={updating}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 font-medium"
                  >
                    ✓ Mark as Delivered
                  </button>
                )}
                
                {(order.status === 'pending' || order.status === 'confirmed') && (
                  <>
                    <button
                      onClick={cancelOrder}
                      disabled={updating}
                      className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium"
                    >
                      Cancel Order
                    </button>
                    
                    <button
                      onClick={refundOrder}
                      disabled={updating}
                      className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 font-medium"
                    >
                      💰 Issue Refund
                    </button>
                  </>
                )}
                
                {order.customer && (
                  <>
                    <a
                      href={`tel:${order.customer.phone}`}
                      className="block w-full px-4 py-2 border border-gray-300 text-center text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      📞 Call Customer
                    </a>
                    
                    <a
                      href={`https://wa.me/${order.customer.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full px-4 py-2 border border-green-300 text-center text-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium"
                    >
                      💬 WhatsApp
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


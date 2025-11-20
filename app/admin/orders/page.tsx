'use client'

import { useEffect, useState } from 'react'
import { pusherClient } from '@/lib/pusher-client'
import CustomerBadge from '@/components/admin/CustomerBadge'
import Link from 'next/link'

interface Customer {
  id: string
  name: string
  phone: string
  city: string | null
  totalOrders: number
  totalSpent: number
  tags: string | null
}

interface Order {
  id: string
  totalCents: number
  paymentMethod: string
  status: string
  createdAt: string
  items?: string
  customer?: Customer | null
  adminNotes?: string | null
  refundReason?: string | null
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    // Apply filters
    if (statusFilter === 'all') {
      setFilteredOrders(orders)
    } else {
      setFilteredOrders(orders.filter(order => order.status === statusFilter))
    }
  }, [orders, statusFilter])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/orders')
      
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  // Note: Pusher subscription is handled by NotificationSystem in layout
  // We listen for a custom event to refresh data
  useEffect(() => {
    const handleNewOrder = () => {
      console.log('📱 New order event received - refreshing orders')
      setToast('New order received!')
      fetchOrders()
      setTimeout(() => setToast(null), 5000)
    }

    window.addEventListener('new-order-event', handleNewOrder)

    return () => {
      window.removeEventListener('new-order-event', handleNewOrder)
    }
  }, [])

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingOrderId(orderId)
      
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ))
        setToast(`Order status updated to ${newStatus}`)
        setTimeout(() => setToast(null), 3000)
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to update order status')
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Failed to update order status')
    } finally {
      setUpdatingOrderId(null)
    }
  }

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const isNewOrder = (createdAt: string) => {
    const orderTime = new Date(createdAt).getTime()
    const now = Date.now()
    const fiveMinutes = 5 * 60 * 1000
    return (now - orderTime) < fiveMinutes
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'refunded':
        return 'bg-red-100 text-red-800'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-full">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{toast}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
              <p className="text-gray-600 mt-1">Manage and track all customer orders</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-700 font-medium">Live</span>
              </div>
              <button
                onClick={fetchOrders}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4 mb-6">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Filter by status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="refunded">Refunded</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <span className="text-sm text-gray-500">
              Showing {filteredOrders.length} of {orders.length} orders
            </span>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="text-gray-600 mt-4">Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-gray-600 text-lg">No orders found</p>
              <p className="text-gray-500 text-sm mt-2">
                {statusFilter !== 'all' ? 'Try changing the filter' : 'Waiting for new orders...'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Loyalty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr 
                      key={order.id} 
                      className={`hover:bg-gray-50 transition-colors ${
                        isNewOrder(order.createdAt) 
                          ? 'bg-blue-50 border-l-4 border-l-blue-500 animate-pulse' 
                          : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <Link 
                            href={order.customer ? `/admin/customers/${order.customer.id}` : '#'}
                            className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                          >
                            {order.customer?.name || 'Unknown Customer'}
                          </Link>
                          <span className="text-xs text-gray-500 mt-0.5">
                            {order.customer?.phone || 'No phone'}
                          </span>
                          {order.customer?.city && (
                            <span className="text-xs text-gray-400 mt-0.5">
                              📍 {order.customer.city}
                            </span>
                          )}
                          <span className="text-xs text-gray-400 mt-1 font-mono">
                            #{order.id.slice(0, 8)}
                          </span>
                          {isNewOrder(order.createdAt) && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-blue-500 text-white mt-1 animate-pulse">
                              ⚡ NEW
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {order.customer && (
                          <CustomerBadge 
                            totalOrders={order.customer.totalOrders}
                            totalSpent={order.customer.totalSpent}
                            size="sm"
                          />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">
                          {formatPrice(order.totalCents)}
                        </span>
                        <span className="block text-xs text-gray-500 mt-0.5">
                          {order.paymentMethod}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(order.status)}`}>
                          {order.status}
                        </span>
                        {order.refundReason && (
                          <span className="block text-xs text-gray-500 mt-1">
                            {order.refundReason}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex flex-col space-y-1">
                          {order.status === 'pending' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'confirmed')}
                              disabled={updatingOrderId === order.id}
                              className="text-blue-600 hover:text-blue-900 font-medium disabled:opacity-50 text-left"
                            >
                              ✓ Confirm
                            </button>
                          )}
                          {order.status === 'confirmed' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'shipped')}
                              disabled={updatingOrderId === order.id}
                              className="text-purple-600 hover:text-purple-900 font-medium disabled:opacity-50 text-left"
                            >
                              📦 Ship
                            </button>
                          )}
                          {order.status === 'shipped' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'delivered')}
                              disabled={updatingOrderId === order.id}
                              className="text-green-600 hover:text-green-900 font-medium disabled:opacity-50 text-left"
                            >
                              ✓ Deliver
                            </button>
                          )}
                          {(order.status === 'pending' || order.status === 'confirmed') && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'refunded')}
                              disabled={updatingOrderId === order.id}
                              className="text-red-600 hover:text-red-900 font-medium disabled:opacity-50 text-left"
                            >
                              💰 Refund
                            </button>
                          )}
                          {order.customer && (
                            <Link
                              href={`/admin/customers/${order.customer.id}`}
                              className="text-gray-600 hover:text-gray-900 font-medium text-left"
                            >
                              👤 Profile
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}


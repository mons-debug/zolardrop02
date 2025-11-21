'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import CustomerBadge from '@/components/admin/CustomerBadge'

interface Order {
  id: string
  totalCents: number
  paymentMethod: string
  status: string
  createdAt: string
  items?: string
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
  notes: string | null
  isBlocked: boolean
  createdAt: string
  updatedAt: string
  orders: Order[]
}

export default function CustomerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const customerId = params.id as string

  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [editingNotes, setEditingNotes] = useState(false)
  const [notes, setNotes] = useState('')
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    if (customerId) {
      fetchCustomer()
    }
  }, [customerId])

  const fetchCustomer = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/customers/${customerId}`)

      if (response.ok) {
        const data = await response.json()
        setCustomer(data.customer)
        setNotes(data.customer.notes || '')
      } else {
        showToast('Failed to load customer')
      }
    } catch (error) {
      console.error('Error fetching customer:', error)
      showToast('Error loading customer')
    } finally {
      setLoading(false)
    }
  }

  const updateCustomer = async (updateData: any) => {
    try {
      setUpdating(true)
      const response = await fetch(`/api/admin/customers/${customerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })

      if (response.ok) {
        const data = await response.json()
        setCustomer(data.customer)
        showToast('Customer updated successfully')
        return true
      } else {
        const error = await response.json()
        showToast(error.message || 'Failed to update customer')
        return false
      }
    } catch (error) {
      console.error('Error updating customer:', error)
      showToast('Error updating customer')
      return false
    } finally {
      setUpdating(false)
    }
  }

  const trackExternalAction = async (actionType: 'whatsapp' | 'phone' | 'email') => {
    try {
      await fetch('/api/admin/actions/external', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actionType,
          entityType: 'customer',
          entityId: customerId,
          metadata: { customerPhone: customer?.phone, customerEmail: customer?.email }
        })
      })
    } catch (error) {
      // Silent fail - don't interrupt user action
      console.error('Failed to track external action:', error)
    }
  }

  const saveNotes = async () => {
    const success = await updateCustomer({ notes })
    if (success) {
      setEditingNotes(false)
    }
  }

  const toggleBlocked = async () => {
    if (!customer) return
    
    const action = customer.isBlocked ? 'unblock' : 'block'
    if (!confirm(`Are you sure you want to ${action} this customer?`)) return

    await updateCustomer({ isBlocked: !customer.isBlocked })
  }

  const markAsVIP = async () => {
    if (!customer) return
    
    const currentTags = customer.tags ? JSON.parse(customer.tags) : []
    if (currentTags.includes('VIP')) {
      showToast('Customer is already VIP')
      return
    }
    
    const newTags = [...currentTags, 'VIP']
    await updateCustomer({ tags: JSON.stringify(newTags) })
    showToast('Customer marked as VIP')
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

  const getItemCount = (order: Order) => {
    try {
      const items = JSON.parse(order.items || '[]')
      return items.reduce((sum: number, item: any) => sum + (item.qty || 0), 0)
    } catch {
      return 0
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-600">Loading customer...</p>
        </div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Customer not found</p>
          <Link href="/admin/customers" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
            ← Back to Customers
          </Link>
        </div>
      </div>
    )
  }

  const customerTags = customer.tags ? JSON.parse(customer.tags) : []
  const averageOrderValue = customer.totalOrders > 0 ? customer.totalSpent / customer.totalOrders : 0

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
                href="/admin/customers"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{customer.name}</h1>
                <p className="text-gray-600 mt-1">Customer Profile</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <CustomerBadge
                totalOrders={customer.totalOrders}
                totalSpent={customer.totalSpent}
                size="lg"
              />
              {customer.isBlocked && (
                <span className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-100 text-red-800 border border-red-300">
                  🚫 BLOCKED
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Customer Info & Stats */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase">Phone</label>
                  <div className="mt-1 flex items-center space-x-2">
                    <a href={`tel:${customer.phone}`} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                      {customer.phone}
                    </a>
                  </div>
                </div>

                {customer.email && (
                  <div>
                    <label className="text-xs text-gray-500 uppercase">Email</label>
                    <div className="mt-1">
                      <a href={`mailto:${customer.email}`} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                        {customer.email}
                      </a>
                    </div>
                  </div>
                )}

                {customer.city && (
                  <div>
                    <label className="text-xs text-gray-500 uppercase">City</label>
                    <p className="text-sm font-medium text-gray-900 mt-1">{customer.city}</p>
                  </div>
                )}

                <div>
                  <label className="text-xs text-gray-500 uppercase">Customer Since</label>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {new Date(customer.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                {customerTags.length > 0 && (
                <div>
                    <label className="text-xs text-gray-500 uppercase">Tags</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {customerTags.map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                </div>
              </div>

              {/* Stats */}
            <div className="bg-white rounded-lg shadow border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Statistics</h2>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Orders</span>
                  <span className="text-2xl font-bold text-gray-900">{customer.totalOrders}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Spent</span>
                  <span className="text-2xl font-bold text-gray-900">{formatPrice(customer.totalSpent)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Average Order</span>
                  <span className="text-2xl font-bold text-gray-900">{formatPrice(Math.round(averageOrderValue))}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="px-6 py-4 space-y-2">
                <a
                  href={`tel:${customer.phone}`}
                  onClick={() => trackExternalAction('phone')}
                  className="block w-full px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  📞 Call Customer
                </a>
                
                <a
                  href={`https://wa.me/${customer.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackExternalAction('whatsapp')}
                  className="block w-full px-4 py-2 bg-green-600 text-white text-center rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  💬 WhatsApp
                </a>
                
                {customer.email && (
                  <a
                    href={`mailto:${customer.email}`}
                    onClick={() => trackExternalAction('email')}
                    className="block w-full px-4 py-2 border border-gray-300 text-center text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    ✉️ Send Email
                  </a>
                )}
                
                <button
                  onClick={markAsVIP}
                  disabled={updating || customerTags.includes('VIP')}
                  className="w-full px-4 py-2 border border-purple-300 text-center text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium disabled:opacity-50"
                >
                  💎 Mark as VIP
                </button>
                
                <button
                  onClick={toggleBlocked}
                  disabled={updating}
                  className={`w-full px-4 py-2 border text-center rounded-lg transition-colors font-medium disabled:opacity-50 ${
                    customer.isBlocked 
                      ? 'border-green-300 text-green-600 hover:bg-green-50'
                      : 'border-red-300 text-red-600 hover:bg-red-50'
                  }`}
                >
                  {customer.isBlocked ? '✓ Unblock Customer' : '🚫 Block Customer'}
                </button>
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
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add internal notes about this customer..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
                      rows={4}
                    />
                    <div className="flex space-x-3">
                    <button
                      onClick={saveNotes}
                        disabled={updating}
                        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 font-medium"
                    >
                      Save Notes
                    </button>
                      <button
                        onClick={() => {
                          setEditingNotes(false)
                          setNotes(customer.notes || '')
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600 text-sm whitespace-pre-wrap">
                    {customer.notes || 'No notes yet'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Order History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Order History ({customer.orders.length})</h2>
              </div>

              {customer.orders.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="text-gray-600 text-lg">No orders yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Items
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {customer.orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link
                              href={`/admin/orders/${order.id}`}
                              className="text-sm font-mono text-blue-600 hover:text-blue-800"
                            >
                              #{order.id.slice(0, 8)}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">{getItemCount(order)} items</span>
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
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link
                              href={`/admin/orders/${order.id}`}
                              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                              View →
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

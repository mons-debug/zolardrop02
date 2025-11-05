'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import CustomerBadge from '@/components/admin/CustomerBadge'

interface Order {
  id: string
  totalCents: number
  status: string
  paymentMethod: string
  createdAt: string
  items: string
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
  orders: Order[]
}

export default function CustomerProfilePage() {
  const params = useParams()
  const router = useRouter()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [editingNotes, setEditingNotes] = useState(false)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (params?.id) {
      fetchCustomer(params.id as string)
    }
  }, [params?.id])

  const fetchCustomer = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/customers/${id}`, {
        headers: {
          'Authorization': 'Bearer admin-token-123'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setCustomer(data.customer)
        setNotes(data.customer.notes || '')
      } else {
        alert('Customer not found')
        router.push('/admin/customers')
      }
    } catch (error) {
      console.error('Error fetching customer:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateCustomer = async (updates: any) => {
    if (!customer) return

    try {
      const response = await fetch(`/api/admin/customers/${customer.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': 'Bearer admin-token-123',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      })

      if (response.ok) {
        await fetchCustomer(customer.id)
        return true
      }
      return false
    } catch (error) {
      console.error('Error updating customer:', error)
      return false
    }
  }

  const saveNotes = async () => {
    const success = await updateCustomer({ notes })
    if (success) {
      setEditingNotes(false)
      alert('Notes saved successfully')
    } else {
      alert('Failed to save notes')
    }
  }

  const toggleBlock = async () => {
    if (!customer) return
    const confirmed = confirm(
      customer.isBlocked
        ? 'Are you sure you want to unblock this customer?'
        : 'Are you sure you want to block this customer?'
    )
    if (!confirmed) return

    const success = await updateCustomer({ isBlocked: !customer.isBlocked })
    if (success) {
      alert(customer.isBlocked ? 'Customer unblocked' : 'Customer blocked')
    }
  }

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'refunded': return 'bg-red-100 text-red-800'
      case 'cancelled': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-600">Loading customer profile...</p>
        </div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <p className="text-gray-600">Customer not found</p>
      </div>
    )
  }

  const avgOrderValue = customer.totalOrders > 0 ? customer.totalSpent / customer.totalOrders : 0

  return (
    <div className="min-h-full">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/customers"
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back to Customers
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleBlock}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  customer.isBlocked
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {customer.isBlocked ? 'Unblock Customer' : 'Block Customer'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Customer Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{customer.name}</h2>
                {customer.isBlocked && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    🚫 Blocked
                  </span>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase">Phone</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{customer.phone}</p>
                </div>

                {customer.city && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase">City</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">📍 {customer.city}</p>
                  </div>
                )}

                {customer.email && customer.email.indexOf('@placeholder') === -1 && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Email</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">{customer.email}</p>
                  </div>
                )}

                <div>
                  <p className="text-xs text-gray-500 uppercase">Customer Since</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {new Date(customer.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase mb-2">Loyalty Status</p>
                  <CustomerBadge
                    totalOrders={customer.totalOrders}
                    totalSpent={customer.totalSpent}
                    size="md"
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Orders</span>
                  <span className="text-sm font-semibold text-gray-900">{customer.totalOrders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Spent</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatPrice(customer.totalSpent)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Average Order</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatPrice(Math.round(avgOrderValue))}
                  </span>
                </div>
              </div>

              {/* Admin Notes */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-gray-500 uppercase">Admin Notes</p>
                  <button
                    onClick={() => setEditingNotes(!editingNotes)}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    {editingNotes ? 'Cancel' : 'Edit'}
                  </button>
                </div>
                {editingNotes ? (
                  <div className="space-y-2">
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="Add notes about this customer..."
                    />
                    <button
                      onClick={saveNotes}
                      className="w-full px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800"
                    >
                      Save Notes
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">
                    {customer.notes || 'No notes yet'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Order History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Order History</h2>
                <p className="text-sm text-gray-600 mt-1">{customer.orders.length} total orders</p>
              </div>

              {customer.orders.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <p className="text-gray-600">No orders yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Order ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {customer.orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-mono text-gray-900">
                              #{order.id.slice(0, 8)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-semibold text-gray-900">
                              {formatPrice(order.totalCents)}
                            </span>
                            <span className="block text-xs text-gray-500">
                              {order.paymentMethod}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(order.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <Link
                              href={`/admin/orders`}
                              className="text-blue-600 hover:text-blue-900 font-medium"
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


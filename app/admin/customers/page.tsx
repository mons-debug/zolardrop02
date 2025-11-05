'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import CustomerBadge from '@/components/admin/CustomerBadge'

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
  _count?: {
    orders: number
  }
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchCustomers()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [customers, filter, search])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/customers', {
        headers: {
          'Authorization': 'Bearer admin-token-123'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setCustomers(data.customers || [])
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...customers]

    // Apply filter
    if (filter === 'vip') {
      filtered = filtered.filter(c => c.totalOrders >= 5)
    } else if (filter === 'new') {
      filtered = filtered.filter(c => c.totalOrders < 2)
    } else if (filter === 'regular') {
      filtered = filtered.filter(c => c.totalOrders >= 2 && c.totalOrders < 5)
    } else if (filter === 'premium') {
      filtered = filtered.filter(c => c.totalOrders >= 10)
    } else if (filter === 'blocked') {
      filtered = filtered.filter(c => c.isBlocked)
    } else if (filter === 'high-value') {
      filtered = filtered.filter(c => c.totalSpent > 50000)
    }

    // Apply search
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(searchLower) ||
        c.phone.includes(search) ||
        (c.city && c.city.toLowerCase().includes(searchLower))
      )
    }

    setFilteredCustomers(filtered)
  }

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="min-h-full">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
              <p className="text-gray-600 mt-1">Manage customer relationships and track loyalty</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchCustomers}
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Customers</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{customers.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">New Customers</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {customers.filter(c => c.totalOrders < 2).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🆕</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">VIP Customers</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {customers.filter(c => c.totalOrders >= 5).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💎</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Premium</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {customers.filter(c => c.totalOrders >= 10).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👑</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Filter:</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
              >
                <option value="all">All Customers</option>
                <option value="new">New (less than 2 orders)</option>
                <option value="regular">Regular (2-4 orders)</option>
                <option value="vip">VIP (5-9 orders)</option>
                <option value="premium">Premium (10+ orders)</option>
                <option value="high-value">High Value ($500+)</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>

            <div className="flex items-center space-x-2 flex-1 md:max-w-md">
              <input
                type="text"
                placeholder="Search by name, phone, or city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="px-3 py-2 text-gray-600 hover:text-gray-900"
                >
                  ✕
                </button>
              )}
            </div>

            <span className="text-sm text-gray-500">
              Showing {filteredCustomers.length} of {customers.length}
            </span>
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="text-gray-600 mt-4">Loading customers...</p>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-gray-600 text-lg">No customers found</p>
              <p className="text-gray-500 text-sm mt-2">
                {search || filter !== 'all' ? 'Try adjusting your filters' : 'Customers will appear here after their first order'}
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
                      Loyalty Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Orders
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Spent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <Link
                            href={`/admin/customers/${customer.id}`}
                            className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                          >
                            {customer.name}
                          </Link>
                          <span className="text-xs text-gray-500 mt-0.5">{customer.phone}</span>
                          {customer.city && (
                            <span className="text-xs text-gray-400 mt-0.5">📍 {customer.city}</span>
                          )}
                          {customer.isBlocked && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 mt-1 w-fit">
                              🚫 Blocked
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <CustomerBadge
                          totalOrders={customer.totalOrders}
                          totalSpent={customer.totalSpent}
                          size="sm"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">{customer.totalOrders}</span>
                        <span className="text-xs text-gray-500 ml-1">orders</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">
                          {formatPrice(customer.totalSpent)}
                        </span>
                        {customer.totalOrders > 0 && (
                          <span className="block text-xs text-gray-500 mt-0.5">
                            Avg: {formatPrice(Math.round(customer.totalSpent / customer.totalOrders))}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(customer.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                          href={`/admin/customers/${customer.id}`}
                          className="text-blue-600 hover:text-blue-900 font-medium"
                        >
                          View Profile →
                        </Link>
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

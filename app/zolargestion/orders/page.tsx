'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { pusherClient } from '@/lib/pusher-client'
import CustomerBadge from '@/components/admin/CustomerBadge'

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
    orderId: string | null  // Human-readable order ID like ORD-20251201-A1B2C3
    customerId: string | null
    items: string
    subtotalCents: number
    taxCents: number
    shippingCents: number
    totalCents: number
    status: string
    paymentMethod: string
    refundReason: string | null
    adminNotes: string | null
    createdAt: string
    updatedAt: string
    customer: Customer | null
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState('all')
    const [search, setSearch] = useState('')
    const [toast, setToast] = useState<string | null>(null)

    useEffect(() => {
        fetchOrders()

        const channel = pusherClient.subscribe('admin-orders')

        channel.bind('new-order', () => {
            setToast('New order received!')
            fetchOrders()
            try {
                const audio = new Audio('/notification.mp3')
                audio.play().catch(() => { })
            } catch { }
        })

        return () => {
            channel.unbind('new-order')
            pusherClient.unsubscribe('admin-orders')
        }
    }, [])

    useEffect(() => {
        applyFilters()
    }, [orders, statusFilter, search])

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000)
            return () => clearTimeout(timer)
        }
    }, [toast])

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

    const applyFilters = () => {
        let filtered = [...orders]

        if (statusFilter !== 'all') {
            filtered = filtered.filter(o => o.status === statusFilter)
        }

        if (search) {
            const searchLower = search.toLowerCase()
            filtered = filtered.filter(o =>
                o.id.toLowerCase().includes(searchLower) ||
                o.orderId?.toLowerCase().includes(searchLower) ||
                (o.customer?.name?.toLowerCase().includes(searchLower)) ||
                (o.customer?.phone?.includes(search)) ||
                (o.customer?.city?.toLowerCase().includes(searchLower))
            )
        }

        setFilteredOrders(filtered)
    }

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        try {
            const response = await fetch(`/api/admin/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            })

            if (response.ok) {
                setToast(`Order updated to ${newStatus}`)
                fetchOrders()
            }
        } catch (error) {
            console.error('Error updating order:', error)
        }
    }

    const formatPrice = (cents: number) => {
        return `${(cents / 100).toFixed(2)} MAD`
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
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

    const getNextStatus = (currentStatus: string): string | null => {
        switch (currentStatus.toLowerCase()) {
            case 'pending':
                return 'confirmed'
            case 'confirmed':
                return 'shipped'
            case 'shipped':
                return 'delivered'
            default:
                return null
        }
    }

    const getStatusAction = (currentStatus: string): string | null => {
        switch (currentStatus.toLowerCase()) {
            case 'pending':
                return 'Confirm'
            case 'confirmed':
                return 'Ship'
            case 'shipped':
                return 'Deliver'
            default:
                return null
        }
    }

    const parseItems = (itemsJson: string) => {
        try {
            return JSON.parse(itemsJson)
        } catch {
            return []
        }
    }

    return (
        <div className="min-h-full">
            {toast && (
                <div className="fixed top-4 right-4 z-50 bg-black text-white px-6 py-3 rounded-lg shadow-lg animate-slide-in">
                    {toast}
                </div>
            )}

            <header className="bg-white border-b border-gray-200">
                <div className="px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
                            <p className="text-gray-600 mt-1">Manage and track all customer orders</p>
                        </div>
                        <div className="flex items-center space-x-3">
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

            <main className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Orders</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{orders.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">📦</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Pending</p>
                                <p className="text-3xl font-bold text-yellow-600 mt-2">
                                    {orders.filter(o => o.status === 'pending').length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">⏳</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Confirmed</p>
                                <p className="text-3xl font-bold text-blue-600 mt-2">
                                    {orders.filter(o => o.status === 'confirmed').length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">✅</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Shipped</p>
                                <p className="text-3xl font-bold text-purple-600 mt-2">
                                    {orders.filter(o => o.status === 'shipped').length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">🚚</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Delivered</p>
                                <p className="text-3xl font-bold text-green-600 mt-2">
                                    {orders.filter(o => o.status === 'delivered').length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">🎉</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow border border-gray-200 p-4 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
                        <div className="flex items-center space-x-4">
                            <label className="text-sm font-medium text-gray-700">Status:</label>
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
                        </div>

                        <div className="flex items-center space-x-2 flex-1 md:max-w-md">
                            <input
                                type="text"
                                placeholder="Search by order ID, customer name, phone, or city..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch('')}
                                    className="px-3 py-2 text-gray-600 hover:text-gray-900"
                                >
                                    X
                                </button>
                            )}
                        </div>

                        <span className="text-sm text-gray-500">
                            Showing {filteredOrders.length} of {orders.length}
                        </span>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow border border-gray-200">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                            <p className="text-gray-600 mt-4">Loading orders...</p>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            <p className="text-gray-600 text-lg">No orders found</p>
                            <p className="text-gray-500 text-sm mt-2">
                                {search || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Orders will appear here when customers place them'}
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
                                            Order Details
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
                                    {filteredOrders.map((order) => {
                                        const items = parseItems(order.items)
                                        const nextStatus = getNextStatus(order.status)
                                        const statusAction = getStatusAction(order.status)

                                        return (
                                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col space-y-1">
                                                        {order.customer ? (
                                                            <>
                                                                <Link
                                                                    href={`/zolargestion/customers/${order.customer.id}`}
                                                                    className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                                                                >
                                                                    {order.customer.name}
                                                                </Link>
                                                                <span className="text-xs text-gray-500">{order.customer.phone}</span>
                                                                {order.customer.city && (
                                                                    <span className="text-xs text-gray-400">📍 {order.customer.city}</span>
                                                                )}
                                                                <CustomerBadge
                                                                    totalOrders={order.customer.totalOrders}
                                                                    totalSpent={order.customer.totalSpent}
                                                                    size="sm"
                                                                />
                                                            </>
                                                        ) : (
                                                            <span className="text-sm text-gray-500">Guest Customer</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col space-y-1">
                                                        <Link
                                                            href={`/zolargestion/orders/${order.id}`}
                                                            className="text-xs font-mono text-blue-600 hover:text-blue-800 font-semibold"
                                                        >
                                                            {order.orderId || `#${order.id.slice(0, 8)}`}
                                                        </Link>
                                                        <span className="text-xs text-gray-500">
                                                            {items.length} item{items.length !== 1 ? 's' : ''}
                                                        </span>
                                                        <span className="text-xs text-gray-400">{order.paymentMethod}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm font-semibold text-gray-900">
                                                        {formatPrice(order.totalCents)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(order.status)}`}>
                                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(order.createdAt)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <div className="flex items-center space-x-2">
                                                        <Link
                                                            href={`/zolargestion/orders/${order.id}`}
                                                            className="text-blue-600 hover:text-blue-900 font-medium"
                                                        >
                                                            View
                                                        </Link>
                                                        {nextStatus && statusAction && (
                                                            <>
                                                                <span className="text-gray-300">|</span>
                                                                <button
                                                                    onClick={() => updateOrderStatus(order.id, nextStatus)}
                                                                    className="text-green-600 hover:text-green-900 font-medium"
                                                                >
                                                                    {statusAction}
                                                                </button>
                                                            </>
                                                        )}
                                                        {order.status !== 'refunded' && order.status !== 'cancelled' && (
                                                            <>
                                                                <span className="text-gray-300">|</span>
                                                                <button
                                                                    onClick={() => {
                                                                        if (confirm('Are you sure you want to mark this order as refunded?')) {
                                                                            updateOrderStatus(order.id, 'refunded')
                                                                        }
                                                                    }}
                                                                    className="text-red-600 hover:text-red-900 font-medium"
                                                                >
                                                                    Refund
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

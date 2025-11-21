'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface AdminAction {
  id: string
  action: string
  entityType: string
  entityId: string
  description: string | null
  createdAt: string
  user: {
    id: string
    name: string | null
    email: string
    role: string
  }
}

export default function ActivityFeedPage() {
  const [actions, setActions] = useState<AdminAction[]>([])
  const [filter, setFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchActions()
    const interval = setInterval(fetchActions, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [filter])

  const fetchActions = async () => {
    try {
      const params = new URLSearchParams()
      if (filter !== 'all') params.append('entityType', filter)
      
      const res = await fetch(`/api/admin/activity?${params}`)
      if (res.ok) {
        const data = await res.json()
        setActions(data.actions)
      }
    } catch (error) {
      console.error('Failed to fetch actions:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActionIcon = (action: string) => {
    if (action.includes('confirm')) return '✅'
    if (action.includes('ship')) return '📦'
    if (action.includes('deliver')) return '🎉'
    if (action.includes('cancel')) return '❌'
    if (action.includes('refund')) return '💰'
    if (action.includes('block')) return '🚫'
    if (action.includes('unblock')) return '✅'
    if (action.includes('vip')) return '👑'
    return '📝'
  }

  const getActionColor = (action: string) => {
    if (action.includes('confirm')) return 'text-green-600'
    if (action.includes('ship')) return 'text-blue-600'
    if (action.includes('deliver')) return 'text-purple-600'
    if (action.includes('cancel')) return 'text-red-600'
    if (action.includes('refund')) return 'text-orange-600'
    if (action.includes('block')) return 'text-red-600'
    if (action.includes('vip')) return 'text-yellow-600'
    return 'text-gray-600'
  }

  const getEntityLink = (entityType: string, entityId: string) => {
    if (entityType === 'order') return `/admin/orders/${entityId}`
    if (entityType === 'customer') return `/admin/customers/${entityId}`
    if (entityType === 'product') return `/admin/products/${entityId}`
    return '#'
  }

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Activity Feed</h1>
        <p className="text-gray-600">Track all admin actions and changes</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {['all', 'order', 'customer', 'product'].map((filterOption) => (
          <button
            key={filterOption}
            onClick={() => setFilter(filterOption)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === filterOption
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}s
          </button>
        ))}
      </div>

      {/* Activity List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : actions.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No activity found
        </div>
      ) : (
        <div className="space-y-4">
          {actions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                  {getActionIcon(action.action)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">
                        <span className="text-gray-600">{action.user.name || action.user.email}</span>
                        {' '}
                        <span className={getActionColor(action.action)}>
                          {action.action.split('.')[1]}
                        </span>
                        {' '}
                        <Link
                          href={getEntityLink(action.entityType, action.entityId)}
                          className="text-blue-600 hover:underline"
                        >
                          {action.entityType}
                        </Link>
                      </p>
                      {action.description && (
                        <p className="text-sm text-gray-500 mt-1">
                          {action.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                        <span>{formatRelativeTime(action.createdAt)}</span>
                        <span>•</span>
                        <span className="capitalize">{action.user.role.toLowerCase().replace('_', ' ')}</span>
                      </div>
                    </div>

                    {/* View Button */}
                    <Link
                      href={getEntityLink(action.entityType, action.entityId)}
                      className="flex-shrink-0 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Load More */}
      {actions.length >= 20 && (
        <div className="mt-6 text-center">
          <button
            onClick={fetchActions}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  )
}


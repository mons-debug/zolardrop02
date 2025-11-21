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

interface User {
  id: string
  name: string | null
  email: string
  role: string
}

export default function ActivityFeedPage() {
  const [actions, setActions] = useState<AdminAction[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [filter, setFilter] = useState<string>('all')
  const [userFilter, setUserFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const [newActionsCount, setNewActionsCount] = useState(0)

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    fetchActions()
    // Auto-refresh every 5 seconds for real-time feel
    const interval = setInterval(fetchActions, 5000)
    return () => clearInterval(interval)
  }, [filter, userFilter])

  // Also refresh when window regains focus
  useEffect(() => {
    const handleFocus = () => {
      fetchActions()
    }
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [filter, userFilter])

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users')
      if (res.ok) {
        const data = await res.json()
        setUsers(data.users || [])
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    }
  }

  // Update the "last refresh" display every second
  useEffect(() => {
    const timer = setInterval(() => {
      // Force re-render to update the time display
      setLastRefresh(prev => new Date(prev))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const fetchActions = async (showLoader = false) => {
    if (showLoader) setRefreshing(true)
    
    try {
      const params = new URLSearchParams()
      if (filter !== 'all') params.append('entityType', filter)
      if (userFilter !== 'all') params.append('userId', userFilter)
      
      const res = await fetch(`/api/admin/activity?${params}`)
      if (res.ok) {
        const data = await res.json()
        const newActions = data.actions
        
        // Detect new actions
        if (actions.length > 0 && newActions.length > 0) {
          const oldFirstId = actions[0]?.id
          const newFirstId = newActions[0]?.id
          
          if (oldFirstId !== newFirstId) {
            // Count how many new actions
            let count = 0
            for (const action of newActions) {
              if (action.id === oldFirstId) break
              count++
            }
            if (count > 0) {
              setNewActionsCount(count)
              // Clear the badge after 3 seconds
              setTimeout(() => setNewActionsCount(0), 3000)
            }
          }
        }
        
        setActions(newActions)
        setLastRefresh(new Date())
      }
    } catch (error) {
      console.error('Failed to fetch actions:', error)
    } finally {
      setLoading(false)
      if (showLoader) setRefreshing(false)
    }
  }

  const handleManualRefresh = () => {
    fetchActions(true)
  }

  const getActionIcon = (action: string) => {
    // Order actions
    if (action.includes('confirm')) return '✅'
    if (action.includes('ship')) return '📦'
    if (action.includes('deliver')) return '🎉'
    if (action.includes('cancel')) return '❌'
    if (action.includes('refund')) return '💰'
    
    // Customer actions
    if (action.includes('block')) return '🚫'
    if (action.includes('unblock')) return '✅'
    if (action.includes('vip')) return '👑'
    
    // Product actions
    if (action.includes('product.create')) return '➕'
    if (action.includes('product.delete')) return '🗑️'
    if (action.includes('product.price')) return '💵'
    if (action.includes('product.stock')) return '📊'
    if (action.includes('product')) return '🏷️'
    
    // Content actions
    if (action.includes('hero')) return '🎬'
    if (action.includes('carousel')) return '🎠'
    if (action.includes('collection')) return '📚'
    if (action.includes('archive')) return '🗄️'
    
    // Settings actions
    if (action.includes('settings')) return '⚙️'
    
    // Newsletter actions
    if (action.includes('newsletter')) return '📧'
    
    // External actions (WhatsApp, phone, email)
    if (action.includes('whatsapp')) return '💬'
    if (action.includes('phone')) return '📞'
    if (action.includes('email')) return '✉️'
    
    return '📝'
  }

  const getActionColor = (action: string) => {
    // Order actions
    if (action.includes('confirm')) return 'text-green-600'
    if (action.includes('ship')) return 'text-blue-600'
    if (action.includes('deliver')) return 'text-purple-600'
    if (action.includes('cancel')) return 'text-red-600'
    if (action.includes('refund')) return 'text-orange-600'
    
    // Customer actions
    if (action.includes('block')) return 'text-red-600'
    if (action.includes('vip')) return 'text-yellow-600'
    
    // Product actions
    if (action.includes('product.delete')) return 'text-red-600'
    if (action.includes('product.price')) return 'text-green-600'
    if (action.includes('product')) return 'text-blue-600'
    
    // Content actions
    if (action.includes('hero') || action.includes('carousel') || action.includes('collection')) return 'text-indigo-600'
    
    // Settings
    if (action.includes('settings')) return 'text-gray-700'
    
    // Newsletter
    if (action.includes('newsletter')) return 'text-pink-600'
    
    // External actions
    if (action.includes('whatsapp') || action.includes('phone') || action.includes('email')) return 'text-teal-600'
    
    return 'text-gray-600'
  }

  const getEntityLink = (entityType: string, entityId: string) => {
    if (entityType === 'order') return `/admin/orders/${entityId}`
    if (entityType === 'customer') return `/admin/customers/${entityId}`
    if (entityType === 'product') return `/admin/products/${entityId}`
    if (entityType === 'hero') return '/admin/hero'
    if (entityType === 'carousel') return '/admin/carousel'
    if (entityType === 'collection') return '/admin/collection-stacks'
    if (entityType === 'archive') return '/admin/archive'
    if (entityType === 'settings') return '/admin/settings'
    if (entityType === 'newsletter') return '/admin/newsletter'
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

  const formatLastRefresh = () => {
    const seconds = Math.floor((new Date().getTime() - lastRefresh.getTime()) / 1000)
    if (seconds < 5) return 'Just now'
    if (seconds < 60) return `${seconds}s ago`
    return lastRefresh.toLocaleTimeString()
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Activity Feed</h1>
            <p className="text-gray-600">Track all admin actions and changes</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              Updated {formatLastRefresh()}
            </span>
            <button
              onClick={handleManualRefresh}
              disabled={refreshing}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <svg 
                className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        {/* Entity Type Filters */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">Filter by Type</label>
          <div className="flex gap-2 flex-wrap">
            {[
              { value: 'all', label: 'All' },
              { value: 'order', label: 'Orders' },
              { value: 'customer', label: 'Customers' },
              { value: 'product', label: 'Products' },
              { value: 'hero', label: 'Hero Slides' },
              { value: 'collection', label: 'Collections' },
              { value: 'settings', label: 'Settings' },
              { value: 'newsletter', label: 'Newsletter' }
            ].map((filterOption) => (
              <button
                key={filterOption.value}
                onClick={() => setFilter(filterOption.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === filterOption.value
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filterOption.label}
              </button>
            ))}
          </div>
        </div>

        {/* User Filter */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">Filter by User</label>
          <div className="flex gap-2 items-center">
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white"
            >
              <option value="all">All Users</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name || user.email} ({user.role})
                </option>
              ))}
            </select>
            {userFilter !== 'all' && (
              <button
                onClick={() => setUserFilter('all')}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* New Actions Badge */}
      {newActionsCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-4 p-4 bg-green-100 border-2 border-green-500 rounded-lg flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-green-900">
                {newActionsCount} new {newActionsCount === 1 ? 'action' : 'actions'}!
              </p>
              <p className="text-sm text-green-700">Activity updated</p>
            </div>
          </div>
        </motion.div>
      )}

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


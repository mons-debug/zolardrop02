'use client'

import { useEffect, useState } from 'react'

interface TimelineAction {
  id: string
  action: string
  createdAt: string
  user: {
    name: string | null
    email: string
    role: string
  }
  description: string | null
  oldValue: string | null
  newValue: string | null
}

export default function OrderTimeline({ orderId }: { orderId: string }) {
  const [timeline, setTimeline] = useState<TimelineAction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTimeline()
  }, [orderId])

  const fetchTimeline = async () => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/timeline`)
      if (res.ok) {
        const data = await res.json()
        setTimeline(data.timeline)
      }
    } catch (error) {
      console.error('Failed to fetch timeline:', error)
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
    if (action.includes('pending')) return '⏳'
    return '📝'
  }

  const getActionColor = (action: string) => {
    if (action.includes('confirm')) return 'bg-green-100 text-green-700 border-green-200'
    if (action.includes('ship')) return 'bg-blue-100 text-blue-700 border-blue-200'
    if (action.includes('deliver')) return 'bg-purple-100 text-purple-700 border-purple-200'
    if (action.includes('cancel')) return 'bg-red-100 text-red-700 border-red-200'
    if (action.includes('refund')) return 'bg-orange-100 text-orange-700 border-orange-200'
    return 'bg-gray-100 text-gray-700 border-gray-200'
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
    
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Order History</h3>
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (timeline.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Order History</h3>
        <p className="text-gray-500 text-center py-8">No activity yet</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-6">Order History</h3>
      
      <div className="space-y-4">
        {timeline.map((item, index) => (
          <div key={item.id} className="flex gap-4">
            {/* Timeline Line */}
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm ${getActionColor(item.action)}`}>
                {getActionIcon(item.action)}
              </div>
              {index !== timeline.length - 1 && (
                <div className="w-0.5 h-full min-h-[40px] bg-gray-200 my-1" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-gray-900">
                    {item.description || item.action.split('.')[1]}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    by {item.user.name || item.user.email}
                    {' • '}
                    <span className="text-gray-400">{formatRelativeTime(item.createdAt)}</span>
                  </p>
                  
                  {/* Show status change if available */}
                  {item.oldValue && item.newValue && (
                    <div className="mt-2 text-xs text-gray-500">
                      <span className="line-through">{JSON.parse(item.oldValue).status}</span>
                      {' → '}
                      <span className="font-medium text-gray-700">{JSON.parse(item.newValue).status}</span>
                    </div>
                  )}
                </div>

                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(item.action)}`}>
                  {item.action.split('.')[1]}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


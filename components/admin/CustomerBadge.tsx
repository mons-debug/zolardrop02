interface CustomerBadgeProps {
  totalOrders: number
  totalSpent?: number
  size?: 'sm' | 'md' | 'lg'
}

export default function CustomerBadge({ totalOrders, totalSpent = 0, size = 'md' }: CustomerBadgeProps) {
  // Determine badge based on order count
  let badge = { label: 'New', color: 'bg-blue-100 text-blue-800', icon: '🆕' }
  
  if (totalOrders >= 10) {
    badge = { label: 'Premium', color: 'bg-purple-100 text-purple-800', icon: '👑' }
  } else if (totalOrders >= 5) {
    badge = { label: 'VIP', color: 'bg-yellow-100 text-yellow-800', icon: '💎' }
  } else if (totalOrders >= 2) {
    badge = { label: 'Regular', color: 'bg-green-100 text-green-800', icon: '⭐' }
  }

  // High value customer
  if (totalSpent > 50000) { // $500+
    badge = { label: 'High Value', color: 'bg-red-100 text-red-800', icon: '💰' }
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5'
  }

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${badge.color} ${sizeClasses[size]}`}>
      <span>{badge.icon}</span>
      <span>{badge.label}</span>
    </span>
  )
}


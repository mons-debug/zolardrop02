'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Sidebar from '@/components/admin/Sidebar'
import NotificationSystem from '@/components/admin/NotificationSystem'

interface User {
  id: string
  email: string
  name: string | null
  role: string
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Login page doesn't need auth check
  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false)
      return
    }

    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')
        
        if (response.ok) {
          const data = await response.json()
          
          // Check if user has admin role
          if (data.user && ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'VIEWER'].includes(data.user.role)) {
            setUser(data.user)
          } else {
            router.push('/admin/login')
          }
        } else {
          router.push('/admin/login')
        }
      } catch (error) {
        console.error('Auth check error:', error)
        router.push('/admin/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router, isLoginPage, pathname])

  // Show login page without layout
  if (isLoginPage) {
    return <>{children}</>
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show nothing if not authenticated (will redirect)
  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar user={user} />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Notification Bell - Fixed in top right */}
        <div className="fixed top-4 right-8 z-50">
          <NotificationSystem 
            userId={user.id}
            onNewOrder={(data) => {
              // Callback when new order arrives
            }}
          />
        </div>
        
        {children}
      </div>
    </div>
  )
}


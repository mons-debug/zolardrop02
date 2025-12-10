'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'
import { CartProvider } from '@/components/CartContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CustomCursor from '@/components/CustomCursor'
import TrackingScripts from '@/components/TrackingScripts'

// Lazy load CartDrawer since it's only needed when cart is opened
const CartDrawer = dynamic(() => import('@/components/CartDrawer'), {
  ssr: false,
})

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Check if current path is an admin page (both /admin and /zolargestion)
  const isAdminPage = pathname?.startsWith('/admin') || pathname?.startsWith('/zolargestion')

  // Add/remove admin-page class to body based on current page
  useEffect(() => {
    if (isAdminPage) {
      document.body.classList.add('admin-page')
    } else {
      document.body.classList.remove('admin-page')
    }

    return () => {
      document.body.classList.remove('admin-page')
    }
  }, [isAdminPage])

  // For admin pages, render without Navbar and Footer
  if (isAdminPage) {
    return <>{children}</>
  }

  // For regular pages, render with Navbar and Footer
  return (
    <CartProvider>
      <TrackingScripts />
      <CustomCursor />
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
      <CartDrawer />
    </CartProvider>
  )
}



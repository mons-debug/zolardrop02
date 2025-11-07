'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { CartProvider } from '@/components/CartContext'
import CartDrawer from '@/components/CartDrawer'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CustomCursor from '@/components/CustomCursor'
import FloatingActions from '@/components/FloatingActions'

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  // Check if current path is an admin page
  const isAdminPage = pathname?.startsWith('/admin')

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
      <CustomCursor />
      <FloatingActions />
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



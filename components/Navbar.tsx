'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import CartIcon from './CartIcon'
import { motion, AnimatePresence } from 'framer-motion'

interface NavbarProps {
  className?: string
}

interface User {
  id: string
  email: string
  name: string | null
  role: string
}

export default function Navbar({ className = '' }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const pathname = usePathname()
  
  // Force black text on products/shop page
  const isProductsPage = pathname === '/products' || pathname === '/shop'
  const shouldBeBlack = isScrolled || isProductsPage

  useEffect(() => {
    const updateScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', updateScroll)
    return () => window.removeEventListener('scroll', updateScroll)
  }, [])

  // Check if user is logged in as admin
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const data = await response.json()
          if (data.user && ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'VIEWER'].includes(data.user.role)) {
            setUser(data.user)
          }
        }
      } catch (error) {
        // Silently fail - user is not logged in
      }
    }

    checkSession()
  }, [])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  const menuSections = [
    {
      title: 'SHOP',
      links: [
        { href: '/products', label: 'ALL PRODUCTS' },
        { href: '/category/sweatshirts', label: 'SWEATSHIRTS' },
      ],
    },
    {
      title: 'COLLECTIONS',
      links: [
        { href: '/#essence', label: 'ESSENCE' },
        { href: '/#fragment', label: 'FRAGMENT' },
        { href: '/#recode', label: 'RECODE' },
      ],
    },
    {
      title: 'EXPLORE',
      links: [
        { href: '/about', label: 'ABOUT' },
        { href: '/contact', label: 'CONTACT' },
      ],
    },
  ]

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 ${className}`}
        style={{
          background: isScrolled 
            ? 'linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)' 
            : 'transparent',
          backdropFilter: isScrolled ? 'blur(30px) saturate(150%)' : 'blur(5px)',
          borderBottom: isScrolled 
            ? '1px solid rgba(255, 255, 255, 0.08)' 
            : 'none',
          boxShadow: isScrolled 
            ? '0 4px 24px -1px rgba(0, 0, 0, 0.1)' 
            : 'none',
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div className="px-4 sm:px-6 lg:px-8 py-3 lg:py-4">
          <div className="flex items-center justify-between">
            {/* Left Side: Menu Button + Logo */}
            <div className="flex items-center space-x-4 lg:space-x-6">
              {/* Menu Button - Enhanced */}
              <button
                onClick={() => setIsMenuOpen(true)}
                className={`lg:hidden group relative p-2 transition-all duration-300 ${
                  shouldBeBlack ? 'text-black hover:text-orange-500' : 'text-white hover:text-orange-500'
                }`}
                aria-label="Open menu"
                style={{ filter: shouldBeBlack ? 'none' : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }}
              >
                <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/10 rounded-lg transition-all duration-300" />
                <svg
                  className="w-5 h-5 lg:w-6 lg:h-6 relative z-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              {/* Large Logo on Left - Enhanced */}
              <Link href="/" className="group flex items-center">
                <div 
                  className="relative transition-all duration-300 group-hover:scale-105"
                  style={{
                    filter: isScrolled 
                      ? 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))' 
                      : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'
                  }}
                >
                  <svg 
                    className="h-10 sm:h-12 lg:h-14 w-auto transition-all duration-300"
                    viewBox="0 0 1024 1024"
                  >
                    <path 
                      className={`transition-all duration-300 ${
                        isScrolled ? 'fill-black group-hover:fill-orange-500' : 'fill-white group-hover:fill-orange-500'
                      }`}
                      d="M695.72,151.63c-1.72-.45-2,.69-3.01,1.48-12.65,9.99-26.76,23.91-39.01,34.99-80.61,72.95-160.75,146.59-240.97,220.03-72.31,66.2-156.46,123.37-149,234.98,3.45,51.67,39.16,108.9,85.32,132.68,2.96,1.53,7.53,4.78,10.64,3.34l66.02-63.03c.42-2.26-.99-1.38-2.48-1.49-26.54-1.85-47.42.97-65.49-21.53-47.23-58.81-8.99-134.06,38.45-178.5,39.85-37.33,83.45-73.26,124.54-109.46,17.5-15.42,34.97-33.54,52.98-48.02,2.83-2.27,5.85-5.12,9.61-2.58,1.67,1.34,1.5,3.68,1.47,5.59-.05,4.46-7.47,41.81-9.21,44.87-32.46,29.53-65.69,58.3-97.88,88.12-28.25,26.16-49.67,45.37-62.16,83.84l-29.82,75.67,253.02-214.47,56.97-286.52ZM713.71,415.63l-205.98,211.51c-.42,2.26.99,1.38,2.48,1.49,27.96,2.04,57.51-3.6,85.02-2.45,1.05.04,5.92.4,5,2.45l-179.43,125.58c-37.72,34.14-85.72,62.85-122.1,97.9-1.08,1.04-2.33,1.76-1.98,3.51.66.62,14.87-4.71,16.98-5.51,55.93-21.15,118.67-46.1,172.69-71.31,22.29-10.4,38.87-25.8,57.8-41.2,52.52-42.71,104.02-86.74,156.56-129.44.82-.84,1.94-1.43,1.81-2.85-.35-3.81-7.6-11.42-7.04-16.47l-1-.54c-25.25-4.88-51.37-1.75-76.8-4.68-.45-1.73.72-2,1.49-3,2.23-2.9,6.69-6.82,9.49-9.51,19.29-18.5,43.46-41.3,64-58,1.96-1.59,5.3-5.01,7.49-2.48,5.47,9.24,10.42,18.79,16.1,27.9,35.14,56.3,78.82,107.7,121.9,158.1,3.76,4.4,8.16,9.86,12.11,13.89,1.04,1.06,1.44,2.54,3.4,2.09l-140.01-296.99Z"
                    />
                  </svg>
                </div>
                <motion.span
                  className="ml-2 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-lg"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1.2 }}
                >
                  ✦
                </motion.span>
              </Link>
            </div>

            {/* Center Navigation - Desktop Only - Clean Design */}
            <div className="hidden lg:flex items-center space-x-2">
              <Link
                href="/"
                className="group relative px-6 py-2.5"
              >
                <span 
                  className={`relative text-xs font-medium tracking-widest transition-all duration-300 uppercase group-hover:text-orange-500 ${
                    shouldBeBlack ? 'text-black' : 'text-white'
                  }`}
                  style={{ filter: shouldBeBlack ? 'none' : 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))' }}
                >
                  HOME
                </span>
              </Link>
              <Link
                href="/products"
                className="group relative px-6 py-2.5"
              >
                <span 
                  className={`relative text-xs font-medium tracking-widest transition-all duration-300 uppercase group-hover:text-orange-500 ${
                    shouldBeBlack ? 'text-black' : 'text-white'
                  }`}
                  style={{ filter: shouldBeBlack ? 'none' : 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))' }}
                >
                  SHOP
                </span>
              </Link>
              <Link
                href="/about"
                className="group relative px-6 py-2.5"
              >
                <span 
                  className={`relative text-xs font-medium tracking-widest transition-all duration-300 uppercase group-hover:text-orange-500 ${
                    shouldBeBlack ? 'text-black' : 'text-white'
                  }`}
                  style={{ filter: shouldBeBlack ? 'none' : 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))' }}
                >
                  ABOUT
                </span>
              </Link>
            </div>

            {/* Right Icons - Enhanced */}
            <div className="flex items-center space-x-3 lg:space-x-5">
              {/* Search Link - Icon + Text */}
              <Link
                href="/search"
                className={`group flex items-center space-x-1.5 hover:text-orange-500 transition-all duration-300 ${
                  shouldBeBlack ? 'text-black' : 'text-white'
                }`}
                aria-label="Search"
                style={{ filter: shouldBeBlack ? 'none' : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="hidden sm:block text-xs tracking-wider uppercase font-medium">
                SEARCH
                </span>
              </Link>

              {/* Shopping Bag - Enhanced with Badge */}
              <div 
                className="relative"
                style={{ filter: isScrolled ? 'none' : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }}
              >
                <CartIcon isScrolled={isScrolled} />
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Side Menu Overlay - Enhanced Premium Design */}
      <div className="lg:hidden">
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Enhanced Backdrop with Blur & Dark Overlay */}
            <motion.div
              initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
              exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="fixed inset-0 bg-black/50 z-[60]"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Premium Side Menu with Improved Overflow */}
            <motion.div
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ 
                duration: 0.6, 
                ease: [0.22, 1, 0.36, 1],
                opacity: { duration: 0.4 }
              }}
              className="fixed left-0 top-0 bottom-0 w-full sm:w-[450px] bg-white z-[70] shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Decorative Header Gradient - Enhanced */}
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-orange-50/50 to-transparent pointer-events-none z-0" />
              
              {/* Close Button - Enhanced with Animation */}
              <motion.button
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-6 right-6 p-2.5 text-black hover:text-orange-500 transition-all duration-300 group z-20 bg-white/90 backdrop-blur-sm rounded-full hover:bg-orange-50 shadow-lg"
                aria-label="Close menu"
              >
                <svg
                  className="w-5 h-5 transform group-hover:rotate-90 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </motion.button>

              {/* Scrollable Menu Content with Better Overflow Handling */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain p-8 pt-24 relative" 
                   style={{ 
                     scrollbarWidth: 'thin',
                     scrollbarColor: '#ff5b00 transparent'
                   }}>
                {/* Logo in Menu */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mb-8"
                >
                  <Link href="/" onClick={() => setIsMenuOpen(false)} className="group inline-block">
                    <svg 
                      className="h-16 w-auto transition-all duration-300 group-hover:scale-105"
                      viewBox="0 0 1024 1024"
                    >
                      <path 
                        className="transition-all duration-300 fill-black group-hover:fill-orange-500" 
                        d="M695.72,151.63c-1.72-.45-2,.69-3.01,1.48-12.65,9.99-26.76,23.91-39.01,34.99-80.61,72.95-160.75,146.59-240.97,220.03-72.31,66.2-156.46,123.37-149,234.98,3.45,51.67,39.16,108.9,85.32,132.68,2.96,1.53,7.53,4.78,10.64,3.34l66.02-63.03c.42-2.26-.99-1.38-2.48-1.49-26.54-1.85-47.42.97-65.49-21.53-47.23-58.81-8.99-134.06,38.45-178.5,39.85-37.33,83.45-73.26,124.54-109.46,17.5-15.42,34.97-33.54,52.98-48.02,2.83-2.27,5.85-5.12,9.61-2.58,1.67,1.34,1.5,3.68,1.47,5.59-.05,4.46-7.47,41.81-9.21,44.87-32.46,29.53-65.69,58.3-97.88,88.12-28.25,26.16-49.67,45.37-62.16,83.84l-29.82,75.67,253.02-214.47,56.97-286.52ZM713.71,415.63l-205.98,211.51c-.42,2.26.99,1.38,2.48,1.49,27.96,2.04,57.51-3.6,85.02-2.45,1.05.04,5.92.4,5,2.45l-179.43,125.58c-37.72,34.14-85.72,62.85-122.1,97.9-1.08,1.04-2.33,1.76-1.98,3.51.66.62,14.87-4.71,16.98-5.51,55.93-21.15,118.67-46.1,172.69-71.31,22.29-10.4,38.87-25.8,57.8-41.2,52.52-42.71,104.02-86.74,156.56-129.44.82-.84,1.94-1.43,1.81-2.85-.35-3.81-7.6-11.42-7.04-16.47l-1-.54c-25.25-4.88-51.37-1.75-76.8-4.68-.45-1.73.72-2,1.49-3,2.23-2.9,6.69-6.82,9.49-9.51,19.29-18.5,43.46-41.3,64-58,1.96-1.59,5.3-5.01,7.49-2.48,5.47,9.24,10.42,18.79,16.1,27.9,35.14,56.3,78.82,107.7,121.9,158.1,3.76,4.4,8.16,9.86,12.11,13.89,1.04,1.06,1.44,2.54,3.4,2.09l-140.01-296.99Z"
                      />
                    </svg>
                  </Link>
                </motion.div>

                {/* Brand Badge */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-12"
                >
                  <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-full border border-orange-200">
                    <span className="text-orange-500 text-sm">✦</span>
                    <span className="text-xs font-medium tracking-wider uppercase text-orange-600">Winter 2025 Collection</span>
                  </div>
                </motion.div>

                {menuSections.map((section, sectionIndex) => (
                  <motion.div
                    key={sectionIndex}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      delay: 0.15 * (sectionIndex + 1),
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                    className="mb-12"
                  >
                    {/* Section Title with Enhanced Orange Accent */}
                    <div className="flex items-center mb-6">
                      <motion.div 
                        className="h-0.5 bg-gradient-to-r from-orange-500 to-red-500 mr-3"
                        initial={{ width: 0 }}
                        animate={{ width: 32 }}
                        transition={{ delay: 0.15 * (sectionIndex + 1) + 0.2, duration: 0.5 }}
                      />
                      <h3 className="text-xs tracking-[0.25em] text-gray-500 uppercase font-semibold">
                      {section.title}
                    </h3>
                    </div>

                    {/* Section Links - Enhanced with Smooth Animations */}
                    <ul className="space-y-3">
                      {section.links.map((link, linkIndex) => (
                        <motion.li
                          key={link.href}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ 
                            delay: 0.05 * linkIndex + 0.15 * (sectionIndex + 1) + 0.3,
                            duration: 0.4,
                            ease: [0.22, 1, 0.36, 1]
                          }}
                        >
                          <Link
                            href={link.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="group relative text-2xl font-light text-black hover:text-orange-500 transition-all duration-300 block uppercase tracking-wide flex items-center py-2"
                          >
                            <span className="relative overflow-hidden">
                            {link.label}
                              <motion.span 
                                className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-orange-500 to-red-500"
                                initial={{ width: 0 }}
                                whileHover={{ width: '100%' }}
                                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                              />
                            </span>
                            <motion.svg
                              className="w-5 h-5 ml-2"
                              initial={{ opacity: 0, x: -8 }}
                              whileHover={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3 }}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </motion.svg>
                          </Link>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                ))}

                {/* Utility Links Section */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: 0.5,
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  className="border-t border-gray-200 pt-8 mt-8"
                >
                  <div className="flex items-center mb-6">
                    <motion.div 
                      className="h-0.5 bg-gradient-to-r from-orange-500 to-red-500 mr-3"
                      initial={{ width: 0 }}
                      animate={{ width: 32 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                    />
                    <h3 className="text-xs tracking-[0.25em] text-gray-500 uppercase font-semibold">
                      SUPPORT
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="lg:hidden">
                      <Link
                        href="/search"
                        onClick={() => setIsMenuOpen(false)}
                        className="group flex items-center text-lg font-light text-black hover:text-orange-500 transition-all duration-300 uppercase"
                      >
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        SEARCH
                      </Link>
                    </li>
                    <li className="lg:hidden">
                      <Link
                        href="/account"
                        onClick={() => setIsMenuOpen(false)}
                        className="group flex items-center text-lg font-light text-black hover:text-orange-500 transition-all duration-300 uppercase"
                      >
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        ACCOUNT
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/contact"
                        onClick={() => setIsMenuOpen(false)}
                        className="group flex items-center text-lg font-light text-black hover:text-orange-500 transition-all duration-300 uppercase"
                      >
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        CONTACT US
                      </Link>
                    </li>
                    {/* Admin access intentionally hidden on mobile drawer */}
                  </ul>
                </motion.div>

                {/* Footer Info with Staggered Animations */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: 0.7,
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  className="mt-12 pt-8 border-t border-gray-200"
                >
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-xs text-gray-500 mb-4 leading-relaxed"
                  >
                    Experience luxury fashion that redefines elegance. Discover our curated collection of timeless pieces.
                  </motion.p>
                  <div className="flex items-center space-x-4">
                    {[
                      { path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
                      { path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
                      { path: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" }
                    ].map((icon, idx) => (
                      <motion.a 
                        key={idx}
                        href="#" 
                        className="text-gray-400 hover:text-orange-500 transition-colors"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.85 + (idx * 0.05) }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d={icon.path} />
                        </svg>
                      </motion.a>
                    ))}
                </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      </div>
    </>
  )
}

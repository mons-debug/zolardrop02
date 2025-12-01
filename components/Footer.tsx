'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface SocialMedia {
  id: string
  platform: string
  name: string
  url: string
  order: number
  isActive: boolean
}

// Social media icon SVGs
const SocialIcons: Record<string, JSX.Element> = {
  instagram: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  ),
  tiktok: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  ),
  twitter: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  facebook: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  youtube: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  linkedin: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  pinterest: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
    </svg>
  )
}

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [socialLinks, setSocialLinks] = useState<SocialMedia[]>([])
  const [loadingSocial, setLoadingSocial] = useState(true)

  // Fetch social media links from API
  useEffect(() => {
    const fetchSocialMedia = async () => {
      try {
        const res = await fetch('/api/admin/social-media')
        const data = await res.json()
        if (data.success && data.socialMedia) {
          // Filter only active social media
          const activeSocial = data.socialMedia.filter((s: SocialMedia) => s.isActive)
          setSocialLinks(activeSocial)
        }
      } catch (error) {
        console.error('Error fetching social media:', error)
      } finally {
        setLoadingSocial(false)
      }
    }
    fetchSocialMedia()
  }, [])

  const quickLinks = [
    { label: 'Products', href: '/products' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ]

  const policyLinks = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Refund Policy', href: '/refund' },
    { label: 'Terms of Service', href: '/terms' },
  ]

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
    },
  }

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12 lg:py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8 mb-8 md:mb-12"
        >
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="col-span-2 md:col-span-2">
            <Link href="/" className="group inline-block mb-4 md:mb-6">
              <svg 
                className="h-10 md:h-12 w-auto transition-all duration-300 group-hover:scale-105"
                viewBox="0 0 1024 1024"
              >
                <path 
                  className="transition-all duration-300 fill-black group-hover:fill-orange-500" 
                  d="M695.72,151.63c-1.72-.45-2,.69-3.01,1.48-12.65,9.99-26.76,23.91-39.01,34.99-80.61,72.95-160.75,146.59-240.97,220.03-72.31,66.2-156.46,123.37-149,234.98,3.45,51.67,39.16,108.9,85.32,132.68,2.96,1.53,7.53,4.78,10.64,3.34l66.02-63.03c.42-2.26-.99-1.38-2.48-1.49-26.54-1.85-47.42.97-65.49-21.53-47.23-58.81-8.99-134.06,38.45-178.5,39.85-37.33,83.45-73.26,124.54-109.46,17.5-15.42,34.97-33.54,52.98-48.02,2.83-2.27,5.85-5.12,9.61-2.58,1.67,1.34,1.5,3.68,1.47,5.59-.05,4.46-7.47,41.81-9.21,44.87-32.46,29.53-65.69,58.3-97.88,88.12-28.25,26.16-49.67,45.37-62.16,83.84l-29.82,75.67,253.02-214.47,56.97-286.52ZM713.71,415.63l-205.98,211.51c-.42,2.26.99,1.38,2.48,1.49,27.96,2.04,57.51-3.6,85.02-2.45,1.05.04,5.92.4,5,2.45l-179.43,125.58c-37.72,34.14-85.72,62.85-122.1,97.9-1.08,1.04-2.33,1.76-1.98,3.51.66.62,14.87-4.71,16.98-5.51,55.93-21.15,118.67-46.1,172.69-71.31,22.29-10.4,38.87-25.8,57.8-41.2,52.52-42.71,104.02-86.74,156.56-129.44.82-.84,1.94-1.43,1.81-2.85-.35-3.81-7.6-11.42-7.04-16.47l-1-.54c-25.25-4.88-51.37-1.75-76.8-4.68-.45-1.73.72-2,1.49-3,2.23-2.9,6.69-6.82,9.49-9.51,19.29-18.5,43.46-41.3,64-58,1.96-1.59,5.3-5.01,7.49-2.48,5.47,9.24,10.42,18.79,16.1,27.9,35.14,56.3,78.82,107.7,121.9,158.1,3.76,4.4,8.16,9.86,12.11,13.89,1.04,1.06,1.44,2.54,3.4,2.09l-140.01-296.99Z"
                />
              </svg>
            </Link>
            <p className="text-sm md:text-base text-gray-600 max-w-md leading-relaxed mb-2 md:mb-3">
              Exclusive limited edition products for those who appreciate quality and uniqueness.
            </p>
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              Redefining Elegance • Winter 2025
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="text-sm md:text-base font-semibold mb-3 md:mb-4 text-gray-900">Quick Links</h4>
            <ul className="space-y-2 md:space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm md:text-base text-gray-600 hover:text-brand"
                  style={{ transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
                >
                  {link.label}
                </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal Links */}
          <motion.div variants={itemVariants}>
            <h4 className="text-sm md:text-base font-semibold mb-3 md:mb-4 text-gray-900">Legal</h4>
            <ul className="space-y-2 md:space-y-3">
              {policyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm md:text-base text-gray-600 hover:text-brand"
                    style={{ transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social Links */}
          <motion.div variants={itemVariants}>
            <h4 className="text-sm md:text-base font-semibold mb-3 md:mb-4 text-gray-900">Follow Us</h4>
            {loadingSocial ? (
              <div className="text-sm text-gray-500">Loading...</div>
            ) : socialLinks.length > 0 ? (
              <div className="flex flex-wrap gap-2 md:gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 md:w-10 md:h-10 bg-gray-100 hover:bg-orange-500 hover:text-white rounded-full flex items-center justify-center text-gray-700 transition-all duration-300"
                    title={social.name}
                  >
                    {SocialIcons[social.platform] || (
                      <span className="text-xs font-medium">{social.platform.substring(0, 2).toUpperCase()}</span>
                    )}
                  </a>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500">No social media links yet</div>
            )}
          </motion.div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          variants={itemVariants}
          className="pt-6 md:pt-8 border-t border-gray-200"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <p className="text-gray-600 text-xs md:text-sm">
              &copy; {currentYear} ZOLAR. All rights reserved.
            </p>

            <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-xs md:text-sm">
              <Link
                href="/privacy"
                className="text-gray-600 hover:text-brand transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/refund"
                className="text-gray-600 hover:text-brand transition-colors"
              >
                Refunds
              </Link>
              <Link
                href="/terms"
                className="text-gray-600 hover:text-brand transition-colors"
              >
                Terms
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

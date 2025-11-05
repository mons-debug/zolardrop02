'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { name: 'Instagram', url: 'https://instagram.com', label: 'IG' },
    { name: 'TikTok', url: 'https://tiktok.com', label: 'TT' },
    { name: 'Twitter', url: 'https://twitter.com', label: 'TW' },
  ]

  const quickLinks = [
    { label: 'Products', href: '/products' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-4 gap-8 mb-12"
        >
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="md:col-span-2">
            <Link href="/" className="group inline-block mb-6">
              <svg 
                className="h-12 w-auto transition-all duration-300 group-hover:scale-105"
                viewBox="0 0 1024 1024"
              >
                <path 
                  className="transition-all duration-300 fill-black group-hover:fill-orange-500" 
                  d="M695.72,151.63c-1.72-.45-2,.69-3.01,1.48-12.65,9.99-26.76,23.91-39.01,34.99-80.61,72.95-160.75,146.59-240.97,220.03-72.31,66.2-156.46,123.37-149,234.98,3.45,51.67,39.16,108.9,85.32,132.68,2.96,1.53,7.53,4.78,10.64,3.34l66.02-63.03c.42-2.26-.99-1.38-2.48-1.49-26.54-1.85-47.42.97-65.49-21.53-47.23-58.81-8.99-134.06,38.45-178.5,39.85-37.33,83.45-73.26,124.54-109.46,17.5-15.42,34.97-33.54,52.98-48.02,2.83-2.27,5.85-5.12,9.61-2.58,1.67,1.34,1.5,3.68,1.47,5.59-.05,4.46-7.47,41.81-9.21,44.87-32.46,29.53-65.69,58.3-97.88,88.12-28.25,26.16-49.67,45.37-62.16,83.84l-29.82,75.67,253.02-214.47,56.97-286.52ZM713.71,415.63l-205.98,211.51c-.42,2.26.99,1.38,2.48,1.49,27.96,2.04,57.51-3.6,85.02-2.45,1.05.04,5.92.4,5,2.45l-179.43,125.58c-37.72,34.14-85.72,62.85-122.1,97.9-1.08,1.04-2.33,1.76-1.98,3.51.66.62,14.87-4.71,16.98-5.51,55.93-21.15,118.67-46.1,172.69-71.31,22.29-10.4,38.87-25.8,57.8-41.2,52.52-42.71,104.02-86.74,156.56-129.44.82-.84,1.94-1.43,1.81-2.85-.35-3.81-7.6-11.42-7.04-16.47l-1-.54c-25.25-4.88-51.37-1.75-76.8-4.68-.45-1.73.72-2,1.49-3,2.23-2.9,6.69-6.82,9.49-9.51,19.29-18.5,43.46-41.3,64-58,1.96-1.59,5.3-5.01,7.49-2.48,5.47,9.24,10.42,18.79,16.1,27.9,35.14,56.3,78.82,107.7,121.9,158.1,3.76,4.4,8.16,9.86,12.11,13.89,1.04,1.06,1.44,2.54,3.4,2.09l-140.01-296.99Z"
                />
              </svg>
            </Link>
            <p className="text-gray-600 max-w-md leading-relaxed mb-3">
              Exclusive limited edition products for those who appreciate quality and uniqueness.
            </p>
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              Redefining Elegance • Winter 2025
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold mb-4 text-gray-900">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-gray-600 hover:text-brand"
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
            <h4 className="font-semibold mb-4 text-gray-900">Follow Us</h4>
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-100 hover:bg-brand hover:text-white rounded-full flex items-center justify-center text-sm font-medium text-gray-700"
                  style={{ transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
                  title={social.name}
                >
                  {social.label}
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          variants={itemVariants}
          className="pt-8 border-t border-gray-200"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-600 text-sm">
              &copy; {currentYear} ZOLAR. All rights reserved.
            </p>

            <div className="flex space-x-6 text-sm">
              <Link
                href="/privacy"
                className="text-gray-600 hover:text-brand transition-colors"
              >
                Privacy
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

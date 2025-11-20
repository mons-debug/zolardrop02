'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export default function FloatingActions() {
  const [isOpen, setIsOpen] = useState(false)

  const actions = [
    { id: 1, label: 'Products', icon: '🛍️', href: '/products' },
    { id: 2, label: 'About', icon: '✨', href: '/about' },
    { id: 3, label: 'Contact', icon: '💬', href: '/contact' },
    { id: 4, label: 'Account', icon: '👤', href: '/account' },
  ]

  return (
    <div className="fixed bottom-8 right-8 z-50 lg:hidden">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-20 right-0 flex flex-col gap-3"
          >
            {actions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={action.href}
                  className="group flex items-center gap-3 bg-white/95 backdrop-blur-md hover:bg-orange-500 hover:text-white transition-all duration-300 px-6 py-3 rounded-full shadow-lg hover:shadow-xl"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-xl">{action.icon}</span>
                  <span className="text-sm font-medium whitespace-nowrap">{action.label}</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-black text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-orange-500 transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ rotate: isOpen ? 45 : 0 }}
      >
        <svg 
          className="w-8 h-8" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 6h16M4 12h16M4 18h16" 
          />
        </svg>
      </motion.button>

      {/* Pulse ring effect */}
      {!isOpen && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-orange-500"
          animate={{
            scale: [1, 1.3, 1.3],
            opacity: [0.8, 0, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      )}
    </div>
  )
}

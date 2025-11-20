'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'

export default function AccountPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // MVP: Just show confirmation
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="text-xs font-normal uppercase tracking-widest text-gray-500 block mb-4">
              Welcome
            </span>
            <h1 
              className="text-4xl md:text-6xl font-light tracking-tight text-black mb-6"
              style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
            >
              My Account
            </h1>
            <p className="text-gray-600 text-sm md:text-base font-light max-w-2xl mx-auto leading-relaxed">
              Manage your orders, preferences, and account details.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Account Content */}
      <section className="py-16 md:py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {!submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gray-50 border border-gray-200 p-8 md:p-12"
            >
              <h2 className="text-2xl md:text-3xl font-light tracking-tight text-black mb-4">
                Sign In
              </h2>
              <p className="text-gray-600 text-sm mb-8 font-light">
                Enter your email to access your account
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 text-sm focus:border-black focus:outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-8 py-3 bg-black text-white text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors duration-300"
                >
                  Continue
                </button>
              </form>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-600 text-center font-light">
                  New to Zolar?{' '}
                  <Link href="/products" className="text-black hover:underline">
                    Start shopping
                  </Link>
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-black text-white p-8 md:p-12 text-center"
            >
              <svg
                className="w-16 h-16 mx-auto mb-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h2 className="text-2xl md:text-3xl font-light tracking-tight mb-4">
                Coming Soon
              </h2>
              <p className="text-gray-300 text-sm mb-8 font-light">
                Full account features are currently under development. <br />
                We'll notify you at <strong className="font-normal">{email}</strong> when they're ready.
              </p>
              <Link
                href="/products"
                className="inline-block px-8 py-3 bg-white text-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-colors duration-300"
              >
                Continue Shopping
              </Link>
            </motion.div>
          )}

          {/* Features Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-16 grid md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                ),
                title: 'Order History',
                description: 'Track all your purchases in one place'
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                ),
                title: 'Wishlist',
                description: 'Save items for later purchase'
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                ),
                title: 'Profile',
                description: 'Manage your personal details'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 text-black mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-base font-normal text-black mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 font-light">{feature.description}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}














'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useCart } from '@/components/CartContext'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { formatPrice } from '@/lib/currency'

export default function CheckoutPage() {
  const { state, clearCart, removeItem } = useCart()
  const router = useRouter()
  const items = state.items
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: ''
  })

  // Validate cart items on mount - remove any with invalid UUIDs
  useEffect(() => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    
    let hasInvalidItems = false
    items?.forEach(item => {
      // Check if variantId is a valid UUID
      if (!uuidRegex.test(item.variantId)) {
        console.warn('Removing invalid cart item:', item)
        removeItem(item.productId, item.variantId, item.size)
        hasInvalidItems = true
      }
    })

    if (hasInvalidItems) {
      alert('Some items in your cart were outdated and have been removed. Please add items again from the products page.')
    }
  }, []) // Run once on mount
  
  // Default Moroccan cities
  const cities = [
    'Casablanca',
    'Rabat',
    'Marrakech',
    'Fes',
    'Tangier',
    'Agadir',
    'Meknes',
    'Oujda',
    'Kenitra',
    'Tetouan',
    'Safi',
    'El Jadida',
    'Beni Mellal',
    'Nador',
    'Khouribga'
  ]
  
  const [submitting, setSubmitting] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [orderId, setOrderId] = useState('')

  // Calculate totals - handle undefined items
  const subtotal = items?.reduce((sum, item) => sum + (item.priceCents * item.qty), 0) || 0
  const shipping = 0 // Free shipping
  const total = subtotal + shipping

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch('/api/checkout/cod', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.productId,
            variantId: item.variantId,
            qty: item.qty,
            size: item.size // Include size if available
          })),
          customer: {
            name: formData.name,
            email: `${formData.phone}@placeholder.com`, // Use phone as placeholder email
            phone: formData.phone,
            address: formData.city
          }
        })
      })

      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Response is not JSON. Status:', response.status)
        const text = await response.text()
        console.error('Response body:', text.substring(0, 200))
        throw new Error(`Server error: ${response.status}. Please contact support.`)
      }

      const data = await response.json()

      if (response.ok && data.success) {
        clearCart()
        // Redirect to thank you page with order details
        router.push(`/thank-you?orderId=${data.orderId}&total=${total}&items=${items.length}`)
      } else {
        // Handle specific error cases
        if (data.message && data.message.includes('not found')) {
          // Cart has invalid items - offer to clear cart
          const shouldClear = confirm(
            'Your cart contains outdated items. Would you like to clear your cart and start fresh?'
          )
          if (shouldClear) {
            clearCart()
            router.push('/products')
          }
        } else {
          alert(data.message || data.error || 'Order failed. Please try again.')
        }
      }
    } catch (error) {
      console.error('Checkout error:', error)
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while placing your order. Please try again.'
      alert(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  // Show loading or empty cart state
  if (!items || (items.length === 0 && !orderSuccess)) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-3xl font-light text-black mb-4">Your cart is empty</h1>
          <button
            onClick={() => router.push('/products')}
            className="px-8 py-3 bg-black text-white text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors duration-300"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-white">
        <section className="pt-24 pb-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-4">
                Order Confirmed!
              </h1>
              <p className="text-gray-300 text-sm mb-2">
                Order ID: <span className="font-mono">{orderId}</span>
              </p>
              <p className="text-gray-300 text-sm mb-8">
                Thank you for your order. We'll contact you at <strong className="font-normal">{formData.phone}</strong>
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/products')}
                  className="block w-full px-8 py-3 bg-white text-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-colors duration-300"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="block w-full px-8 py-3 border border-white text-white text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300"
                >
                  Back to Home
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-24 pb-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 
              className="text-4xl md:text-5xl font-light tracking-tight text-black"
              style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
            >
              Checkout
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Checkout Form */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-light text-black mb-6">Delivery Information</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-gray-300 bg-white text-sm focus:border-black focus:outline-none transition-colors"
                  />
                </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                    Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-3 border border-gray-300 bg-white text-sm focus:border-black focus:outline-none transition-colors"
                    />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                    City *
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 bg-white text-sm focus:border-black focus:outline-none transition-colors appearance-none cursor-pointer"
                    style={{
                      backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.75rem center',
                      backgroundSize: '1.25em 1.25em'
                    }}
                  >
                    <option value="">Select your city</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full px-8 py-4 bg-black text-white text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors duration-300 disabled:bg-gray-400"
                  >
                    {submitting ? 'Processing...' : 'Place Order (Cash on Delivery)'}
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-gray-50 border border-gray-200 p-6">
                <h2 className="text-2xl font-light text-black mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  {items?.map((item) => (
                    <div key={`${item.productId}-${item.variantId}`} className="flex gap-4">
                      <div className="relative w-20 h-24 bg-gray-200">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-normal text-black">{item.title}</h3>
                        {item.variantName && (
                          <p className="text-xs text-gray-600 mt-1">{item.variantName}</p>
                        )}
                        <p className="text-xs text-gray-600 mt-1">Qty: {item.qty}</p>
                        <p className="text-sm text-black mt-2">{formatPrice(item.priceCents)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-300 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-black">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-black">Free</span>
                  </div>
                  <div className="flex justify-between text-lg font-normal pt-2 border-t border-gray-300">
                    <span className="text-black">Total</span>
                    <span className="text-black">{formatPrice(total)}</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-white border border-gray-200">
                  <p className="text-xs text-gray-600">
                    <strong className="font-normal text-black">Cash on Delivery:</strong> Pay when you receive your order. No online payment required.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}




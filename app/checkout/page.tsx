'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useCart } from '@/components/CartContext'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function CheckoutPage() {
  const { state, clearCart } = useCart()
  const router = useRouter()
  const items = state.items
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: ''
  })
  
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
        alert(data.message || data.error || 'Order failed. Please try again.')
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero */}
      <section className="pt-28 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center mb-6">
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-black to-transparent" />
              <span className="mx-4 text-xs font-medium uppercase tracking-[0.3em] text-black/60">
                Secure Checkout
              </span>
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-black to-transparent" />
            </div>
            <h1 
              className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-black mb-4"
              style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
            >
              Complete Your Order
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Just a few details away from your new essentials
            </p>
          </motion.div>
        </div>
      </section>

      {/* Checkout Form */}
      <section className="py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-3"
            >
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-light text-black">Delivery Information</h2>
                    <p className="text-sm text-gray-500">We'll contact you to confirm your order</p>
                  </div>
                </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="group">
                  <label className="block text-xs uppercase tracking-widest text-gray-600 mb-3 font-medium">
                    Full Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                      className="w-full px-5 py-4 border-2 border-gray-200 bg-white text-base rounded-xl focus:border-black focus:outline-none transition-all duration-300 group-hover:border-gray-300"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                </div>

                  <div className="group">
                    <label className="block text-xs uppercase tracking-widest text-gray-600 mb-3 font-medium">
                    Phone Number *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      placeholder="Enter your phone number"
                      className="w-full px-5 py-4 border-2 border-gray-200 bg-white text-base rounded-xl focus:border-black focus:outline-none transition-all duration-300 group-hover:border-gray-300"
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                </div>

                <div className="group">
                  <label className="block text-xs uppercase tracking-widest text-gray-600 mb-3 font-medium">
                    City *
                  </label>
                  <div className="relative">
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 border-2 border-gray-200 bg-white text-base rounded-xl focus:border-black focus:outline-none transition-all duration-300 appearance-none cursor-pointer group-hover:border-gray-300"
                      style={{
                        backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 1rem center',
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
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="group relative w-full px-8 py-5 bg-black text-white text-sm uppercase tracking-widest rounded-xl overflow-hidden transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed hover:shadow-2xl hover:scale-[1.02]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      {submitting ? (
                        <>
                          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Processing Your Order...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Place Order (Cash on Delivery)
                        </>
                      )}
                    </span>
                  </button>
                  <p className="text-xs text-center text-gray-500 mt-4">
                    By placing your order, you agree to our terms and conditions
                  </p>
                </div>
              </form>
              </div>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sticky top-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-light text-black">Order Summary</h2>
                </div>
                
                <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {items?.map((item, index) => (
                    <motion.div 
                      key={`${item.productId}-${item.variantId}`} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div className="relative w-20 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-black truncate">{item.title}</h3>
                        {item.variantName && (
                          <p className="text-xs text-gray-500 mt-1">{item.variantName}</p>
                        )}
                        {item.size && (
                          <p className="text-xs text-gray-500 mt-1">Size: {item.size}</p>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">Qty: {item.qty}</span>
                          <span className="text-sm font-medium text-black">${(item.priceCents / 100).toFixed(2)}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="border-t-2 border-gray-100 pt-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-black font-medium">${(subtotal / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between text-xl font-medium pt-3 border-t-2 border-gray-100">
                    <span className="text-black">Total</span>
                    <span className="text-black">${(total / 100).toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-green-900 mb-1">Cash on Delivery</p>
                      <p className="text-xs text-green-700">
                        Pay when you receive your order. No online payment required.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <p className="text-xs text-gray-600">
                      Your information is secure and will only be used to process your order.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}




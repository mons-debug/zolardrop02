'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from './CartContext'

export default function CartDrawer() {
  const { state, removeItem, updateQuantity, toggleCart, getSubtotal, getItemCount, clearCart } = useCart()
  const [isCheckout, setIsCheckout] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null)
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    address: '',
    phone: ''
  })

  const formatPrice = (cents: number) => {
    return `${(cents / 100).toFixed(2)} MAD`
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value
    })
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!customerInfo.name || !customerInfo.email || !customerInfo.address || !customerInfo.phone) {
      alert('Please fill in all customer information')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/checkout/cod', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
          body: JSON.stringify({
          items: state.items.map(item => ({
            productId: item.productId,
            variantId: item.variantId,
            qty: item.qty,
            size: item.size // Include size if available
          })),
          customer: customerInfo,
          shippingCents: 0 // Could be made configurable
        })
      })

      const data = await response.json()

      if (response.ok) {
        setOrderSuccess(data.orderId)
        clearCart()
        setIsCheckout(false)
        setCustomerInfo({ name: '', email: '', address: '', phone: '' })
      } else {
        alert(data.message || 'Failed to place order')
      }
    } catch (error) {
      alert('Failed to place order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!state.isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={toggleCart}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-lg bg-white shadow-xl z-50 transform transition-transform">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-lg font-semibold">Shopping Cart</h2>
            <button
              onClick={toggleCart}
              className="p-2 hover:bg-gray-100 rounded-2xl"
              style={{ transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {state.items.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 3H3m4 10v6a1 1 0 001 1h10a1 1 0 001-1v-6M9 19a1 1 0 102 0 1 1 0 00-2 0zm8 0a1 1 0 102 0 1 1 0 00-2 0z" />
                </svg>
                <p className="text-gray-500">Your cart is empty</p>
                <button
                  onClick={toggleCart}
                  className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div key={`${item.productId}-${item.variantId}`} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                    {/* Product Image */}
                    <div className="relative w-16 h-16 bg-white rounded-2xl overflow-hidden flex-shrink-0 border border-gray-200">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{item.title}</h3>
                      {item.variantName && (
                        <p className="text-sm text-gray-500">{item.variantName}</p>
                      )}
                      {item.size && (
                        <p className="text-xs text-gray-600 font-medium mt-0.5">Size: {item.size}</p>
                      )}
                      <p className="text-sm font-semibold text-gray-900 mt-1">{formatPrice(item.priceCents)}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col items-center space-y-2">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.variantId, item.qty - 1, item.size)}
                          className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>

                        <span className="w-8 text-center text-sm font-medium">{item.qty}</span>

                        <button
                          onClick={() => updateQuantity(item.productId, item.variantId, item.qty + 1, item.size)}
                          className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                          aria-label="Increase quantity"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                      
                      {/* Delete Button */}
                      <button
                        onClick={() => removeItem(item.productId, item.variantId, item.size)}
                        className="p-1.5 rounded-full bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 transition-colors"
                        aria-label="Remove item"
                        title="Remove from cart"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {formatPrice(item.priceCents * item.qty)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {state.items.length > 0 && !orderSuccess && (
            <div className="border-t p-6 space-y-4">
              {!isCheckout ? (
                <>
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Subtotal ({getItemCount()} items)</span>
                    <span>{formatPrice(getSubtotal())}</span>
                  </div>

                  <div className="space-y-3">
                    <Link
                      href="/checkout"
                      onClick={toggleCart}
                      className="relative block w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-6 text-center font-bold text-lg hover:from-orange-600 hover:to-red-600 transform hover:scale-105 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <svg className="w-5 h-5 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        Proceed to Checkout
                      </span>
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                    </Link>
                    <button
                      onClick={toggleCart}
                      className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 text-center">
                    Cash on Delivery - Pay when you receive your order
                  </p>
                </>
              ) : (
                <form onSubmit={handleCheckout} className="space-y-4">
                  <h3 className="text-lg font-semibold">Customer Information</h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={customerInfo.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 shadow-sm focus:shadow-md"
                      style={{ transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={customerInfo.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 shadow-sm focus:shadow-md"
                      style={{ transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={customerInfo.address}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 shadow-sm focus:shadow-md"
                      style={{ transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
                      placeholder="Enter your delivery address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={customerInfo.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 shadow-sm focus:shadow-md"
                      style={{ transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="flex justify-between items-center text-lg font-semibold pt-2 border-t">
                    <span>Total</span>
                    <span>{formatPrice(getSubtotal())}</span>
                  </div>

                  <div className="space-y-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-brand text-white py-3 px-4 rounded-2xl font-semibold shadow-md hover:shadow-lg hover:bg-[#e65200] disabled:bg-gray-400 disabled:cursor-not-allowed"
                      style={{ transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
                    >
                      {isSubmitting ? 'Placing Order...' : 'Place COD Order'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsCheckout(false)}
                      className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                      Back to Cart
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Order Success */}
          {orderSuccess && (
            <div className="border-t p-6 text-center">
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <h3 className="text-lg font-semibold text-green-600 mb-2">Order Placed Successfully!</h3>
                <p className="text-gray-600 mb-4">
                  Your order #{orderSuccess.slice(-8)} has been placed and will be delivered soon.
                </p>
                <p className="text-sm text-gray-500">
                  You will receive a confirmation email shortly.
                </p>
              </div>

              <button
                onClick={toggleCart}
                className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

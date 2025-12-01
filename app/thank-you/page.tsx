'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice as formatPriceCurrency } from '@/lib/currency'

interface TrackingSettings {
  googleAdsId: string | null
  googleAdsLabel: string | null
  googleAnalyticsId: string | null
  facebookPixelId: string | null
  tiktokPixelId: string | null
  snapchatPixelId: string | null
  isActive: boolean
}

interface OrderItem {
  productId: string
  variantId: string
  qty: number
  priceCents: number
  title?: string
  image?: string
  variantName?: string
  size?: string
}

export default function ThankYouPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [trackingSettings, setTrackingSettings] = useState<TrackingSettings | null>(null)
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [loadingItems, setLoadingItems] = useState(false)
  const [orderData, setOrderData] = useState<any>(null)
  
  const orderId = searchParams.get('orderId')
  const total = searchParams.get('total')
  const items = searchParams.get('items')

  useEffect(() => {
    if (!orderId) {
      router.push('/')
      return
    }

    // Fetch tracking settings
    fetchTrackingSettings()
    
    // Fetch order details to show items
    if (orderId) {
      fetchOrderDetails()
    }
  }, [orderId])

  const fetchOrderDetails = async () => {
    try {
      setLoadingItems(true)
      const response = await fetch(`/api/admin/orders/${orderId}`)
      if (response.ok) {
        const data = await response.json()
        setOrderData(data.order) // Store full order data
        const items = JSON.parse(data.order.items || '[]') as OrderItem[]
        
        // Fetch product details for each item
        const itemsWithDetails = await Promise.all(
          items.map(async (item) => {
            try {
              const productRes = await fetch(`/api/products/${item.productId}`)
              if (productRes.ok) {
                const productData = await productRes.json()
                return {
                  ...item,
                  title: productData.product?.title || 'Unknown Product',
                  image: productData.product?.images ? JSON.parse(productData.product.images)[0] : '/placeholder.jpg'
                }
              }
            } catch (err) {
              if (process.env.NODE_ENV === 'development') {
                console.error('Failed to fetch product:', err)
              }
            }
            return item
          })
        )
        setOrderItems(itemsWithDetails)
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching order details:', error)
      }
    } finally {
      setLoadingItems(false)
    }
  }

  const downloadReceipt = async () => {
    if (!orderId) return
    
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/receipt`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `receipt-${orderId.slice(0, 8).toUpperCase()}.html`
        document.body.appendChild(a)
        a.click()
        
        // Also open in new window for print
        const printWindow = window.open(url, '_blank')
        if (printWindow) {
          printWindow.onload = () => {
            setTimeout(() => {
              printWindow.print()
            }, 500)
          }
        }
        
        setTimeout(() => {
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)
        }, 1000)
      } else {
        alert('Failed to download receipt. Please try again later.')
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error downloading receipt:', error)
      }
      alert('Failed to download receipt. Please try again later.')
    }
  }

  const fetchTrackingSettings = async () => {
    try {
      const response = await fetch('/api/tracking/settings')
      if (response.ok) {
        const settings = await response.json()
        setTrackingSettings(settings)
        
        // Fire tracking pixels if active
        if (settings.isActive) {
          fireTrackingPixels(settings)
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching tracking settings:', error)
      }
    }
  }

  const fireTrackingPixels = (settings: TrackingSettings) => {
    const totalValue = total ? parseFloat(total) / 100 : 0
    const currency = 'MAD'

    // Google Ads Conversion Tracking
    if (settings.googleAdsId) {
      try {
        // @ts-ignore
        if (typeof gtag !== 'undefined') {
          // @ts-ignore
          gtag('event', 'conversion', {
            'send_to': settings.googleAdsLabel 
              ? `${settings.googleAdsId}/${settings.googleAdsLabel}`
              : settings.googleAdsId,
            'value': totalValue,
            'currency': currency,
            'transaction_id': orderId
          })
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Google Ads tracking error:', error)
        }
      }
    }

    // Google Analytics 4 Purchase Event
    if (settings.googleAnalyticsId) {
      try {
        // @ts-ignore
        if (typeof gtag !== 'undefined') {
          // @ts-ignore
          gtag('event', 'purchase', {
            'transaction_id': orderId,
            'value': totalValue,
            'currency': currency,
            'items': items ? parseInt(items) : 1
          })
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Google Analytics tracking error:', error)
        }
      }
    }

    // Facebook Pixel Purchase Event
    if (settings.facebookPixelId) {
      try {
        // @ts-ignore
        if (typeof fbq !== 'undefined') {
          // @ts-ignore
          fbq('track', 'Purchase', {
            value: totalValue,
            currency: currency,
            content_type: 'product'
          })
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Facebook Pixel tracking error:', error)
        }
      }
    }

    // TikTok Pixel Purchase Event
    if (settings.tiktokPixelId) {
      try {
        // @ts-ignore
        if (typeof ttq !== 'undefined') {
          // @ts-ignore
          ttq.track('CompletePayment', {
            value: totalValue,
            currency: currency,
            content_type: 'product'
          })
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('TikTok Pixel tracking error:', error)
        }
      }
    }

    // Snapchat Pixel Purchase Event
    if (settings.snapchatPixelId) {
      try {
        // @ts-ignore
        if (typeof snaptr !== 'undefined') {
          // @ts-ignore
          snaptr('track', 'PURCHASE', {
            price: totalValue,
            currency: currency
          })
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Snapchat Pixel tracking error:', error)
        }
      }
    }
  }

  const formatPrice = (cents: string | null) => {
    if (!cents) return formatPriceCurrency(0)
    return formatPriceCurrency(parseFloat(cents))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-gray-50">
      <section className="pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-2xl rounded-2xl p-8 md:p-12 text-center border border-gray-100"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-14 h-14 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-gray-900"
            >
              Order Confirmed!
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="text-lg text-gray-600 mb-8"
            >
              Thank you for your purchase
            </motion.p>

            {/* Order Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-6 border border-orange-200"
            >
              <p className="text-gray-700 text-sm mb-2 font-medium">
                Order ID: <span className="font-mono text-orange-600 font-bold">{orderData?.orderId || orderId?.slice(0, 8).toUpperCase()}</span>
              </p>
              {total && (
                <p className="text-2xl font-bold text-gray-900 mt-3">
                  {formatPrice(total)}
                </p>
              )}
              <p className="text-gray-600 text-sm mt-4 leading-relaxed">
                Your order has been successfully placed and is being processed.
              </p>
            </motion.div>

            {/* Order Items */}
            {loadingItems ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="mb-8 bg-white rounded-xl p-6 border border-gray-200"
              >
                <p className="text-gray-600 text-sm text-center">Loading order items...</p>
              </motion.div>
            ) : orderItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="mb-8 bg-white rounded-xl p-6 border border-gray-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
                <div className="space-y-4">
                  {orderItems.map((item, index) => (
                    <div key={index} className="flex items-start space-x-4 pb-4 border-b border-gray-100 last:border-0">
                      {item.image && (
                        <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={item.image}
                            alt={item.title || 'Product'}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{item.title || 'Product'}</p>
                        {item.variantName && (
                          <p className="text-xs text-gray-500 mt-1">{item.variantName}</p>
                        )}
                        {item.size && (
                          <p className="text-xs text-gray-500">Size: {item.size}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">Quantity: {item.qty}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          {formatPrice((item.priceCents * item.qty).toString())}
                        </p>
                        <p className="text-xs text-gray-500">{formatPrice(item.priceCents.toString())} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* What's Next Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gray-50 rounded-xl p-6 mb-8 text-left border border-gray-200"
            >
              <h2 className="text-xl font-bold mb-5 text-center text-gray-900">What Happens Next?</h2>
              <div className="space-y-4 text-sm">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Order Confirmation</p>
                    <p className="text-gray-600 leading-relaxed">We'll send you a confirmation message shortly</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Processing</p>
                    <p className="text-gray-600 leading-relaxed">Our team will prepare your order carefully</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Delivery</p>
                    <p className="text-gray-600 leading-relaxed">We'll contact you to arrange delivery</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/"
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm uppercase tracking-widest hover:from-orange-600 hover:to-orange-700 transition-all duration-300 font-bold shadow-lg hover:shadow-xl rounded-lg text-center"
                >
                  Back to Home
                </Link>
                <Link
                  href="/products"
                  className="px-8 py-4 border-2 border-gray-900 text-gray-900 text-sm uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all duration-300 font-bold rounded-lg text-center"
                >
                  Continue Shopping
                </Link>
              </div>
              <button
                onClick={downloadReceipt}
                className="px-8 py-4 bg-white border-2 border-orange-500 text-orange-600 text-sm uppercase tracking-widest hover:bg-orange-50 transition-all duration-300 font-bold rounded-lg flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Download Receipt</span>
              </button>
            </motion.div>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 text-center text-gray-700 text-sm"
          >
            <p>Need help? <Link href="/contact" className="text-orange-600 font-semibold underline hover:text-orange-700">Contact us</Link></p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}


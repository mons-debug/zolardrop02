'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface TrackingSettings {
  googleAdsId: string | null
  googleAdsLabel: string | null
  googleAnalyticsId: string | null
  facebookPixelId: string | null
  tiktokPixelId: string | null
  snapchatPixelId: string | null
  isActive: boolean
}

export default function ThankYouPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [trackingSettings, setTrackingSettings] = useState<TrackingSettings | null>(null)
  
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
  }, [orderId])

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
    if (!cents) return '0.00 MAD'
    return `${(parseFloat(cents) / 100).toFixed(2)} MAD`
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
                Order ID: <span className="font-mono text-orange-600 font-bold">{orderId?.slice(0, 8).toUpperCase()}</span>
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
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/"
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm uppercase tracking-widest hover:from-orange-600 hover:to-orange-700 transition-all duration-300 font-bold shadow-lg hover:shadow-xl rounded-lg"
              >
                Back to Home
              </Link>
              <Link
                href="/products"
                className="px-8 py-4 border-2 border-gray-900 text-gray-900 text-sm uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all duration-300 font-bold rounded-lg"
              >
                Continue Shopping
              </Link>
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


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
      console.error('Error fetching tracking settings:', error)
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
          console.log('Google Ads conversion tracked')
        }
      } catch (error) {
        console.error('Google Ads tracking error:', error)
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
          console.log('Google Analytics purchase tracked')
        }
      } catch (error) {
        console.error('Google Analytics tracking error:', error)
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
          console.log('Facebook Pixel purchase tracked')
        }
      } catch (error) {
        console.error('Facebook Pixel tracking error:', error)
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
          console.log('TikTok Pixel purchase tracked')
        }
      } catch (error) {
        console.error('TikTok Pixel tracking error:', error)
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
          console.log('Snapchat Pixel purchase tracked')
        }
      } catch (error) {
        console.error('Snapchat Pixel tracking error:', error)
      }
    }
  }

  const formatPrice = (cents: string | null) => {
    if (!cents) return '0.00 MAD'
    return `${(parseFloat(cents) / 100).toFixed(2)} MAD`
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-black text-white p-8 md:p-12 text-center"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <svg
                className="w-20 h-20 mx-auto mb-6 text-white"
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
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-light tracking-tight mb-4"
            >
              Thank You for Your Order!
            </motion.h1>

            {/* Order Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <p className="text-gray-300 text-sm mb-2">
                Order ID: <span className="font-mono text-white">{orderId?.slice(0, 8)}</span>
              </p>
              {total && (
                <p className="text-gray-300 text-sm mb-2">
                  Total: <span className="text-white font-medium">{formatPrice(total)}</span>
                </p>
              )}
              <p className="text-gray-300 text-base mt-4">
                Your order has been successfully placed and is being processed.
              </p>
            </motion.div>

            {/* What's Next Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gray-900 p-6 mb-8 text-left"
            >
              <h2 className="text-xl font-semibold mb-4 text-center">What Happens Next?</h2>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-white">Order Confirmation</p>
                    <p>We'll send you a confirmation message shortly</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-white">Processing</p>
                    <p>Our team will prepare your order carefully</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-white">Delivery</p>
                    <p>We'll contact you to arrange delivery</p>
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
                className="px-8 py-3 bg-white text-black text-sm uppercase tracking-widest hover:bg-gray-100 transition-colors duration-300 font-medium"
              >
                Back to Home
              </Link>
              <Link
                href="/products"
                className="px-8 py-3 border-2 border-white text-white text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300 font-medium"
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
            className="mt-8 text-center text-gray-600 text-sm"
          >
            <p>Need help? <Link href="/contact" className="text-black underline hover:text-gray-700">Contact us</Link></p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}


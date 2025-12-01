'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-12 md:pb-16 bg-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-white" />
          <motion.div 
            className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center mb-6">
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
              <span className="mx-3 text-xs font-medium uppercase tracking-[0.3em] text-orange-500">
                Legal
              </span>
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-black mb-4 leading-tight">
              Refund Policy
            </h1>
            
            <p className="text-base text-gray-600 font-light">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="prose prose-lg max-w-none"
          >
            <div className="space-y-8 text-gray-700">
              <div>
                <h2 className="text-2xl font-medium text-black mb-4">Our Commitment</h2>
                <p className="leading-relaxed">
                  At ZOLAR, we want you to be completely satisfied with your purchase. If you're not happy with your order, we're here to help with returns and refunds.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-medium text-black mb-4">Return Window</h2>
                <p className="leading-relaxed">
                  You have <strong>30 days</strong> from the date of delivery to return an item for a refund or exchange. Items must be unworn, unwashed, and in their original condition with all tags attached.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-medium text-black mb-4">Eligible Items</h2>
                <p className="leading-relaxed mb-3">The following items can be returned:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Unworn clothing with original tags</li>
                  <li>Unwashed items in original condition</li>
                  <li>Items in original packaging</li>
                  <li>Products that are not damaged or altered</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-medium text-black mb-4">Non-Returnable Items</h2>
                <p className="leading-relaxed mb-3">The following items cannot be returned:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Items marked as "Final Sale"</li>
                  <li>Worn or washed items</li>
                  <li>Items without original tags</li>
                  <li>Damaged items (unless defective)</li>
                  <li>Custom or personalized items</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-medium text-black mb-4">How to Initiate a Return</h2>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-semibold text-sm">1</span>
                    <div>
                      <p className="font-medium text-black">Contact Us</p>
                      <p className="text-gray-600">Email us at returns@zolar.com with your order number and reason for return.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-semibold text-sm">2</span>
                    <div>
                      <p className="font-medium text-black">Receive Authorization</p>
                      <p className="text-gray-600">We'll send you a return authorization and shipping label within 24-48 hours.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-semibold text-sm">3</span>
                    <div>
                      <p className="font-medium text-black">Ship Your Return</p>
                      <p className="text-gray-600">Pack the item securely and ship it back using the provided label.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-semibold text-sm">4</span>
                    <div>
                      <p className="font-medium text-black">Receive Your Refund</p>
                      <p className="text-gray-600">Once we receive and inspect your return, we'll process your refund within 5-7 business days.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-medium text-black mb-4">Refund Processing</h2>
                <p className="leading-relaxed">
                  Refunds will be issued to your original payment method. Please allow 5-7 business days after we receive your return for the refund to appear in your account. Depending on your bank or credit card company, it may take an additional 2-3 business days for the credit to post.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-medium text-black mb-4">Exchanges</h2>
                <p className="leading-relaxed">
                  If you'd like to exchange an item for a different size or color, please follow the return process above and place a new order for the desired item. This ensures you get your new item as quickly as possible.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-medium text-black mb-4">Shipping Costs</h2>
                <p className="leading-relaxed mb-3">Shipping costs are as follows:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Return Shipping:</strong> We provide a prepaid return label for your convenience. A $5 return shipping fee will be deducted from your refund.</li>
                  <li><strong>Defective Items:</strong> If your item is defective or we sent you the wrong item, we'll cover all return shipping costs.</li>
                  <li><strong>Original Shipping:</strong> Original shipping charges are non-refundable unless the item is defective or incorrect.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-medium text-black mb-4">Defective or Damaged Items</h2>
                <p className="leading-relaxed">
                  If you receive a defective or damaged item, please contact us immediately at returns@zolar.com with photos of the issue. We'll provide a prepaid return label and issue a full refund or send a replacement at no additional cost to you.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-medium text-black mb-4">International Returns</h2>
                <p className="leading-relaxed">
                  International customers are responsible for return shipping costs. We recommend using a trackable shipping service. Refunds will be issued once we receive and inspect the returned item.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-medium text-black mb-4">Contact Us</h2>
                <p className="leading-relaxed">
                  If you have any questions about returns or refunds, please don't hesitate to reach out:
                </p>
                <div className="mt-4 p-6 bg-gray-50 rounded-lg">
                  <p className="font-medium text-black">ZOLAR Returns Department</p>
                  <p>Email: returns@zolar.com</p>
                  <p>
                    <Link href="/contact" className="text-orange-500 hover:text-orange-600 transition-colors">
                      Contact Form
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Back to Home CTA */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white text-sm uppercase tracking-wider font-medium hover:bg-orange-500 transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Home</span>
          </Link>
        </div>
      </section>
    </div>
  )
}







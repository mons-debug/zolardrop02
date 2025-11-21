'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-12 md:pb-16 bg-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-white" />
          <motion.div 
            className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-3xl"
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
              Privacy Policy
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
                <h2 className="text-2xl font-medium text-black mb-4">Introduction</h2>
                <p className="leading-relaxed">
                  At ZOLAR, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase from us.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-medium text-black mb-4">Information We Collect</h2>
                <p className="leading-relaxed mb-3">We collect information that you provide directly to us, including:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Name, email address, and contact information</li>
                  <li>Billing and shipping addresses</li>
                  <li>Payment information (processed securely through our payment providers)</li>
                  <li>Order history and preferences</li>
                  <li>Communications with us</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-medium text-black mb-4">How We Use Your Information</h2>
                <p className="leading-relaxed mb-3">We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Process and fulfill your orders</li>
                  <li>Communicate with you about your orders and our products</li>
                  <li>Send you marketing communications (with your consent)</li>
                  <li>Improve our website and customer service</li>
                  <li>Detect and prevent fraud</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-medium text-black mb-4">Information Sharing</h2>
                <p className="leading-relaxed">
                  We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website, conducting our business, or servicing you, as long as those parties agree to keep this information confidential.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-medium text-black mb-4">Cookies and Tracking</h2>
                <p className="leading-relaxed">
                  We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand where our visitors are coming from. You can control cookies through your browser settings.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-medium text-black mb-4">Data Security</h2>
                <p className="leading-relaxed">
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-medium text-black mb-4">Your Rights</h2>
                <p className="leading-relaxed mb-3">You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access the personal information we hold about you</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your information</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Object to processing of your information</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-medium text-black mb-4">Children's Privacy</h2>
                <p className="leading-relaxed">
                  Our website is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-medium text-black mb-4">Changes to This Policy</h2>
                <p className="leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-medium text-black mb-4">Contact Us</h2>
                <p className="leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <div className="mt-4 p-6 bg-gray-50 rounded-lg">
                  <p className="font-medium text-black">ZOLAR</p>
                  <p>Email: privacy@zolar.com</p>
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

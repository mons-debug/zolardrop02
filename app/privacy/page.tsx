'use client'

import { motion } from 'framer-motion'

export default function PrivacyPage() {
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
              Legal
            </span>
            <h1 
              className="text-4xl md:text-6xl font-light tracking-tight text-black mb-6"
              style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
            >
              Privacy Policy
            </h1>
            <p className="text-gray-600 text-sm md:text-base font-light max-w-2xl mx-auto leading-relaxed">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="prose prose-sm max-w-none"
          >
            <div className="space-y-12">
              {[
                {
                  title: 'Information We Collect',
                  content: `We collect information you provide directly to us, including your name, email address, shipping address, phone number, and payment information when you make a purchase. We also collect information about your device and how you interact with our website through cookies and similar technologies.`
                },
                {
                  title: 'How We Use Your Information',
                  content: `We use the information we collect to process your orders, communicate with you about your purchases, send you marketing communications (with your consent), improve our products and services, and comply with legal obligations. We never sell your personal information to third parties.`
                },
                {
                  title: 'Information Sharing',
                  content: `We may share your information with service providers who assist us in operating our website and fulfilling orders (such as payment processors and shipping companies). These service providers are contractually obligated to protect your information and use it only for the purposes we specify.`
                },
                {
                  title: 'Cookies and Tracking',
                  content: `We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand user behavior. You can control cookies through your browser settings, though some features of our site may not function properly if you disable cookies.`
                },
                {
                  title: 'Data Security',
                  content: `We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.`
                },
                {
                  title: 'Your Rights',
                  content: `You have the right to access, correct, or delete your personal information. You can also opt out of marketing communications at any time. To exercise these rights, please contact us at contact@zolar.com.`
                },
                {
                  title: 'Children\'s Privacy',
                  content: `Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe we have collected information about a child, please contact us.`
                },
                {
                  title: 'Changes to This Policy',
                  content: `We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date.`
                },
                {
                  title: 'Contact Us',
                  content: `If you have any questions about this privacy policy or our data practices, please contact us at contact@zolar.com or through our contact page.`
                }
              ].map((section, index) => (
                <div key={index} className="border-l-2 border-black pl-6">
                  <h2 className="text-xl font-normal text-black mb-4">
                    {section.title}
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed font-light">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}





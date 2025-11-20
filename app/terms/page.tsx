'use client'

import { motion } from 'framer-motion'

export default function TermsPage() {
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
              Terms & Conditions
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
                  title: 'Acceptance of Terms',
                  content: `By accessing and using this website, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our website or services.`
                },
                {
                  title: 'Products and Pricing',
                  content: `All products are subject to availability. We reserve the right to limit quantities or discontinue any product at any time. Prices are subject to change without notice. We strive to ensure all pricing is accurate, but errors may occur. In such cases, we reserve the right to cancel orders.`
                },
                {
                  title: 'Orders and Payment',
                  content: `When you place an order, you are making an offer to purchase our products. We reserve the right to accept or decline your order for any reason. Payment must be made at the time of purchase through our approved payment methods. We currently accept Cash on Delivery (COD) for qualifying orders.`
                },
                {
                  title: 'Shipping and Delivery',
                  content: `We aim to process and ship orders within 3-5 business days. Delivery times may vary depending on your location. Title and risk of loss pass to you upon delivery. We are not responsible for delays caused by shipping carriers or circumstances beyond our control.`
                },
                {
                  title: 'Returns and Refunds',
                  content: `We accept returns within 30 days of purchase for unworn items in original condition with tags attached. Refunds will be processed to the original payment method within 7-10 business days of receiving the return. Shipping costs are non-refundable. Sale items may not be eligible for return.`
                },
                {
                  title: 'Product Care',
                  content: `Care instructions are provided with each product. We are not responsible for damage caused by improper care or use. Please follow all care instructions carefully to maintain product quality.`
                },
                {
                  title: 'Intellectual Property',
                  content: `All content on this website, including text, graphics, logos, images, and software, is the property of Zolar or its content suppliers and is protected by copyright and intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.`
                },
                {
                  title: 'User Conduct',
                  content: `You agree not to use our website for any unlawful purpose or in any way that could damage, disable, or impair our services. You must not attempt to gain unauthorized access to our systems or interfere with other users' use of the website.`
                },
                {
                  title: 'Limitation of Liability',
                  content: `To the fullest extent permitted by law, Zolar shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our website or products. Our total liability shall not exceed the amount you paid for the product in question.`
                },
                {
                  title: 'Governing Law',
                  content: `These terms shall be governed by and construed in accordance with the laws of the United States. Any disputes shall be resolved in the courts of the appropriate jurisdiction.`
                },
                {
                  title: 'Changes to Terms',
                  content: `We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the website. Your continued use of the website after changes constitutes acceptance of the modified terms.`
                },
                {
                  title: 'Contact Information',
                  content: `If you have any questions about these Terms and Conditions, please contact us at contact@zolar.com.`
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













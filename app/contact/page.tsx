'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send to an API
    console.log('Form submitted:', formData)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

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
              Get in Touch
            </span>
            <h1 
              className="text-4xl md:text-6xl font-light tracking-tight text-black mb-6"
              style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
            >
              Contact Us
            </h1>
            <p className="text-gray-600 text-sm md:text-base font-light max-w-2xl mx-auto leading-relaxed">
              Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl md:text-3xl font-light tracking-tight text-black mb-8">
                Send us a Message
              </h2>

              {submitted && (
                <div className="mb-6 p-4 bg-black text-white text-sm">
                  Thank you for your message. We'll get back to you soon.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 text-sm focus:border-black focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 text-sm focus:border-black focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 text-sm focus:border-black focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 text-sm focus:border-black focus:outline-none transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-8 py-3 bg-black text-white text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors duration-300"
                >
                  Send Message
                </button>
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl md:text-3xl font-light tracking-tight text-black mb-8">
                  Contact Information
                </h2>

                <div className="space-y-6">
                  <div className="border-l-2 border-black pl-4">
                    <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-2">Email</h3>
                    <a href="mailto:contact@zolar.com" className="text-base text-black hover:text-gray-600 transition-colors">
                      contact@zolar.com
                    </a>
                  </div>

                  <div className="border-l-2 border-black pl-4">
                    <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-2">Response Time</h3>
                    <p className="text-base text-black">Within 24-48 hours</p>
                  </div>

                  <div className="border-l-2 border-black pl-4">
                    <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-2">Follow Us</h3>
                    <div className="flex space-x-4 mt-3">
                      {[
                        { name: 'Instagram', url: 'https://instagram.com' },
                        { name: 'TikTok', url: 'https://tiktok.com' },
                        { name: 'Twitter', url: 'https://twitter.com' }
                      ].map((social) => (
                        <a
                          key={social.name}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-black hover:text-gray-600 transition-colors"
                        >
                          {social.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="pt-8 border-t border-gray-200">
                <h3 className="text-xl font-light tracking-tight text-black mb-6">
                  Frequently Asked Questions
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      q: 'What is your shipping policy?',
                      a: 'We offer free shipping on all orders. Standard delivery takes 3-5 business days.'
                    },
                    {
                      q: 'Can I return or exchange items?',
                      a: 'Yes, we accept returns within 30 days of purchase. Items must be unworn and in original condition.'
                    },
                    {
                      q: 'How do I track my order?',
                      a: 'You'll receive a tracking number via email once your order ships.'
                    },
                    {
                      q: 'Do you ship internationally?',
                      a: 'Currently, we only ship within the United States. International shipping coming soon.'
                    }
                  ].map((faq, index) => (
                    <div key={index} className="pb-4 border-b border-gray-200 last:border-0">
                      <h4 className="text-sm font-normal text-black mb-2">{faq.q}</h4>
                      <p className="text-sm text-gray-600 font-light leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}





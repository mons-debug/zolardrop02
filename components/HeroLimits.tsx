'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function HeroLimits() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black flex items-center">
      {/* Solid Black Background */}
      <div className="absolute inset-0 bg-black" />
      
      {/* Subtle ambient light effect */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Content Container */}
      <div className="relative w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-20 z-10">
        <div className="max-w-4xl">
          
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold tracking-wider text-white">ZOLAR</span>
            </Link>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light text-white leading-[0.9] mb-12"
          >
            Shatter the Limits.
          </motion.h1>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6 mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl text-white font-light">
              Premium Moroccan Streetwear<br />
              for the Young & Wise.
            </h2>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="space-y-4 text-gray-400 text-lg md:text-xl max-w-2xl mb-12"
          >
            <p>Designed for the generation that refuses excuses.</p>
            <p>Built on discipline, knowledge, and power —</p>
            <p>crafted to elevate your journey.</p>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Link
              href="/products"
              className="inline-block px-12 py-5 border-2 border-white text-white text-sm uppercase tracking-widest font-medium hover:bg-white hover:text-black transition-all duration-300"
            >
              Explore Collections
            </Link>
          </motion.div>

        </div>
      </div>

      {/* Decorative Elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1.5, delay: 1 }}
        className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-full hidden xl:block"
      >
        <div className="relative w-full h-full">
          {/* Geometric shapes */}
          <div className="absolute top-1/4 right-1/4 w-32 h-32 border border-white/20 rotate-45" />
          <div className="absolute bottom-1/3 right-1/3 w-24 h-24 border border-white/10 rotate-12" />
        </div>
      </motion.div>
    </section>
  )
}








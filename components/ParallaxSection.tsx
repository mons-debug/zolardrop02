'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

export default function ParallaxSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const y1 = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const y2 = useTransform(scrollYProgress, [0, 1], ['0%', '-20%'])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.9])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])

  return (
    <section ref={containerRef} className="relative py-32 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Text Content */}
          <motion.div 
            style={{ y: y2 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4 block">
                Innovation Meets Tradition
              </span>
              
              <h2 className="text-5xl lg:text-6xl font-light tracking-tight text-black mb-6 leading-tight">
                Crafted for the
                <span className="block font-serif italic mt-2" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                  Extraordinary
                </span>
              </h2>
              
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Each piece tells a story of meticulous craftsmanship, sustainable practices, 
                and timeless design. We don't just create clothing—we craft experiences that 
                transcend generations.
              </p>

              <div className="space-y-6 border-l-2 border-orange-500 pl-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-black">Sustainable Materials</h3>
                  <p className="text-gray-600">
                    100% organic and recycled fabrics sourced from ethical suppliers worldwide.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-black">Master Artisans</h3>
                  <p className="text-gray-600">
                    Every stitch placed by skilled craftspeople with decades of experience.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-black">Limited Editions</h3>
                  <p className="text-gray-600">
                    Exclusive collections with numbered pieces for true collectors.
                  </p>
                </div>
              </div>

              <Link
                href="/about"
                className="inline-flex items-center gap-3 mt-10 text-black group"
              >
                <span className="text-sm uppercase tracking-widest font-semibold border-b-2 border-black pb-1 group-hover:border-orange-500 transition-colors">
                  Discover Our Process
                </span>
                <motion.svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </motion.svg>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right - Parallax Images */}
          <motion.div 
            style={{ y: y1, scale, opacity }}
            className="relative h-[600px]"
          >
            <div className="absolute top-0 right-0 w-2/3 h-2/3 z-10">
              <div className="relative h-full group overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800"
                  alt="Fashion Detail 1"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>

            <div className="absolute bottom-0 left-0 w-2/3 h-2/3">
              <div className="relative h-full group overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800"
                  alt="Fashion Detail 2"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>

            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-white shadow-2xl p-8 text-center"
            >
              <div className="text-6xl font-light text-black mb-2">2025</div>
              <div className="text-xs uppercase tracking-[0.3em] text-gray-500">Award Winning</div>
              <div className="text-xs uppercase tracking-[0.3em] text-gray-500 mt-1">Design</div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
    </section>
  )
}


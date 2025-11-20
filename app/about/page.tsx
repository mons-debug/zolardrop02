'use client'

import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function AboutPage() {
  const storyRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: storyRef,
    offset: ["start end", "end start"]
  })
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['-20%', '20%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
    },
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pb-24 bg-white overflow-hidden">
        {/* ZOLAR Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.02, scale: 1 }}
            transition={{ duration: 2, ease: 'easeOut' }}
            className="text-[35vw] font-black tracking-tighter select-none whitespace-nowrap text-gray-900"
            style={{ lineHeight: 0.8 }}
          >
            ZOLAR
          </motion.div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-white" />
          <motion.div 
            className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center mb-8">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
              <span className="mx-4 text-xs font-medium uppercase tracking-[0.3em] text-orange-500">
                About ZOLAR
              </span>
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-light tracking-tight text-black mb-8 leading-[0.9]">
              Made for<br />
              <span className="font-medium">Movement.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 font-light max-w-3xl mx-auto leading-relaxed mb-4">
              Modern streetwear for people who want more from themselves.
            </p>
            <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
              Better days. Better energy. Better versions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section with Parallax */}
      <section ref={storyRef} className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-br from-orange-50 via-orange-100/30 to-gray-50">
        {/* Parallax Background Elements */}
        <motion.div 
          className="absolute inset-0 z-0 pointer-events-none"
          style={{ y: backgroundY, opacity }}
        >
          {/* Animated Orange Orb */}
          <motion.div 
            className="absolute top-0 right-[10%] w-[500px] h-[500px] bg-gradient-radial from-orange-400/40 via-orange-300/20 to-transparent rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, 50, 0],
              y: [0, -30, 0],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Animated Red Orb */}
          <motion.div 
            className="absolute bottom-0 left-[15%] w-[600px] h-[600px] bg-gradient-radial from-red-400/30 via-pink-300/15 to-transparent rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              x: [0, -40, 0],
              y: [0, 40, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Geometric Patterns */}
          <div className="absolute top-20 left-10 w-32 h-32 border border-orange-300/20 rotate-45" />
          <div className="absolute bottom-32 right-20 w-24 h-24 border border-red-300/20 rotate-12" />
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              style={{ y: textY }}
            >
              <div className="inline-flex items-center mb-6">
                <div className="h-px w-12 bg-gradient-to-r from-orange-500 to-transparent mr-3" />
                <span className="text-xs font-medium uppercase tracking-[0.3em] text-orange-500">
                  Our Story
                </span>
              </div>
              
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-black mb-8 leading-tight">
                A Brand Built on<br />
                <span className="font-medium">Forward Energy</span>
              </h2>
              
              <div className="space-y-6 text-gray-700 text-base sm:text-lg leading-relaxed font-light">
                <p>
                  ZOLAR started with a simple belief: clothing should move with you, not against you. 
                  We create modern essentials for people who refuse to stand still.
                </p>
                <p>
                  Born in Morocco, inspired by global streetwear culture, ZOLAR represents a new 
                  generation of style—clean lines, bold identity, and everyday ambition.
                </p>
                <p>
                  We're not here to follow trends. We're here to build a movement of people who 
                  wear what moves them forward.
                </p>
              </div>

              <Link
                href="/products"
                className="inline-flex items-center gap-3 mt-8 px-8 py-4 bg-black text-white text-sm uppercase tracking-wider font-medium hover:bg-orange-500 transition-all duration-300 group"
              >
                <span>Explore Collections</span>
                <svg 
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-[4/5] bg-gray-100 rounded-sm overflow-hidden shadow-lg"
            >
              <Image
                src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80"
                alt="ZOLAR Brand"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-xs font-normal uppercase tracking-widest text-gray-500 block mb-4">
              Our Philosophy
            </span>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight text-black">
              Quality Over Quantity
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Timeless Design',
                description: 'We create pieces that last beyond seasons, focusing on enduring style rather than fleeting trends.'
              },
              {
                title: 'Premium Materials',
                description: 'Only the finest fabrics and materials make it into our collections, ensuring comfort and durability.'
              },
              {
                title: 'Ethical Production',
                description: 'Every piece is crafted with care, respecting both artisans and the environment.'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-8 border border-gray-200"
              >
                <h3 className="text-lg font-normal text-black mb-3 tracking-wide">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed font-light">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative aspect-square"
            >
              <Image
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
                alt="Zolar Values"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-xs font-normal uppercase tracking-widest text-gray-500 block mb-4">
                Our Values
              </span>
              <h2 className="text-3xl md:text-4xl font-light tracking-tight text-black mb-6">
                What We Stand For
              </h2>
              <div className="space-y-6">
                {[
                  {
                    title: 'Authenticity',
                    text: 'We stay true to our vision, never compromising on quality or design principles.'
                  },
                  {
                    title: 'Innovation',
                    text: 'While respecting tradition, we constantly push boundaries in design and production.'
                  },
                  {
                    title: 'Community',
                    text: 'Our customers are part of the Zolar family. Your feedback shapes our future collections.'
                  }
                ].map((value, index) => (
                  <div key={index} className="border-l-2 border-black pl-4">
                    <h3 className="text-base font-normal text-black mb-2">{value.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed font-light">
                      {value.text}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 
              className="text-3xl md:text-5xl font-light tracking-tight mb-6"
              style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
            >
              Explore the Collection
            </h2>
            <p className="text-gray-300 text-sm mb-8 max-w-2xl mx-auto font-light">
              Discover pieces that reflect your unique style and commitment to quality.
            </p>
            <Link
              href="/products"
              className="inline-block px-12 py-3 bg-white text-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-colors duration-300"
            >
              Shop Now
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}







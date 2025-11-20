'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

interface CarouselImage {
  id: string
  url: string
  alt: string
  size: 'small' | 'medium' | 'large'
}

export default function FashionCarousel() {
  const [images, setImages] = useState<CarouselImage[]>([])
  const [loading, setLoading] = useState(true)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  // Fetch images from API
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/fashion-carousel?active=true')
        if (response.ok) {
          const data = await response.json()
          setImages(data.images || [])
        }
      } catch (error) {
        console.error('Error fetching fashion carousel:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchImages()
  }, [])

  // Show loading state
  if (loading) {
    return (
      <section className="relative py-20 md:py-24 lg:py-28 bg-gradient-to-b from-gray-50 via-white to-gray-50 overflow-hidden">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
            <p className="text-gray-600">Loading fashion carousel...</p>
          </div>
        </div>
      </section>
    )
  }

  // Show empty state if no images
  if (images.length === 0) {
    return null
  }

  return (
    <section className="relative py-24 md:py-32 lg:py-40 bg-white overflow-hidden">
      {/* Subtle Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 via-white to-gray-50/50" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header - Clean & Minimal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center justify-center mb-6"
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
            <span className="mx-4 text-xs font-medium uppercase tracking-[0.3em] text-orange-500">
              Lookbook
            </span>
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight text-black mb-6 leading-tight"
          >
            Style in Motion
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto font-light"
          >
            See how our pieces come to life.
          </motion.p>
        </motion.div>

        {/* Modern Lookbook Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {images.slice(0, 3).map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group relative overflow-hidden"
            >
              <Link href="/products" className="block">
                {/* Image Container with Modern Aspect */}
                <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                  {imageErrors[image.id] ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <div className="text-center p-8">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span className="text-gray-400 text-sm">Image Not Available</span>
                      </div>
                    </div>
                  ) : (
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      onError={() => setImageErrors(prev => ({ ...prev, [image.id]: true }))}
                      unoptimized
                    />
                  )}
                  
                  {/* Subtle Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />
                  
                  {/* Orange Glow on Hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-t from-orange-500/30 via-transparent to-transparent" />
                  </div>
                </div>

                {/* Floating Label on Hover */}
                <motion.div 
                  className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm px-4 py-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                  initial={{ y: -10 }}
                  whileHover={{ y: 0 }}
                >
                  <p className="text-xs uppercase tracking-[0.2em] font-semibold text-black">
                    Drop 02
                  </p>
                </motion.div>

                {/* Bottom CTA Bar */}
                <div className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-sm p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">ZOLAR</p>
                      <p className="text-sm font-medium text-black">View Collection</p>
                    </div>
                    <svg 
                      className="w-5 h-5 text-orange-500 transform group-hover:translate-x-1 transition-transform duration-300" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Link
            href="/products"
            className="group relative inline-flex items-center gap-4 px-12 py-5 bg-black text-white text-sm uppercase tracking-[0.25em] font-medium overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.02]"
          >
            <span className="relative z-10">Shop the Look</span>
            <motion.svg 
              className="w-5 h-5 relative z-10" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </motion.svg>
            
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.5 }}
            />
          </Link>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="text-xs text-gray-400 mt-6 tracking-wider uppercase"
          >
            Moroccan Streetwear · Limited Edition
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}


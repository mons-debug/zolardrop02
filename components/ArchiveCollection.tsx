'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface ArchiveImage {
  url: string
  alt: string
}

export default function ArchiveCollection() {
  const [archiveImages, setArchiveImages] = useState<ArchiveImage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchArchiveImages()
  }, [])

  const fetchArchiveImages = async () => {
    try {
      const res = await fetch('/api/archive-collection')
      if (res.ok) {
        const data = await res.json()
        if (data.images && data.images.length > 0) {
          setArchiveImages(data.images)
        } else {
          // Use high-quality streetwear images as default
          setArchiveImages([
            { url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80', alt: 'Borderline Black Tee' },
            { url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80', alt: 'Borderline White Hoodie' }
          ])
        }
      }
    } catch (error) {
      console.error('Error fetching archive images:', error)
      // Fallback to high-quality streetwear images
      setArchiveImages([
        { url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80', alt: 'Borderline Black Tee' },
        { url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80', alt: 'Borderline White Hoodie' }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative py-16 bg-black text-white overflow-hidden">
      {/* Complex Background Layers */}
      <div className="absolute inset-0">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(16, 185, 129, 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(16, 185, 129, 0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
        
        {/* Diagonal Stripes */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(16, 185, 129, 0.2) 35px, rgba(16, 185, 129, 0.2) 70px)`
        }} />
        
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Side - Enhanced Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Label with Lines */}
            <div className="flex items-center space-x-4">
              <div className="h-px w-12 bg-gradient-to-r from-emerald-500 to-transparent" />
              <span className="text-xs uppercase tracking-[0.3em] text-emerald-400 font-medium">
                Archive Collection
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-emerald-500/50 to-transparent" />
            </div>
            
            {/* BORDERLINE Title with Enhanced Styling */}
            <div>
              <h2 
                className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter mb-4"
                style={{ 
                  color: '#10b981',
                  textShadow: '0 0 40px rgba(16, 185, 129, 0.4), 0 0 80px rgba(16, 185, 129, 0.2)',
                  letterSpacing: '-0.02em',
                  lineHeight: '0.9'
                }}
              >
                BORDER<br />LINE
              </h2>
              
              {/* Sold Out Badge - Redesigned */}
              <div className="inline-flex items-center space-x-2 px-4 py-2 border border-emerald-500/50 bg-emerald-500/5 backdrop-blur-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs uppercase tracking-[0.2em] text-emerald-300 font-semibold">
                  Sold Out
                </span>
              </div>
            </div>

            {/* Collection Details */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-400">Summer 2024</span>
                </div>
                <div className="h-4 w-px bg-gray-700" />
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-400">Morocco</span>
                </div>
              </div>
              
              <div className="border-l-2 border-emerald-500 pl-4 space-y-3">
                <p className="text-sm text-gray-300 leading-relaxed">
                  The Borderline Collection marked our entry into the fashion world. Premium streetwear 
                  designed for those who stand out.
                </p>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Every piece sold out - a testament to quality and design. Limited to 100 pieces worldwide.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-800">
              <div>
                <div className="text-2xl font-light text-emerald-400 mb-1">100</div>
                <div className="text-[10px] uppercase tracking-wider text-gray-500">Pieces</div>
              </div>
              <div>
                <div className="text-2xl font-light text-emerald-400 mb-1">2</div>
                <div className="text-[10px] uppercase tracking-wider text-gray-500">Designs</div>
              </div>
              <div>
                <div className="text-2xl font-light text-emerald-400 mb-1">100%</div>
                <div className="text-[10px] uppercase tracking-wider text-gray-500">Sold Out</div>
              </div>
            </div>
            
            {/* CTA Button - Enhanced */}
            <Link
              href="/products"
              className="group inline-flex items-center space-x-3 mt-6"
            >
              <span className="text-sm uppercase tracking-[0.2em] font-semibold text-emerald-400 border-b-2 border-emerald-500 pb-1 group-hover:text-emerald-300 group-hover:border-emerald-300 transition-all duration-300">
                Explore Current Collection
              </span>
              <svg 
                className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300 transition-all duration-300 group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>

          {/* Right Side - Enhanced Image Grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {(loading ? [{ url: '', alt: '' }, { url: '', alt: '' }] : archiveImages.slice(0, 2)).map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 + (index * 0.1) }}
                  className="relative group cursor-pointer"
                >
                  {/* Image Container with Multiple Borders */}
                  <div className="relative">
                    {/* Outer Glow Border */}
                    <div className="absolute -inset-0.5 bg-gradient-to-br from-emerald-500/50 to-emerald-500/10 opacity-0 group-hover:opacity-100 blur transition-opacity duration-500" />
                    
                    {/* Main Image */}
                    <div className="relative aspect-[3/4] bg-gray-900 overflow-hidden border-2 border-emerald-500/20 group-hover:border-emerald-500/40 transition-all duration-500">
                      {loading ? (
                        <div className="w-full h-full bg-gray-800 animate-pulse" />
                      ) : (
                        <Image
                          src={image.url}
                          alt={image.alt}
                          fill
                          className="object-cover transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-110"
                          sizes="(max-width: 768px) 45vw, 25vw"
                          unoptimized
                        />
                      )}
                      
                      {/* Gradient Overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                      
                      {/* Sold Out Badge - Floating */}
                      <div className="absolute top-3 left-3 px-3 py-1.5 bg-black/90 backdrop-blur-md border border-emerald-500/50">
                        <span className="text-[9px] uppercase tracking-[0.2em] text-emerald-400 font-bold">Sold Out</span>
                      </div>
                      
                      {/* Bottom Info */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <div className="text-xs text-white font-medium mb-1">{image.alt}</div>
                        <div className="text-[10px] text-emerald-400 uppercase tracking-wider">Archive Item</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Decorative Corner Elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 border-l-2 border-t-2 border-emerald-500/30 pointer-events-none" />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-r-2 border-b-2 border-emerald-500/30 pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  )
}


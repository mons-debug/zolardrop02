'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
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
  
  const controls = useAnimation()
  const animationRef = useRef<number>(0)
  const isHoveredRef = useRef(false)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  const ANIMATION_DURATION = 90 // seconds for full loop
  const HOVER_DELAY = 150 // milliseconds delay for smooth transition

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

  useEffect(() => {
    let animationFrameId: number
    let startTime = Date.now()
    
    const animate = () => {
      if (!isHoveredRef.current) {
        const elapsed = (Date.now() - startTime + animationRef.current * 1000) / 1000
        const progress = (elapsed % ANIMATION_DURATION) / ANIMATION_DURATION
        const xPosition = progress * -50 // Move from 0 to -50%
        
        controls.set({ x: `${xPosition}%` })
      }
      
      animationFrameId = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    }
  }, [controls])

  const handleHoverStart = () => {
    // Clear any pending resume timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
    
    // Add slight delay before pausing for smoother feel
    hoverTimeoutRef.current = setTimeout(() => {
      isHoveredRef.current = true
    }, 100)
  }

  const handleHoverEnd = () => {
    // Clear any pending pause timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
    
    // Add slight delay before resuming for smoother transition
    hoverTimeoutRef.current = setTimeout(() => {
      isHoveredRef.current = false
    }, 150)
  }

  const getSizeClasses = (size: 'small' | 'medium' | 'large') => {
    switch (size) {
      case 'small':
        // Horizontal/Wide cards - Same ratio on mobile, just smaller
        return 'h-[200px] md:h-[280px] lg:h-[350px] w-[280px] md:w-[380px] lg:w-[500px]'
      case 'medium':
        // Square-ish cards - Same ratio on mobile, just smaller
        return 'h-[250px] md:h-[350px] lg:h-[450px] w-[210px] md:w-[300px] lg:w-[380px]'
      case 'large':
        // Tall/Vertical cards - Same ratio on mobile, just smaller
        return 'h-[320px] md:h-[450px] lg:h-[600px] w-[210px] md:w-[300px] lg:w-[400px]'
      default:
        return 'h-[250px] md:h-[350px] lg:h-[450px] w-[210px] md:w-[300px] lg:w-[380px]'
    }
  }

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
    return (
      <section className="relative py-20 md:py-24 lg:py-28 bg-gradient-to-b from-gray-50 via-white to-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500">No carousel images available. Please add images via the admin dashboard.</p>
        </div>
      </section>
    )
  }

  // Duplicate images for seamless infinite loop
  const duplicatedImages = [...images, ...images]

  return (
    <section className="relative py-20 md:py-24 lg:py-28 bg-gradient-to-b from-gray-50 via-white to-gray-50 overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-orange-50/30 to-transparent pointer-events-none" />
      
      {/* Section Header - Enhanced */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          {/* Label with Accent Lines */}
          <div className="inline-flex items-center justify-center space-x-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-orange-500">
              Latest Collection
            </span>
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
          </div>
          
          {/* Title with Split Style */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-black mb-4 leading-tight">
            <span className="block mb-2">Fashion</span>
            <span className="block font-serif italic bg-gradient-to-r from-black via-orange-600 to-black bg-clip-text text-transparent"
                  style={{ fontFamily: 'Playfair Display, Georgia, serif', backgroundSize: '200%' }}>
              Edit
            </span>
          </h2>
          
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto font-light">
            Curated styles from our latest collection, handpicked for the season
          </p>
        </motion.div>
      </div>

      {/* Infinite Scrolling Carousel - Enhanced */}
      <div className="relative w-full overflow-hidden">
        {/* Scrolling Container */}
        <div className="flex items-center">
          <motion.div
            className="flex gap-6 items-center"
            animate={controls}
          >
            {duplicatedImages.map((image, index) => (
              <div
                key={`${image.id}-${index}`}
                className={`relative flex-shrink-0 overflow-hidden group cursor-pointer ${getSizeClasses(
                  image.size
                )}`}
                onMouseEnter={handleHoverStart}
                onMouseLeave={handleHoverEnd}
              >
                {/* Image with Enhanced Effects */}
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 400px, 500px"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Orange Accent Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Border Effect */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-orange-500/40 transition-all duration-500" />
                
                {/* Hover Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <div className="text-white">
                    <p className="text-xs uppercase tracking-wider mb-1">Editorial Style</p>
                    <p className="text-sm font-medium">View Collection</p>
                  </div>
                </div>
                
                {/* Corner Decoration */}
                <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-white/0 group-hover:border-white/40 transition-all duration-500" />
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Enhanced CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-center mt-12 md:mt-16"
      >
        <Link
          href="/products"
          className="group relative inline-flex items-center gap-4 px-12 py-4 bg-black text-white text-sm uppercase tracking-[0.2em] overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105"
        >
          <span className="relative z-10 font-semibold">Explore Full Collection</span>
          <svg 
            className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
          
          {/* Gradient Effect on Hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>
        
        {/* Additional Info */}
        <p className="text-xs text-gray-500 mt-4">
          New styles added weekly
        </p>
      </motion.div>
    </section>
  )
}


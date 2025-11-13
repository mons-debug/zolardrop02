'use client'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import FashionCarousel from '@/components/FashionCarousel'
import ArchiveCollection from '@/components/ArchiveCollection'
import AnimatedBackground from '@/components/AnimatedBackground'

export default function Home() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [products, setProducts] = useState<any[]>([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [heroSlides, setHeroSlides] = useState<any[]>([])
  const [heroLoading, setHeroLoading] = useState(true)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})
  const [dominantColors, setDominantColors] = useState<Record<string, string>>({})

  // Extract dominant color from image
  const extractDominantColor = async (imageUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = document.createElement('img')
      img.crossOrigin = 'Anonymous'
      img.src = imageUrl
      
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve('rgba(0, 0, 0, 0.3)') // Default fallback
          return
        }
        
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        
        try {
          // Sample center region for dominant color
          const imageData = ctx.getImageData(
            Math.floor(img.width * 0.3),
            Math.floor(img.height * 0.3),
            Math.floor(img.width * 0.4),
            Math.floor(img.height * 0.4)
          )
          
          let r = 0, g = 0, b = 0, count = 0
          
          // Average color values
          for (let i = 0; i < imageData.data.length; i += 4) {
            r += imageData.data[i]
            g += imageData.data[i + 1]
            b += imageData.data[i + 2]
            count++
          }
          
          r = Math.floor(r / count)
          g = Math.floor(g / count)
          b = Math.floor(b / count)
          
          resolve(`rgba(${r}, ${g}, ${b}, 0.3)`)
        } catch (e) {
          // CORS error or other issue - use fallback
          resolve('rgba(0, 0, 0, 0.3)')
        }
      }
      
      img.onerror = () => {
        resolve('rgba(0, 0, 0, 0.3)')
      }
    })
  }

  // Navigation functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  // Extract colors from hero slides
  useEffect(() => {
    if (heroSlides.length === 0) return
    
    const extractColors = async () => {
      const colors: Record<string, string> = {}
      for (const slide of heroSlides) {
        if (slide.image && !dominantColors[slide.id]) {
          const color = await extractDominantColor(slide.image)
          colors[slide.id] = color
        }
      }
      if (Object.keys(colors).length > 0) {
        setDominantColors(prev => ({ ...prev, ...colors }))
      }
    }
    
    extractColors()
  }, [heroSlides])

  // Fetch real products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products?limit=4')
        if (res.ok) {
          const data = await res.json()
          setProducts(data.products || [])
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setProductsLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Fetch hero slides from database
  useEffect(() => {
    const fetchHeroSlides = async () => {
      try {
        // Add cache busting to get fresh data
        const res = await fetch(`/api/hero-slides?t=${Date.now()}`, {
          cache: 'no-store'
        })
        if (res.ok) {
          const data = await res.json()
          const slides = (data.slides || []).map((slide: any) => ({
            id: slide.id,
            title: slide.title,
            subtitle: slide.subtitle || '',
            image: slide.mediaUrl,
            mediaType: slide.mediaType,
            linkUrl: slide.linkUrl,
            backgroundColor: slide.backgroundColor || '#000000',
            textColor: slide.textColor || '#FFFFFF',
            accentColor: slide.accentColor || '#ff5b00',
            duration: slide.duration || 5000
          }))
          console.log('Loaded hero slides:', slides) // Debug log
          setHeroSlides(slides)
        }
      } catch (error) {
        console.error('Error fetching hero slides:', error)
        // Fallback to default slides
        setHeroSlides([
          {
            id: '1',
      title: 'ESSENTIAL TEE',
      subtitle: 'DROP 02',
            image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1920&q=80',
            mediaType: 'image',
            backgroundColor: '#000000',
            textColor: '#FFFFFF',
            accentColor: '#ff5b00',
            duration: 5000
          }
        ])
      } finally {
        setHeroLoading(false)
      }
    }
    fetchHeroSlides()
  }, [])

  // Auto-rotate carousel with dynamic duration
  useEffect(() => {
    if (heroSlides.length === 0) return
    
    // Use the current slide's duration
    const currentDuration = heroSlides[currentSlide]?.duration || 5000
    
    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, currentDuration)

    return () => clearTimeout(timer)
  }, [heroSlides, currentSlide])

  // Color map for variant display
  const colorMap: Record<string, string> = {
    'Black': '#000000',
    'White': '#FFFFFF',
    'Gray': '#6B7280',
    'Orange': '#ff5b00',
    'Navy': '#1F2937',
    'Blue': '#3B82F6',
    'Red': '#EF4444',
    'Green': '#10B981',
    'Heather Gray': '#9CA3AF'
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setTimeout(() => {
        setEmail('')
        setSubscribed(false)
      }, 3000)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as any },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: i * 0.1,
        ease: [0.4, 0, 0.2, 1] as any,
      },
    }),
  }

  return (
    <div className="bg-white">
      {/* Hero Section - Award-Winning Split Design */}
      <section
        className="relative h-screen w-full overflow-hidden bg-black"
      >
        <div className="flex flex-col lg:flex-row h-screen">
          {/* Left Side - Clean Minimal Design */}
          <motion.div 
            className="relative flex flex-col justify-center px-6 sm:px-8 md:px-12 lg:px-20 py-8 lg:py-0 overflow-hidden h-1/2 lg:h-full lg:w-1/2"
          >
            {/* Simple Gradient Background with Subtle Color Theme */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={`bg-${currentSlide}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: 'easeInOut' }}
                className="absolute inset-0"
              >
                {/* Product-specific subtle gradient */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: heroSlides[currentSlide]?.title === 'Eclipse Black' 
                      ? 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)'
                      : heroSlides[currentSlide]?.title === 'Forest Dusk'
                      ? 'linear-gradient(135deg, #0a1810 0%, #000000 100%)'
                      : heroSlides[currentSlide]?.title === 'Ocean Deep'
                      ? 'linear-gradient(135deg, #0a1628 0%, #000000 100%)'
                      : heroSlides[currentSlide]?.title === 'Cloud Mist'
                      ? 'linear-gradient(135deg, #1a1c1e 0%, #000000 100%)'
                      : 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)'
                  }}
                />

                {/* Atmospheric Effects - Smoke/Mist for non-black backgrounds */}
                {heroSlides[currentSlide]?.title === 'Cloud Mist' && (
                  <>
                    {/* Cloud Mist - Prominent smoke effect */}
                    <motion.div
                      className="absolute inset-0 opacity-30"
                      animate={{
                        opacity: [0.2, 0.35, 0.2],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                    >
                      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gray-400/20 rounded-full blur-3xl" />
                      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gray-300/15 rounded-full blur-3xl" />
                    </motion.div>
                    <motion.div
                      className="absolute inset-0 opacity-20"
                      animate={{
                        x: ['-10%', '10%', '-10%'],
                      }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: 'linear'
                      }}
                    >
                      <div className="absolute top-1/2 left-0 w-full h-64 bg-gradient-to-r from-transparent via-gray-400/10 to-transparent blur-2xl" />
                    </motion.div>
                  </>
                )}

                {heroSlides[currentSlide]?.title === 'Forest Dusk' && (
                  <>
                    {/* Forest Dusk - Subtle misty fog effect */}
                    <motion.div
                      className="absolute inset-0 opacity-20"
                      animate={{
                        opacity: [0.15, 0.25, 0.15],
                      }}
                      transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                    >
                      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-green-900/15 rounded-full blur-3xl" />
                      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-emerald-900/10 rounded-full blur-3xl" />
                    </motion.div>
                  </>
                )}

                {heroSlides[currentSlide]?.title === 'Ocean Deep' && (
                  <>
                    {/* Ocean Deep - Flowing mist effect */}
                    <motion.div
                      className="absolute inset-0 opacity-20"
                      animate={{
                        opacity: [0.15, 0.28, 0.15],
                        y: ['-5%', '5%', '-5%']
                      }}
                      transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                    >
                      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl" />
                      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-cyan-900/15 rounded-full blur-3xl" />
                    </motion.div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Main Content - Clean Typography */}
            <div className="relative z-10">
              {/* Generic Tagline */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-6 lg:mb-8"
              >
                <h2 className="text-sm lg:text-base font-light tracking-[0.3em] uppercase text-white/60 mb-2">
                  Zolar
                </h2>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light tracking-tight leading-[0.9] text-white mb-4">
                  Make your<br />
                  fashion look
                </h1>
              </motion.div>

              {/* Subtitle with dynamic product name */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={`desc-${currentSlide}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1, ease: 'easeInOut' }}
                  className="text-base lg:text-lg mb-8 lg:mb-12 max-w-md leading-relaxed font-light text-white/70"
                >
                  {heroSlides[currentSlide]?.title || 'More Charming'}
                </motion.p>
              </AnimatePresence>

              {/* Button and Navigation */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex items-center gap-6"
              >
                <Link
                  href="/products"
                  className="inline-block px-8 lg:px-12 py-3 lg:py-4 border-2 border-white/40 text-white hover:bg-white hover:text-black transition-all duration-300 group"
                >
                  <span className="text-xs lg:text-sm font-medium tracking-widest uppercase">
                    Explore
                  </span>
                </Link>

                {/* Navigation Arrows */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={prevSlide}
                    className="w-10 h-10 lg:w-12 lg:h-12 border border-white/30 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300"
                    aria-label="Previous slide"
                  >
                    <svg
                      className="w-4 h-4 lg:w-5 lg:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={nextSlide}
                    className="w-10 h-10 lg:w-12 lg:h-12 border border-white/30 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300"
                    aria-label="Next slide"
                  >
                    <svg
                      className="w-4 h-4 lg:w-5 lg:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Bottom/Right Side - Dynamic Image Grid */}
          <div className="relative bg-gray-900 h-1/2 lg:h-full lg:w-1/2">
            {/* Main Feature Image */}
            <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  className="relative h-full"
          >
            {heroSlides[currentSlide]?.mediaType === 'video' ? (
              <video
                src={heroSlides[currentSlide].image}
                className="absolute inset-0 w-full h-full object-cover object-center"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <Image
                src={heroSlides[currentSlide]?.image || ''}
                alt={heroSlides[currentSlide]?.title || ''}
                fill
                className="object-cover object-center"
                priority
                unoptimized
              />
            )}
        </motion.div>
              </AnimatePresence>
            </div>

          </div>

        </div>

        {/* Scroll Indicator - Removed for performance */}
      </section>

      {/* Section Divider */}
      <div className="border-t border-gray-100" />

      {/* The Drop - Product Grid */}
      <section className="relative bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">
        {/* Dynamic Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute top-20 right-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute bottom-20 left-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-3xl"
            animate={{
              x: [0, -80, 0],
              y: [0, 80, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />
        </div>
        
        {/* Content */}
        <div className="py-20 md:py-28 lg:py-32 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
          >
            {/* Enhanced Header with Split Design */}
            <motion.div 
              variants={itemVariants} 
              className="mb-16 sm:mb-20"
            >
              <div className="grid lg:grid-cols-2 gap-8 items-end">
                <div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="inline-flex items-center space-x-3 mb-6">
                      <div className="h-px w-12 bg-gradient-to-r from-orange-500 to-transparent" />
                      <span className="text-xs font-medium uppercase tracking-[0.3em] text-orange-500">
                        Exclusive Release
                      </span>
              </div>
              
                    <h2 className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight text-black mb-4 leading-[0.95]">
                      <span className="block">The</span>
                      <span className="block font-serif italic bg-gradient-to-r from-black via-gray-700 to-black bg-clip-text text-transparent"
                            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                        Drop
                      </span>
                    </h2>
                  </motion.div>
                </div>
                
                <div>
                  <motion.p
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-lg md:text-xl text-gray-600 leading-relaxed font-light"
                  >
                    Curated excellence. Each piece represents the pinnacle of design and craftsmanship. 
                    <span className="block mt-2 text-black font-medium">Limited quantities. Forever exclusive.</span>
                  </motion.p>
                </div>
              </div>
            </motion.div>

            {/* Desktop Grid */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {productsLoading ? (
                // Loading skeleton
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="bg-white border border-gray-200 overflow-hidden animate-pulse">
                    <div className="aspect-[3/4] bg-gray-200" />
                    <div className="p-5">
                      <div className="h-4 bg-gray-200 rounded mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
                      <div className="flex space-x-1.5">
                        <div className="w-5 h-5 bg-gray-200 rounded-full" />
                        <div className="w-5 h-5 bg-gray-200 rounded-full" />
                        <div className="w-5 h-5 bg-gray-200 rounded-full" />
                      </div>
                    </div>
                  </div>
                ))
              ) : products.length === 0 ? (
                <div className="col-span-4 text-center py-12">
                  <p className="text-gray-600">No products available</p>
                  <Link href="/admin/products/new" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
                    Add products in admin →
                  </Link>
                </div>
              ) : (
                products.map((product, index) => {
                  const productImages = JSON.parse(product.images) as string[]
                  const mainImage = productImages[0] || '/placeholder.jpg'
                  
                  return (
                <motion.div
                  key={product.id}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  className="group"
                >
                      <Link href={`/product/${product.sku}`} className="block">
                        <div className="bg-white overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 relative">
                          {/* Product Image */}
                          <div className="relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden bg-gray-900">
                            {imageErrors[product.id] ? (
                              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                <div className="text-center p-4">
                                  <div className="w-16 h-16 mx-auto mb-2 bg-gray-200 rounded flex items-center justify-center">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                  <span className="text-gray-400 text-xs">{product.title}</span>
                                </div>
                              </div>
                            ) : (
                      <Image
                                src={mainImage}
                        alt={product.title}
                        fill
                                className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                onError={() => setImageErrors(prev => ({ ...prev, [product.id]: true }))}
                                unoptimized
                              />
                            )}
                            {/* Gradient Overlay on Hover */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            
                            {/* Premium Badge */}
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold uppercase tracking-wider"
                            >
                              New
                            </motion.div>
                            
                      {/* Glass Shine Effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                      </div>

                            {/* Quick View Button */}
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              whileHover={{ opacity: 1, y: 0 }}
                              className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300"
                            >
                              <div className="bg-white text-black px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 hover:text-white transition-all duration-300">
                                Quick View
                              </div>
                            </motion.div>
                    </div>
                    
                          {/* Product Info */}
                          <div className="p-5 sm:p-6 bg-white">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h3 className="text-base sm:text-lg font-medium text-black mb-1 tracking-wide group-hover:text-orange-500 transition-colors">
                        {product.title}
                      </h3>
                                <p className="text-sm text-gray-500 uppercase tracking-wider">Limited Edition</p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg sm:text-xl font-semibold text-black">
                              ${(product.priceCents / 100).toFixed(2)}
                            </p>
                              </div>
                            </div>
                            
                            {/* Color Variants with Enhanced Design */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                              <div className="flex items-center space-x-2">
                              {product.variants && product.variants.slice(0, 4).map((variant: any, idx: number) => (
                                  <motion.div
                            key={idx}
                                    whileHover={{ scale: 1.2 }}
                                    className="relative w-6 h-6 border-2 border-gray-200 transition-all duration-200 hover:border-orange-500 cursor-pointer shadow-sm"
                                  style={{ backgroundColor: colorMap[variant.color] || '#6B7280' }}
                                  title={variant.color}
                                  >
                                    {idx === 0 && (
                                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full border border-white" />
                                    )}
                                  </motion.div>
                                ))}
                                {product.variants && product.variants.length > 4 && (
                                  <span className="text-xs text-gray-500">+{product.variants.length - 4}</span>
                                )}
                      </div>
                              
                              <motion.svg
                                className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                animate={{ x: [0, 4, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </motion.svg>
                    </div>
                  </div>
                        </div>
                      </Link>
                </motion.div>
                  )
                })
              )}
            </div>
          </motion.div>

          {/* Mobile Carousel */}
          <div className="sm:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Carousel Container with Snap Scroll */}
              <div className="overflow-x-auto overflow-y-hidden scrollbar-hide snap-x snap-mandatory pb-2">
                <div className="flex gap-4 px-4">
                  {productsLoading ? (
                    // Loading skeleton for mobile
                    Array.from({ length: 4 }).map((_, index) => (
                      <div key={index} className="min-w-[300px] max-w-[300px] flex-shrink-0">
                        <div className="bg-white border border-gray-200 overflow-hidden animate-pulse">
                          <div className="aspect-[4/5] bg-gray-200" />
                          <div className="p-4">
                            <div className="h-4 bg-gray-200 rounded mb-2" />
                            <div className="h-4 bg-gray-200 rounded w-1/2" />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    products.map((product, index) => {
                      const productImages = JSON.parse(product.images) as string[]
                      const mainImage = productImages[0] || '/placeholder.jpg'
                      
                      return (
                    <motion.div
                      key={product.id}
                      className="group min-w-[300px] max-w-[300px] flex-shrink-0 snap-center"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                          <Link href={`/product/${product.sku}`}>
                            <div className="bg-white border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative cursor-pointer">
                        <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
                                {imageErrors[product.id] ? (
                                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                    <div className="text-center p-4">
                                      <div className="w-12 h-12 mx-auto mb-2 bg-gray-200 rounded flex items-center justify-center">
                                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                      </div>
                                      <span className="text-gray-400 text-xs">{product.title}</span>
                                    </div>
                                  </div>
                                ) : (
                          <Image
                                    src={mainImage}
                            alt={product.title}
                            fill
                            className="object-cover transition-all duration-500 group-hover:scale-105"
                            sizes="300px"
                                    onError={() => setImageErrors(prev => ({ ...prev, [product.id]: true }))}
                                    unoptimized
                          />
                                )}
                          {/* Glass Shine Effect */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <h3 className="text-sm font-normal text-black mb-1 tracking-wide">
                            {product.title}
                          </h3>
                          <p className="text-sm font-normal text-gray-600 mb-3">
                                  ${(product.priceCents / 100).toFixed(2)}
                          </p>
                          
                          <div className="flex items-center space-x-1.5 mb-3">
                                  {product.variants && product.variants.slice(0, 4).map((variant: any, idx: number) => (
                              <div
                                key={idx}
                                className="w-4 h-4 border border-gray-300 transition-all duration-200 hover:scale-110 cursor-pointer"
                                      style={{ backgroundColor: colorMap[variant.color] || '#6B7280' }}
                                      title={variant.color}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                          </Link>
                    </motion.div>
                      )
                    })
                  )}
                </div>
              </div>

              {/* Scroll Indicator Dots */}
              {!productsLoading && products.length > 0 && (
              <div className="flex justify-center gap-2 mt-6">
                  {products.map((_, idx) => (
                  <div
                    key={idx}
                    className="w-2 h-2 rounded-full bg-gray-300 transition-all duration-300"
                  />
                ))}
              </div>
              )}
            </motion.div>
          </div>

          {/* View All Products Button - Enhanced */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-16"
          >
            <Link
              href="/products"
              className="group relative inline-flex items-center gap-4 px-16 py-5 bg-black text-white text-sm uppercase tracking-[0.3em] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-105"
            >
              <span className="relative z-10">Explore Full Collection</span>
              <motion.svg
                className="w-6 h-6 relative z-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </motion.svg>
              
              {/* Animated Background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-orange-500"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.5 }}
              />
            </Link>
            
            {/* Additional Info */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-6 text-sm text-gray-500"
            >
              50+ Exclusive Pieces Available
            </motion.p>
          </motion.div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="border-t border-gray-100" />

      {/* Fashion Carousel Section */}
      <FashionCarousel />

      {/* Section Divider */}
      <div className="border-t border-gray-100" />

      {/* Quality & Design Section - Award-Winning Design */}
      <section className="relative py-20 md:py-28 lg:py-32 bg-white overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50" />
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-orange-50/30 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content Area - Enhanced */}
          <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Label with Accent Line */}
              <div className="inline-flex items-center space-x-3">
                <div className="h-px w-12 bg-gradient-to-r from-orange-500 to-transparent" />
                <span className="text-xs font-medium uppercase tracking-[0.3em] text-orange-500">
                  Our Philosophy
                </span>
              </div>
              
              {/* Headline */}
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-black leading-tight">
                <span className="block mb-2">Quality &</span>
                <span className="block font-serif italic bg-gradient-to-r from-black via-gray-700 to-black bg-clip-text text-transparent"
                      style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                  Design
                </span>
              </h2>
              
              {/* Description */}
              <div className="space-y-4 border-l-2 border-orange-500 pl-6">
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                  Every piece in our collection is crafted with meticulous attention to detail. 
                  We believe in creating timeless designs that transcend seasonal trends.
                </p>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                  From fabric selection to final stitch, each step is carefully considered 
                  to deliver products that exceed expectations.
                </p>
              </div>

              {/* Feature List */}
              <div className="space-y-6 pt-6">
                {[
                  { icon: '✓', title: '100% Premium Materials', desc: 'Organic and recycled fabrics from ethical suppliers' },
                  { icon: '∞', title: 'Timeless Design', desc: 'Styles that transcend seasonal trends' },
                  { icon: '⚡', title: 'Master Craftsmanship', desc: 'Every stitch placed by skilled artisans' },
                ].map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    className="flex items-start space-x-4 group"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-xl font-light group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-red-500 transition-all duration-300">
                      {feature.icon}
                </div>
                <div>
                      <h3 className="text-lg font-semibold text-black mb-1">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.desc}</p>
                </div>
                  </motion.div>
                ))}
              </div>

              {/* CTA Button */}
                <Link
                  href="/about"
                className="group inline-flex items-center space-x-3 mt-8"
              >
                <span className="text-sm uppercase tracking-[0.2em] font-semibold text-black border-b-2 border-black pb-1 group-hover:border-orange-500 group-hover:text-orange-500 transition-all duration-300">
                  Discover Our Process
                </span>
                <svg 
                  className="w-5 h-5 text-black group-hover:text-orange-500 transition-all duration-300 group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                </Link>
              </motion.div>

            {/* Right Image Grid - Enhanced Layout */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-6">
                {/* Large Main Image */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="col-span-2 relative overflow-hidden group"
                >
                  <div className="relative h-[300px] sm:h-[400px] lg:h-[450px]">
                  <Image
                      src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1200"
                      alt="Quality Craftsmanship"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    {/* Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Floating Badge */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 }}
                      className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm px-6 py-3 shadow-xl"
                    >
                      <div className="text-2xl font-light text-black">2025</div>
                      <div className="text-[10px] uppercase tracking-widest text-gray-600">Award Winner</div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Two Smaller Images */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="relative overflow-hidden group"
                >
                  <div className="relative h-[200px] sm:h-[250px]">
                    <Image
                      src="https://images.unsplash.com/photo-1558769132-cb1aea709744?w=600"
                      alt="Premium Fabrics"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-2"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="relative overflow-hidden group"
                >
                  <div className="relative h-[200px] sm:h-[250px]">
                    <Image
                      src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600"
                      alt="Detailed Design"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-2"
                      sizes="(max-width: 768px) 50vw, 25vw"
                  />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                </div>
              </motion.div>
            </div>

              {/* Decorative Element */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Archive Collection - Zolar Borderline */}
      <ArchiveCollection />

      {/* Section Divider */}
      <div className="border-t border-gray-100" />

      {/* Join the Drop - Newsletter Section - White Background */}
      <section className="relative py-32 bg-white text-black overflow-hidden">
        {/* Animated Background Gradient - Orange on White */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.6, 0.4, 0.6],
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
            className="max-w-4xl mx-auto"
          >
            {/* Header */}
            <div className="text-center mb-16">
              <motion.div 
                variants={itemVariants} 
                className="mb-8"
              >
                <div className="inline-flex items-center justify-center space-x-3 mb-6">
                  <div className="h-px w-16 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
                  <span className="text-xs font-medium uppercase tracking-[0.3em] text-orange-500">
                    Exclusive Access
              </span>
                  <div className="h-px w-16 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
                </div>
            </motion.div>

              <motion.h2 
                variants={itemVariants} 
                className="mb-6 text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight leading-tight"
              >
                <span className="block text-black">Join the</span>
                <span className="block font-serif italic bg-gradient-to-r from-black via-orange-600 to-black bg-clip-text text-transparent"
                      style={{ fontFamily: 'Playfair Display, Georgia, serif', backgroundSize: '200%' }}>
                  Movement
                </span>
            </motion.h2>
              
              <motion.p 
                variants={itemVariants} 
                className="text-xl text-gray-600 max-w-2xl mx-auto font-light leading-relaxed"
              >
                Be the first to access new collections, exclusive drops, and insider perks. 
                Join 50,000+ fashion enthusiasts worldwide.
            </motion.p>
            </div>

            {/* Newsletter Form */}
            <motion.form
              variants={itemVariants}
              onSubmit={handleSubscribe}
              className="max-w-2xl mx-auto mb-20"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative group">
              <input
                type="email"
                    placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-8 py-5 bg-gray-50 border-2 border-gray-200 focus:border-orange-500 focus:outline-none transition-all duration-300 text-base text-black placeholder-gray-400 group-hover:bg-gray-100"
                required
              />
                  <div className="absolute inset-0 border-2 border-orange-500/0 group-hover:border-orange-500/30 transition-all duration-300 pointer-events-none" />
                </div>
                <motion.button
                type="submit"
                  className="relative px-12 py-5 bg-black text-white text-sm font-semibold uppercase tracking-[0.2em] overflow-hidden group disabled:opacity-50"
                disabled={subscribed}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10">
                    {subscribed ? '✓ Subscribed' : 'Subscribe'}
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              </div>
              
              <p className="text-xs text-gray-500 mt-4 text-center">
                By subscribing, you agree to our Privacy Policy and consent to receive updates.
              </p>
            </motion.form>

            {/* Stats - Enhanced Design for White Background */}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-3 gap-8"
            >
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative p-8 bg-gray-50 border-2 border-gray-200 overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <p className="text-5xl font-light text-black mb-3">50K+</p>
                  <p className="text-sm uppercase tracking-wider text-gray-600">Global Community</p>
                </div>
                <div className="absolute top-4 right-4 text-6xl opacity-5">🌍</div>
              </motion.div>
              
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative p-8 bg-gray-50 border-2 border-gray-200 overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <p className="text-5xl font-light text-black mb-3">4.9</p>
                  <p className="text-sm uppercase tracking-wider text-gray-600">Average Rating</p>
                </div>
                <div className="absolute top-4 right-4 text-6xl opacity-5">⭐</div>
              </motion.div>
              
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative p-8 bg-gray-50 border-2 border-gray-200 overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <p className="text-5xl font-light text-black mb-3">100%</p>
                  <p className="text-sm uppercase tracking-wider text-gray-600">Quality Promise</p>
                </div>
                <div className="absolute top-4 right-4 text-6xl opacity-5">✨</div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </section>
    </div>
  )
}

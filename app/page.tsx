'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Image from 'next/image'

// Lazy load ArchiveCollection as it's below fold
const ArchiveCollection = dynamic(() => import('@/components/ArchiveCollection'), {
  ssr: true,
  loading: () => <div className="py-32 text-center">Loading...</div>
})

// Lazy load ShatteredBackground for performance
const ShatteredBackground = dynamic(() => import('@/components/ShatteredBackground'), {
  ssr: false,
  loading: () => null
})

export default function Home() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [subscribing, setSubscribing] = useState(false)
  const [subscribeMessage, setSubscribeMessage] = useState('')
  const [currentSlide, setCurrentSlide] = useState(0)
  const [essenceImages, setEssenceImages] = useState<string[]>([])
  const [fragmentImages, setFragmentImages] = useState<string[]>([])
  const [recodeImages, setRecodeImages] = useState<string[]>([])
  const [essenceTitle, setEssenceTitle] = useState('ESSENCE')
  const [fragmentTitle, setFragmentTitle] = useState('FRAGMENT')
  const [recodeTitle, setRecodeTitle] = useState('RECODE')
  const [essenceDescription, setEssenceDescription] = useState('Simple. Clean. Easy to wear.\nEveryday essentials built for your rhythm.')
  const [fragmentDescription, setFragmentDescription] = useState('Bold without trying.\nShattered graphics for a confident, effortless look.')
  const [recodeDescription, setRecodeDescription] = useState('Made for the new you.\nText-driven pieces that reflect your direction.')
  const [essenceLinkUrl, setEssenceLinkUrl] = useState('/products?collection=essence')
  const [fragmentLinkUrl, setFragmentLinkUrl] = useState('/products?collection=fragment')
  const [recodeLinkUrl, setRecodeLinkUrl] = useState('/products?collection=recode')
  const [products, setProducts] = useState<any[]>([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [collectionsLoading, setCollectionsLoading] = useState(true)
  const [essenceIndex, setEssenceIndex] = useState(0)
  const [fragmentIndex, setFragmentIndex] = useState(0)
  const [recodeIndex, setRecodeIndex] = useState(0)
  const [essenceDelay, setEssenceDelay] = useState(3000)
  const [fragmentDelay, setFragmentDelay] = useState(3000)
  const [recodeDelay, setRecodeDelay] = useState(3000)
  const [heroSlides, setHeroSlides] = useState<any[]>([])
  const [heroLoading, setHeroLoading] = useState(true)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  // Navigation functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  // Fetch collection stacks from database
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await fetch('/api/collection-stacks')
        if (res.ok) {
          const data = await res.json()
          const stacks = data.stacks || []
          
          // Find each collection by name
          const essence = stacks.find((s: any) => s.collectionName === 'ESSENCE')
          const fragment = stacks.find((s: any) => s.collectionName === 'FRAGMENT')
          const recode = stacks.find((s: any) => s.collectionName === 'RECODE')
          
          // Set images
          setEssenceImages(essence?.images || [])
          setFragmentImages(fragment?.images || [])
          setRecodeImages(recode?.images || [])
          
          // Set titles
          setEssenceTitle(essence?.title || 'ESSENCE')
          setFragmentTitle(fragment?.title || 'FRAGMENT')
          setRecodeTitle(recode?.title || 'RECODE')
          
          // Set descriptions
          setEssenceDescription(essence?.description || 'Simple. Clean. Easy to wear.\nEveryday essentials built for your rhythm.')
          setFragmentDescription(fragment?.description || 'Bold without trying.\nShattered graphics for a confident, effortless look.')
          setRecodeDescription(recode?.description || 'Made for the new you.\nText-driven pieces that reflect your direction.')
          
          // Set link URLs
          setEssenceLinkUrl(essence?.linkUrl || '/products?collection=essence')
          setFragmentLinkUrl(fragment?.linkUrl || '/products?collection=fragment')
          setRecodeLinkUrl(recode?.linkUrl || '/products?collection=recode')
          
          // Set auto-rotate delays
          setEssenceDelay(essence?.autoRotateDelay || 3000)
          setFragmentDelay(fragment?.autoRotateDelay || 3000)
          setRecodeDelay(recode?.autoRotateDelay || 3000)
        }
      } catch (error) {
        // Silently handle error
      } finally {
        setCollectionsLoading(false)
      }
    }
    fetchCollections()
  }, [])

  // Fetch real products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products')
        if (res.ok) {
          const data = await res.json()
          setProducts(data.products || [])
        }
      } catch (error) {
        // Silently handle error
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
          setHeroSlides(slides)
        }
      } catch (error) {
        // Silently handle error
        setHeroSlides([
          {
            id: '1',
            title: 'CURRENT DROP',
            subtitle: 'BEYOND',
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

  // Auto-rotate carousel
  useEffect(() => {
    if (heroSlides.length === 0) return
    const currentDuration = heroSlides[currentSlide]?.duration || 5000
    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, currentDuration)
    return () => clearTimeout(timer)
  }, [heroSlides, currentSlide])

  // Auto-rotate ESSENCE collection
  useEffect(() => {
    if (essenceImages.length <= 1) return
    const timer = setInterval(() => {
      setEssenceIndex((prev) => (prev + 1) % essenceImages.length)
    }, essenceDelay)
    return () => clearInterval(timer)
  }, [essenceImages.length, essenceDelay])

  // Auto-rotate FRAGMENT collection
  useEffect(() => {
    if (fragmentImages.length <= 1) return
    const timer = setInterval(() => {
      setFragmentIndex((prev) => (prev + 1) % fragmentImages.length)
    }, fragmentDelay)
    return () => clearInterval(timer)
  }, [fragmentImages.length, fragmentDelay])

  // Auto-rotate RECODE collection
  useEffect(() => {
    if (recodeImages.length <= 1) return
    const timer = setInterval(() => {
      setRecodeIndex((prev) => (prev + 1) % recodeImages.length)
    }, recodeDelay)
    return () => clearInterval(timer)
  }, [recodeImages.length, recodeDelay])

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

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) return

    setSubscribing(true)
    setSubscribeMessage('')

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          email,
          source: 'homepage' 
        })
      })

      const data = await response.json()

      if (data.success) {
        setSubscribed(true)
        setSubscribeMessage(data.message)
        setEmail('')
        
        // Reset success state after 5 seconds
        setTimeout(() => {
          setSubscribed(false)
          setSubscribeMessage('')
        }, 5000)
      } else {
        setSubscribeMessage(data.message || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error)
      setSubscribeMessage('Network error. Please check your connection and try again.')
    } finally {
      setSubscribing(false)
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

  return (
    <div className="bg-white">
      {/* 🟣 SECTION 1 — HERO SECTION */}
      <section className="relative h-screen w-full overflow-hidden bg-black">
        <div className="flex flex-col lg:flex-row h-screen">
          {/* Left Side - New Brand Messaging */}
          <motion.div 
            className="relative flex flex-col justify-center px-6 sm:px-8 md:px-12 lg:px-20 py-8 lg:py-0 overflow-hidden h-1/2 lg:h-full lg:w-1/2"
          >
            {/* Cinematic Background */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={`bg-${currentSlide}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
                className="absolute inset-0"
              >
                <div 
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #000000 100%)'
                  }}
                />

                {/* Atmospheric smoke effects */}
                    <motion.div
                  className="absolute inset-0 opacity-30"
                      animate={{
                    opacity: [0.2, 0.4, 0.2],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                    >
                      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl" />
                      <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] bg-gray-800/10 rounded-full blur-3xl" />
                    </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Animated Shattered Logo */}
            <motion.div 
              className="absolute inset-0 flex items-center justify-center opacity-5 lg:opacity-10 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.1, 0.08] }}
              transition={{ duration: 2, delay: 0.5, repeat: Infinity, repeatType: "reverse" }}
            >
              <svg 
                className="w-full h-full max-w-[500px] lg:max-w-[700px] max-h-[500px] lg:max-h-[700px]"
                viewBox="0 0 1024 1024"
                fill="white"
              >
                {/* Main Logo Path - Animated as shattered pieces */}
                <motion.path
                  d="M695.72,151.63c-1.72-.45-2,.69-3.01,1.48-12.65,9.99-26.76,23.91-39.01,34.99-80.61,72.95-160.75,146.59-240.97,220.03-72.31,66.2-156.46,123.37-149,234.98,3.45,51.67,39.16,108.9,85.32,132.68,2.96,1.53,7.53,4.78,10.64,3.34l66.02-63.03c.42-2.26-.99-1.38-2.48-1.49-26.54-1.85-47.42.97-65.49-21.53-47.23-58.81-8.99-134.06,38.45-178.5,39.85-37.33,83.45-73.26,124.54-109.46,17.5-15.42,34.97-33.54,52.98-48.02,2.83-2.27,5.85-5.12,9.61-2.58,1.67,1.34,1.5,3.68,1.47,5.59-.05,4.46-7.47,41.81-9.21,44.87-32.46,29.53-65.69,58.3-97.88,88.12-28.25,26.16-49.67,45.37-62.16,83.84l-29.82,75.67,253.02-214.47,56.97-286.52ZM713.71,415.63l-205.98,211.51c-.42,2.26.99,1.38,2.48,1.49,27.96,2.04,57.51-3.6,85.02-2.45,1.05.04,5.92.4,5,2.45l-179.43,125.58c-37.72,34.14-85.72,62.85-122.1,97.9-1.08,1.04-2.33,1.76-1.98,3.51.66.62,14.87-4.71,16.98-5.51,55.93-21.15,118.67-46.1,172.69-71.31,22.29-10.4,38.87-25.8,57.8-41.2,52.52-42.71,104.02-86.74,156.56-129.44.82-.84,1.94-1.43,1.81-2.85-.35-3.81-7.6-11.42-7.04-16.47l-1-.54c-25.25-4.88-51.37-1.75-76.8-4.68-.45-1.73.72-2,1.49-3,2.23-2.9,6.69-6.82,9.49-9.51,19.29-18.5,43.46-41.3,64-58,1.96-1.59,5.3-5.01,7.49-2.48,5.47,9.24,10.42,18.79,16.1,27.9,35.14,56.3,78.82,107.7,121.9,158.1,3.76,4.4,8.16,9.86,12.11,13.89,1.04,1.06,1.44,2.54,3.4,2.09l-140.01-296.99Z"
                  fill="white"
                  initial={{ 
                    x: 0, 
                    y: 0,
                    opacity: 0.3,
                    scale: 0.98
                  }}
                  animate={{ 
                    x: [0, -3, 2, -1, 0],
                    y: [0, 2, -3, 1, 0],
                    opacity: [0.3, 0.4, 0.35, 0.4, 0.3],
                    scale: [0.98, 1, 0.99, 1, 0.98]
                  }}
                  transition={{ 
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </svg>
            </motion.div>

            {/* Main Content */}
            <div className="relative z-10">
              {/* Brand Tagline */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="mb-6 lg:mb-8 mt-8 lg:mt-12"
              >
                {/* NEW RELEASE Badge */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="mb-6 flex items-center gap-3"
                >
                  <div className="h-12 w-0.5 bg-orange-500"></div>
                  <span className="inline-block text-sm sm:text-base font-bold uppercase tracking-widest text-orange-500">
                    NEW RELEASE
                  </span>
                </motion.div>
                
                {/* Main Headline - NEW */}
                <motion.h1
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light tracking-tight leading-[0.9] text-white mb-4"
                >
                  GO<br />
                  BEYOND.
                </motion.h1>
              </motion.div>

              {/* Subheadline - NEW */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="mb-8 lg:mb-12 max-w-md space-y-4"
              >
                <motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 1, ease: [0.22, 1, 0.36, 1] }}
                  className="text-xl lg:text-2xl font-medium text-white/95 leading-relaxed tracking-wide"
                >
                  Current Drop — clean designs for people who move different.
                </motion.p>
                <motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  className="text-base lg:text-lg font-light text-white/70 leading-relaxed"
                >
                  Essentials made for everyday ambition.
                </motion.p>
              </motion.div>

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.4 }}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
              >
                <Link
                  href="/products"
                  className="inline-block px-8 lg:px-10 py-3 lg:py-3.5 bg-white text-black hover:bg-orange-500 hover:text-white transition-all duration-300 group"
                >
                  <span className="text-xs lg:text-sm font-semibold tracking-widest uppercase">
                    Explore Current Drop
                  </span>
                </Link>

                {/* Navigation Arrows */}
                <div className="hidden lg:flex items-center gap-3 ml-4">
                  <button
                    onClick={prevSlide}
                    className="w-12 h-12 border border-white/30 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300"
                    aria-label="Previous slide"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextSlide}
                    className="w-12 h-12 border border-white/30 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300"
                    aria-label="Next slide"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Dynamic Hero Images */}
          <div className="relative bg-gray-900 h-1/2 lg:h-full lg:w-1/2">
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
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
            )}
        </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="border-t border-gray-100" />

      {/* 🔵 SECTION 2 — COLLECTIONS SHOWCASE (SPLIT SCREEN DESIGN) */}
      <section className="relative bg-white pt-16 md:pt-20 lg:pt-24 pb-8 md:pb-12 lg:pb-16 overflow-hidden">
        {/* Clean White Background */}
        <div className="absolute inset-0 bg-white" />
        
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
            className="text-center mb-12 md:mb-16"
          >
            <div className="inline-flex items-center justify-center mb-8">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
              <span className="mx-4 text-xs font-medium uppercase tracking-[0.3em] text-orange-500">
                Collections
              </span>
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
            </div>
            
            <h2 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-light tracking-tight text-black mb-6 leading-[0.9]">
              Three Collections.<br />
              <span className="font-medium">Your Style.</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
              Choose your path. Each collection unlocks a new chapter.
            </p>
                  </motion.div>

          {/* ESSENCE & FRAGMENT - STAGGERED LAYOUT */}
          <div className="relative space-y-12 md:space-y-0">
            {/* ESSENCE COLLECTION */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              {/* Background Panel */}
              <div className="absolute inset-0 bg-white rounded-lg md:rounded-2xl -z-10" />
              
              <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto px-4 md:px-8 lg:px-12 py-12 md:py-16">
                {/* Left: Interactive 4-Card Stack */}
                <div className="relative order-2 md:order-1 px-8 md:px-0">
                  <div 
                    className="relative aspect-[3/4] cursor-pointer perspective-1000 max-w-md mx-auto"
                    onClick={() => {
                      setEssenceIndex((prev) => (prev + 1) % essenceImages.length)
                      // Navigate after short delay to show animation
                      setTimeout(() => {
                        window.location.href = essenceLinkUrl
                      }, 600)
                    }}
                  >
                    <div className="relative w-full h-full">
                      {essenceImages.length > 0 && [0, 1, 2, 3].map((offset) => {
                        const imageIndex = (essenceIndex + offset) % essenceImages.length
                        const zIndex = 40 - offset * 10
                        // Enhanced 3D depth effect
                        const translateX = offset === 0 ? 0 : offset === 1 ? 16 : offset === 2 ? 12 : 8
                        const translateY = offset * 10
                        const translateZ = -offset * 20 // Add depth
                        const rotate = offset * 3
                        const rotateY = offset * 2 // Add Y-axis rotation for 3D effect
                        const opacity = offset === 0 ? 1 : offset === 1 ? 0.95 : 1 - offset * 0.2
                        const scale = 1 - offset * 0.05
                        
                        return (
                          <motion.div
                            key={`essence-${imageIndex}-${offset}`}
                            className="card-stack absolute inset-0"
                            style={{ 
                              zIndex,
                              transformStyle: 'preserve-3d'
                            }}
                            initial={false}
                            animate={{ 
                              x: translateX,
                              y: translateY,
                              z: translateZ,
                              rotateZ: rotate,
                              rotateY: rotateY,
                              opacity,
                              scale
                            }}
                            transition={{ 
                              duration: 0.7,
                              ease: [0.34, 1.56, 0.64, 1] // Elastic easing for smooth shuffle
                            }}
                          >
                            <div 
                              className="relative w-full h-full overflow-hidden bg-gray-100 rounded-sm"
                              style={{
                                boxShadow: offset === 0 
                                  ? '0 25px 50px -12px rgba(0, 0, 0, 0.35), 0 15px 30px -10px rgba(0, 0, 0, 0.25)' 
                                  : offset === 1 
                                    ? '0 20px 40px -15px rgba(0, 0, 0, 0.25)' 
                                    : '0 10px 25px -10px rgba(0, 0, 0, 0.15)',
                                transform: offset === 0 ? 'translateY(-8px)' : 'none'
                              }}
                            >
                              <AnimatePresence mode="wait">
                                {essenceImages[imageIndex] && (
                                  <motion.div
                                    key={`essence-img-${imageIndex}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="absolute inset-0"
                                  >
                                    <Image
                                      src={essenceImages[imageIndex]}
                                      alt={`Essence ${imageIndex + 1}`}
                                      loading="lazy"
                                      fill
                                      className="object-cover"
                                      sizes="(max-width: 768px) 100vw, 50vw"
                                      unoptimized
                                    />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                              {offset === 0 && (
                                <div className="absolute bottom-4 left-4 text-white text-sm font-medium">
                                  {imageIndex + 1} / {essenceImages.length}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Right: Content */}
                <div className="space-y-4 order-1 md:order-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-500 rounded-full">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="text-xs font-bold uppercase tracking-wider text-white">Available Now</span>
                      </div>

                  <h3 className="text-4xl md:text-5xl font-light text-black tracking-tight leading-none">
                    {essenceTitle}
                  </h3>
                  
                  <p className="text-base text-gray-600 leading-relaxed whitespace-pre-line">
                    {essenceDescription}
                  </p>
                  
                  <Link
                    href={essenceLinkUrl}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-medium uppercase tracking-wider text-xs hover:bg-orange-500 transition-all duration-300 group"
                  >
                    <span>See Collection</span>
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                  </Link>
                                  </div>
                              </div>
                            </motion.div>
                  
            {/* FRAGMENT COLLECTION - STAGGERED UP */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative md:mt-8"
            >
              {/* Background Panel */}
              <div className="absolute inset-0 bg-white rounded-lg md:rounded-2xl -z-10" />
              
              <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto px-4 md:px-8 lg:px-12 py-12 md:py-16">
                {/* Left: Content */}
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-500 rounded-full">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="text-xs font-bold uppercase tracking-wider text-white">Available Now</span>
                    </div>
                    
                  <h3 className="text-4xl md:text-5xl font-light text-black tracking-tight leading-none">
                    {fragmentTitle}
                      </h3>
                  
                  <p className="text-base text-gray-600 leading-relaxed whitespace-pre-line">
                    {fragmentDescription}
                  </p>
                  
                  <Link
                    href={fragmentLinkUrl}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-medium uppercase tracking-wider text-xs hover:bg-orange-500 transition-all duration-300 group"
                  >
                    <span>See Collection</span>
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                            </div>
                            
                {/* Right: Interactive 4-Card Stack */}
                <div className="relative px-8 md:px-0">
                  <div 
                    className="relative aspect-[3/4] cursor-pointer perspective-1000 max-w-md mx-auto"
                    onClick={() => {
                      setFragmentIndex((prev) => (prev + 1) % fragmentImages.length)
                      // Navigate after short delay to show animation
                      setTimeout(() => {
                        window.location.href = fragmentLinkUrl
                      }, 600)
                    }}
                  >
                    <div className="relative w-full h-full">
                      {fragmentImages.length > 0 && [0, 1, 2, 3].map((offset) => {
                        const imageIndex = (fragmentIndex + offset) % fragmentImages.length
                        const zIndex = 40 - offset * 10
                        // Enhanced 3D depth effect (mirrored for FRAGMENT)
                        const translateX = offset === 0 ? 0 : offset === 1 ? -16 : offset === 2 ? -12 : -8
                        const translateY = offset * 10
                        const translateZ = -offset * 20 // Add depth
                        const rotate = -offset * 3
                        const rotateY = -offset * 2 // Add Y-axis rotation for 3D effect (mirrored)
                        const opacity = offset === 0 ? 1 : offset === 1 ? 0.95 : 1 - offset * 0.2
                        const scale = 1 - offset * 0.05
                        
                        return (
                          <motion.div
                            key={`fragment-${imageIndex}-${offset}`}
                            className="card-stack absolute inset-0"
                            style={{ 
                              zIndex,
                              transformStyle: 'preserve-3d'
                            }}
                            initial={false}
                            animate={{ 
                              x: translateX,
                              y: translateY,
                              z: translateZ,
                              rotateZ: rotate,
                              rotateY: rotateY,
                              opacity,
                              scale
                            }}
                            transition={{ 
                              duration: 0.7,
                              ease: [0.34, 1.56, 0.64, 1] // Elastic easing for smooth shuffle
                            }}
                          >
                            <div 
                              className="relative w-full h-full overflow-hidden bg-gray-100 rounded-sm"
                              style={{
                                boxShadow: offset === 0 
                                  ? '0 25px 50px -12px rgba(0, 0, 0, 0.35), 0 15px 30px -10px rgba(0, 0, 0, 0.25)' 
                                  : offset === 1 
                                    ? '0 20px 40px -15px rgba(0, 0, 0, 0.25)' 
                                    : '0 10px 25px -10px rgba(0, 0, 0, 0.15)',
                                transform: offset === 0 ? 'translateY(-8px)' : 'none'
                              }}
                            >
                              <AnimatePresence mode="wait">
                                {fragmentImages[imageIndex] && (
                                  <motion.div
                                    key={`fragment-img-${imageIndex}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="absolute inset-0"
                                  >
                                    <Image
                                      src={fragmentImages[imageIndex]}
                                      alt={`Fragment ${imageIndex + 1}`}
                                      loading="lazy"
                                      fill
                                      className="object-cover"
                                      sizes="(max-width: 768px) 100vw, 50vw"
                                      unoptimized
                                    />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                              {offset === 0 && (
                                <div className="absolute bottom-4 left-4 text-white text-sm font-medium">
                                  {imageIndex + 1} / {fragmentImages.length}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
                    
          {/* RECODE COLLECTION - INTERACTIVE CARD STACK */}
                    <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative md:mt-8"
          >
            {/* Background Panel */}
            <div className="absolute inset-0 bg-white rounded-lg md:rounded-2xl -z-10" />
            
            <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto px-4 md:px-8 lg:px-12 py-12 md:py-16">
              {/* Left: Interactive 4-Card Stack */}
              <div className="relative px-8 md:px-0 order-2 md:order-1">
                {recodeImages.length > 0 ? (
                  <div 
                    className="relative aspect-[3/4] cursor-pointer perspective-1000 max-w-md mx-auto"
                    onClick={() => {
                      setRecodeIndex((prev) => (prev + 1) % recodeImages.length)
                      // Navigate after short delay to show animation
                      setTimeout(() => {
                        window.location.href = recodeLinkUrl
                      }, 600)
                    }}
                  >
                    <div className="relative w-full h-full">
                      {[0, 1, 2, 3].map((offset) => {
                        const imageIndex = (recodeIndex + offset) % recodeImages.length
                        const zIndex = 40 - offset * 10
                        // Enhanced 3D depth effect
                        const translateX = offset === 0 ? 0 : offset === 1 ? 16 : offset === 2 ? 12 : 8
                        const translateY = offset * 10
                        const translateZ = -offset * 20 // Add depth
                        const rotate = offset * 3
                        const rotateY = offset * 2 // Add Y-axis rotation for 3D effect
                        const opacity = offset === 0 ? 1 : offset === 1 ? 0.95 : 1 - offset * 0.2
                        const scale = 1 - offset * 0.05
                        
                        return (
                          <motion.div
                            key={`recode-${imageIndex}-${offset}`}
                            className="card-stack absolute inset-0"
                            style={{ 
                              zIndex,
                              transformStyle: 'preserve-3d'
                            }}
                            initial={false}
                            animate={{ 
                              x: translateX,
                              y: translateY,
                              z: translateZ,
                              rotateZ: rotate,
                              rotateY: rotateY,
                              opacity,
                              scale
                            }}
                            transition={{ 
                              duration: 0.7,
                              ease: [0.34, 1.56, 0.64, 1] // Elastic easing for smooth shuffle
                            }}
                          >
                            <div 
                              className="relative w-full h-full overflow-hidden bg-gray-100 rounded-sm"
                              style={{
                                boxShadow: offset === 0 
                                  ? '0 25px 50px -12px rgba(0, 0, 0, 0.35), 0 15px 30px -10px rgba(0, 0, 0, 0.25)' 
                                  : offset === 1 
                                    ? '0 20px 40px -15px rgba(0, 0, 0, 0.25)' 
                                    : '0 10px 25px -10px rgba(0, 0, 0, 0.15)',
                                transform: offset === 0 ? 'translateY(-8px)' : 'none'
                              }}
                            >
                              <AnimatePresence mode="wait">
                                {recodeImages[imageIndex] && (
                                  <motion.div
                                    key={`recode-img-${imageIndex}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="absolute inset-0"
                                  >
                                    <Image
                                      src={recodeImages[imageIndex]}
                                      alt={`Recode ${imageIndex + 1}`}
                                      loading="lazy"
                                      fill
                                      className="object-cover"
                                      sizes="(max-width: 768px) 100vw, 50vw"
                                      unoptimized
                                    />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                              {offset === 0 && (
                                <div className="absolute bottom-4 left-4 text-white text-sm font-medium">
                                  {imageIndex + 1} / {recodeImages.length}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="relative aspect-[3/4] max-w-md mx-auto cursor-not-allowed">
                    <div className="relative w-full h-full bg-gray-200 rounded-sm shadow-2xl flex items-center justify-center">
                      <div className="text-center">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <p className="text-gray-500 text-sm">Coming Soon</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Content */}
              <div className="space-y-4 order-1 md:order-2">
                {recodeImages.length > 0 ? (
                  <>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-500 rounded-full">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span className="text-xs font-bold uppercase tracking-wider text-white">Available Now</span>
                    </div>
                    
                    <h3 className="text-4xl md:text-5xl font-light text-black tracking-tight leading-none">
                      {recodeTitle}
                    </h3>
                    
                    <p className="text-base text-gray-600 leading-relaxed whitespace-pre-line">
                      {recodeDescription}
                    </p>
                    
                    <Link
                      href={recodeLinkUrl}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-medium uppercase tracking-wider text-xs hover:bg-orange-500 transition-all duration-300 group"
                    >
                      <span>See Collection</span>
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-700 rounded-full">
                      <svg className="w-3 h-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-300">Coming Soon</span>
                    </div>
                    
                    <h3 className="text-4xl md:text-5xl font-light text-gray-400 tracking-tight leading-none">
                      {recodeTitle}
                    </h3>
                    
                    <p className="text-base text-gray-500 leading-relaxed whitespace-pre-line">
                      {recodeDescription}
                    </p>
                    
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-500 font-medium uppercase tracking-wider text-xs cursor-not-allowed border border-gray-300">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span>Coming Soon</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>

                </div>
      </section>

      {/* 🟠 SECTION 4 — BRAND PHILOSOPHY BLOCK */}
      <section className="relative pt-8 md:pt-12 lg:pt-16 pb-12 md:pb-16 lg:pb-20 bg-white overflow-hidden">
        {/* ZOLAR Logo Watermark - Subtle & Large */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 0.02, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: 'easeOut' }}
            className="text-[35vw] font-black tracking-tighter select-none whitespace-nowrap text-gray-900"
            style={{ lineHeight: 0.8 }}
          >
            ZOLAR
          </motion.div>
        </div>

        {/* Slow Moving Gradient Background */}
        <div className="absolute inset-0 bg-white">
          {/* Animated Orange Orb - Smaller on mobile */}
          <motion.div 
            className="absolute top-[10%] right-[15%] w-[250px] h-[250px] md:w-[600px] md:h-[600px] bg-gradient-radial from-orange-400/30 via-orange-300/15 to-transparent rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, 50, 0],
              y: [0, -30, 0],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Animated Pink/Red Orb - Smaller on mobile */}
          <motion.div 
            className="absolute bottom-[10%] left-[20%] w-[300px] h-[300px] md:w-[700px] md:h-[700px] bg-gradient-radial from-red-400/25 via-pink-300/12 to-transparent rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              x: [0, -40, 0],
              y: [0, 40, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
            className="text-center"
          >
            {/* Enhanced Badge */}
            <motion.div variants={itemVariants} className="mb-12">
              <div className="inline-flex items-center justify-center space-x-3">
                <div className="h-px w-20 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
                <span className="text-xs font-medium uppercase tracking-[0.3em] text-orange-500">
                  Our Story
                </span>
                <div className="h-px w-20 bg-gradient-to-l from-transparent via-orange-500 to-transparent" />
              </div>
            </motion.div>

            {/* Enhanced Title */}
            <motion.div variants={itemVariants} className="mb-20">
              <h2 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-light tracking-tight leading-[0.85] mb-8 text-black">
                Made for<br />
                <span className="font-medium text-black">Movement.</span>
              </h2>
            </motion.div>

            {/* Enhanced Philosophy Content */}
            <motion.div 
              variants={itemVariants}
              className="max-w-5xl mx-auto space-y-10 mb-20"
            >              
              <div className="space-y-10">
                <p className="text-3xl sm:text-4xl lg:text-5xl text-black font-light leading-tight tracking-tight">
                  ZOLAR is built for people who want more from themselves.
                </p>
                
                <div className="max-w-3xl mx-auto space-y-6 text-gray-700">
                  <p className="text-xl sm:text-2xl font-light leading-relaxed">
                    Better days. Better energy. Better versions.
                  </p>
                  <p className="text-lg sm:text-xl font-light leading-relaxed text-gray-600">
                    We create modern essentials that move with you—designed for those who push boundaries and define their own path.
                  </p>
          </div>

                <div className="py-8">
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-medium text-black">
                    Wear what moves you forward.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Enhanced CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Link
                href="/about"
                className="group relative inline-flex items-center gap-4 px-14 py-6 bg-black text-white text-sm uppercase tracking-[0.3em] font-semibold overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-105"
              >
                <span className="relative z-10">Our Story</span>
                <svg 
                  className="w-6 h-6 relative z-10 group-hover:translate-x-2 transition-transform" 
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              
              <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.5 }}
              />
            </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Modern Action Gallery / Reel Section */}
      <section className="relative py-8 md:py-12 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
              <span className="mx-3 text-xs font-medium uppercase tracking-[0.3em] text-orange-500">
                In Action
                </span>
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
              </div>
              
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-black mb-3 leading-tight">
              Style in <span className="font-medium">Motion</span>
              </h2>
            <p className="text-base text-gray-600 font-light">
              ZOLAR on the streets.
            </p>
          </motion.div>

          {/* Horizontal Scrolling Gallery */}
          <div className="relative">
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
              {/* Gallery Item 1 */}
                  <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex-none w-[280px] snap-center"
              >
                <Link href="/products" className="group block relative overflow-hidden rounded-sm">
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                    {products[0] && (
                      <Image
                        src={JSON.parse(products[0].images)[0] || '/placeholder.jpg'}
                        alt="ZOLAR style 1"
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="280px"
                        unoptimized
                      />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                </div>
                </Link>
              </motion.div>

              {/* Gallery Item 2 */}
                <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex-none w-[280px] snap-center"
                >
                <Link href="/products" className="group block relative overflow-hidden rounded-sm">
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                    {products[1] && (
                  <Image
                        src={JSON.parse(products[1].images)[0] || '/placeholder.jpg'}
                        alt="ZOLAR style 2"
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="280px"
                        unoptimized
                      />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                  </div>
                </Link>
              </motion.div>

              {/* Gallery Item 3 */}
                    <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex-none w-[280px] snap-center"
              >
                <Link href="/products" className="group block relative overflow-hidden rounded-sm">
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                    {products[2] && (
                      <Image
                        src={JSON.parse(products[2].images)[0] || '/placeholder.jpg'}
                        alt="ZOLAR style 3"
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="280px"
                        unoptimized
                      />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                  </div>
                </Link>
                </motion.div>

              {/* Gallery Item 4 */}
                <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex-none w-[280px] snap-center"
                >
                <Link href="/products" className="group block relative overflow-hidden rounded-sm">
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                    {products[3] && (
                    <Image
                        src={JSON.parse(products[3].images)[0] || '/placeholder.jpg'}
                        alt="ZOLAR style 4"
                      fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="280px"
                        unoptimized
                    />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                  </div>
                </Link>
                </motion.div>

              {/* Gallery Item 5 */}
                <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex-none w-[280px] snap-center"
                >
                <Link href="/products" className="group block relative overflow-hidden rounded-sm">
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                    {products[4] && (
                    <Image
                        src={JSON.parse(products[4].images)[0] || '/placeholder.jpg'}
                        alt="ZOLAR style 5"
                      fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="280px"
                        unoptimized
                  />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                </div>
                </Link>
              </motion.div>
            </div>
            </div>

          {/* View All Link */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mt-8"
          >
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 text-black text-sm uppercase tracking-wider font-medium hover:text-orange-500 transition-colors duration-300"
            >
              <span>View All</span>
              <svg 
                className="w-4 h-4 group-hover:translate-x-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Archive Collection */}
      <ArchiveCollection />

      {/* Section Divider */}
      <div className="border-t border-gray-100" />

      {/* Newsletter Section */}
      <section className="relative py-32 bg-white text-black overflow-hidden">
        {/* Shattered fragments for Newsletter */}
        <ShatteredBackground variant="essence" intensity="low" />
        
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{ duration: 8, repeat: Infinity }}
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
                <span className="block text-black">Stay</span>
                <span className="block font-medium">Connected</span>
            </motion.h2>
              
              <motion.p 
                variants={itemVariants} 
                className="text-xl text-gray-600 max-w-2xl mx-auto font-light leading-relaxed"
              >
                Be the first to know about new drops, exclusive releases, and special offers from ZOLAR.
            </motion.p>
            </div>

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
                    disabled={subscribing || subscribed}
              />
                </div>
                <motion.button
                type="submit"
                  className="relative px-12 py-5 bg-black text-white text-sm font-semibold uppercase tracking-[0.2em] overflow-hidden group disabled:opacity-50"
                  disabled={subscribing || subscribed}
                  whileHover={{ scale: subscribing || subscribed ? 1 : 1.02 }}
                  whileTap={{ scale: subscribing || subscribed ? 1 : 0.98 }}
                >
                  <span className="relative z-10">
                    {subscribing ? 'Subscribing...' : subscribed ? '✓ Subscribed' : 'Subscribe'}
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: subscribing || subscribed ? '-100%' : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              </div>
              
              {subscribeMessage && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-sm mt-4 text-center font-medium ${
                    subscribed ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {subscribeMessage}
                </motion.p>
              )}
              
              <p className="text-xs text-gray-500 mt-4 text-center">
                By subscribing, you agree to our Privacy Policy and consent to receive updates.
              </p>
            </motion.form>
              </motion.div>
                </div>
      </section>
              
      {/* 🟤 SECTION 5 — FOOTER SLOGAN */}
      <section className="relative bg-black text-white py-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <p className="text-sm sm:text-base font-light tracking-[0.2em] uppercase text-white/60">
              Wear what moves you.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

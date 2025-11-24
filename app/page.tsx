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

// Lazy load WavyBackground for essence collection
const WavyBackground = dynamic(() => import('@/components/ui/wavy-background').then(mod => ({ default: mod.WavyBackground })), {
  ssr: false,
  loading: () => null
})

// Import Cover directly for hero text effect (fix deployment issue)
import { Cover } from '@/components/ui/cover'
import { Spotlight } from '@/components/ui/spotlight'
import { AnimatedCollection } from '@/components/ui/animated-collection'

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
          
          // Set images with fallbacks
          setEssenceImages(essence?.images && essence.images.length > 0 ? essence.images : [
            'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80',
            'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80',
            'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80',
            'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80'
          ])
          setFragmentImages(fragment?.images && fragment.images.length > 0 ? fragment.images : [
            'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&q=80',
            'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=800&q=80',
            'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80',
            'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80'
          ])
          setRecodeImages(recode?.images && recode.images.length > 0 ? recode.images : [
            'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80',
            'https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?w=800&q=80',
            'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=800&q=80',
            'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80'
          ])
          
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

            {/* Spotlight Effect */}
            <Spotlight
              className="-top-20 left-0 md:left-0 md:-top-40"
              fill="white"
            />

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
                  <Cover className="text-white">BEYOND.</Cover>
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
              className="relative rounded-lg md:rounded-2xl"
            >
              {/* Wavy Background */}
              <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
                <WavyBackground
                  containerClassName="w-full h-full"
                  className="w-full h-full"
                  colors={["#d5d5d5", "#c8c8c8", "#bdbdbd", "#cacaca", "#c0c0c0"]}
                  waveWidth={50}
                  backgroundFill="white"
                  blur={10}
                  speed="slow"
                  waveOpacity={0.5}
                >
                  <div />
                </WavyBackground>
              </div>
              
              <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-12 py-12 md:py-16">
                <AnimatedCollection
                  collection={{
                    title: essenceTitle,
                    subtitle: "STREET ESSENTIALS",
                    description: essenceDescription,
                    images: essenceImages,
                    link: essenceLinkUrl
                  }}
                  autoplay={true}
                  index={0}
                />
              </div>
            </motion.div>
                  
            {/* FRAGMENT COLLECTION */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative md:mt-8 bg-white rounded-lg md:rounded-2xl"
            >
              <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-12 py-12 md:py-16">
                <AnimatedCollection
                  collection={{
                    title: fragmentTitle,
                    subtitle: "SUMMER DROP 2025",
                    description: fragmentDescription,
                    images: fragmentImages,
                    link: fragmentLinkUrl
                  }}
                  autoplay={true}
                  index={1}
                />
              </div>
            </motion.div>
          </div>
                    
          {/* RECODE COLLECTION */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative md:mt-8 bg-white rounded-lg md:rounded-2xl"
          >
            <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-12 py-12 md:py-16">
              <AnimatedCollection
                collection={{
                  title: recodeTitle,
                  subtitle: "COMING SOON 2025",
                  description: recodeDescription,
                  images: recodeImages,
                  link: recodeLinkUrl
                }}
                autoplay={true}
                index={2}
              />
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

'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import FashionCarousel from '@/components/FashionCarousel'
import ArchiveCollection from '@/components/ArchiveCollection'
import HeroShatter from '@/components/HeroShatter'

export default function Home() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [productsLoading, setProductsLoading] = useState(true)

  // Color map for variant display
  const colorMap: Record<string, string> = {
    'Black': '#000000',
    'White': '#FFFFFF',
    'Gray': '#6B7280'
  }

  // Fetch products
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

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <HeroShatter />

      {/* Section Divider */}
      <div className="border-t border-gray-100" />

      {/* The Drop - Product Grid */}
      <section className="relative bg-gradient-to-b from-white via-gray-50 to-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-16">
            <div className="inline-flex items-center space-x-3 mb-6">
              <div className="h-px w-12 bg-gradient-to-r from-orange-500 to-transparent" />
              <span className="text-xs font-medium uppercase tracking-[0.3em] text-orange-500">
                Exclusive Release
              </span>
            </div>
            
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight text-black mb-4">
              <span className="block">The</span>
              <span className="block font-serif italic">Drop</span>
            </h2>
          </div>

          {/* Product Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {productsLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-white border border-gray-200 animate-pulse">
                  <div className="aspect-[3/4] bg-gray-200" />
                  <div className="p-5">
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))
            ) : (
              products.slice(0, 4).map((product) => (
                <Link 
                  key={product.id}
                  href={`/product/${product.sku}`}
                  className="group bg-white border border-gray-200 hover:shadow-lg transition-all"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    {product.variants?.[0]?.images && (
                      <Image
                        src={JSON.parse(product.variants[0].images)[0]}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-medium text-black mb-1">{product.title}</h3>
                    <p className="text-lg font-semibold text-black">
                      ${(product.priceCents / 100).toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* View All Button */}
          <div className="text-center mt-16">
            <Link
              href="/products"
              className="inline-block px-12 py-4 border-2 border-black text-black text-sm uppercase tracking-wider font-medium hover:bg-black hover:text-white transition-all"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="border-t border-gray-100" />

      {/* Carousel Section */}
      <FashionCarousel />

      {/* Section Divider */}
      <div className="border-t border-gray-100" />

      {/* Archive Collection */}
      <ArchiveCollection />

      {/* Newsletter Section */}
      <section className="bg-black text-white py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-light mb-6">Join the Movement</h2>
          <p className="text-gray-400 text-lg mb-8">
            Be the first to know about new drops and exclusive releases.
          </p>
          
          <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
            <div className="flex gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
                required
              />
              <button
                type="submit"
                className="px-8 py-4 bg-white text-black text-sm uppercase tracking-wider font-medium hover:bg-gray-200 transition-colors"
              >
                Subscribe
              </button>
            </div>
            {subscribed && (
              <p className="mt-4 text-green-400">Thanks for subscribing!</p>
            )}
          </form>
        </div>
      </section>
    </div>
  )
}









'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface Product {
  id: string
  title: string
  sku: string
  priceCents: number
  images: string
  category?: string
  variants: any[]
}


export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams?.get('q') || ''
  
  const [searchQuery, setSearchQuery] = useState(query)
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    if (query) {
      handleSearch(query)
    }
  }, [query])

  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return

    setLoading(true)
    setSearched(true)

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`)
      if (response.ok) {
        const data = await response.json()
        setResults(data.products || [])
      } else {
        setResults([])
      }
    } catch (error) {
      // Silently handle error
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.history.pushState({}, '', `/search?q=${encodeURIComponent(searchQuery)}`)
      handleSearch(searchQuery)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Search */}
      <section className="pt-24 pb-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <span className="text-xs font-normal uppercase tracking-widest text-gray-500 block mb-4">
              Search
            </span>
            <h1 
              className="text-4xl md:text-6xl font-light tracking-tight text-black mb-6"
              style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
            >
              Find Your Style
            </h1>
          </motion.div>

          {/* Search Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="max-w-2xl mx-auto"
          >
            <div className="flex gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                autoFocus
                className="flex-1 px-5 py-3 border border-gray-300 bg-white text-gray-900 text-sm focus:border-black focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-black text-white text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors duration-300"
              >
                Search
              </button>
            </div>
          </motion.form>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600 text-sm mt-4">Searching...</p>
            </div>
          )}

          {!loading && searched && results.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center py-12"
            >
              <svg
                className="w-16 h-16 mx-auto text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <h2 className="text-2xl font-light text-black mb-2">No Results Found</h2>
              <p className="text-gray-600 text-sm mb-6">
                Try searching with different keywords
              </p>
              <Link
                href="/products"
                className="inline-block px-8 py-3 bg-black text-white text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors duration-300"
              >
                Browse All Products
              </Link>
            </motion.div>
          )}

          {!loading && results.length > 0 && (
            <div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-gray-600 mb-8"
              >
                Found {results.length} {results.length === 1 ? 'result' : 'results'} for "{query}"
              </motion.p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {results.map((product, index) => {
                  const images = JSON.parse(product.images) as string[]
                  const mainImage = images[0] || 'https://via.placeholder.com/400'

                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.05 }}
                    >
                      <Link href={`/product/${product.sku}`} className="group block">
                        <div className="bg-white border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                          <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
                            <Image
                              src={mainImage}
                              alt={product.title}
                              fill
                              className="object-cover transition-all duration-500 group-hover:scale-105"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            />
                          </div>
                          
                          <div className="p-4 sm:p-5">
                            <h3 className="text-sm sm:text-base font-normal text-black mb-1 tracking-wide">
                              {product.title}
                            </h3>
                            <p className="text-sm sm:text-base font-normal text-gray-600 mb-3">
                              {(product.priceCents / 100).toFixed(2)} MAD
                            </p>
                            
                            {product.variants && product.variants.length > 0 && (
                              <div className="flex items-center space-x-1.5">
                                {product.variants.slice(0, 4).map((variant: any, idx: number) => (
                                  <div
                                    key={idx}
                                    className="w-4 h-4 sm:w-5 sm:h-5 border border-gray-300 transition-all duration-200 hover:scale-110"
                                    style={{ backgroundColor: variant.color || '#000' }}
                                    title={variant.color}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )}

          {!loading && !searched && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center py-12"
            >
              <p className="text-gray-600 text-sm mb-6">
                Enter a search term to find products
              </p>
              <Link
                href="/products"
                className="inline-block px-8 py-3 bg-black text-white text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors duration-300"
              >
                Browse All Products
              </Link>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}


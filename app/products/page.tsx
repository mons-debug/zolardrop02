'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import ProductCard from '@/components/ProductCard'

interface Product {
  id: string
  sku: string
  title: string
  description: string
  images: string
  priceCents: number
  salePriceCents?: number
  currency: string
  stock: number
  category?: string
  variants: Array<{
    id: string
    color: string
    sku: string
    priceCents: number
    stock: number
    images: string
  }>
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'sweatshirts'>('all')
  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high' | 'name'>('default')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/products', {
          cache: 'no-store'
        })

        if (res.ok) {
          const data = await res.json()
          setProducts(data.products || [])
          setFilteredProducts(data.products || [])
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Apply filters
  useEffect(() => {
    let result = [...products]

    // Filter by category
    if (filter === 'sweatshirts') {
      result = result.filter(p => 
        p.title.toLowerCase().includes('sweatshirt') ||
        p.category?.toLowerCase() === 'sweatshirts' ||
        p.category?.toLowerCase() === 'sweatshirt'
      )
    }

    // Sort products
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.priceCents - b.priceCents)
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.priceCents - a.priceCents)
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.title.localeCompare(b.title))
    }

    setFilteredProducts(result)
  }, [products, filter, sortBy])

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
    },
  }

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: i * 0.1,
        ease: [0.4, 0, 0.2, 1],
      },
    }),
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="pt-24 pb-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={headerVariants}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <span className="text-xs font-normal uppercase tracking-widest text-gray-500">
                Drop 02
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-6xl font-light tracking-tight text-black mb-6"
              style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
            >
              All Products
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-sm md:text-base text-gray-600 leading-relaxed font-light"
            >
              Discover our exclusive collection, carefully curated for those who appreciate quality and unique design.
            </motion.p>

            {/* Filter and Sort Controls */}
            {!loading && (
              <motion.div
                variants={itemVariants}
                className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                {/* Filter Buttons */}
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider text-gray-500 mr-2">Filter:</span>
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 text-xs uppercase tracking-wider transition-all duration-300 ${
                      filter === 'all'
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter('sweatshirts')}
                    className={`px-4 py-2 text-xs uppercase tracking-wider transition-all duration-300 ${
                      filter === 'sweatshirts'
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Sweatshirts
                  </button>
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider text-gray-500">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-4 py-2 text-xs uppercase tracking-wider bg-gray-100 text-gray-600 border-none focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
                  >
                    <option value="default">Default</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name: A-Z</option>
                  </select>
                </div>
              </motion.div>
            )}

            {/* Results Count */}
            {!loading && (
              <motion.div
                variants={itemVariants}
                className="mt-6 text-sm text-gray-500"
              >
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-gray-100" />

      {/* Products Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
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
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <p className="text-gray-600 text-sm mb-4">No products match your filters</p>
              <button
                onClick={() => {
                  setFilter('all')
                  setSortBy('default')
                }}
                className="inline-block px-6 py-3 bg-black text-white text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors"
              >
                Clear Filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}

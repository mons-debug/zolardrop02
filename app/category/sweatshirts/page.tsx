'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'

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

export default function SweatshirtsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/products?limit=100', {
          cache: 'no-store'
        })

        if (res.ok) {
          const data = await res.json()
          // Filter for sweatshirts - check title or category field
          const sweatshirts = (data.products || []).filter((p: Product) => 
            p.title.toLowerCase().includes('sweatshirt') ||
            p.category?.toLowerCase() === 'sweatshirts' ||
            p.category?.toLowerCase() === 'sweatshirt'
          )
          setProducts(sweatshirts)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])


  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="pt-24 pb-6 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex text-sm text-gray-500">
            <Link href="/" className="hover:text-black transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="hover:text-black transition-colors">
              Products
            </Link>
            <span className="mx-2">/</span>
            <span className="text-black">Sweatshirts</span>
          </nav>
        </div>
      </div>

      {/* Hero Header */}
      <section className="pb-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mb-6"
            >
              <span className="text-xs font-normal uppercase tracking-widest text-gray-500">
                Drop 02 Collection
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-4xl md:text-6xl font-light tracking-tight text-black mb-6"
              style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
            >
              Sweatshirts
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="text-sm md:text-base text-gray-600 leading-relaxed font-light"
            >
              Premium sweatshirts crafted for comfort and style. Discover our exclusive collection.
            </motion.p>

            {/* Results Count */}
            {!loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 text-sm text-gray-500"
              >
                {products.length} {products.length === 1 ? 'Product' : 'Products'}
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
              <p className="text-gray-600">Loading sweatshirts...</p>
            </div>
          ) : products.length === 0 ? (
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
              <p className="text-gray-600 text-sm mb-4">No sweatshirts available at the moment</p>
              <Link
                href="/products"
                className="inline-block px-6 py-3 bg-black text-white text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors"
              >
                Browse All Products
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}


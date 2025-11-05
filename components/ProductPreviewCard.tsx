'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

interface ProductPreviewCardProps {
  id: string
  title: string
  price: number
  image: string
  slug?: string
  badge?: string
  inStock?: boolean
  className?: string
}

export default function ProductPreviewCard({
  id,
  title,
  price,
  image,
  slug,
  badge,
  inStock = true,
  className = '',
}: ProductPreviewCardProps) {
  const productUrl = slug ? `/product/${slug}` : `/product/${id}`
  const formattedPrice = `$${(price / 100).toFixed(2)}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
      className={`group relative ${className}`}
    >
      <Link href={productUrl} className="block">
        {/* Card Container */}
        <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]">
          {/* Image Container with Hover Zoom */}
          <div className="relative aspect-square overflow-hidden bg-gray-900">
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="w-full h-full"
            >
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </motion.div>

            {/* Overlay Gradient on Hover */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
            />

            {/* Badge */}
            {badge && (
              <div className="absolute top-3 left-3 z-10">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.2, type: 'spring' }}
                  className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg"
                >
                  {badge}
                </motion.span>
              </div>
            )}

            {/* Stock Indicator */}
            {!inStock && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10">
                <span className="text-white font-semibold text-lg">Out of Stock</span>
              </div>
            )}

            {/* Quick View Icon on Hover */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
            </motion.div>
          </div>

          {/* Product Info */}
          <div className="p-4">
            {/* Title */}
            <motion.h3
              className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-purple-200 transition-colors"
              whileHover={{ x: 2 }}
            >
              {title}
            </motion.h3>

            {/* Price */}
            <div className="flex items-center justify-between">
              <motion.span
                className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
              >
                {formattedPrice}
              </motion.span>

              {/* Arrow Icon */}
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-gray-400 group-hover:text-white transition-colors"
              >
                <svg
                  className="w-5 h-5"
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
              </motion.div>
            </div>
          </div>

          {/* Shine Effect on Hover */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
            }}
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 2,
            }}
          />
        </div>
      </Link>

      {/* Glow Effect on Hover */}
      <motion.div
        className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10"
        whileHover={{ scale: 1.05 }}
      />
    </motion.div>
  )
}


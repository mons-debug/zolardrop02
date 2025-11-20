'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from './CartContext'

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

interface ProductCardProps {
  product: Product
}

const colorMap: Record<string, string> = {
  'Black': 'bg-black',
  'White': 'bg-white border-2 border-gray-300',
  'Gray': 'bg-gray-500',
  'Navy': 'bg-blue-900',
  'Red': 'bg-red-500',
  'Blue': 'bg-blue-500',
  'Green': 'bg-green-500',
  'Yellow': 'bg-yellow-500',
  'Purple': 'bg-purple-500',
  'Pink': 'bg-pink-500',
  'Orange': 'bg-orange-500',
  'Brown': 'bg-amber-800',
  'Heather Gray': 'bg-gray-400',
  'Burgundy': 'bg-red-800',
  'Cream': 'bg-yellow-50',
  'Khaki': 'bg-yellow-600',
  'Olive': 'bg-green-700',
  'Forest Green': 'bg-green-800'
}

export default function ProductCard({ product }: ProductCardProps) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imageError, setImageError] = useState(false)
  const { addItem } = useCart()

  // Safety check: ensure product has variants
  if (!product.variants || product.variants.length === 0 || !selectedVariant) {
    return (
      <div className="group h-full flex flex-col">
        <div className="bg-white border border-gray-200 p-8 text-center">
          <div className="w-full h-full flex items-center justify-center bg-gray-100 aspect-[3/4] mb-4">
            <span className="text-gray-400 text-sm">No variants available</span>
          </div>
          <p className="text-sm text-gray-600">{product.title}</p>
        </div>
      </div>
    )
  }

  // Safely parse images with error handling
  const parseImages = (imageString: string): string[] => {
    try {
      if (!imageString) return []
      const parsed = JSON.parse(imageString)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  const productImages = parseImages(product.images)
  const variantImages = selectedVariant ? parseImages(selectedVariant.images) : []
  const allImages = [...variantImages, ...productImages].filter(img => img) // Show variant images first, filter empty

  // Change image when variant changes
  const handleVariantChange = (variant: typeof selectedVariant) => {
    setSelectedVariant(variant)
    setCurrentImageIndex(0) // Reset to first image of new variant
  }

  const formatPrice = (cents: number) => {
    return `${(cents / 100).toFixed(2)} MAD`
  }

  const totalStock = product.variants.reduce((sum, variant) => sum + variant.stock, 0)

  const handleAddToCart = () => {
    const variantImgs = parseImages(selectedVariant.images)
    const productImgs = parseImages(product.images)
    const firstImage = variantImgs[0] || productImgs[0] || '/placeholder.jpg'
    
    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      qty: 1,
      priceCents: selectedVariant.priceCents,
      title: product.title,
      image: firstImage,
      variantName: selectedVariant.color
    })
  }

  return (
    <div className="group h-full flex flex-col">
      <Link href={`/product/${product.sku}`} className="bg-white border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] h-full flex flex-col" style={{ willChange: 'transform' }}>
        {/* Image Section */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
          {allImages.length > 0 && !imageError ? (
            <>
              <Image
                src={allImages[currentImageIndex]}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                loading="lazy"
                priority={false}
                onError={() => setImageError(true)}
                unoptimized
              />
              {/* Hover Overlay with Quick View */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-white text-xs uppercase tracking-wider font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>Quick View</span>
                </div>
              </div>
            </>
          ) : (
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
          )}

          {/* Image Indicators */}
          {allImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
              {allImages.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault()
                    setCurrentImageIndex(index)
                  }}
                  className={`transition-all duration-300 ${
                    index === currentImageIndex 
                      ? 'bg-black w-6 h-1' 
                      : 'bg-gray-400 w-6 h-1 hover:bg-gray-600'
                  }`}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Stock Badge */}
          {totalStock < 20 && (
            <div className="absolute top-4 right-4 bg-white px-2 py-1 border border-gray-200">
              <span className="text-xs font-normal text-gray-900 tracking-wide">
                {totalStock} LEFT
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4 sm:p-5 flex flex-col flex-1">
          {/* Title */}
          <h3 className="text-sm sm:text-base font-normal text-black mb-1 tracking-wide line-clamp-1">
            {product.title}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-sm sm:text-base font-normal text-gray-600">
              {formatPrice(selectedVariant.priceCents)}
            </span>
          </div>

          {/* Color Variants */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-1.5">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleVariantChange(variant)
                  }}
                  className={`w-5 h-5 transition-all duration-300 border-2 ${
                    selectedVariant.id === variant.id
                      ? 'border-black ring-2 ring-offset-2 ring-black'
                      : 'border-gray-300 hover:border-gray-600'
                  } ${colorMap[variant.color] || 'bg-gray-200'}`}
                  title={`${variant.color} - ${variant.stock} in stock`}
                  aria-label={`Select ${variant.color} color`}
                />
              ))}
            </div>
          </div>

          {/* Selected Variant Info */}
          <div className="text-xs text-gray-500 mb-4">
            <span className="font-normal">{selectedVariant.color}</span>
            <span className="mx-2">•</span>
            <span>{selectedVariant.stock} in stock</span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 mt-auto">
            <button
              onClick={(e) => {
                e.preventDefault()
                // This will be handled by the Link wrapper
              }}
              className="px-3 py-2 border border-black text-black text-xs uppercase tracking-wider hover:bg-black hover:text-white transition-colors duration-300 text-center"
            >
              Details
            </button>
            <button
              onClick={(e) => {
                e.preventDefault()
                handleAddToCart()
              }}
              disabled={selectedVariant.stock === 0}
              className={`px-3 py-2 text-xs uppercase tracking-wider transition-colors duration-300 ${
                selectedVariant.stock > 0
                  ? 'bg-black text-white hover:bg-gray-800'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              {selectedVariant.stock > 0 ? 'Add' : 'Sold Out'}
            </button>
          </div>
        </div>
      </Link>
    </div>
  )
}

'use client'

import { useState } from 'react'
import Image from 'next/image'
import { formatPrice as formatPriceCurrency } from '@/lib/currency'

interface SizeSelectorModalProps {
  product: {
    id: string
    sku: string
    title: string
    images: string
    priceCents: number
    sizeInventory?: string | null
  }
  selectedVariant?: {
    id: string
    color: string
    images: string
    sizeInventory?: string | null
  } | null
  onClose: () => void
  onAddToCart: (size: string, quantity: number) => void
}

export default function SizeSelectorModal({ 
  product, 
  selectedVariant, 
  onClose, 
  onAddToCart 
}: SizeSelectorModalProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState('')

  // Parse size inventory
  const parseSizeInventory = (sizeStr: string | null | undefined): Array<{ size: string; quantity: number }> => {
    if (!sizeStr) return []
    try {
      return sizeStr.split(',').map(item => {
        const [size, qty] = item.trim().split('=')
        return { size: size.trim(), quantity: parseInt(qty) || 0 }
      }).filter(item => item.size && !isNaN(item.quantity))
    } catch {
      return []
    }
  }

  // Parse images
  const parseImages = (imageString: string): string[] => {
    try {
      if (!imageString) return []
      const parsed = JSON.parse(imageString)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  const sizeInventory = parseSizeInventory(
    selectedVariant?.sizeInventory || product.sizeInventory
  )
  
  const variantImages = selectedVariant ? parseImages(selectedVariant.images) : []
  const productImages = parseImages(product.images)
  const displayImages = variantImages.length > 0 ? variantImages : productImages
  const firstImage = displayImages[0] || '/placeholder.jpg'

  const formatPrice = (cents: number) => {
    return formatPriceCurrency(cents)
  }

  const getStockForSize = (size: string): number => {
    const sizeData = sizeInventory.find(s => s.size === size)
    return sizeData?.quantity || 0
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      setError('Please select a size')
      return
    }

    const stock = getStockForSize(selectedSize)
    if (stock === 0) {
      setError('This size is out of stock')
      return
    }

    if (quantity > stock) {
      setError(`Only ${stock} available`)
      return
    }

    onAddToCart(selectedSize, quantity)
    onClose()
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg max-w-md w-full p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Product Info */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative w-20 h-20 flex-shrink-0">
            <Image
              src={firstImage}
              alt={product.title}
              fill
              className="object-cover rounded"
              unoptimized
            />
          </div>
          <div>
            <h3 className="text-lg font-medium text-black">{product.title}</h3>
            {selectedVariant && (
              <p className="text-sm text-gray-600">{selectedVariant.color}</p>
            )}
            <p className="text-base font-semibold text-black mt-1">
              {formatPrice(product.priceCents)}
            </p>
          </div>
        </div>

        {/* Size Selection */}
        {sizeInventory.length > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-black mb-3">
              SELECT SIZE
            </label>
            <div className="grid grid-cols-4 gap-2">
              {sizeInventory.map((sizeData) => {
                const stock = sizeData.quantity
                const isOutOfStock = stock === 0
                const isSelected = selectedSize === sizeData.size
                
                return (
                  <button
                    key={sizeData.size}
                    onClick={() => {
                      if (!isOutOfStock) {
                        setSelectedSize(sizeData.size)
                        setError('')
                      }
                    }}
                    disabled={isOutOfStock}
                    className={`px-4 py-3 border-2 text-sm font-medium uppercase transition-all ${
                      isSelected
                        ? 'border-black bg-black text-white'
                        : isOutOfStock
                          ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'border-gray-300 text-black hover:border-black'
                    }`}
                  >
                    {sizeData.size}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Quantity Selection */}
        {selectedSize && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-black mb-3">
              QUANTITY
            </label>
            <select
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-300 focus:border-black focus:outline-none"
            >
              {[...Array(Math.min(10, getStockForSize(selectedSize)))].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-2">
              {getStockForSize(selectedSize)} available
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 border-2 border-gray-300 text-black text-sm uppercase tracking-wider hover:bg-gray-100 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleAddToCart}
            className="px-6 py-3 bg-black text-white text-sm uppercase tracking-wider hover:bg-orange-500 transition-all"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}



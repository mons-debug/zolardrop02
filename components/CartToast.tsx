'use client'

import { useEffect } from 'react'

interface CartToastProps {
  show: boolean
  onClose: () => void
  productName: string
  variantName: string
  image: string
  price: string
}

export default function CartToast({ show, onClose, productName, variantName, image, price }: CartToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose()
      }, 4000) // Auto-close after 4 seconds

      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  const handleViewCart = () => {
    // This will trigger the cart drawer to open
    const cartButton = document.querySelector('[aria-label="Open shopping cart"]') as HTMLElement
    if (cartButton) cartButton.click()
    onClose()
  }

  if (!show) return null

  return (
    <div className="fixed top-24 right-4 z-[9999] animate-slide-in">
      <div 
        className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden max-w-sm cursor-pointer hover:shadow-3xl transition-shadow"
        onClick={handleViewCart}
      >
        <div className="flex items-start p-4 space-x-4">
          {/* Checkmark Icon */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 mb-1">Added to cart</p>
            <p className="text-sm text-gray-600">{productName}</p>
            <p className="text-xs text-gray-500 mt-1">{variantName} • {price}</p>
          </div>

          {/* Product Image */}
          {image && (
            <div className="flex-shrink-0">
              <div className="w-16 h-16 relative bg-gray-100 rounded overflow-hidden">
                <img
                  src={image}
                  alt={productName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Hide image container if image fails to load
                    const target = e.target as HTMLImageElement
                    const container = target.parentElement
                    if (container) container.style.display = 'none'
                  }}
                />
              </div>
            </div>
          )}

          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Action Button */}
        <div className="bg-gray-50 px-4 py-3 flex items-center justify-center border-t border-gray-200">
          <p className="text-xs text-gray-500">Click to view cart</p>
        </div>
      </div>
    </div>
  )
}


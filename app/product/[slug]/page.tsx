'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/components/CartContext'
import CartIcon from '@/components/CartIcon'

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

const colorMap: Record<string, string> = {
  'Black': 'bg-black',
  'White': 'bg-white border border-gray-300',
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

export default function ProductPage() {
  const params = useParams()
  const slug = params?.slug as string
  const { addItem } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<any>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomedImageUrl, setZoomedImageUrl] = useState('')

  useEffect(() => {
    if (slug) {
      // Fetch product directly in the browser
      fetch(`/api/products/${slug}`)
        .then(res => {
          if (!res.ok) {
            throw new Error('Product not found')
          }
          return res.json()
        })
        .then(data => {
          setProduct(data.product)
          if (data.product && data.product.variants && data.product.variants.length > 0) {
            setSelectedVariant(data.product.variants[0])
          }
          setLoading(false)
        })
        .catch(error => {
          // Silently handle error
          setProduct(null)
          setLoading(false)
        })
    }
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <Link href="/products" className="text-blue-600 hover:text-blue-800">
            ← Back to Products
          </Link>
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
  const handleVariantChange = (variant: any) => {
    setSelectedVariant(variant)
    setCurrentImageIndex(0) // Reset to first image when changing variant
  }

  const formatPrice = (cents: number) => {
    return `${(cents / 100).toFixed(2)} MAD`
  }

  const handleAddToCart = () => {
    if (!selectedVariant || !product) return

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

  // JSON-LD Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "description": product.description || `${product.title} - Available at ZOLAR`,
    "sku": product.sku,
    "brand": {
      "@type": "Brand",
      "name": "ZOLAR"
    },
    "offers": {
      "@type": "AggregateOffer",
      "url": `https://zolar.ma/product/${product.sku}`,
      "priceCurrency": "MAD",
      "lowPrice": Math.min(...product.variants.map(v => v.priceCents / 100)),
      "highPrice": Math.max(...product.variants.map(v => v.priceCents / 100)),
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "offerCount": product.variants.length
    },
    "image": allImages[0] || '/icon-192x192.png',
    "category": product.category || "Apparel"
  }

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="min-h-screen bg-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="text-xs uppercase tracking-wider text-gray-500 mb-8">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          {' / '}
          <Link href="/products" className="hover:text-black transition-colors">Products</Link>
          {' / '}
          <span className="text-black">{product.title}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Image Gallery */}
          <div className="space-y-3">
            <div 
              className="aspect-[3/4] relative bg-gray-50 overflow-hidden group cursor-zoom-in"
              onClick={() => {
                if (allImages.length > 0 && !imageError) {
                  setZoomedImageUrl(allImages[currentImageIndex])
                  setIsZoomed(true)
                }
              }}
            >
              {allImages.length > 0 && !imageError ? (
                <>
                  <Image
                    src={allImages[currentImageIndex]}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={() => setImageError(true)}
                    unoptimized
                  />
                  {/* Zoom Icon Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-lg">
                      <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                      </svg>
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <div className="text-center p-8">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-gray-400">Image Not Available</span>
                  </div>
                </div>
              )}

              {/* Image indicators */}
              {allImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                  {allImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation()
                        setCurrentImageIndex(index)
                      }}
                      className={`transition-all ${
                        index === currentImageIndex ? 'bg-black w-8 h-0.5' : 'bg-gray-300 w-8 h-0.5'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail strip */}
            {allImages.length > 1 && !imageError && (
              <div className="grid grid-cols-4 gap-2">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-[3/4] relative bg-gray-50 border transition-all ${
                      index === currentImageIndex ? 'border-black' : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-light tracking-tight text-black mb-3">
                {product.title}
              </h1>
              <p className="text-xs uppercase tracking-wider text-gray-500">
                SKU: {product.sku}
              </p>
            </div>

            {/* Price */}
            <div className="space-y-1">
              {selectedVariant && selectedVariant.priceCents !== product.priceCents && (
                <div className="text-sm text-gray-400 line-through">
                  {formatPrice(product.priceCents)}
                </div>
              )}
              <div className="text-3xl font-light text-black">
                {selectedVariant ? formatPrice(selectedVariant.priceCents) : formatPrice(product.priceCents)}
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Tune Selection */}
            <div>
              <h3 className="text-xs uppercase tracking-wider text-gray-900 mb-4">Select Tune</h3>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => handleVariantChange(variant)}
                    className={`px-5 py-3 text-xs uppercase tracking-wider font-medium border-2 transition-all rounded-sm ${
                      selectedVariant?.id === variant.id
                        ? 'border-orange-500 bg-orange-500 text-white shadow-md'
                        : 'border-gray-300 text-black hover:border-orange-500 hover:text-orange-500'
                    }`}
                    disabled={variant.stock === 0}
                  >
                    {variant.color}
                    {variant.stock === 0 && ' (Out of Stock)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Variant Info */}
            {selectedVariant && (
              <div className="border-t border-b border-gray-200 py-4">
                <div className="grid grid-cols-2 gap-4 text-xs uppercase tracking-wider">
                  <div>
                    <span className="text-gray-500">Selected Tune</span>
                    <div className="text-black mt-1">{selectedVariant.color}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">SKU</span>
                    <div className="text-black mt-1">{selectedVariant.sku}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Stock</span>
                    <div className="text-black mt-1">{selectedVariant.stock} left</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Price</span>
                    <div className="text-black mt-1">{formatPrice(selectedVariant.priceCents)}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={!selectedVariant || selectedVariant.stock === 0}
                className={`w-full py-4 px-8 text-xs uppercase tracking-widest font-medium transition-colors ${
                  selectedVariant && selectedVariant.stock > 0
                    ? 'bg-black text-white hover:bg-gray-800'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {selectedVariant && selectedVariant.stock > 0
                  ? 'Add to Cart'
                  : 'Out of Stock'
                }
              </button>

              <div className="text-center">
                <Link 
                  href="/products" 
                  className="text-xs uppercase tracking-wider text-black hover:text-gray-600 transition-colors"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Zoom Modal */}
      {isZoomed && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setIsZoomed(false)}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-6 right-6 z-50 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
            aria-label="Close zoom"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Navigation Arrows */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : allImages.length - 1
                  setCurrentImageIndex(newIndex)
                  setZoomedImageUrl(allImages[newIndex])
                }}
                className="absolute left-6 z-50 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-4 rounded-full transition-all duration-300 hover:scale-110"
                aria-label="Previous image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  const newIndex = currentImageIndex < allImages.length - 1 ? currentImageIndex + 1 : 0
                  setCurrentImageIndex(newIndex)
                  setZoomedImageUrl(allImages[newIndex])
                }}
                className="absolute right-6 z-50 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-4 rounded-full transition-all duration-300 hover:scale-110"
                aria-label="Next image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Zoomed Image */}
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative max-w-7xl max-h-full w-full h-full">
              <Image
                src={zoomedImageUrl}
                alt={product.title}
                fill
                className="object-contain"
                unoptimized
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {/* Image Counter */}
          {allImages.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
              {currentImageIndex + 1} / {allImages.length}
            </div>
          )}
        </div>
      )}
    </div>
    </>
  )
}

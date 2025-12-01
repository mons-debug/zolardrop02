'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/components/CartContext'
import CartIcon from '@/components/CartIcon'
// Lens zoom removed - was causing image display issues

interface Product {
  id: string
  sku: string
  title: string
  color?: string | null
  description: string
  images: string
  priceCents: number
  salePriceCents?: number
  currency: string
  stock: number
  sizeInventory?: string | null
  category?: string
  variants: Array<{
    id: string
    color: string
    size?: string | null
    sku: string
    priceCents: number
    stock: number
    images: string
    sizeInventory?: string | null
    description?: string | null
    showAsProduct?: boolean
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
  const searchParams = useSearchParams()
  const slug = params?.slug as string
  const preSelectedVariantId = searchParams.get('variant')
  const { addItem } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<any>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [sizeQuantities, setSizeQuantities] = useState<Record<string, number>>({}) // Track quantities for each size
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  const [showSizeGuide, setShowSizeGuide] = useState(false)

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
            // FIRST PRIORITY: Check if variant is specified in URL
            if (preSelectedVariantId) {
              const urlVariant = data.product.variants.find((v: any) => v.id === preSelectedVariantId)
              if (urlVariant) {
                setSelectedVariant(urlVariant)
                if (urlVariant.size) {
                  setSelectedSize(urlVariant.size)
                }
                setLoading(false)
                return
              }
            }
            
            // SECOND PRIORITY: If main product color is Eclipse Black and no variant specified, don't select any variant
            // This allows the main product (Eclipse Black) to be displayed instead of defaulting to first variant
            const mainProductColor = data.product.color?.toLowerCase().trim()
            if (mainProductColor && (
              mainProductColor === 'eclipse black' ||
              mainProductColor.includes('eclipse black') ||
              mainProductColor.includes('eclipse') && mainProductColor.includes('black')
            )) {
              // Don't set selectedVariant - let main product display
              setLoading(false)
              return
            }
            
            // THIRD PRIORITY: Check if this is an Essence product - try to find Eclipse Black variant
            const isEssenceProduct = (data.product.sku && data.product.sku.startsWith('ESS-')) || 
                                     (data.product.title && data.product.title.toLowerCase().includes('essence'))
            
            let eclipseBlackVariant = null
            if (isEssenceProduct) {
              eclipseBlackVariant = data.product.variants.find((v: any) => {
                if (!v.color) return false
                const color = v.color.toLowerCase().trim()
                return (
                  color === 'eclipse black' ||
                  color.includes('eclipse black') ||
                  color === 'eclipse-black' ||
                  color === 'eclipseblack' ||
                  (color.includes('eclipse') && color.includes('black'))
                )
              })
            }
            
            // Check if variants have sizes
            const variantsWithSizes = data.product.variants.filter((v: any) => v.size)
            if (variantsWithSizes.length > 0) {
              // Prioritize Eclipse Black first if it exists
              if (eclipseBlackVariant) {
                setSelectedVariant(eclipseBlackVariant)
                if (eclipseBlackVariant.size) {
                  setSelectedSize(eclipseBlackVariant.size)
                }
              } else {
                // Set initial size to first available size
                setSelectedSize(variantsWithSizes[0].size)
                // Set initial variant to first variant with that size
                const firstVariantWithSize = data.product.variants.find((v: any) => v.size === variantsWithSizes[0].size)
                if (firstVariantWithSize) {
                  setSelectedVariant(firstVariantWithSize)
                }
              }
            } else {
              // No sizes, prioritize Eclipse Black for essence products, otherwise first variant with stock
              if (eclipseBlackVariant) {
                setSelectedVariant(eclipseBlackVariant)
              } else {
                const firstAvailableVariant = data.product.variants.find((v: any) => v.stock > 0) || data.product.variants[0]
                setSelectedVariant(firstAvailableVariant)
              }
            }
          }
          setLoading(false)
        })
        .catch(error => {
          // Silently handle error
          setProduct(null)
          setLoading(false)
        })
    }
  }, [slug, preSelectedVariantId])

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
  // If variant is selected and has images, show ONLY variant images
  // Otherwise show product images
  const allImages = (selectedVariant && variantImages.length > 0)
    ? variantImages
    : productImages.length > 0 
      ? productImages
      : []

  // Parse sizeInventory string
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

  const sizeInventory = parseSizeInventory(product.sizeInventory)
  
  // Get variant sizeInventory if selected variant has it
  const variantSizeInventory = selectedVariant?.sizeInventory 
    ? parseSizeInventory(selectedVariant.sizeInventory) 
    : []
  
  // Prioritize variant size inventory over product size inventory
  const displaySizeInventory = variantSizeInventory.length > 0 ? variantSizeInventory : sizeInventory

  // Dynamic display values based on selected variant OR main product color
  const displayTitle = selectedVariant && selectedVariant.color
    ? `${product.title} - ${selectedVariant.color.toUpperCase()}`
    : product.color
      ? `${product.title} - ${product.color.toUpperCase()}`
      : product.title

  const displayDescription = (selectedVariant && selectedVariant.description)
    ? selectedVariant.description
    : (product.description || `High-quality ${product.title} - Available now at ZOLAR.`)

  const displayPrice = selectedVariant ? selectedVariant.priceCents : product.priceCents
  
  const displayColor = selectedVariant ? selectedVariant.color : (product.color || 'Default')

  // Get all available colors (main product + variants)
  const getAllColors = () => {
    const colors = []
    
    // Add main product color as first option if it exists
    if (product.color) {
      colors.push({
        id: 'main',
        color: product.color,
        isMainProduct: true
      })
    }
    
    // Add variant colors
    product.variants.forEach((v: any) => {
      colors.push({
        id: v.id,
        color: v.color,
        isMainProduct: false,
        variant: v
      })
    })
    
    return colors
  }

  // Get available sizes from variants
  const getAvailableSizes = (): string[] => {
    if (!product) return []
    const sizes = new Set<string>()
    product.variants.forEach((v: any) => {
      if (v.size) sizes.add(v.size)
    })
    return Array.from(sizes).sort()
  }

  // Get variants filtered by selected size
  const getFilteredVariants = () => {
    if (!product) return []
    if (!selectedSize) return product.variants
    return product.variants.filter((v: any) => v.size === selectedSize)
  }

  // Handle size selection
  const handleSizeChange = (size: string) => {
    setSelectedSize(size)
    // Select first variant with this size
    const variantWithSize = product?.variants.find((v: any) => v.size === size)
    if (variantWithSize) {
      setSelectedVariant(variantWithSize)
      setCurrentImageIndex(0)
    }
  }

  // Change image when variant changes
  const handleVariantChange = (variant: any) => {
    setSelectedVariant(variant)
    setCurrentImageIndex(0) // Reset to first image when changing variant
    // Update selected size if variant has a size
    if (variant.size) {
      setSelectedSize(variant.size)
    }
  }

  const formatPrice = (cents: number) => {
    return `${(cents / 100).toFixed(2)} MAD`
  }

  // Update quantity for a specific size
  const updateSizeQuantity = (size: string, quantity: number) => {
    if (quantity < 0) return
    setSizeQuantities(prev => ({
      ...prev,
      [size]: quantity
    }))
  }

  // Get total quantity across all sizes
  const getTotalQuantity = () => {
    return Object.values(sizeQuantities).reduce((sum, qty) => sum + qty, 0)
  }

  const handleAddToCart = () => {
    if (!product) return

    const hasSizes = displaySizeInventory.length > 0 || getAvailableSizes().length > 0
    
    // If product has sizes, check if size and quantity are selected
    if (hasSizes) {
      if (!selectedSize) {
        alert('Please select a size before adding to cart')
        return
      }
      const qty = sizeQuantities[selectedSize] || 0
      if (qty === 0) {
        alert('Please select a quantity before adding to cart')
        return
      }
    } else {
      // No sizes - use single selection logic
      if (!selectedVariant && product.variants && product.variants.length > 0) {
        alert('Please select a variant before adding to cart')
        return
      }
    }

    const productImgs = parseImages(product.images)
    const firstImage = productImgs[0] || '/placeholder.jpg'

    // If product has sizes, add the selected size with quantity
    if (hasSizes && selectedSize) {
      const qty = sizeQuantities[selectedSize] || 1
      
      // Find variant for this size and color
      const variantForSize = product.variants?.find((v: any) => 
        v.size === selectedSize && 
        (selectedVariant ? v.color === selectedVariant.color : true)
      ) || selectedVariant

      if (variantForSize) {
        const variantImgs = parseImages(variantForSize.images)
        const variantImage = variantImgs[0] || firstImage

        addItem({
          productId: product.id,
          variantId: variantForSize.id,
          qty: qty,
          priceCents: variantForSize.priceCents,
          title: product.title,
          image: variantImage,
          variantName: `${variantForSize.color || product.color || 'Default'} - ${selectedSize}`,
          size: selectedSize
        })
      } else {
        // No variant found, use product directly
        addItem({
          productId: product.id,
          variantId: product.id,
          qty: qty,
          priceCents: product.priceCents,
          title: product.title,
          image: firstImage,
          variantName: `${product.color || 'Default'} - ${selectedSize}`,
          size: selectedSize
        })
      }
    } else {
      // No sizes - single item logic
      if (product.variants && product.variants.length > 0 && selectedVariant) {
        const variantImgs = parseImages(selectedVariant.images)
        const variantImage = variantImgs[0] || firstImage

        addItem({
          productId: product.id,
          variantId: selectedVariant.id,
          qty: 1,
          priceCents: selectedVariant.priceCents,
          title: product.title,
          image: variantImage,
          variantName: `${selectedVariant.color}${selectedVariant.size ? ` - ${selectedVariant.size}` : ''}`
        })
      } else {
        addItem({
          productId: product.id,
          variantId: product.id,
          qty: 1,
          priceCents: product.priceCents,
          title: product.title,
          image: firstImage,
          variantName: `${product.color || 'Default'}${selectedSize ? ` - ${selectedSize}` : ''}`
        })
      }
    }

    // Clear size quantities after adding
    setSizeQuantities({})
    setSelectedSize(null)
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
          <span className="text-black">{displayTitle}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Image Gallery */}
          <div className="space-y-3">
            <div 
              className="aspect-[3/4] relative bg-gray-50 overflow-hidden group cursor-zoom-in"
              onClick={() => setIsZoomed(true)}
              onMouseMove={(e) => {
                if (!isZoomed) {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const x = ((e.clientX - rect.left) / rect.width) * 100
                  const y = ((e.clientY - rect.top) / rect.height) * 100
                  setZoomPosition({ x, y })
                }
              }}
            >
              {allImages.length > 0 && !imageError ? (
                <>
                  <Image
                    src={allImages[currentImageIndex]}
                    alt={displayTitle}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={() => setImageError(true)}
                    unoptimized
                  />
                  {/* Zoom icon overlay */}
                  <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                    </svg>
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
                      alt={`${displayTitle} ${index + 1}`}
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
                {displayTitle}
              </h1>
              <p className="text-xs uppercase tracking-wider text-gray-500">
                SKU: {product.sku}
              </p>
              {preSelectedVariantId && selectedVariant && (
                <p className="text-sm text-gray-500 mt-1">
                  Viewing: {selectedVariant.color} variant
                </p>
              )}
            </div>

            {/* Price */}
            <div className="space-y-1">
              {selectedVariant && selectedVariant.priceCents !== product.priceCents && (
                <div className="text-sm text-gray-400 line-through">
                  {formatPrice(product.priceCents)}
                </div>
              )}
              <div className="text-3xl font-light text-black">
                {formatPrice(displayPrice)}
              </div>
            </div>

            {/* Description */}
            <div>
              <div className="text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none">
                {displayDescription && displayDescription.split('\n').map((line, idx) => {
                  // Headline
                  if (line.startsWith('# ')) {
                    return <h2 key={idx} className="text-lg font-bold mt-4 mb-2 text-black">{line.replace('# ', '')}</h2>
                  }
                  // Sub-headline
                  if (line.startsWith('## ')) {
                    return <h3 key={idx} className="text-base font-semibold mt-3 mb-2 text-black">{line.replace('## ', '')}</h3>
                  }
                  // Bullet point
                  if (line.startsWith('• ') || line.startsWith('- ')) {
                    return <li key={idx} className="ml-4 list-disc">{line.replace(/^[•-] /, '')}</li>
                  }
                  // Bold text
                  if (line.includes('**')) {
                    const parts = line.split('**')
                    return (
                      <p key={idx} className="mb-2">
                        {parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="font-semibold text-black">{part}</strong> : part)}
                      </p>
                    )
                  }
                  // Empty line
                  if (line.trim() === '') {
                    return <br key={idx} />
                  }
                  // Regular text
                  return <p key={idx} className="mb-2">{line}</p>
                })}
              </div>
            </div>

            {/* Product-Level Size Selection (from sizeInventory or variant sizeInventory) */}
            {displaySizeInventory.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs uppercase tracking-wider text-gray-900">Select Size</h3>
                  {product.sizeGuide && (
                    <button
                      onClick={() => setShowSizeGuide(true)}
                      className="flex items-center gap-1 text-xs text-gray-600 hover:text-black transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      Size Guide
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {displaySizeInventory.map(({ size, quantity }) => {
                    const isAvailable = quantity > 0
                    return (
                      <button
                        key={size}
                        onClick={() => {
                          if (isAvailable) {
                            setSelectedSize(size)
                            // Auto-set quantity to 1 when size is selected
                            if (!sizeQuantities[size] || sizeQuantities[size] === 0) {
                              updateSizeQuantity(size, 1)
                            }
                          }
                        }}
                        disabled={!isAvailable}
                        className={`px-4 py-2.5 text-xs uppercase tracking-wider font-medium border-2 transition-all rounded-sm ${
                          selectedSize === size
                            ? 'border-black bg-black text-white shadow-md'
                            : !isAvailable
                              ? 'border-gray-200 text-gray-300 cursor-not-allowed opacity-50'
                              : 'border-gray-300 text-black hover:border-black hover:text-black'
                        }`}
                      >
                        {size}
                      </button>
                    )
                  })}
                </div>
                
                {/* Size Selected - Show Quantity and Stock Status */}
                {selectedSize && displaySizeInventory.find(s => s.size === selectedSize)?.quantity > 0 && (() => {
                  const selectedSizeData = displaySizeInventory.find(s => s.size === selectedSize)
                  const quantity = selectedSizeData?.quantity || 0
                  const isLowStock = quantity > 0 && quantity <= 10
                  const currentQty = sizeQuantities[selectedSize] || 1
                  
                  return (
                    <div className="flex items-center gap-4 mb-6 p-3 bg-gray-50 border border-gray-200 rounded-sm">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs uppercase tracking-wider text-gray-600">Size:</span>
                          <span className="text-sm font-semibold text-black">{selectedSize}</span>
                          <span className={`text-xs font-medium ml-2 ${
                            isLowStock ? 'text-orange-600' : 'text-green-600'
                          }`}>
                            {isLowStock ? '⚠ Low Stock' : '✓ In Stock'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs uppercase tracking-wider text-gray-600">Quantity:</span>
                          <select
                            value={currentQty}
                            onChange={(e) => {
                              const qty = parseInt(e.target.value)
                              const maxQty = quantity
                              updateSizeQuantity(selectedSize, Math.min(qty, maxQty))
                            }}
                            className="px-3 py-1.5 text-sm border border-gray-300 focus:border-black focus:outline-none transition-colors bg-white"
                          >
                            {Array.from({ length: Math.min(quantity, 10) }, (_, i) => i + 1).map(num => (
                              <option key={num} value={num}>{num}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </div>
            )}

            {/* Size Selection (from variants) - fallback if no sizeInventory */}
            {displaySizeInventory.length === 0 && getAvailableSizes().length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs uppercase tracking-wider text-gray-900">Select Size</h3>
                  {product.sizeGuide && (
                    <button
                      onClick={() => setShowSizeGuide(true)}
                      className="flex items-center gap-1 text-xs text-gray-600 hover:text-black transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      Size Guide
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {getAvailableSizes().map((size) => {
                    // Find variant for this size to get stock
                    const variantForSize = product?.variants?.find((v: any) => v.size === size)
                    const availableStock = variantForSize?.stock || 0
                    const isAvailable = availableStock > 0
                    return (
                      <button
                        key={size}
                        onClick={() => {
                          if (isAvailable) {
                            handleSizeChange(size)
                            // Auto-set quantity to 1 when size is selected
                            if (!sizeQuantities[size] || sizeQuantities[size] === 0) {
                              updateSizeQuantity(size, 1)
                            }
                          }
                        }}
                        disabled={!isAvailable}
                        className={`px-4 py-2.5 text-xs uppercase tracking-wider font-medium border-2 transition-all rounded-sm ${
                          selectedSize === size
                            ? 'border-black bg-black text-white shadow-md'
                            : !isAvailable
                              ? 'border-gray-200 text-gray-300 cursor-not-allowed opacity-50'
                              : 'border-gray-300 text-black hover:border-black hover:text-black'
                        }`}
                      >
                        {size}
                      </button>
                    )
                  })}
                </div>
                
                {/* Size Selected - Show Quantity and Stock Status */}
                {selectedSize && (() => {
                  const variantForSize = product?.variants?.find((v: any) => v.size === selectedSize)
                  const availableStock = variantForSize?.stock || 0
                  const isLowStock = availableStock > 0 && availableStock <= 10
                  const currentQty = sizeQuantities[selectedSize] || 1
                  
                  return availableStock > 0 && (
                    <div className="flex items-center gap-4 mb-6 p-3 bg-gray-50 border border-gray-200 rounded-sm">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs uppercase tracking-wider text-gray-600">Size:</span>
                          <span className="text-sm font-semibold text-black">{selectedSize}</span>
                          <span className={`text-xs font-medium ml-2 ${
                            isLowStock ? 'text-orange-600' : 'text-green-600'
                          }`}>
                            {isLowStock ? '⚠ Low Stock' : '✓ In Stock'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs uppercase tracking-wider text-gray-600">Quantity:</span>
                          <select
                            value={currentQty}
                            onChange={(e) => {
                              const qty = parseInt(e.target.value)
                              updateSizeQuantity(selectedSize, Math.min(qty, availableStock))
                            }}
                            className="px-3 py-1.5 text-sm border border-gray-300 focus:border-black focus:outline-none transition-colors bg-white"
                          >
                            {Array.from({ length: Math.min(availableStock, 10) }, (_, i) => i + 1).map(num => (
                              <option key={num} value={num}>{num}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </div>
            )}

            {/* Color Selection */}
            {getAllColors().length > 0 && (
              <div>
                <h3 className="text-xs uppercase tracking-wider text-gray-900 mb-4">Select Color</h3>
                <div className="flex flex-wrap gap-3">
                  {getAllColors().map((colorOption: any) => (
                    <button
                      key={colorOption.id}
                      onClick={() => {
                        if (colorOption.isMainProduct) {
                          setSelectedVariant(null)
                          setCurrentImageIndex(0)
                        } else {
                          setSelectedVariant(colorOption.variant)
                          setCurrentImageIndex(0)
                        }
                      }}
                      className={`px-5 py-3 text-xs uppercase tracking-wider font-medium border-2 transition-all rounded-sm ${
                        (colorOption.isMainProduct && !selectedVariant) || 
                        (selectedVariant?.id === colorOption.variant?.id)
                          ? 'border-black bg-black text-white shadow-md'
                          : 'border-gray-300 text-black hover:border-black hover:text-black'
                      }`}
                    >
                      {colorOption.color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Variant Info */}
            <div className="border-t border-b border-gray-200 py-4">
              <div className="grid grid-cols-2 gap-4 text-xs uppercase tracking-wider">
                {selectedVariant ? (
                  <>
                    <div>
                      <span className="text-gray-500">Selected Color</span>
                      <div className="text-black mt-1">{selectedVariant.color}</div>
                    </div>
                    {selectedVariant.size && (
                      <div>
                        <span className="text-gray-500">Size</span>
                        <div className="text-black mt-1">{selectedVariant.size}</div>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-500">SKU</span>
                      <div className="text-black mt-1">{selectedVariant.sku}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Stock</span>
                      <div className="text-black mt-1">
                        {selectedVariant.stock === 0 ? (
                          <span className="text-red-600">Out of Stock</span>
                        ) : selectedVariant.stock <= 10 ? (
                          <span className="text-orange-600">Low Stock</span>
                        ) : (
                          <span className="text-green-600">In Stock</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Price</span>
                      <div className="text-black mt-1">{formatPrice(selectedVariant.priceCents)}</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <span className="text-gray-500">SKU</span>
                      <div className="text-black mt-1">{product.sku}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Stock</span>
                      <div className="text-black mt-1">
                        {product.stock === 0 ? (
                          <span className="text-red-600">Out of Stock</span>
                        ) : product.stock <= 10 ? (
                          <span className="text-orange-600">Low Stock</span>
                        ) : (
                          <span className="text-green-600">In Stock</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Price</span>
                      <div className="text-black mt-1">{formatPrice(product.priceCents)}</div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Add to Cart */}
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={
                  // Only disable if out of stock
                  (product.variants && product.variants.length > 0)
                    ? (selectedVariant && selectedVariant.stock === 0)
                    : product.stock === 0
                }
                className={`w-full py-4 px-8 text-xs uppercase tracking-widest font-medium transition-colors ${
                  ((displaySizeInventory.length > 0 || getAvailableSizes().length > 0) && (!selectedSize || !sizeQuantities[selectedSize]))
                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                    : (product.variants && product.variants.length > 0)
                      ? (selectedVariant && selectedVariant.stock === 0)
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-black text-white hover:bg-gray-800'
                      : product.stock === 0
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                {(displaySizeInventory.length > 0 || getAvailableSizes().length > 0) && (!selectedSize || !sizeQuantities[selectedSize])
                  ? 'Please Select Size & Quantity'
                  : (product.variants && product.variants.length > 0)
                    ? (selectedVariant && selectedVariant.stock === 0)
                      ? 'Out of Stock'
                      : 'Add to Cart'
                    : product.stock === 0
                      ? 'Out of Stock'
                      : 'Add to Cart'
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
      {isZoomed && allImages.length > 0 && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-4 right-4 z-50 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
            aria-label="Close zoom"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Navigation arrows for multiple images */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))
                }}
                className="absolute left-4 z-50 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
                aria-label="Previous image"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))
                }}
                className="absolute right-4 z-50 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
                aria-label="Next image"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Zoomed image */}
          <div 
            className="relative w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-w-5xl max-h-full overflow-hidden">
              <Image
                src={allImages[currentImageIndex]}
                alt={`${displayTitle} - Zoomed`}
                width={1200}
                height={1600}
                className="object-contain max-h-[90vh] w-auto"
                unoptimized
              />
            </div>
          </div>

          {/* Image counter */}
          {allImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
              {currentImageIndex + 1} / {allImages.length}
            </div>
          )}
        </div>
      )}

      {/* Size Guide Modal */}
      {showSizeGuide && product?.sizeGuide && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setShowSizeGuide(false)}
        >
          <div 
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900">Size Guide</h3>
              </div>
              <button
                onClick={() => setShowSizeGuide(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">All measurements in centimeters (cm)</p>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-900">SIZE</th>
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-900">CHEST WIDTH</th>
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-900">LENGTH</th>
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-900">SHOULDER</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.sizeGuide.split('\n').filter(line => line.trim()).map((line, idx) => {
                      const parts = line.split('|').map(p => p.trim())
                      if (parts.length >= 4) {
                        return (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-3 font-semibold text-gray-900">{parts[0]}</td>
                            <td className="border border-gray-300 px-4 py-3 text-gray-700">{parts[1]}</td>
                            <td className="border border-gray-300 px-4 py-3 text-gray-700">{parts[2]}</td>
                            <td className="border border-gray-300 px-4 py-3 text-gray-700">{parts[3]}</td>
                          </tr>
                        )
                      }
                      return null
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900 font-medium mb-2">📏 How to Measure:</p>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• <strong>Chest Width:</strong> Measure across the chest from armpit to armpit</li>
                  <li>• <strong>Length:</strong> Measure from the highest point of the shoulder to the bottom hem</li>
                  <li>• <strong>Shoulder:</strong> Measure from shoulder seam to shoulder seam</li>
                </ul>
                <p className="text-xs text-blue-700 mt-3">
                  💡 Tip: This product follows an oversized fit. For a regular fit, consider sizing down.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  )
}

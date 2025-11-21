'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import ImageGallery from '@/components/admin/ImageGallery'
import ImageUpload from '@/components/admin/ImageUpload'

interface Variant {
  id?: string
  color: string
  size?: string
  sku: string
  priceCents: number
  stock: number
  images: string[]
}

interface Product {
  id: string
  sku: string
  title: string
  description: string | null
  images: string
  priceCents: number
  stock: number
  category?: string
  variants: any[]
}

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params?.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  
  // Product fields
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [sku, setSku] = useState('')
  const [priceCents, setPriceCents] = useState('')
  const [stock, setStock] = useState('')
  const [category, setCategory] = useState('')
  const [images, setImages] = useState<string[]>([])
  
  // Variants
  const [variants, setVariants] = useState<Variant[]>([])
  const [showVariantForm, setShowVariantForm] = useState(false)
  const [variantColor, setVariantColor] = useState('')
  const [variantSize, setVariantSize] = useState('')
  const [variantSku, setVariantSku] = useState('')
  const [variantPrice, setVariantPrice] = useState('')
  const [variantStock, setVariantStock] = useState('')
  const [variantImages, setVariantImages] = useState<string[]>([])

  useEffect(() => {
    if (productId) {
      fetchProduct()
    }
  }, [productId])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${productId}`)
      
      if (response.ok) {
        const data = await response.json()
        const product = data.product

        setTitle(product.title)
        setDescription(product.description || '')
        setSku(product.sku)
        setPriceCents((product.priceCents / 100).toFixed(2))
        setStock(product.stock.toString())
        setCategory(product.category || '')
        
        // Parse images
        try {
          const parsedImages = JSON.parse(product.images)
          setImages(parsedImages)
        } catch {
          setImages([])
        }

        // Parse variants
        const parsedVariants = product.variants.map((v: any) => ({
          id: v.id,
          color: v.color,
          sku: v.sku,
          priceCents: v.priceCents,
          stock: v.stock,
          images: v.images ? JSON.parse(v.images) : []
        }))
        setVariants(parsedVariants)
      } else {
        alert('Product not found')
        router.push('/admin/products')
      }
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVariantImageUpload = (url: string) => {
    setVariantImages([...variantImages, url])
  }

  const removeVariantImage = (index: number) => {
    setVariantImages(variantImages.filter((_, i) => i !== index))
  }

  const addVariant = () => {
    if (!variantColor || !variantSku || !variantPrice || !variantStock) {
      alert('Please fill in all variant fields')
      return
    }

    const newVariant: Variant = {
      color: variantColor,
      size: variantSize || undefined,
      sku: variantSku,
      priceCents: Math.round(parseFloat(variantPrice) * 100),
      stock: parseInt(variantStock),
      images: variantImages
    }

    setVariants([...variants, newVariant])
    
    // Reset variant form
    setVariantColor('')
    setVariantSize('')
    setVariantSku('')
    setVariantPrice('')
    setVariantStock('')
    setVariantImages([])
    setShowVariantForm(false)
  }

  const removeVariant = async (index: number) => {
    const variant = variants[index]
    
    // If variant has an ID, it exists in database - delete it
    if (variant.id) {
      if (!confirm(`Are you sure you want to delete the ${variant.color} variant?`)) {
        return
      }
      
      try {
        // Delete from database via API
        const response = await fetch(`/api/admin/variants/${variant.id}`, {
          method: 'DELETE'
        })
        
        if (!response.ok) {
          throw new Error('Failed to delete variant')
        }
        
        alert('Variant deleted successfully')
      } catch (error) {
        console.error('Error deleting variant:', error)
        alert('Failed to delete variant')
        return
      }
    }
    
    // Remove from local state
    setVariants(variants.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !sku || !priceCents || !stock) {
      alert('Please fill in all required fields')
      return
    }

    if (images.length === 0) {
      alert('Please add at least one product image')
      return
    }

    setSaving(true)

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          description: description || null,
          sku,
          priceCents: Math.round(parseFloat(priceCents) * 100),
          stock: parseInt(stock),
          category,
          images,
          variants: variants.length > 0 ? variants : undefined
        })
      })

      if (response.ok) {
        alert('Product updated successfully!')
        router.push('/admin/products')
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to update product')
      }
    } catch (error) {
      console.error('Error updating product:', error)
      alert('Failed to update product')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/admin/products" className="text-sm text-blue-600 hover:text-blue-800 mb-2 inline-block">
            ← Back to Products
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-600 mt-1">Update product details and variants</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-8">
              {/* Basic Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="essence">Essence Collection</option>
                  <option value="fragment">Fragment Collection</option>
                  <option value="recode">Recode Collection</option>
                  <option value="sweatshirts">Sweatshirts (Generic)</option>
                  <option value="hoodies">Hoodies</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SKU *
                  </label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={priceCents}
                    onChange={(e) => setPriceCents(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
              </div>
            </div>

            {/* Product Images */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b">Product Images *</h2>
              
              <ImageGallery
                images={images}
                onImagesChange={setImages}
                label=""
              />
            </div>

            {/* Variants */}
            <div>
              <div className="flex items-center justify-between mb-4 pb-2 border-b">
                <h2 className="text-xl font-semibold text-gray-900">Variants (Colors)</h2>
                <button
                  type="button"
                  onClick={() => setShowVariantForm(!showVariantForm)}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                >
                  {showVariantForm ? 'Cancel' : '+ Add Variant'}
                </button>
              </div>

              {showVariantForm && (
                <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg space-y-5 mb-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Color Name *
                      </label>
                      <input
                        type="text"
                        value={variantColor}
                        onChange={(e) => setVariantColor(e.target.value)}
                        placeholder="e.g., Black, Navy"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Size
                      </label>
                      <select
                        value={variantSize}
                        onChange={(e) => setVariantSize(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">Select size...</option>
                        <option value="One Size">One Size</option>
                        <option value="XS">XS</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                        <option value="XXL">XXL</option>
                        <option value="XXXL">XXXL</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Variant SKU *
                      </label>
                      <input
                        type="text"
                        value={variantSku}
                        onChange={(e) => setVariantSku(e.target.value)}
                        placeholder="e.g., TK-SLIM-004-BLK"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price (USD) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={variantPrice}
                        onChange={(e) => setVariantPrice(e.target.value)}
                        placeholder="0.00"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stock *
                      </label>
                      <input
                        type="number"
                        value={variantStock}
                        onChange={(e) => setVariantStock(e.target.value)}
                        placeholder="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  {/* Variant Images */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Variant Images (Optional)
                    </label>
                    
                    {/* Image Gallery */}
                    {variantImages.length > 0 && (
                      <div className="grid grid-cols-4 gap-3 mb-3">
                        {variantImages.map((url, index) => (
                          <div key={index} className="relative group">
                            <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                              <img
                                src={url}
                                alt={`Variant ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeVariantImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Upload Component */}
                    <ImageUpload
                      onUpload={handleVariantImageUpload}
                      label=""
                    />
                  </div>

                  <button
                    type="button"
                    onClick={addVariant}
                    className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors"
                  >
                    Add Variant
                  </button>
                </div>
              )}

              {variants.length > 0 && (
                <div className="space-y-3">
                  {variants.map((variant, index) => (
                    <div key={index} className="flex items-start justify-between p-5 bg-white border-2 border-gray-200 rounded-lg hover:border-orange-200 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900 text-lg">{variant.color}</h3>
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded font-medium">
                            {variant.sku}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <span className="flex items-center gap-1">
                            <span className="font-medium text-gray-900">${(variant.priceCents / 100).toFixed(2)}</span>
                          </span>
                          <span>•</span>
                          <span>Stock: <span className="font-medium text-gray-900">{variant.stock}</span></span>
                        </div>
                        {variant.images && variant.images.length > 0 && (
                          <div className="flex gap-2">
                            {variant.images.slice(0, 4).map((img, imgIdx) => (
                              <div key={imgIdx} className="w-12 h-12 rounded border border-gray-200 overflow-hidden">
                                <img src={img} alt="" className="w-full h-full object-cover" />
                              </div>
                            ))}
                            {variant.images.length > 4 && (
                              <div className="w-12 h-12 rounded border border-gray-200 bg-gray-100 flex items-center justify-center text-xs text-gray-600">
                                +{variant.images.length - 4}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="ml-4 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex space-x-4 pt-4 border-t">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? 'Saving Changes...' : 'Save Changes'}
              </button>
              <Link
                href="/admin/products"
                className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>

        {/* Right Column - Preview & Info */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            {/* Product Preview */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Preview</h3>
              
              {/* Preview Image */}
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                {images.length > 0 ? (
                  <img
                    src={images[0]}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Preview Info */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">
                  {title || 'Product Title'}
                </h4>
                <p className="text-2xl font-bold text-gray-900">
                  ${priceCents ? parseFloat(priceCents).toFixed(2) : '0.00'}
                </p>
                {variants.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {variants.map((v, idx) => (
                      <div
                        key={idx}
                        className="px-3 py-1 border border-gray-300 rounded text-xs font-medium"
                      >
                        {v.color}
                      </div>
                    ))}
                  </div>
                )}
                {description && (
                  <p className="text-sm text-gray-600 mt-3 line-clamp-3">
                    {description}
                  </p>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Images</span>
                  <span className="font-medium text-gray-900">{images.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Variants</span>
                  <span className="font-medium text-gray-900">{variants.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Stock</span>
                  <span className="font-medium text-gray-900">
                    {parseInt(stock || '0') + variants.reduce((acc, v) => acc + v.stock, 0)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">SKU</span>
                  <span className="font-medium text-gray-900">{sku || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Help Text */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 Tips</h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• First image is the primary image</li>
                <li>• Use high-quality images (min 800px)</li>
                <li>• Add variants for different colors</li>
                <li>• Fill all required fields (*)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
    </div>
  )
}


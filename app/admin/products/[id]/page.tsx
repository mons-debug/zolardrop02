'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface Variant {
  id?: string
  color: string
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
  const [images, setImages] = useState<string[]>([])
  
  // Variants
  const [variants, setVariants] = useState<Variant[]>([])
  const [showVariantForm, setShowVariantForm] = useState(false)
  const [variantColor, setVariantColor] = useState('')
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

  const handleImageUpload = async (files: FileList | null, isVariant: boolean = false) => {
    if (!files || files.length === 0) return

    setUploadingImages(true)
    const uploadedUrls: string[] = []

    try {
      for (let i = 0; i < files.length; i++) {
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: files[i].name })
        })

        if (response.ok) {
          const data = await response.json()
          uploadedUrls.push(data.url)
        }
      }

      if (isVariant) {
        setVariantImages([...variantImages, ...uploadedUrls])
      } else {
        setImages([...images, ...uploadedUrls])
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload images')
    } finally {
      setUploadingImages(false)
    }
  }

  const removeImage = (index: number, isVariant: boolean = false) => {
    if (isVariant) {
      setVariantImages(variantImages.filter((_, i) => i !== index))
    } else {
      setImages(images.filter((_, i) => i !== index))
    }
  }

  const addVariant = () => {
    if (!variantColor || !variantSku || !variantPrice || !variantStock) {
      alert('Please fill in all variant fields')
      return
    }

    const newVariant: Variant = {
      color: variantColor,
      sku: variantSku,
      priceCents: Math.round(parseFloat(variantPrice) * 100),
      stock: parseInt(variantStock),
      images: variantImages
    }

    setVariants([...variants, newVariant])
    
    // Reset variant form
    setVariantColor('')
    setVariantSku('')
    setVariantPrice('')
    setVariantStock('')
    setVariantImages([])
    setShowVariantForm(false)
  }

  const removeVariant = (index: number) => {
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
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}`
        },
        body: JSON.stringify({
          title,
          description: description || null,
          sku,
          priceCents: Math.round(parseFloat(priceCents) * 100),
          stock: parseInt(stock),
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
      <main className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
            
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
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Images *</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Images
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImageUpload(e.target.files)}
                  disabled={uploadingImages}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-4 gap-4">
                  {images.map((url, index) => (
                    <div key={index} className="relative group">
                      <div className="relative h-24 w-full rounded-lg overflow-hidden border-2 border-gray-200">
                        <Image
                          src={url}
                          alt={`Product image ${index + 1}`}
                          fill
                          sizes="150px"
                          className="object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Variants */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Variants (Colors)</h2>
              <button
                type="button"
                onClick={() => setShowVariantForm(!showVariantForm)}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                {showVariantForm ? 'Cancel' : '+ Add Variant'}
              </button>
            </div>

            {showVariantForm && (
              <div className="bg-gray-50 p-6 rounded-lg space-y-4 mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color Name
                    </label>
                    <input
                      type="text"
                      value={variantColor}
                      onChange={(e) => setVariantColor(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Variant SKU
                    </label>
                    <input
                      type="text"
                      value={variantSku}
                      onChange={(e) => setVariantSku(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (USD)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={variantPrice}
                      onChange={(e) => setVariantPrice(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock
                    </label>
                    <input
                      type="number"
                      value={variantStock}
                      onChange={(e) => setVariantStock(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Variant Images (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleImageUpload(e.target.files, true)}
                    disabled={uploadingImages}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                {variantImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-4">
                    {variantImages.map((url, index) => (
                      <div key={index} className="relative group">
                        <div className="relative h-20 w-full rounded-lg overflow-hidden border-2 border-gray-200">
                          <Image
                            src={url}
                            alt={`Variant image ${index + 1}`}
                            fill
                            sizes="100px"
                            className="object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index, true)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={addVariant}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Add Variant
                </button>
              </div>
            )}

            {variants.length > 0 && (
              <div className="space-y-3">
                {variants.map((variant, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{variant.color}</p>
                      <p className="text-sm text-gray-600">
                        SKU: {variant.sku} • ${(variant.priceCents / 100).toFixed(2)} • Stock: {variant.stock}
                      </p>
                      {variant.images && variant.images.length > 0 && (
                        <p className="text-xs text-gray-500">{variant.images.length} images</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={saving || uploadingImages}
              className="flex-1 bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? 'Saving Changes...' : 'Save Changes'}
            </button>
            <Link
              href="/admin/products"
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  )
}


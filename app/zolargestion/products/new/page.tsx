'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import ImageGallery from '@/components/admin/ImageGallery'
import ImageUpload from '@/components/admin/ImageUpload'

interface Variant {
  color: string
  size?: string
  sku: string
  priceCents: number
  stock: number
  images: string[]
  sizeInventory?: string
  description?: string
  showAsProduct?: boolean
}

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  
  // Product fields
  const [title, setTitle] = useState('')
  const [color, setColor] = useState('')
  const [description, setDescription] = useState('')
  const [sku, setSku] = useState('')
  const [priceCents, setPriceCents] = useState('')
  const [stock, setStock] = useState('')
  const [sizeInventory, setSizeInventory] = useState('')
  const [sizeGuide, setSizeGuide] = useState('')
  const [category, setCategory] = useState('sweatshirts')
  const [images, setImages] = useState<string[]>([])
  
  // Variants
  const [variants, setVariants] = useState<Variant[]>([])
  const [showVariantForm, setShowVariantForm] = useState(false)
  const [variantColor, setVariantColor] = useState('')
  const [variantSku, setVariantSku] = useState('')
  const [variantPrice, setVariantPrice] = useState('')
  const [variantStock, setVariantStock] = useState('')
  const [variantImages, setVariantImages] = useState<string[]>([])
  const [variantSizeInventory, setVariantSizeInventory] = useState('')
  const [variantDescription, setVariantDescription] = useState('')
  const [variantShowAsProduct, setVariantShowAsProduct] = useState(false)

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
      sku: variantSku,
      priceCents: Math.round(parseFloat(variantPrice) * 100),
      stock: parseInt(variantStock),
      images: variantImages,
      sizeInventory: variantSizeInventory || undefined,
      description: variantDescription || undefined,
      showAsProduct: variantShowAsProduct
    }

    setVariants([...variants, newVariant])
    
    // Reset variant form
    setVariantColor('')
    setVariantSku('')
    setVariantPrice('')
    setVariantStock('')
    setVariantImages([])
    setVariantSizeInventory('')
    setVariantDescription('')
    setVariantShowAsProduct(false)
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

    setLoading(true)

    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          color: color || null,
          description: description || null,
          sku,
          priceCents: Math.round(parseFloat(priceCents) * 100),
          stock: parseInt(stock),
          sizeInventory: sizeInventory || null,
          sizeGuide: sizeGuide || null,
          category,
          images,
          variants: variants.length > 0 ? variants : undefined
        })
      })

      if (response.ok) {
        alert('Product created successfully!')
        router.push('/zolargestion/products')
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to create product')
      }
    } catch (error) {
      console.error('Error creating product:', error)
      alert('Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/zolargestion/products" className="text-sm text-blue-600 hover:text-blue-800 mb-2 inline-block">
            ? Back to Products
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-600 mt-1">Create a new product with variants</p>
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
                  placeholder="e.g., Classic Cotton T-Shirt"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Color (Optional)
                </label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="e.g., Black, Navy, Multicolor"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Main color for this product (variants can have different colors)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <div className="space-y-2">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={12}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black font-mono text-sm"
                    placeholder="Enter product description with formatting..."
                  />
                  <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded border border-gray-200">
                    <p className="font-semibold mb-2">Formatting Guide:</p>
                    <ul className="space-y-1 ml-4">
                      <li>• <span className="font-mono bg-white px-1">**Bold Text**</span> for bold</li>
                      <li>• <span className="font-mono bg-white px-1"># Headline</span> for large headlines</li>
                      <li>• <span className="font-mono bg-white px-1">## Sub-headline</span> for sub-headlines</li>
                      <li>• <span className="font-mono bg-white px-1">• Item</span> for bullet points</li>
                      <li>• Press Enter twice for new paragraphs</li>
                      <li>• Single Enter creates line breaks</li>
                    </ul>
                  </div>
                  {description && (
                    <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-white">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Preview:</p>
                      <div className="prose prose-sm max-w-none">
                        {description.split('\n').map((line, idx) => {
                          // Headline
                          if (line.startsWith('# ')) {
                            return <h2 key={idx} className="text-xl font-bold mt-4 mb-2">{line.replace('# ', '')}</h2>
                          }
                          // Sub-headline
                          if (line.startsWith('## ')) {
                            return <h3 key={idx} className="text-lg font-semibold mt-3 mb-2">{line.replace('## ', '')}</h3>
                          }
                          // Bullet point
                          if (line.startsWith('• ') || line.startsWith('- ')) {
                            return <li key={idx} className="ml-4">{line.replace(/^[•-] /, '')}</li>
                          }
                          // Bold text
                          if (line.includes('**')) {
                            const parts = line.split('**')
                            return (
                              <p key={idx} className="mb-2">
                                {parts.map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part)}
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
                  )}
                </div>
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
                    placeholder="e.g., PROD-001"
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
                    placeholder="29.99"
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
                  placeholder="100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size Inventory (Optional)
                </label>
                <input
                  type="text"
                  value={sizeInventory}
                  onChange={(e) => setSizeInventory(e.target.value)}
                  placeholder="e.g. M=25, L=15, S=10, XL=5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter sizes and quantities separated by commas
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Size Guide / Measurements (Optional)
                </label>
                <div className="space-y-2">
                  <textarea
                    value={sizeGuide}
                    onChange={(e) => setSizeGuide(e.target.value)}
                    rows={8}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black font-mono text-sm"
                    placeholder="S | 50 | 68 | 19&#10;M | 52 | 70 | 20&#10;L | 54 | 72 | 21&#10;XL | 56 | 74 | 22"
                  />
                  <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded border border-gray-200">
                    <p className="font-semibold mb-2">?? Format: Size | Chest | Length | Shoulder</p>
                    <p className="mb-2">Enter one size per line, values separated by | (pipe)</p>
                    <code className="block bg-white px-2 py-1 rounded mb-2">
                      S | 50 | 68 | 19<br/>
                      M | 52 | 70 | 20<br/>
                      L | 54 | 72 | 21<br/>
                      XL | 56 | 74 | 22
                    </code>
                    <p className="text-xs">Measurements in cm: Chest Width | Length | Shoulder Width</p>
                  </div>
                </div>
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
                  <div className="grid grid-cols-2 gap-4">
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
                        Variant SKU *
                      </label>
                      <input
                        type="text"
                        value={variantSku}
                        onChange={(e) => setVariantSku(e.target.value)}
                        placeholder="e.g., PROD-001-BLK"
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
                        placeholder="29.99"
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
                        placeholder="25"
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

                  {/* Size Inventory */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Size Inventory (Optional)
                    </label>
                    <input
                      type="text"
                      value={variantSizeInventory}
                      onChange={(e) => setVariantSizeInventory(e.target.value)}
                      placeholder="e.g. M=25, L=15, S=10, XL=5"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Enter sizes and quantities for this variant
                    </p>
                  </div>

                  {/* Variant Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Variant Description (Optional)
                    </label>
                    <textarea
                      value={variantDescription}
                      onChange={(e) => setVariantDescription(e.target.value)}
                      placeholder="Unique description for this variant"
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  {/* Show as Product Checkbox */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="showAsProduct"
                      checked={variantShowAsProduct}
                      onChange={(e) => setVariantShowAsProduct(e.target.checked)}
                      className="h-4 w-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500"
                    />
                    <label htmlFor="showAsProduct" className="text-sm font-medium text-gray-700">
                      Show as separate product in shop
                    </label>
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
                disabled={loading}
                className="flex-1 bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Creating Product...' : 'Create Product'}
              </button>
              <Link
                href="/zolargestion/products"
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
              <h4 className="text-sm font-semibold text-blue-900 mb-2">?? Tips</h4>
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


'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ImageGallery from '@/components/admin/ImageGallery'

interface Variant {
    color: string
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
    const [saving, setSaving] = useState(false)

    // Product fields
    const [title, setTitle] = useState('')
    const [color, setColor] = useState('')
    const [description, setDescription] = useState('')
    const [sku, setSku] = useState('')
    const [priceCents, setPriceCents] = useState('')
    const [stock, setStock] = useState('')
    const [sizeInventory, setSizeInventory] = useState('')
    const [sizeGuide, setSizeGuide] = useState('')
    const [category, setCategory] = useState('')
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

    const addVariant = () => {
        if (!variantColor || !variantSku || !variantPrice || !variantStock) {
            alert('Please fill in all variant fields')
            return
        }

        const variantData: Variant = {
            color: variantColor,
            sku: variantSku,
            priceCents: Math.round(parseFloat(variantPrice) * 100),
            stock: parseInt(variantStock),
            images: variantImages,
            sizeInventory: variantSizeInventory || undefined
        }

        setVariants([...variants, variantData])
        setVariantColor('')
        setVariantSku('')
        setVariantPrice('')
        setVariantStock('')
        setVariantImages([])
        setVariantSizeInventory('')
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
            const response = await fetch('/api/admin/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
            setSaving(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <Link href="/zolargestion/products" className="text-sm text-blue-600 hover:text-blue-800 mb-2 inline-block">
                        Back to Products
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Create New Product</h1>
                    <p className="text-gray-600 mt-1">Add a new product to your catalog</p>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-8">
                            {/* Basic Information */}
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b">Basic Information</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Title *</label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Color (Optional)</label>
                                        <input
                                            type="text"
                                            value={color}
                                            onChange={(e) => setColor(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                            placeholder="e.g., Black, Navy, Multicolor"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            rows={6}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                            placeholder="Enter product description..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
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
                                            <option value="genesis">Genesis Collection</option>
                                            <option value="sweatshirts">Sweatshirts</option>
                                            <option value="hoodies">Hoodies</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">SKU *</label>
                                            <input
                                                type="text"
                                                value={sku}
                                                onChange={(e) => setSku(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Price (USD) *</label>
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
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity *</label>
                                        <input
                                            type="number"
                                            value={stock}
                                            onChange={(e) => setStock(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Size Inventory (Optional)</label>
                                        <input
                                            type="text"
                                            value={sizeInventory}
                                            onChange={(e) => setSizeInventory(e.target.value)}
                                            placeholder="e.g. M=25, L=15, S=10, XL=5"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Size Guide (Optional)</label>
                                        <textarea
                                            value={sizeGuide}
                                            onChange={(e) => setSizeGuide(e.target.value)}
                                            rows={4}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black font-mono text-sm"
                                            placeholder="S | 50 | 68 | 19&#10;M | 52 | 70 | 20"
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
                                    <h2 className="text-xl font-semibold text-gray-900">Variants (Optional)</h2>
                                    <button
                                        type="button"
                                        onClick={() => setShowVariantForm(!showVariantForm)}
                                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                                    >
                                        {showVariantForm ? 'Cancel' : '+ Add Variant'}
                                    </button>
                                </div>

                                {showVariantForm && (
                                    <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg space-y-4 mb-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Color Name *</label>
                                                <input
                                                    type="text"
                                                    value={variantColor}
                                                    onChange={(e) => setVariantColor(e.target.value)}
                                                    placeholder="e.g., Black"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Variant SKU *</label>
                                                <input
                                                    type="text"
                                                    value={variantSku}
                                                    onChange={(e) => setVariantSku(e.target.value)}
                                                    placeholder="e.g., PROD-BLK"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Price (USD) *</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={variantPrice}
                                                    onChange={(e) => setVariantPrice(e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Stock *</label>
                                                <input
                                                    type="number"
                                                    value={variantStock}
                                                    onChange={(e) => setVariantStock(e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Variant Images</label>
                                            <ImageGallery images={variantImages} onImagesChange={setVariantImages} label="" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Size Inventory</label>
                                            <input
                                                type="text"
                                                value={variantSizeInventory}
                                                onChange={(e) => setVariantSizeInventory(e.target.value)}
                                                placeholder="e.g. M=25, L=15"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={addVariant}
                                            className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
                                        >
                                            Add Variant
                                        </button>
                                    </div>
                                )}

                                {variants.length > 0 && (
                                    <div className="space-y-3">
                                        {variants.map((variant, index) => (
                                            <div key={index} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                                                <div>
                                                    <span className="font-semibold">{variant.color}</span>
                                                    <span className="text-gray-500 ml-2">({variant.sku})</span>
                                                    <span className="text-gray-500 ml-4">${(variant.priceCents / 100).toFixed(2)}</span>
                                                    <span className="text-gray-500 ml-4">Stock: {variant.stock}</span>
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

                            {/* Submit */}
                            <div className="flex space-x-4 pt-4 border-t">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                                >
                                    {saving ? 'Creating Product...' : 'Create Product'}
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

                    {/* Preview */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Preview</h3>
                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                                {images.length > 0 ? (
                                    <img src={images[0]} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <h4 className="font-medium text-gray-900">{title || 'Product Title'}</h4>
                            <p className="text-lg font-semibold text-gray-900 mt-1">
                                {priceCents ? `$${parseFloat(priceCents).toFixed(2)}` : '$0.00'}
                            </p>
                            {variants.length > 0 && (
                                <p className="text-sm text-gray-500 mt-2">{variants.length} variant(s)</p>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

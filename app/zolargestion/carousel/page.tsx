'use client'

import { useEffect, useState } from 'react'
import ImageUpload from '@/components/admin/ImageUpload'

interface CarouselImage {
  id?: string
  url: string
  alt: string
  size: 'small' | 'medium' | 'large'
  linkUrl?: string  // Optional product/page link
  order: number
  isActive: boolean
}

export default function FashionCarouselManagementPage() {
  const [images, setImages] = useState<CarouselImage[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/admin/fashion-carousel')

      if (response.ok) {
        const data = await response.json()
        setImages(data.images || [])
      }
    } catch (error) {
      console.error('Error fetching fashion carousel:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddImage = () => {
    const newImage: CarouselImage = {
      url: '',
      alt: `Fashion Image ${images.length + 1}`,
      size: 'medium',
      linkUrl: '',  // Empty by default - won't be clickable
      order: images.length,
      isActive: true
    }
    setImages([...images, newImage])
  }

  const handleImageChange = (index: number, field: keyof CarouselImage, value: any) => {
    const updated = [...images]
    updated[index] = { ...updated[index], [field]: value }
    setImages(updated)
  }

  const handleSaveImage = async (index: number) => {
    const image = images[index]
    if (!image.url.trim()) {
      alert('Image URL is required')
      return
    }

    try {
      setSaving(true)
      const method = image.id ? 'PUT' : 'POST'
      const response = await fetch('/api/admin/fashion-carousel', {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(image)
      })

      if (response.ok) {
        const data = await response.json()
        const updated = [...images]
        updated[index] = data.image
        setImages(updated)
        setEditingId(null)
        alert('Image saved successfully!')
      } else {
        alert('Failed to save image')
      }
    } catch (error) {
      console.error('Error saving image:', error)
      alert('Error saving image')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteImage = async (index: number) => {
    const image = images[index]
    if (!image.id) {
      // Just remove from array if not saved yet
      setImages(images.filter((_, i) => i !== index))
      return
    }

    if (!confirm('Are you sure you want to delete this image?')) {
      return
    }

    try {
      setSaving(true)
      const response = await fetch(`/api/admin/fashion-carousel?id=${image.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setImages(images.filter((_, i) => i !== index))
        alert('Image deleted successfully!')
      } else {
        alert('Failed to delete image')
      }
    } catch (error) {
      console.error('Error deleting image:', error)
      alert('Error deleting image')
    } finally {
      setSaving(false)
    }
  }

  const moveImage = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === images.length - 1)
    ) {
      return
    }

    const newImages = [...images]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
      ;[newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]]

    // Update order values
    newImages.forEach((img, i) => {
      img.order = i
    })

    setImages(newImages)
  }

  const getSizeLabel = (size: string) => {
    switch (size) {
      case 'small': return 'Horizontal (Wide)'
      case 'medium': return 'Square'
      case 'large': return 'Tall (Vertical)'
      default: return size
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Style in Motion</h1>
              <p className="text-gray-600 mt-1">Manage the images displayed in the "Style in Motion" gallery on the homepage</p>
            </div>
            <button
              onClick={handleAddImage}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              + Add Image
            </button>
          </div>
        </div>
      </header>

      <main className="p-8">
        {/* Images List */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Gallery Images</h2>
            <p className="text-sm text-gray-600">
              These images will appear in the "Style in Motion" gallery section on the homepage.
              The first 3 active images will be displayed in a grid layout.
            </p>
          </div>

          <div className="space-y-4">
            {images.map((image, index) => (
              <div
                key={image.id || index}
                className={`border-2 rounded-lg p-5 ${image.isActive ? 'border-gray-200 bg-white' : 'border-gray-300 bg-gray-50'
                  }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => moveImage(index, 'up')}
                        disabled={index === 0}
                        className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                        title="Move up"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => moveImage(index, 'down')}
                        disabled={index === images.length - 1}
                        className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                        title="Move down"
                      >
                        ▼
                      </button>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Image #{index + 1}</h3>
                      <p className="text-xs text-gray-500">
                        {image.id ? `ID: ${image.id.slice(0, 8)}...` : 'Not saved yet'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={image.isActive}
                        onChange={(e) => handleImageChange(index, 'isActive', e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-gray-700">Active</span>
                    </label>
                    <button
                      onClick={() => handleDeleteImage(index)}
                      className="px-3 py-1 text-red-600 hover:bg-red-50 rounded text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <ImageUpload
                      label="Image *"
                      currentImage={image.url}
                      onUpload={(url) => handleImageChange(index, 'url', url)}
                      onDelete={() => handleImageChange(index, 'url', '')}
                    />
                    {!image.url && (
                      <p className="text-xs text-gray-500 mt-1">
                        Or paste URL:
                        <input
                          type="url"
                          value={image.url}
                          onChange={(e) => handleImageChange(index, 'url', e.target.value)}
                          className="ml-2 px-2 py-1 border border-gray-300 rounded text-xs"
                          placeholder="https://images.unsplash.com/..."
                        />
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Size *
                    </label>
                    <select
                      value={image.size}
                      onChange={(e) => handleImageChange(index, 'size', e.target.value as 'small' | 'medium' | 'large')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    >
                      <option value="large">Tall (Vertical)</option>
                      <option value="medium">Square</option>
                      <option value="small">Horizontal (Wide)</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      {getSizeLabel(image.size)}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alt Text (Description)
                  </label>
                  <input
                    type="text"
                    value={image.alt}
                    onChange={(e) => handleImageChange(index, 'alt', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    placeholder="Editorial Fashion, Luxury Accessories, etc."
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Link URL <span className="text-gray-400 font-normal">(optional - leave empty for no link)</span>
                  </label>
                  <input
                    type="text"
                    value={image.linkUrl || ''}
                    onChange={(e) => handleImageChange(index, 'linkUrl', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    placeholder="/products or /product/SKU-001 or https://..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    If empty, the image won't be clickable. Add a URL to make it link to a product or page.
                  </p>
                </div>

                {/* Image Preview */}
                {image.url && (
                  <div className="flex items-start gap-4">
                    <div className={`relative border border-gray-200 rounded overflow-hidden ${image.size === 'large' ? 'w-32 h-48' :
                      image.size === 'medium' ? 'w-32 h-32' :
                        'w-48 h-32'
                      }`}>
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x500?text=Invalid+URL'
                        }}
                      />
                    </div>
                    <button
                      onClick={() => handleSaveImage(index)}
                      disabled={saving}
                      className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 text-sm font-medium"
                    >
                      {saving ? 'Saving...' : (image.id ? 'Update' : 'Save')}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {images.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500 mb-4">No carousel images yet</p>
              <button
                onClick={handleAddImage}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Add First Image
              </button>
            </div>
          )}
        </div>

        {/* Preview Section */}
        {images.filter(img => img.url && img.isActive).length > 0 && (
          <div className="mt-8 bg-gradient-to-b from-gray-50 via-white to-gray-50 rounded-lg shadow border border-gray-200 p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Gallery Preview</h2>

            <div className="overflow-hidden">
              <div className="flex gap-6 items-center">
                {images.filter(img => img.url && img.isActive).slice(0, 6).map((image, index) => {
                  const sizeClasses =
                    image.size === 'large' ? 'h-96 w-64' :
                      image.size === 'medium' ? 'h-72 w-56' :
                        'h-56 w-80'

                  return (
                    <div
                      key={index}
                      className={`relative flex-shrink-0 ${sizeClasses} rounded overflow-hidden border-2 border-gray-200 shadow-lg`}
                    >
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                        {image.size}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <p className="text-sm text-gray-600 mt-4 text-center">
              This is how your images will appear in the gallery. The first 3 active images are shown on the homepage.
            </p>
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">💡 Tips for Best Results</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• <strong>Mix sizes:</strong> Alternate between Tall, Square, and Horizontal images for visual variety</li>
            <li>• <strong>Image quality:</strong> Use high-resolution images (at least 800px on the shortest side)</li>
            <li>• <strong>Order matters:</strong> Use the up/down arrows to reorder images. They'll scroll in this order.</li>
            <li>• <strong>Active/Inactive:</strong> Uncheck "Active" to temporarily hide an image without deleting it</li>
            <li>• <strong>Save individually:</strong> Each image must be saved separately after editing</li>
          </ul>
        </div>
      </main>
    </div>
  )
}


'use client'

import { useEffect, useState } from 'react'
import ImageUpload from '@/components/admin/ImageUpload'

interface ArchiveImage {
  url: string
  alt: string
}

export default function ArchiveManagementPage() {
  const [images, setImages] = useState<ArchiveImage[]>([
    { url: '', alt: 'Borderline Product 1' },
    { url: '', alt: 'Borderline Product 2' }
  ])
  const [title, setTitle] = useState('BORDERLINE')
  const [subtitle, setSubtitle] = useState('DROP 01')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchArchive()
  }, [])

  const fetchArchive = async () => {
    try {
      const response = await fetch('/api/admin/archive-collection', {
        headers: {
          'Authorization': 'Bearer admin-token-123'
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.archive) {
          const parsedImages = JSON.parse(data.archive.images)
          setImages(parsedImages)
          setTitle(data.archive.title)
          setSubtitle(data.archive.subtitle)
        }
      }
    } catch (error) {
      console.error('Error fetching archive:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (index: number, field: 'url' | 'alt', value: string) => {
    const updated = [...images]
    updated[index] = { ...updated[index], [field]: value }
    setImages(updated)
  }

  const addImage = () => {
    setImages([...images, { url: '', alt: `Borderline Product ${images.length + 1}` }])
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      
      // Filter out empty images
      const validImages = images.filter(img => img.url.trim() !== '')

      const response = await fetch('/api/admin/archive-collection', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer admin-token-123',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          images: validImages,
          title,
          subtitle
        })
      })

      if (response.ok) {
        alert('Archive collection updated successfully!')
      } else {
        alert('Failed to update archive collection')
      }
    } catch (error) {
      console.error('Error saving archive:', error)
      alert('Error saving archive collection')
    } finally {
      setSaving(false)
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
              <h1 className="text-3xl font-bold text-gray-900">Archive Collection</h1>
              <p className="text-gray-600 mt-1">Manage Drop 01 "Borderline" images and content</p>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-gray-400 font-medium"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </header>

      <main className="p-8">
        {/* Collection Title & Subtitle */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Collection Details</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Collection Title (e.g., BORDERLINE)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="BORDERLINE"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Drop Label (e.g., DROP 01)
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="DROP 01"
              />
            </div>
          </div>
        </div>

        {/* Archive Images */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Archive Images</h2>
            <button
              onClick={addImage}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
            >
              + Add Image
            </button>
          </div>

          <p className="text-sm text-gray-600 mb-6">
            These images will appear in the "Archive Collection" section on the homepage.
            Upload images showing your previous Drop 01 Borderline collection.
          </p>

          <div className="space-y-4">
            {images.map((image, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">Image {index + 1}</h3>
                  {images.length > 1 && (
                    <button
                      onClick={() => removeImage(index)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <ImageUpload
                      label={`Image ${index + 1} URL *`}
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
                          className="ml-2 px-2 py-1 border border-gray-300 rounded text-xs w-full mt-1"
                          placeholder="https://example.com/image.jpg"
                        />
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alt Text
                    </label>
                    <input
                      type="text"
                      value={image.alt}
                      onChange={(e) => handleImageChange(index, 'alt', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
                      placeholder="Description of the image"
                    />
                  </div>
                </div>

                {/* Image Preview */}
                {image.url && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-2">Preview:</p>
                    <div className="relative aspect-[3/4] max-w-xs border border-gray-200 rounded overflow-hidden">
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x500?text=Image+Not+Found'
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {images.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">No images added yet</p>
              <button
                onClick={addImage}
                className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
              >
                Add First Image
              </button>
            </div>
          )}
        </div>

        {/* Preview Section */}
        <div className="mt-8 bg-black rounded-lg shadow border-2 border-emerald-500/30 p-8">
          <h2 className="text-lg font-semibold text-white mb-6">Live Preview</h2>
          
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="h-px w-12 bg-gray-600" />
              <span className="text-xs uppercase tracking-[0.3em] text-gray-400">
                MOROCCO · 2024
              </span>
              <div className="h-px w-12 bg-gray-600" />
            </div>

            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-3">
              WELCOME TO ZOLAR
            </h2>

            <div className="inline-flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-gray-600" />
              <span className="text-xs uppercase tracking-widest text-gray-400">{subtitle}</span>
              <div className="h-px w-8 bg-gray-600" />
            </div>

            <h1 
              className="text-5xl md:text-7xl font-black tracking-tight mb-4"
              style={{ 
                color: '#10b981',
                textShadow: '0 0 30px rgba(16, 185, 129, 0.3)'
              }}
            >
              {title}
            </h1>

            <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">
              PREMIUM STREETWEAR DESIGNED FOR THOSE WHO STAND OUT.
            </p>

            <p className="text-sm font-light mb-6" style={{ color: '#06b6d4' }}>
              FROM MOROCCO TO THE WORLD
            </p>

            <div className="inline-block px-6 py-2 border-2 border-red-500/50 bg-red-500/10 text-xs uppercase tracking-widest text-red-400">
              ✕ SOLD OUT
            </div>
          </div>

          {/* Image Preview */}
          {images.filter(img => img.url).length > 0 && (
            <div className="grid grid-cols-2 gap-4 mt-8 max-w-2xl mx-auto">
              {images.filter(img => img.url).slice(0, 2).map((image, index) => (
                <div key={index} className="relative aspect-[3/4] border-2 border-emerald-500/30 rounded overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}


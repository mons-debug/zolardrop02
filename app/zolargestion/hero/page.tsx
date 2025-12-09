'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface HeroSlide {
  id: string
  title: string
  subtitle: string | null
  mediaUrl: string
  mediaType: 'image' | 'video'
  linkUrl: string | null
  backgroundColor: string
  textColor: string
  accentColor: string
  duration: number
  order: number
  isActive: boolean
}

export default function HeroManagementPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null)
  const formRef = useRef<HTMLDivElement>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    mediaUrl: '',
    mediaType: 'image' as 'image' | 'video',
    linkUrl: '',
    backgroundColor: '#000000',
    textColor: '#FFFFFF',
    accentColor: '#ff5b00',
    duration: 5000,
    order: 0,
    isActive: true
  })

  useEffect(() => {
    fetchSlides()
  }, [])

  const fetchSlides = async () => {
    try {
      const res = await fetch('/api/admin/hero-slides', {
        headers: { 'Authorization': 'Bearer admin-token-123' }
      })
      if (res.ok) {
        const data = await res.json()
        setSlides(data.slides || [])
      }
    } catch (error) {
      console.error('Error fetching slides:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB')
      e.target.value = ''
      return
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/quicktime']
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image (JPG, PNG, GIF, WebP) or video (MP4, MOV) file')
      e.target.value = ''
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    setUploading(true)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const data = await res.json()
      
      if (res.ok && data.url) {
        setFormData(prev => ({ ...prev, mediaUrl: data.url }))
        
        // Auto-detect media type from file
        if (file.type.startsWith('video/')) {
          setFormData(prev => ({ ...prev, mediaType: 'video' }))
        } else {
          setFormData(prev => ({ ...prev, mediaType: 'image' }))
        }
        
        console.log('Upload successful:', data.url)
      } else {
        const errorMsg = data.message || data.error || 'Upload failed'
        alert(`Upload failed: ${errorMsg}`)
        console.error('Upload failed:', data)
      }
    } catch (error) {
      console.error('Error uploading:', error)
      alert('Upload error: ' + (error instanceof Error ? error.message : 'Network error'))
    } finally {
      setUploading(false)
      e.target.value = '' // Reset file input
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const method = editingSlide ? 'PATCH' : 'POST'
      const body = editingSlide 
        ? { id: editingSlide.id, ...formData }
        : formData

      const res = await fetch('/api/admin/hero-slides', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin-token-123'
        },
        body: JSON.stringify(body)
      })

      if (res.ok) {
        await fetchSlides()
        resetForm()
        alert(editingSlide ? 'Slide updated!' : 'Slide added!')
      } else {
        const data = await res.json()
        alert(data.message || 'Error saving slide')
      }
    } catch (error) {
      console.error('Error saving slide:', error)
      alert('Error saving slide')
    }
  }

  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide(slide)
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle || '',
      mediaUrl: slide.mediaUrl,
      mediaType: slide.mediaType,
      linkUrl: slide.linkUrl || '',
      backgroundColor: slide.backgroundColor || '#000000',
      textColor: slide.textColor || '#FFFFFF',
      accentColor: slide.accentColor || '#ff5b00',
      duration: slide.duration || 5000,
      order: slide.order,
      isActive: slide.isActive
    })
    
    // Scroll to form with a slight delay to ensure state is updated
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        // Add a highlight effect
        formRef.current.classList.add('ring-4', 'ring-orange-300')
        setTimeout(() => {
          formRef.current?.classList.remove('ring-4', 'ring-orange-300')
        }, 2000)
      }
    }, 100)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this slide?')) return

    try {
      const res = await fetch(`/api/admin/hero-slides?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer admin-token-123' }
      })

      if (res.ok) {
        await fetchSlides()
        alert('Slide deleted!')
      } else {
        alert('Error deleting slide')
      }
    } catch (error) {
      console.error('Error deleting slide:', error)
      alert('Error deleting slide')
    }
  }

  const resetForm = () => {
    setEditingSlide(null)
    setFormData({
      title: '',
      subtitle: '',
      mediaUrl: '',
      mediaType: 'image',
      linkUrl: '',
      backgroundColor: '#000000',
      textColor: '#FFFFFF',
      accentColor: '#ff5b00',
      duration: 5000,
      order: 0,
      isActive: true
    })
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
            <p className="text-gray-600">Loading hero slides...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Hero Carousel Management</h1>
        <p className="text-gray-600">Manage hero slides with images or videos for your homepage</p>
      </div>

      {/* Add/Edit Form */}
      <motion.div
        ref={formRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 transition-all duration-300"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {editingSlide ? (
              <span className="flex items-center gap-2">
                <span>✏️ Editing Slide</span>
                <span className="text-sm font-normal text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                  {editingSlide.title}
                </span>
              </span>
            ) : (
              '➕ Add New Slide'
            )}
          </h2>
          {editingSlide && (
            <button
              type="button"
              onClick={resetForm}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Cancel Edit
            </button>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g., ESSENTIAL TEE"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subtitle
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g., DROP 02"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Media (Image or Video) *
            </label>
            <div className="flex gap-3">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              {uploading && <span className="text-orange-500">Uploading...</span>}
            </div>
            {formData.mediaUrl && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
                ✓ Media uploaded: {formData.mediaType}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Or Enter Media URL *
            </label>
            <input
              type="url"
              required
              value={formData.mediaUrl}
              onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Media Type
              </label>
              <select
                value={formData.mediaType}
                onChange={(e) => setFormData({ ...formData, mediaType: e.target.value as 'image' | 'video' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.isActive ? 'active' : 'inactive'}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'active' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link URL (Optional)
            </label>
            <input
              type="url"
              value={formData.linkUrl}
              onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="https://example.com/product"
            />
          </div>

          {/* Slide Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slide Duration (seconds)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="2"
                max="15"
                step="0.5"
                value={formData.duration / 1000}
                onChange={(e) => setFormData({ ...formData, duration: parseFloat(e.target.value) * 1000 })}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="2"
                  max="15"
                  step="0.5"
                  value={formData.duration / 1000}
                  onChange={(e) => setFormData({ ...formData, duration: parseFloat(e.target.value) * 1000 })}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center font-medium"
                />
                <span className="text-sm text-gray-600">sec</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">How long this slide displays before transitioning to the next (2-15 seconds)</p>
          </div>

          {/* Theme Colors Section */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Theme Colors</h3>
            <p className="text-sm text-gray-600 mb-4">Set the background and text colors for the left side of the hero section when this slide is active.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.backgroundColor}
                    onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                    className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.backgroundColor}
                    onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm"
                    placeholder="#000000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.textColor}
                    onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                    className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.textColor}
                    onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm"
                    placeholder="#FFFFFF"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Accent Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.accentColor}
                    onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                    className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.accentColor}
                    onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm"
                    placeholder="#ff5b00"
                  />
                </div>
              </div>
            </div>

            {/* Color Preview */}
            <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: formData.backgroundColor }}>
              <p className="text-sm font-medium mb-1" style={{ color: formData.textColor }}>
                Preview: This is how the hero section will look
              </p>
              <p className="text-xs" style={{ color: formData.accentColor }}>
                Accent color appears in gradients and highlights
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              {editingSlide ? 'Update Slide' : 'Add Slide'}
            </button>
            {editingSlide && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </motion.div>

      {/* Slides List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Current Slides ({slides.length})</h2>
        
        {slides.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p>No hero slides yet. Add your first slide above!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {slides.map((slide) => (
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`border rounded-lg overflow-hidden hover:shadow-lg transition-all ${
                  editingSlide?.id === slide.id 
                    ? 'border-orange-500 border-2 shadow-lg ring-2 ring-orange-200' 
                    : 'border-gray-200'
                }`}
              >
                <div className="relative aspect-video bg-gray-100">
                  {slide.mediaType === 'video' ? (
                    <video
                      src={slide.mediaUrl}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <Image
                      src={slide.mediaUrl}
                      alt={slide.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      slide.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {slide.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {/* Media Type Badge */}
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 text-xs font-medium rounded bg-black/70 text-white">
                      {slide.mediaType === 'video' ? '🎥 Video' : '🖼️ Image'}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{slide.title}</h3>
                      {slide.subtitle && (
                        <p className="text-sm text-gray-600">{slide.subtitle}</p>
                      )}
                    </div>
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                      #{slide.order}
                    </span>
                  </div>

                  {slide.linkUrl && (
                    <p className="text-xs text-blue-600 truncate mb-3">
                      🔗 {slide.linkUrl}
                    </p>
                  )}

                  {/* Duration and Color Theme Preview */}
                  <div className="mb-3 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">{(slide.duration / 1000).toFixed(1)}s</span>
                      <span className="text-gray-400">duration</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500">BG:</span>
                        <div 
                          className="w-6 h-6 rounded border border-gray-300" 
                          style={{ backgroundColor: slide.backgroundColor }}
                          title={slide.backgroundColor}
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500">Text:</span>
                        <div 
                          className="w-6 h-6 rounded border border-gray-300" 
                          style={{ backgroundColor: slide.textColor }}
                          title={slide.textColor}
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500">Accent:</span>
                        <div 
                          className="w-6 h-6 rounded border border-gray-300" 
                          style={{ backgroundColor: slide.accentColor }}
                          title={slide.accentColor}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(slide)}
                      disabled={editingSlide?.id === slide.id}
                      className={`flex-1 px-3 py-2 text-sm rounded transition-colors ${
                        editingSlide?.id === slide.id
                          ? 'bg-orange-500 text-white cursor-not-allowed'
                          : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                      }`}
                    >
                      {editingSlide?.id === slide.id ? '✏️ Editing...' : 'Edit'}
                    </button>
                    <button
                      onClick={() => handleDelete(slide.id)}
                      disabled={editingSlide?.id === slide.id}
                      className={`flex-1 px-3 py-2 text-sm rounded transition-colors ${
                        editingSlide?.id === slide.id
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


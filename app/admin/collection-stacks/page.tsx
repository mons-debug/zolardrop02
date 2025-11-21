'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface CollectionStack {
  id: string
  collectionName: string
  title: string
  description?: string
  images: string[]
  linkUrl?: string
  autoRotateDelay: number
  isActive: boolean
}

const COLLECTIONS = [
  { 
    name: 'ESSENCE', 
    title: 'ESSENCE', 
    defaultDescription: 'Simple. Clean. Easy to wear. Everyday essentials built for your rhythm.',
    defaultLinkUrl: '/products?collection=essence'
  },
  { 
    name: 'FRAGMENT', 
    title: 'FRAGMENT', 
    defaultDescription: 'Bold without trying. Shattered graphics for a confident, effortless look.',
    defaultLinkUrl: '/products?collection=fragment'
  },
  { 
    name: 'RECODE', 
    title: 'RECODE', 
    defaultDescription: 'Coming Soon. The next evolution of style.',
    defaultLinkUrl: '/products?collection=recode'
  }
]

export default function CollectionStacksManagementPage() {
  const [stacks, setStacks] = useState<CollectionStack[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCollection, setEditingCollection] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const [formData, setFormData] = useState({
    collectionName: '',
    title: '',
    description: '',
    images: [] as string[],
    linkUrl: '',
    autoRotateDelay: 3000,
    isActive: true
  })

  useEffect(() => {
    fetchStacks()
  }, [])

  const fetchStacks = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/collection-stacks')
      if (res.ok) {
        const data = await res.json()
        setStacks(data.stacks || [])
      }
    } catch (error) {
      console.error('Error fetching stacks:', error)
      showToast('Failed to load collections', 'error')
    } finally {
      setLoading(false)
    }
  }

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      showToast('File size must be less than 10MB', 'error')
      return
    }

    const uploadFormData = new FormData()
    uploadFormData.append('file', file)

    setUploading(true)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData
      })

      const data = await res.json()

      if (res.ok && data.url) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, data.url]
        }))
        showToast('Image uploaded successfully', 'success')
      } else {
        showToast(data.message || 'Upload failed', 'error')
      }
    } catch (error) {
      console.error('Upload error:', error)
      showToast('Upload failed. Please try again.', 'error')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.collectionName || formData.images.length === 0) {
      showToast('Collection name and at least one image are required', 'error')
      return
    }

    try {
      const existingStack = stacks.find(s => s.collectionName === formData.collectionName)
      const url = existingStack 
        ? `/api/collection-stacks/${existingStack.id}`
        : '/api/collection-stacks'
      
      const method = existingStack ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        showToast(
          existingStack 
            ? 'Collection updated successfully' 
            : 'Collection created successfully',
          'success'
        )
        fetchStacks()
        closeModal()
      } else {
        showToast('Failed to save collection', 'error')
      }
    } catch (error) {
      console.error('Error saving stack:', error)
      showToast('Failed to save collection', 'error')
    }
  }

  const openModal = (collectionName: string) => {
    const collection = COLLECTIONS.find(c => c.name === collectionName)!
    const existingStack = stacks.find(s => s.collectionName === collectionName)

    setEditingCollection(collectionName)
    setFormData({
      collectionName,
      title: existingStack?.title || collection.title,
      description: existingStack?.description || collection.defaultDescription,
      images: existingStack?.images || [],
      linkUrl: existingStack?.linkUrl || collection.defaultLinkUrl,
      autoRotateDelay: existingStack?.autoRotateDelay || 3000,
      isActive: existingStack?.isActive ?? true
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingCollection(null)
    setFormData({
      collectionName: '',
      title: '',
      description: '',
      images: [],
      linkUrl: '',
      autoRotateDelay: 3000,
      isActive: true
    })
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...formData.images]
    const [removed] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, removed)
    setFormData(prev => ({ ...prev, images: newImages }))
  }

  const getCollectionStack = (collectionName: string) => {
    return stacks.find(s => s.collectionName === collectionName)
  }

  return (
    <div className="min-h-full">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className={`${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white px-6 py-4 rounded-lg shadow-lg`}>
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Collection Stacks</h1>
            <p className="text-gray-600 mt-1">Manage images for ESSENCE, FRAGMENT, and RECODE collections</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COLLECTIONS.map((collection) => {
              const stack = getCollectionStack(collection.name)
              const hasImages = stack && stack.images.length > 0

              return (
                <div
                  key={collection.name}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Preview */}
                  <div className="relative h-64 bg-gray-900">
                    {hasImages ? (
                      <div className="relative w-full h-full p-4">
                        {stack.images.slice(0, 3).map((imageUrl, index) => (
                          <div
                            key={index}
                            className="absolute rounded-lg overflow-hidden border-2 border-white shadow-xl"
                            style={{
                              width: '80%',
                              height: '80%',
                              left: `${10 + index * 8}%`,
                              top: `${10 - index * 5}%`,
                              zIndex: stack.images.length - index,
                              transform: `rotate(${index * 3}deg)`
                            }}
                          >
                            <Image
                              src={imageUrl}
                              alt={`${collection.name} ${index + 1}`}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <svg className="w-16 h-16 mx-auto text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-gray-500 text-sm">No images yet</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    {stack && (
                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          stack.isActive 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-500 text-white'
                        }`}>
                          {stack.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{stack?.title || collection.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {stack?.description || collection.defaultDescription}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>{stack?.images.length || 0} {stack?.images.length === 1 ? 'image' : 'images'}</span>
                    </div>

                    {/* Actions */}
                    <button
                      onClick={() => openModal(collection.name)}
                      className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                    >
                      {hasImages ? 'Edit Collection' : 'Setup Collection'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Manage {formData.collectionName} Collection
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="ESSENCE"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Simple. Clean. Easy to wear."
                  rows={3}
                />
              </div>

              {/* Link URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link URL (when clicking "See Collection")
                </label>
                <input
                  type="text"
                  value={formData.linkUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, linkUrl: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="/products?collection=essence"
                />
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Images * (Upload 4 images for best stack effect)
                </label>
                
                {/* Upload Button */}
                <div className="mb-4">
                  <label className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    Upload images in the order you want them stacked (first image = top of stack)
                  </p>
                </div>

                {/* Image Grid */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={imageUrl}
                            alt={`Image ${index + 1}`}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                          
                          {/* Overlay with actions */}
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100">
                            {index > 0 && (
                              <button
                                type="button"
                                onClick={() => moveImage(index, index - 1)}
                                className="p-2 bg-white rounded-lg hover:bg-gray-100"
                                title="Move left"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                              </button>
                            )}
                            {index < formData.images.length - 1 && (
                              <button
                                type="button"
                                onClick={() => moveImage(index, index + 1)}
                                className="p-2 bg-white rounded-lg hover:bg-gray-100"
                                title="Move right"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                              title="Remove"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>

                          {/* Index Badge */}
                          <div className="absolute top-2 left-2 px-2 py-1 bg-black bg-opacity-75 text-white text-xs rounded">
                            #{index + 1}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Auto-Rotate Delay */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Auto-Rotate Delay (seconds)
                </label>
                <input
                  type="number"
                  value={formData.autoRotateDelay / 1000}
                  onChange={(e) => setFormData(prev => ({ ...prev, autoRotateDelay: parseFloat(e.target.value) * 1000 }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  min="1"
                  max="30"
                  step="0.5"
                  placeholder="3"
                />
                <p className="text-xs text-gray-500 mt-1">
                  How long before automatically switching to the next card (1-30 seconds)
                </p>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.isActive ? 'active' : 'inactive'}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.value === 'active' }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="active">Active (Show on homepage)</option>
                  <option value="inactive">Inactive (Hidden)</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  Save Collection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

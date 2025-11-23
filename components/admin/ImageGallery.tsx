'use client'

import { useState } from 'react'
import ImageUpload from './ImageUpload'

interface ImageGalleryProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  label?: string
}

export default function ImageGallery({
  images,
  onImagesChange,
  label = 'Product Images',
}: ImageGalleryProps) {
  const [primaryIndex, setPrimaryIndex] = useState(0)

  const handleAddImage = (url: string) => {
    onImagesChange([...images, url])
  }

  const handleDeleteImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
    if (primaryIndex >= newImages.length) {
      setPrimaryIndex(Math.max(0, newImages.length - 1))
    }
  }

  const handleSetPrimary = (index: number) => {
    setPrimaryIndex(index)
    // Move the image to first position
    const newImages = [...images]
    const [primaryImage] = newImages.splice(index, 1)
    newImages.unshift(primaryImage)
    onImagesChange(newImages)
    setPrimaryIndex(0)
  }

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images]
    const [movedImage] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, movedImage)
    onImagesChange(newImages)
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        {label} {images.length > 0 && `(${images.length})`}
      </label>

      {/* Existing Images Gallery */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative group border-2 border-gray-200 rounded-lg overflow-hidden hover:border-orange-500 transition-colors"
            >
              {/* Image */}
              <div className="relative aspect-square">
                <img
                  src={image}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Primary Badge */}
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded font-medium">
                  Primary
                </div>
              )}

              {/* Hover Actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {index !== 0 && (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(index)}
                    className="px-3 py-1 bg-white text-gray-900 rounded text-xs font-medium hover:bg-gray-100"
                    title="Set as primary"
                  >
                    Set Primary
                  </button>
                )}
                
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, index - 1)}
                    className="p-1 bg-white text-gray-900 rounded hover:bg-gray-100"
                    title="Move left"
                  >
                    ←
                  </button>
                )}
                
                {index < images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, index + 1)}
                    className="p-1 bg-white text-gray-900 rounded hover:bg-gray-100"
                    title="Move right"
                  >
                    →
                  </button>
                )}
                
                <button
                  type="button"
                  onClick={() => handleDeleteImage(index)}
                  className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                  title="Delete"
                >
                  ×
                </button>
              </div>

              {/* Image Number */}
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                #{index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload New Image */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
        <ImageUpload
          onUpload={handleAddImage}
          label={images.length === 0 ? 'Upload First Image (or multiple)' : 'Add More Images (can select multiple)'}
          multiple={true}
        />
      </div>

      {/* Helper Text */}
      <p className="text-sm text-gray-500">
        {images.length === 0 
          ? 'Upload at least one product image. You can select multiple images at once. The first image will be the primary image.'
          : 'The first image is the primary image shown in listings. Click "Set Primary" to change it. You can select multiple images at once.'
        }
      </p>
    </div>
  )
}


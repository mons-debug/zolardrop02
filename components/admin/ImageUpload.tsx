'use client'

import { useState, useRef, DragEvent } from 'react'

interface ImageUploadProps {
  onUpload: (url: string) => void
  currentImage?: string
  multiple?: boolean
  label?: string
  onDelete?: () => void
}

export default function ImageUpload({
  onUpload,
  currentImage,
  multiple = false,
  label = 'Upload Image',
  onDelete,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const validateFile = (file: File): string | null => {
    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      return 'Invalid file type. Please upload JPG, PNG, WEBP, or GIF.'
    }

    // Check file size (10MB max)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return 'File too large. Maximum size is 10MB.'
    }

    return null
  }

  const uploadFile = async (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      onUpload(data.url)
    } catch (err) {
      console.error('Upload error:', err)
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const uploadMultipleFiles = async (files: FileList) => {
    setUploading(true)
    setError(null)

    const uploadPromises = Array.from(files).map(async (file) => {
      const validationError = validateFile(file)
      if (validationError) {
        console.error(`Validation error for ${file.name}:`, validationError)
        return null
      }

      try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error('Upload failed')
        }

        const data = await response.json()
        return data.url
      } catch (err) {
        console.error(`Upload error for ${file.name}:`, err)
        return null
      }
    })

    try {
      const results = await Promise.all(uploadPromises)
      const successfulUploads = results.filter(url => url !== null)
      
      if (successfulUploads.length === 0) {
        setError('All uploads failed. Please try again.')
      } else if (successfulUploads.length < files.length) {
        setError(`${successfulUploads.length} of ${files.length} images uploaded successfully.`)
      }

      // Call onUpload for each successful upload
      successfulUploads.forEach(url => onUpload(url as string))
    } catch (err) {
      console.error('Multiple upload error:', err)
      setError('Some uploads failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (multiple) {
        await uploadMultipleFiles(e.dataTransfer.files)
      } else {
        await uploadFile(e.dataTransfer.files[0])
      }
    }
  }

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files.length > 0) {
      if (multiple) {
        await uploadMultipleFiles(e.target.files)
      } else {
        await uploadFile(e.target.files[0])
      }
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      {currentImage ? (
        <div className="relative">
          <div className="relative w-full h-48 border-2 border-gray-200 rounded-lg overflow-hidden">
            <img
              src={currentImage}
              alt="Current"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={handleClick}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              Replace Image
            </button>
            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
              >
                Delete Image
              </button>
            )}
          </div>
        </div>
      ) : (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
            dragActive
              ? 'border-orange-500 bg-orange-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleChange}
            multiple={multiple}
          />

          {uploading ? (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-2"></div>
              <p className="text-sm text-gray-600">Uploading...</p>
            </div>
          ) : (
            <div className="text-center cursor-pointer" onClick={handleClick}>
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-orange-500 hover:text-orange-600">
                    Click to upload
                  </span>
                  {' '}or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, WEBP, GIF up to 10MB{multiple ? ' (multiple files allowed)' : ''}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}


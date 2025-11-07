import { NextApiRequest, NextApiResponse } from 'next'
import { put } from '@vercel/blob'

export const config = {
  api: {
    bodyParser: false, // Disable body parser to handle file upload
  },
}

async function parseMultipartForm(req: NextApiRequest): Promise<{ file: Buffer; filename: string; contentType: string }> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    let boundary: string | null = null
    let filename = 'upload.jpg'
    let contentType = 'image/jpeg'

    // Extract boundary from content-type header
    const contentTypeHeader = req.headers['content-type']
    if (contentTypeHeader) {
      const match = contentTypeHeader.match(/boundary=(.+)$/)
      if (match) {
        boundary = '--' + match[1]
      }
    }

    req.on('data', (chunk: Buffer) => {
      chunks.push(chunk)
    })

    req.on('end', () => {
      const buffer = Buffer.concat(chunks)
      
      if (boundary) {
        // Parse multipart data
        const parts = buffer.toString('binary').split(boundary)
        for (const part of parts) {
          if (part.includes('Content-Disposition') && part.includes('filename=')) {
            // Extract filename
            const filenameMatch = part.match(/filename="([^"]+)"/)
            if (filenameMatch) {
              filename = filenameMatch[1]
            }
            
            // Extract content type
            const contentTypeMatch = part.match(/Content-Type: ([^\r\n]+)/)
            if (contentTypeMatch) {
              contentType = contentTypeMatch[1].trim()
            }

            // Extract file data (after double CRLF)
            const dataStart = part.indexOf('\r\n\r\n') + 4
            const dataEnd = part.lastIndexOf('\r\n')
            if (dataStart > 3 && dataEnd > dataStart) {
              const binaryData = part.substring(dataStart, dataEnd)
              const fileBuffer = Buffer.from(binaryData, 'binary')
              resolve({ file: fileBuffer, filename, contentType })
              return
            }
          }
        }
      }
      
      reject(new Error('No file found in request'))
    })

    req.on('error', reject)
  })
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // Check if BLOB_READ_WRITE_TOKEN is set
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error('BLOB_READ_WRITE_TOKEN not set in environment variables')
      return res.status(500).json({ 
        message: 'Upload configuration error',
        error: 'Storage credentials not configured. Please set BLOB_READ_WRITE_TOKEN in environment variables.'
      })
    }

    // Parse the multipart form data
    const { file, filename, contentType } = await parseMultipartForm(req)

    // Validate file size (max 10MB)
    if (file.length > 10 * 1024 * 1024) {
      return res.status(400).json({ 
        message: 'File too large',
        error: 'File size must be less than 10MB'
      })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(7)
    const extension = filename.split('.').pop() || 'jpg'
    const uniqueFilename = `hero/${timestamp}-${randomId}.${extension}`

    console.log(`Uploading ${uniqueFilename} (${file.length} bytes, ${contentType})`)

    // Upload to Vercel Blob
    const blob = await put(uniqueFilename, file, {
      access: 'public',
      contentType,
    })

    console.log('Upload successful:', blob.url)

    res.status(200).json({
      success: true,
      url: blob.url,
      message: 'File uploaded successfully'
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ 
      message: 'Upload failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}


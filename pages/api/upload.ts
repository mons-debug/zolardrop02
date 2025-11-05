import { NextApiRequest, NextApiResponse } from 'next'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Generate a fake CDN URL
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(7)
    const fakeUrl = `https://cdn.example.com/products/${timestamp}-${randomId}.jpg`

    // In production, this would:
    // 1. Parse multipart form data
    // 2. Upload to S3/Cloudinary/etc
    // 3. Return real CDN URL

    res.status(200).json({
      success: true,
      url: fakeUrl,
      message: 'Image uploaded successfully (simulated)'
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ message: 'Upload failed' })
  }
}


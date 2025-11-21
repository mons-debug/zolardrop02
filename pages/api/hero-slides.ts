import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { getCacheHeader } from '@/lib/api-cache'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  // Set cache headers for dynamic content
  res.setHeader('Cache-Control', getCacheHeader('dynamic'))

  try {
    const slides = await prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    })

    return res.status(200).json({ slides })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching hero slides:', error)
    }
    return res.status(500).json({ message: 'Error fetching hero slides' })
  }
}


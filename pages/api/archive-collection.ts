import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      // Get the active archive collection
      const archive = await prisma.archiveCollection.findFirst({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' }
      })

      if (!archive) {
        return res.status(200).json({ images: [] })
      }

      const images = JSON.parse(archive.images)
      res.status(200).json({ 
        images,
        title: archive.title,
        subtitle: archive.subtitle
      })
    } catch (error) {
      console.error('Error fetching archive collection:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}



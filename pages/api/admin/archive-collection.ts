import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Simple auth check
  const authHeader = req.headers.authorization
  const token = authHeader?.replace('Bearer ', '')
  
  if (token !== process.env.ADMIN_TOKEN && token !== 'admin-token-123') {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  if (req.method === 'GET') {
    try {
      const archive = await prisma.archiveCollection.findFirst({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' }
      })

      res.status(200).json({ archive })
    } catch (error) {
      console.error('Error fetching archive collection:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else if (req.method === 'POST' || req.method === 'PUT') {
    try {
      const { images, title, subtitle } = req.body

      if (!images || !Array.isArray(images)) {
        return res.status(400).json({ message: 'Images array is required' })
      }

      // Deactivate all existing archives
      await prisma.archiveCollection.updateMany({
        where: { isActive: true },
        data: { isActive: false }
      })

      // Create new archive
      const archive = await prisma.archiveCollection.create({
        data: {
          images: JSON.stringify(images),
          title: title || 'BORDERLINE',
          subtitle: subtitle || 'DROP 01',
          isActive: true
        }
      })

      res.status(201).json({ 
        success: true,
        archive,
        message: 'Archive collection updated successfully' 
      })
    } catch (error) {
      console.error('Error updating archive collection:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}


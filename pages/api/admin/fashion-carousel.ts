import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check authentication
  const user = await requireAdmin(req, res)
  if (!user) {
    return // requireAdmin already sent the error response
  }

  if (req.method === 'GET') {
    try {
      const images = await prisma.fashionCarousel.findMany({
        orderBy: { order: 'asc' }
      })

      res.status(200).json({ images })
    } catch (error) {
      console.error('Error fetching fashion carousel:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else if (req.method === 'POST') {
    try {
      const { url, alt, size, order } = req.body

      if (!url || !alt || !size) {
        return res.status(400).json({ message: 'URL, alt text, and size are required' })
      }

      // Get max order if order not provided
      let imageOrder = order
      if (!imageOrder && imageOrder !== 0) {
        const maxOrder = await prisma.fashionCarousel.aggregate({
          _max: { order: true }
        })
        imageOrder = (maxOrder._max.order ?? -1) + 1
      }

      const image = await prisma.fashionCarousel.create({
        data: {
          url,
          alt,
          size,
          order: imageOrder,
          isActive: true
        }
      })

      res.status(201).json({ 
        success: true,
        image,
        message: 'Image added successfully' 
      })
    } catch (error) {
      console.error('Error creating fashion carousel image:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, url, alt, size, order, isActive } = req.body

      if (!id) {
        return res.status(400).json({ message: 'Image ID is required' })
      }

      const updateData: any = {}
      if (url !== undefined) updateData.url = url
      if (alt !== undefined) updateData.alt = alt
      if (size !== undefined) updateData.size = size
      if (order !== undefined) updateData.order = order
      if (isActive !== undefined) updateData.isActive = isActive

      const image = await prisma.fashionCarousel.update({
        where: { id },
        data: updateData
      })

      res.status(200).json({ 
        success: true,
        image,
        message: 'Image updated successfully' 
      })
    } catch (error) {
      console.error('Error updating fashion carousel image:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ message: 'Image ID is required' })
      }

      await prisma.fashionCarousel.delete({
        where: { id }
      })

      res.status(200).json({ 
        success: true,
        message: 'Image deleted successfully' 
      })
    } catch (error) {
      console.error('Error deleting fashion carousel image:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}


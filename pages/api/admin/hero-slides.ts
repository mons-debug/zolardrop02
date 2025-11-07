import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Simple auth check
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token || token !== 'admin-token-123') {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    if (req.method === 'GET') {
      const slides = await prisma.heroSlide.findMany({
        orderBy: { order: 'asc' }
      })
      return res.status(200).json({ slides })
    }

    if (req.method === 'POST') {
      const { title, subtitle, mediaUrl, mediaType, linkUrl, order, isActive, backgroundColor, textColor, accentColor } = req.body

      if (!title || !mediaUrl) {
        return res.status(400).json({ message: 'Title and media URL are required' })
      }

      // If no order is specified, set it to be last
      let slideOrder = order
      if (slideOrder === undefined || slideOrder === null) {
        const lastSlide = await prisma.heroSlide.findFirst({
          orderBy: { order: 'desc' }
        })
        slideOrder = lastSlide ? lastSlide.order + 1 : 0
      }

      const slide = await prisma.heroSlide.create({
        data: {
          title,
          subtitle: subtitle || null,
          mediaUrl,
          mediaType: mediaType || 'image',
          linkUrl: linkUrl || null,
          backgroundColor: backgroundColor || '#000000',
          textColor: textColor || '#FFFFFF',
          accentColor: accentColor || '#ff5b00',
          order: slideOrder,
          isActive: isActive !== undefined ? isActive : true
        }
      })

      return res.status(201).json({ slide })
    }

    if (req.method === 'PATCH') {
      const { id, title, subtitle, mediaUrl, mediaType, linkUrl, order, isActive, backgroundColor, textColor, accentColor } = req.body

      if (!id) {
        return res.status(400).json({ message: 'Slide ID is required' })
      }

      const slide = await prisma.heroSlide.update({
        where: { id },
        data: {
          ...(title !== undefined && { title }),
          ...(subtitle !== undefined && { subtitle }),
          ...(mediaUrl !== undefined && { mediaUrl }),
          ...(mediaType !== undefined && { mediaType }),
          ...(linkUrl !== undefined && { linkUrl }),
          ...(backgroundColor !== undefined && { backgroundColor }),
          ...(textColor !== undefined && { textColor }),
          ...(accentColor !== undefined && { accentColor }),
          ...(order !== undefined && { order }),
          ...(isActive !== undefined && { isActive })
        }
      })

      return res.status(200).json({ slide })
    }

    if (req.method === 'DELETE') {
      const { id } = req.query

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ message: 'Slide ID is required' })
      }

      await prisma.heroSlide.delete({
        where: { id }
      })

      return res.status(200).json({ message: 'Slide deleted successfully' })
    }

    return res.status(405).json({ message: 'Method not allowed' })
  } catch (error) {
    console.error('Error managing hero slides:', error)
    return res.status(500).json({ message: 'Error managing hero slides' })
  }
}


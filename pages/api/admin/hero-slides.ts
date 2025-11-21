import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { trackContentAction } from '@/lib/audit-logger'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check authentication
  const user = await requireAdmin(req, res)
  if (!user) {
    return // requireAdmin already sent the error response
  }

  try {
    if (req.method === 'GET') {
      const slides = await prisma.heroSlide.findMany({
        orderBy: { order: 'asc' }
      })
      return res.status(200).json({ slides })
    }

    if (req.method === 'POST') {
      const { title, subtitle, mediaUrl, mediaType, linkUrl, order, isActive, backgroundColor, textColor, accentColor, duration } = req.body

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
          duration: duration || 5000,
          order: slideOrder,
          isActive: isActive !== undefined ? isActive : true
        }
      })

      // Log the creation
      await trackContentAction(
        'hero',
        slide.id,
        user.id,
        'create',
        null,
        { title: slide.title, mediaUrl: slide.mediaUrl, order: slide.order },
        { isActive: slide.isActive }
      )

      return res.status(201).json({ slide })
    }

    if (req.method === 'PATCH') {
      const { id, title, subtitle, mediaUrl, mediaType, linkUrl, order, isActive, backgroundColor, textColor, accentColor, duration } = req.body

      if (!id) {
        return res.status(400).json({ message: 'Slide ID is required' })
      }

      // Get existing slide for audit log
      const existingSlide = await prisma.heroSlide.findUnique({
        where: { id }
      })

      if (!existingSlide) {
        return res.status(404).json({ message: 'Slide not found' })
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
          ...(duration !== undefined && { duration }),
          ...(order !== undefined && { order }),
          ...(isActive !== undefined && { isActive })
        }
      })

      // Determine action type (activate/deactivate or update)
      let actionType: 'activate' | 'deactivate' | 'update' = 'update'
      if (isActive !== undefined && isActive !== existingSlide.isActive) {
        actionType = isActive ? 'activate' : 'deactivate'
      }

      // Log the update
      await trackContentAction(
        'hero',
        slide.id,
        user.id,
        actionType,
        { title: existingSlide.title, isActive: existingSlide.isActive },
        { title: slide.title, isActive: slide.isActive },
        { fieldsUpdated: Object.keys(req.body).filter(k => k !== 'id') }
      )

      return res.status(200).json({ slide })
    }

    if (req.method === 'DELETE') {
      const { id } = req.query

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ message: 'Slide ID is required' })
      }

      // Get slide for audit log
      const slideToDelete = await prisma.heroSlide.findUnique({
        where: { id }
      })

      if (!slideToDelete) {
        return res.status(404).json({ message: 'Slide not found' })
      }

      await prisma.heroSlide.delete({
        where: { id }
      })

      // Log the deletion
      await trackContentAction(
        'hero',
        id,
        user.id,
        'delete',
        { title: slideToDelete.title, mediaUrl: slideToDelete.mediaUrl },
        null
      )

      return res.status(200).json({ message: 'Slide deleted successfully' })
    }

    return res.status(405).json({ message: 'Method not allowed' })
  } catch (error) {
    console.error('Error managing hero slides:', error)
    return res.status(500).json({ message: 'Error managing hero slides' })
  }
}


import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // GET: Fetch all social media
    if (req.method === 'GET') {
      const socialMedia = await prisma.socialMedia.findMany({
        orderBy: [
          { order: 'asc' },
          { createdAt: 'asc' }
        ]
      })
      return res.status(200).json({ success: true, socialMedia })
    }

    // POST: Create new social media entry
    if (req.method === 'POST') {
      const { platform, name, url, icon, order, isActive } = req.body

      if (!platform || !name || !url) {
        return res.status(400).json({
          success: false,
          message: 'Platform, name, and URL are required'
        })
      }

      const socialMedia = await prisma.socialMedia.create({
        data: {
          platform,
          name,
          url,
          icon,
          order: order || 0,
          isActive: isActive !== undefined ? isActive : true
        }
      })

      return res.status(201).json({ success: true, socialMedia })
    }

    // PUT: Update social media entry
    if (req.method === 'PUT') {
      const { id, platform, name, url, icon, order, isActive } = req.body

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID is required for update'
        })
      }

      const socialMedia = await prisma.socialMedia.update({
        where: { id },
        data: {
          ...(platform && { platform }),
          ...(name && { name }),
          ...(url && { url }),
          ...(icon !== undefined && { icon }),
          ...(order !== undefined && { order }),
          ...(isActive !== undefined && { isActive })
        }
      })

      return res.status(200).json({ success: true, socialMedia })
    }

    // DELETE: Delete social media entry
    if (req.method === 'DELETE') {
      const { id } = req.query

      if (!id || typeof id !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'ID is required for deletion'
        })
      }

      await prisma.socialMedia.delete({
        where: { id }
      })

      return res.status(200).json({ success: true, message: 'Social media deleted' })
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' })
  } catch (error: any) {
    console.error('Social media API error:', error)
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    })
  } finally {
    await prisma.$disconnect()
  }
}













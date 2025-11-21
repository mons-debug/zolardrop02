import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { requireAdmin } from '@/lib/auth'
import { trackContentAction } from '@/lib/audit-logger'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query

  if (typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid ID' })
  }

  // GET is public, others need auth
  if (req.method === 'GET') {
    try {
      const stack = await prisma.collectionStack.findUnique({
        where: { id }
      })

      if (!stack) {
        return res.status(404).json({ message: 'Collection stack not found' })
      }

      return res.status(200).json({ 
        success: true, 
        stack: {
          ...stack,
          images: JSON.parse(stack.images)
        }
      })
    } catch (error) {
      console.error('Error fetching collection stack:', error)
      return res.status(500).json({ message: 'Failed to fetch collection stack' })
    }
  }

  if (req.method === 'PUT') {
    // Require auth
    const user = await requireAdmin(req, res)
    if (!user) return

    try {
      const { collectionName, title, description, images, linkUrl, autoRotateDelay, isActive } = req.body

      // Get existing for audit log
      const existing = await prisma.collectionStack.findUnique({ where: { id } })
      if (!existing) {
        return res.status(404).json({ message: 'Collection stack not found' })
      }

      const updateData: any = {}
      if (collectionName !== undefined) updateData.collectionName = collectionName
      if (title !== undefined) updateData.title = title
      if (description !== undefined) updateData.description = description
      if (images !== undefined) updateData.images = JSON.stringify(images)
      if (linkUrl !== undefined) updateData.linkUrl = linkUrl
      if (autoRotateDelay !== undefined) updateData.autoRotateDelay = autoRotateDelay
      if (isActive !== undefined) updateData.isActive = isActive

      const stack = await prisma.collectionStack.update({
        where: { id },
        data: updateData
      })

      // Log the update
      const actionType = (isActive !== undefined && isActive !== existing.isActive) 
        ? (isActive ? 'activate' : 'deactivate')
        : 'update'

      await trackContentAction(
        'collection',
        stack.id,
        user.id,
        actionType,
        { title: existing.title, collectionName: existing.collectionName },
        { title: stack.title, collectionName: stack.collectionName },
        { fieldsUpdated: Object.keys(updateData) }
      )

      return res.status(200).json({ 
        success: true, 
        stack: {
          ...stack,
          images: JSON.parse(stack.images)
        }
      })
    } catch (error) {
      console.error('Error updating collection stack:', error)
      return res.status(500).json({ message: 'Failed to update collection stack' })
    }
  }

  if (req.method === 'DELETE') {
    // Require auth
    const user = await requireAdmin(req, res)
    if (!user) return

    try {
      // Get for audit log
      const stackToDelete = await prisma.collectionStack.findUnique({ where: { id } })
      if (!stackToDelete) {
        return res.status(404).json({ message: 'Collection stack not found' })
      }

      await prisma.collectionStack.delete({
        where: { id }
      })

      // Log the deletion
      await trackContentAction(
        'collection',
        id,
        user.id,
        'delete',
        { title: stackToDelete.title, collectionName: stackToDelete.collectionName },
        null
      )

      return res.status(200).json({ 
        success: true, 
        message: 'Collection stack deleted successfully' 
      })
    } catch (error) {
      console.error('Error deleting collection stack:', error)
      return res.status(500).json({ message: 'Failed to delete collection stack' })
    }
  }

  return res.status(405).json({ message: 'Method not allowed' })
}


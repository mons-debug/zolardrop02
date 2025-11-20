import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query

  if (typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid ID' })
  }

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
    try {
      const { collectionName, title, description, images, linkUrl, isActive } = req.body

      const updateData: any = {}
      if (collectionName !== undefined) updateData.collectionName = collectionName
      if (title !== undefined) updateData.title = title
      if (description !== undefined) updateData.description = description
      if (images !== undefined) updateData.images = JSON.stringify(images)
      if (linkUrl !== undefined) updateData.linkUrl = linkUrl
      if (isActive !== undefined) updateData.isActive = isActive

      const stack = await prisma.collectionStack.update({
        where: { id },
        data: updateData
      })

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
    try {
      await prisma.collectionStack.delete({
        where: { id }
      })

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


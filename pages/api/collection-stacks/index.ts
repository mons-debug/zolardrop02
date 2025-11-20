import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const stacks = await prisma.collectionStack.findMany({
        orderBy: { collectionName: 'asc' }
      })
      
      return res.status(200).json({ 
        success: true, 
        stacks: stacks.map(stack => ({
          ...stack,
          images: JSON.parse(stack.images)
        }))
      })
    } catch (error) {
      console.error('Error fetching collection stacks:', error)
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch collection stacks' 
      })
    }
  }

  if (req.method === 'POST') {
    try {
      const { collectionName, title, description, images, linkUrl, autoRotateDelay, isActive } = req.body

      if (!collectionName || !title || !images || !Array.isArray(images)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Collection name, title, and images array are required' 
        })
      }

      const stack = await prisma.collectionStack.create({
        data: {
          collectionName,
          title,
          description: description || '',
          images: JSON.stringify(images),
          linkUrl: linkUrl || '',
          autoRotateDelay: autoRotateDelay || 3000,
          isActive: isActive ?? true
        }
      })

      return res.status(201).json({ 
        success: true, 
        stack: {
          ...stack,
          images: JSON.parse(stack.images)
        }
      })
    } catch (error) {
      console.error('Error creating collection stack:', error)
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to create collection stack' 
      })
    }
  }

  return res.status(405).json({ message: 'Method not allowed' })
}


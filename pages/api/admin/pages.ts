import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Verify authentication
    const authResult = verifyAuth(req)
    if (!authResult.authenticated || !authResult.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    // Check if user has admin privileges
    if (!['SUPER_ADMIN', 'ADMIN'].includes(authResult.user.role)) {
      return res.status(403).json({ success: false, message: 'Forbidden' })
    }

    if (req.method === 'GET') {
      // Fetch all pages
      const pages = await prisma.pageContent.findMany({
        orderBy: { page: 'asc' }
      })

      return res.status(200).json({ success: true, pages })
    }

    if (req.method === 'PUT') {
      const { page, title, content } = req.body

      if (!page || !title || !content) {
        return res.status(400).json({ success: false, message: 'Missing required fields' })
      }

      // Update or create page content
      const updatedPage = await prisma.pageContent.upsert({
        where: { page },
        update: { title, content, updatedAt: new Date() },
        create: { page, title, content }
      })

      return res.status(200).json({ success: true, page: updatedPage })
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' })
  } catch (error) {
    console.error('Pages API error:', error)
    return res.status(500).json({ success: false, message: 'Internal server error' })
  }
}







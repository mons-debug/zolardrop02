import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const user = await requireAdmin(req, res)
  if (!user) {
    return
  }

  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Variant ID is required' })
  }

  try {
    await prisma.variant.delete({
      where: { id }
    })

    res.status(200).json({ success: true, message: 'Variant deleted successfully' })
  } catch (error) {
    console.error('Error deleting variant:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}


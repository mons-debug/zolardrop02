import { NextApiRequest, NextApiResponse } from 'next'
import { requireAdmin } from '@/lib/auth'
import { getUserAnalytics } from '@/lib/audit-logger'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check authentication
  const user = await requireAdmin(req, res)
  if (!user) {
    return // requireAdmin already sent the error response
  }

  // Only SUPER_ADMIN and ADMIN can view analytics
  if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Insufficient permissions' })
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const users = await getUserAnalytics()
    res.status(200).json({ users })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}


import { NextApiRequest, NextApiResponse } from 'next'
import { requireAdmin } from '@/lib/auth'
import { getEntityAuditLog } from '@/lib/audit-logger'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check authentication
  const user = await requireAdmin(req, res)
  if (!user) {
    return // requireAdmin already sent the error response
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { id } = req.query

  if (typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid order ID' })
  }

  try {
    const timeline = await getEntityAuditLog('order', id)
    res.status(200).json({ timeline })
  } catch (error) {
    console.error('Error fetching order timeline:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}


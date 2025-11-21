import { NextApiRequest, NextApiResponse } from 'next'
import { requireAdmin } from '@/lib/auth'
import { getRecentActions } from '@/lib/audit-logger'

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

  try {
    const { entityType, limit = '20' } = req.query
    const actions = await getRecentActions(parseInt(limit as string))

    // Filter by entity type if provided
    const filteredActions = entityType && entityType !== 'all'
      ? actions.filter(a => a.entityType === entityType)
      : actions

    res.status(200).json({ actions: filteredActions })
  } catch (error) {
    console.error('Error fetching activity:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}


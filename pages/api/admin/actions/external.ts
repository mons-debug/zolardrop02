import { NextApiRequest, NextApiResponse } from 'next'
import { requireAdmin } from '@/lib/auth'
import { trackExternalAction } from '@/lib/audit-logger'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check authentication
  const user = await requireAdmin(req, res)
  if (!user) {
    return // requireAdmin already sent the error response
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { actionType, entityType, entityId, metadata } = req.body

    // Validate required fields
    if (!actionType || !entityType || !entityId) {
      return res.status(400).json({ 
        message: 'Missing required fields: actionType, entityType, entityId' 
      })
    }

    // Validate action type
    if (!['whatsapp', 'phone', 'email'].includes(actionType)) {
      return res.status(400).json({ 
        message: 'Invalid actionType. Must be whatsapp, phone, or email' 
      })
    }

    // Validate entity type
    if (!['order', 'customer'].includes(entityType)) {
      return res.status(400).json({ 
        message: 'Invalid entityType. Must be order or customer' 
      })
    }

    // Log the external action
    await trackExternalAction(
      user.id,
      actionType,
      entityType,
      entityId,
      metadata
    )

    res.status(200).json({ 
      success: true, 
      message: 'Action logged successfully' 
    })
  } catch (error) {
    console.error('Error logging external action:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}


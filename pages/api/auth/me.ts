import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from '@/lib/auth'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const user = await getSession(req)

    if (!user) {
      return res.status(401).json({ 
        message: 'Not authenticated',
        user: null
      })
    }

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isActive: user.isActive
      }
    })
  } catch (error) {
    console.error('Session error:', error)
    return res.status(500).json({ 
      message: 'Internal server error' 
    })
  }
}











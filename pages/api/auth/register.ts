import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { 
  hashPassword, 
  requireAuth,
  isValidEmail,
  isValidPassword 
} from '@/lib/auth'
import { isSuperAdmin } from '@/lib/permissions'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // Only authenticated super admins can register new users
    const currentUser = await requireAuth(req, res)
    if (!currentUser) return
    
    if (!isSuperAdmin(currentUser.role)) {
      return res.status(403).json({ 
        message: 'Only super admins can create new users' 
      })
    }

    const { email, password, name, role } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required' 
      })
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ 
        message: 'Invalid email format' 
      })
    }

    const passwordValidation = isValidPassword(password)
    if (!passwordValidation.valid) {
      return res.status(400).json({ 
        message: passwordValidation.message 
      })
    }

    // Validate role
    const validRoles = ['VIEWER', 'MANAGER', 'ADMIN', 'SUPER_ADMIN']
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({ 
        message: 'Invalid role' 
      })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingUser) {
      return res.status(409).json({ 
        message: 'User with this email already exists' 
      })
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user
    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        name: name || null,
        passwordHash,
        role: role || 'VIEWER',
        isActive: true
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    })

    return res.status(201).json({
      success: true,
      user: newUser
    })
  } catch (error) {
    console.error('Registration error:', error)
    return res.status(500).json({ 
      message: 'Internal server error' 
    })
  }
}



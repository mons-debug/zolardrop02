import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { requireAuth, hashPassword, isValidEmail, isValidPassword } from '@/lib/auth'
import { isSuperAdmin, isAdmin } from '@/lib/permissions'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Require authentication
    const currentUser = await requireAuth(req, res)
    if (!currentUser) return

    // Only admins can manage users
    if (!isAdmin(currentUser.role)) {
      return res.status(403).json({ 
        message: 'Admin access required' 
      })
    }

    // GET - List all users
    if (req.method === 'GET') {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          lastLogin: true,
          createdAt: true,
          updatedAt: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      return res.status(200).json({ users })
    }

    // PUT - Update user
    if (req.method === 'PUT') {
      const { userId, name, role, isActive, password } = req.body

      if (!userId) {
        return res.status(400).json({ 
          message: 'User ID is required' 
        })
      }

      // Only super admins can change roles or deactivate users
      if ((role || isActive !== undefined) && !isSuperAdmin(currentUser.role)) {
        return res.status(403).json({ 
          message: 'Only super admins can change roles or account status' 
        })
      }

      // Validate role if provided
      if (role) {
        const validRoles = ['customer', 'VIEWER', 'MANAGER', 'ADMIN', 'SUPER_ADMIN']
        if (!validRoles.includes(role)) {
          return res.status(400).json({ 
            message: 'Invalid role' 
          })
        }
      }

      // Build update data
      const updateData: any = {}
      if (name !== undefined) updateData.name = name
      if (role !== undefined) updateData.role = role
      if (isActive !== undefined) updateData.isActive = isActive
      
      // Handle password update
      if (password) {
        const passwordValidation = isValidPassword(password)
        if (!passwordValidation.valid) {
          return res.status(400).json({ 
            message: passwordValidation.message 
          })
        }
        updateData.passwordHash = await hashPassword(password)
      }

      // Update user
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          updatedAt: true
        }
      })

      return res.status(200).json({
        success: true,
        user: updatedUser
      })
    }

    // DELETE - Delete user
    if (req.method === 'DELETE') {
      // Only super admins can delete users
      if (!isSuperAdmin(currentUser.role)) {
        return res.status(403).json({ 
          message: 'Only super admins can delete users' 
        })
      }

      const { userId } = req.body

      if (!userId) {
        return res.status(400).json({ 
          message: 'User ID is required' 
        })
      }

      // Prevent deleting yourself
      if (userId === currentUser.id) {
        return res.status(400).json({ 
          message: 'Cannot delete your own account' 
        })
      }

      await prisma.user.delete({
        where: { id: userId }
      })

      return res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      })
    }

    return res.status(405).json({ message: 'Method not allowed' })
  } catch (error) {
    console.error('User management error:', error)
    return res.status(500).json({ 
      message: 'Internal server error' 
    })
  }
}











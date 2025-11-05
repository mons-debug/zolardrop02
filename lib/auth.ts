import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { serialize, parse } from 'cookie'
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from './prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const COOKIE_NAME = 'admin_token'

export interface JWTPayload {
  userId: string
  email: string
  role: string
  name?: string
}

export interface AuthUser {
  id: string
  email: string
  name: string | null
  role: string
  isActive: boolean
}

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// JWT token management
export function generateToken(user: AuthUser): string {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name || undefined
  }
  
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d' // 7 days expiration
  })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    return null
  }
}

// Cookie management
export function serializeAuthCookie(token: string): string {
  return serialize(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  })
}

export function serializeClearCookie(): string {
  return serialize(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/'
  })
}

// Get session from request
export async function getSession(req: NextApiRequest): Promise<AuthUser | null> {
  try {
    const cookies = parse(req.headers.cookie || '')
    const token = cookies[COOKIE_NAME]
    
    if (!token) {
      return null
    }
    
    const payload = verifyToken(token)
    if (!payload) {
      return null
    }
    
    // Fetch user from database to ensure they still exist and are active
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true
      }
    })
    
    if (!user || !user.isActive) {
      return null
    }
    
    return user
  } catch (error) {
    console.error('Session error:', error)
    return null
  }
}

// Check if user is authenticated
export async function requireAuth(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<AuthUser | null> {
  const user = await getSession(req)
  
  if (!user) {
    res.status(401).json({ message: 'Unauthorized. Please log in.' })
    return null
  }
  
  return user
}

// Check if user has admin role
export async function requireAdmin(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<AuthUser | null> {
  const user = await requireAuth(req, res)
  
  if (!user) {
    return null
  }
  
  const adminRoles = ['SUPER_ADMIN', 'ADMIN', 'MANAGER']
  if (!adminRoles.includes(user.role)) {
    res.status(403).json({ message: 'Forbidden. Admin access required.' })
    return null
  }
  
  return user
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate password strength
export function isValidPassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' }
  }
  
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' }
  }
  
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' }
  }
  
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' }
  }
  
  return { valid: true }
}



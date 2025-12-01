import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      // Public endpoint - no auth required for checkout
      const settings = await prisma.settings.findFirst({
        where: { key: 'available_cities' }
      })
      
      const cities = settings?.value ? JSON.parse(settings.value) : [
        'Casablanca',
        'Rabat',
        'Marrakech',
        'Fes',
        'Tangier',
        'Agadir',
        'Meknes',
        'Oujda',
        'Kenitra',
        'Tetouan'
      ]
      
      return res.status(200).json({ cities })
    } catch (error) {
      console.error('Error fetching cities:', error)
      return res.status(500).json({ message: 'Failed to fetch cities' })
    }
  }
  
  if (req.method === 'PUT') {
    // Require admin for updates
    const user = await requireAdmin(req, res)
    if (!user) return
    
    try {
      const { cities } = req.body
      
      if (!Array.isArray(cities)) {
        return res.status(400).json({ message: 'Cities must be an array' })
      }
      
      // Update or create settings
      await prisma.settings.upsert({
        where: { key: 'available_cities' },
        update: { value: JSON.stringify(cities) },
        create: {
          key: 'available_cities',
          value: JSON.stringify(cities)
        }
      })
      
      return res.status(200).json({ success: true, cities })
    } catch (error) {
      console.error('Error updating cities:', error)
      return res.status(500).json({ message: 'Failed to update cities' })
    }
  }
  
  return res.status(405).json({ message: 'Method not allowed' })
}


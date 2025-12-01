import { NextApiRequest, NextApiResponse } from 'next'
import { requireAdmin } from '@/lib/auth'

// Default Moroccan cities - can be customized
let availableCities = [
  'Casablanca',
  'Rabat',
  'Marrakech',
  'Fes',
  'Tangier',
  'Agadir',
  'Meknes',
  'Oujda',
  'Kenitra',
  'Tetouan',
  'Safi',
  'El Jadida',
  'Beni Mellal',
  'Nador',
  'Khouribga'
]

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    return res.status(200).json({ cities: availableCities })
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
      
      // Update cities in memory
      availableCities = cities
      
      return res.status(200).json({ success: true, cities: availableCities })
    } catch (error) {
      console.error('Error updating cities:', error)
      return res.status(500).json({ message: 'Failed to update cities' })
    }
  }
  
  return res.status(405).json({ message: 'Method not allowed' })
}


import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { getCacheHeader } from '@/lib/api-cache'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    // Set cache headers for settings (rarely change)
    res.setHeader('Cache-Control', getCacheHeader('settings'))
    
    try {
      const settings = await prisma.trackingSettings.findFirst({
        where: { isActive: true }
      })

      // Return only the public-facing IDs, not internal data
      res.status(200).json({
        googleAdsId: settings?.googleAdsId || null,
        googleAdsLabel: settings?.googleAdsLabel || null,
        googleAnalyticsId: settings?.googleAnalyticsId || null,
        facebookPixelId: settings?.facebookPixelId || null,
        tiktokPixelId: settings?.tiktokPixelId || null,
        snapchatPixelId: settings?.snapchatPixelId || null,
        isActive: settings?.isActive || false
      })
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching tracking settings:', error)
      }
      res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}


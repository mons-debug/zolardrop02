import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check authentication
  const user = await requireAdmin(req, res)
  if (!user) {
    return // requireAdmin already sent the error response
  }

  if (req.method === 'GET') {
    try {
      // Get the first (and should be only) settings record
      const settings = await prisma.trackingSettings.findFirst()

      res.status(200).json({ settings })
    } catch (error) {
      console.error('Error fetching tracking settings:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else if (req.method === 'POST') {
    try {
      const {
        googleAdsId,
        googleAdsLabel,
        googleAnalyticsId,
        facebookPixelId,
        tiktokPixelId,
        snapchatPixelId,
        isActive
      } = req.body

      // Check if settings already exist
      const existing = await prisma.trackingSettings.findFirst()

      let settings
      if (existing) {
        // Update existing settings
        settings = await prisma.trackingSettings.update({
          where: { id: existing.id },
          data: {
            googleAdsId: googleAdsId || null,
            googleAdsLabel: googleAdsLabel || null,
            googleAnalyticsId: googleAnalyticsId || null,
            facebookPixelId: facebookPixelId || null,
            tiktokPixelId: tiktokPixelId || null,
            snapchatPixelId: snapchatPixelId || null,
            isActive
          }
        })
      } else {
        // Create new settings
        settings = await prisma.trackingSettings.create({
          data: {
            googleAdsId: googleAdsId || null,
            googleAdsLabel: googleAdsLabel || null,
            googleAnalyticsId: googleAnalyticsId || null,
            facebookPixelId: facebookPixelId || null,
            tiktokPixelId: tiktokPixelId || null,
            snapchatPixelId: snapchatPixelId || null,
            isActive
          }
        })
      }

      res.status(200).json({ settings, message: 'Settings saved successfully' })
    } catch (error) {
      console.error('Error saving tracking settings:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}


import { NextApiRequest, NextApiResponse } from 'next'

// Test endpoint to trigger a push notification manually
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        // Call the push/send endpoint
        const baseUrl = process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : 'https://zolar.ma'

        const response = await fetch(`${baseUrl}/api/push/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: '🔔 Test Notification',
                body: 'This is a test push notification!',
                url: '/zolargestion',
                tag: 'test'
            })
        })

        const data = await response.json()

        res.status(200).json({
            success: true,
            message: 'Test push notification sent!',
            result: data,
            timestamp: new Date().toISOString()
        })
    } catch (error: any) {
        console.error('Test push failed:', error)
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

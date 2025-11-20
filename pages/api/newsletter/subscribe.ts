import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

// Rate limiting: Simple in-memory store (for production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

const checkRateLimit = (ip: string): boolean => {
  const now = Date.now()
  const limit = rateLimitStore.get(ip)

  if (!limit || now > limit.resetTime) {
    // Reset or create new limit
    rateLimitStore.set(ip, { count: 1, resetTime: now + 60000 }) // 1 minute window
    return true
  }

  if (limit.count >= 5) {
    // Max 5 requests per minute
    return false
  }

  limit.count++
  return true
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { email, source = 'homepage' } = req.body

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        message: 'Please enter a valid email address' 
      })
    }

    // Get IP address for rate limiting
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 
                req.socket.remoteAddress || 
                'unknown'

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return res.status(429).json({ 
        success: false,
        message: 'Too many requests. Please try again later.' 
      })
    }

    // Get user agent
    const userAgent = req.headers['user-agent'] || null

    // Check if email already exists
    const existingSubscriber = await prisma.newsletter.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingSubscriber) {
      if (existingSubscriber.status === 'active') {
        return res.status(200).json({ 
          success: true,
          message: "You're already subscribed to our newsletter!",
          alreadySubscribed: true
        })
      } else {
        // Re-subscribe if previously unsubscribed
        await prisma.newsletter.update({
          where: { email: email.toLowerCase() },
          data: {
            status: 'active',
            subscribedAt: new Date(),
            unsubscribedAt: null,
            ipAddress: ip,
            userAgent,
            source
          }
        })

        return res.status(200).json({ 
          success: true,
          message: 'Welcome back! You have been re-subscribed to our newsletter.',
          resubscribed: true
        })
      }
    }

    // Create new subscriber
    const subscriber = await prisma.newsletter.create({
      data: {
        email: email.toLowerCase(),
        status: 'active',
        source,
        ipAddress: ip,
        userAgent,
        subscribedAt: new Date()
      }
    })

    // TODO: Future integration with email service (Mailchimp, SendGrid, etc.)
    // Example:
    // if (process.env.MAILCHIMP_API_KEY) {
    //   const mailchimpId = await addToMailchimp(subscriber.email)
    //   await prisma.newsletter.update({
    //     where: { id: subscriber.id },
    //     data: { metadata: JSON.stringify({ mailchimpId }) }
    //   })
    // }

    return res.status(201).json({ 
      success: true,
      message: 'Thank you for subscribing! Check your inbox for updates.',
      subscriber: {
        email: subscriber.email,
        subscribedAt: subscriber.subscribedAt
      }
    })

  } catch (error) {
    console.error('Newsletter subscription error:', error)
    
    return res.status(500).json({ 
      success: false,
      message: 'Something went wrong. Please try again later.' 
    })
  }
}


/**
 * Simple in-memory rate limiter
 * 
 * For production, consider using Redis or a dedicated service
 */

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

// Clean up old entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    Object.keys(store).forEach(key => {
      if (store[key].resetTime < now) {
        delete store[key]
      }
    })
  }, 5 * 60 * 1000)
}

export interface RateLimitOptions {
  /**
   * Number of requests allowed
   */
  limit: number
  
  /**
   * Time window in seconds
   */
  windowSeconds: number
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  resetTime: number
}

/**
 * Check if a request should be rate limited
 * 
 * @param identifier - Unique identifier (IP, user ID, etc.)
 * @param options - Rate limit configuration
 * @returns Rate limit result
 */
export function rateLimit(
  identifier: string,
  options: RateLimitOptions = { limit: 10, windowSeconds: 60 }
): RateLimitResult {
  const now = Date.now()
  const windowMs = options.windowSeconds * 1000
  
  // Get or create entry
  if (!store[identifier] || store[identifier].resetTime < now) {
    store[identifier] = {
      count: 0,
      resetTime: now + windowMs
    }
  }
  
  const entry = store[identifier]
  entry.count++
  
  const remaining = Math.max(0, options.limit - entry.count)
  
  return {
    success: entry.count <= options.limit,
    remaining,
    resetTime: entry.resetTime
  }
}

/**
 * Get client identifier from request (IP address or session)
 */
export function getClientIdentifier(request: Request): string {
  // Try to get real IP from headers (for proxies/load balancers)
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }
  
  // Fallback to a generic identifier
  return 'unknown'
}


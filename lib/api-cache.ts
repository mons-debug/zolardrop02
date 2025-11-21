/**
 * API Response Caching Utilities
 * 
 * Cache-Control headers for better performance
 */

export type CacheStrategy = 'static' | 'dynamic' | 'settings' | 'no-cache'

/**
 * Get Cache-Control header value based on strategy
 * 
 * - static: Data that rarely changes (1 hour cache)
 * - dynamic: Frequently updated data (1 minute cache with stale-while-revalidate)
 * - settings: Configuration data (1 hour cache)
 * - no-cache: Always fresh data (no caching)
 */
export function getCacheHeader(strategy: CacheStrategy = 'dynamic'): string {
  switch (strategy) {
    case 'static':
      // Cache for 1 hour, serve stale while revalidating
      return 's-maxage=3600, stale-while-revalidate=86400'
    
    case 'dynamic':
      // Cache for 1 minute, serve stale while revalidating
      return 's-maxage=60, stale-while-revalidate=300'
    
    case 'settings':
      // Cache for 1 hour, serve stale while revalidating for 1 day
      return 's-maxage=3600, stale-while-revalidate=86400'
    
    case 'no-cache':
      // No caching, always fresh
      return 'no-store, no-cache, must-revalidate'
    
    default:
      return 's-maxage=60, stale-while-revalidate=300'
  }
}

/**
 * Set cache headers on NextResponse
 */
export function setCacheHeaders(
  headers: Headers,
  strategy: CacheStrategy = 'dynamic'
): void {
  headers.set('Cache-Control', getCacheHeader(strategy))
}


import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware runs on edge - protects admin routes before they reach the page
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Security: Block old /admin route completely (return 404)
    if (pathname.startsWith('/admin')) {
        return new NextResponse(null, { status: 404 })
    }

    // Check if this is a zolargestion (admin) route (except login)
    const isAdminRoute = pathname.startsWith('/zolargestion')
    const isAdminLogin = pathname === '/zolargestion/login'

    // Get the admin token from cookies
    const adminToken = request.cookies.get('admin_token')?.value

    // Security headers to add to all responses
    const securityHeaders = {
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
    }

    // For admin routes (except login), check for authentication
    if (isAdminRoute && !isAdminLogin) {
        // If no token, redirect to homepage (not login page - to hide admin exists)
        if (!adminToken) {
            // Redirect to homepage to hide the fact that admin panel exists
            const url = request.nextUrl.clone()
            url.pathname = '/'
            const response = NextResponse.redirect(url)

            // Add security headers
            Object.entries(securityHeaders).forEach(([key, value]) => {
                response.headers.set(key, value)
            })

            return response
        }
    }

    // For other routes, just add security headers and continue
    const response = NextResponse.next()

    Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value)
    })

    return response
}

// Configure which routes the middleware applies to
export const config = {
    matcher: [
        // Match zolargestion routes (new admin)
        '/zolargestion/:path*',
        // Block old admin routes
        '/admin/:path*',
        // Match all API admin routes
        '/api/admin/:path*',
    ],
}

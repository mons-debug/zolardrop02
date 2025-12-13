/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
      {
        // Your specific Vercel Blob store
        protocol: 'https',
        hostname: '0nugpwqw3muf6tro.public.blob.vercel-storage.com',
      },
      {
        // Cloudinary for new image uploads
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
    // Add these for better image handling
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Enable React strict mode for better development practices
  reactStrictMode: true,
  // Optimize production builds
  swcMinify: true,
  // Disable ESLint during production builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript checking during builds
  typescript: {
    ignoreBuildErrors: true,
  },
  // Explicitly expose environment variables to the client
  env: {
    NEXT_PUBLIC_VAPID_PUBLIC_KEY: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  },
  // Add redirects for old /admin URLs to new /zolargestion URLs
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/zolargestion',
        permanent: true,
      },
      {
        source: '/admin/:path*',
        destination: '/zolargestion/:path*',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig

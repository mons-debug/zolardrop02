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
        hostname: '**.public.blob.vercel-storage.com',
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
}

module.exports = nextConfig

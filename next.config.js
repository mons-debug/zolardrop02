/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.vercel.app',
        pathname: '/**',
      },
    ],
  },
  // Enable React strict mode for better development practices
  reactStrictMode: true,
  // Optimize production builds
  swcMinify: true,
  // Disable ESLint during production builds
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig

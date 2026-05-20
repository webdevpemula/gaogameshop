// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      // API routes — allow Midtrans webhook
      {
        source: '/api/payment/notification',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://api.midtrans.com' },
          { key: 'Access-Control-Allow-Methods', value: 'POST' },
        ],
      },
    ]
  },

  // Redirect www ke non-www
  async redirects() {
    return [
      {
        source: '/',
        has: [{ type: 'host', value: 'www.gaogameshop.id' }],
        destination: 'https://gaogameshop.id/',
        permanent: true,
      },
    ]
  },
}

export default nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},

  typescript: {
    ignoreBuildErrors: true,
  },

  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*` // Proxy to Backend
      }
    ]
  }
};

module.exports = nextConfig;

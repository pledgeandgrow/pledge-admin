/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'placeholder-url.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Using Turbopack instead of webpack for better performance
  // Configure experimental features
  experimental: {
    // Required for Supabase SSR
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Turbopack configuration (now stable, moved out of experimental)
  turbopack: {},
  // Handle CORS for API routes
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
  // Ignore ESLint errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Ignore TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Configure webpack to ignore warnings
  webpack: (config) => {
    config.ignoreWarnings = [
      { message: /.*/ }
    ];
    return config;
  },
};

module.exports = nextConfig;

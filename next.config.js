/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'placeholder-url.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Ensure we ignore any references to non-existent route groups
  webpack: (config, { isServer }) => {
    return config;
  },
};

module.exports = nextConfig;

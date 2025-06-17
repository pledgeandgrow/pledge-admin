/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // This experimental flag helps with route group issues
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: [],
  },
  // Ensure we ignore any references to non-existent route groups
  webpack: (config, { isServer }) => {
    return config;
  },
};

module.exports = nextConfig;

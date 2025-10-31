import type { NextConfig } from "next";

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
  
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  
  turbopack: {},
  
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
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  typescript: {
    ignoreBuildErrors: true,
  },
  
  webpack: (config: any) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
    };
    
    config.ignoreWarnings = [
      { message: /.*/ },
      { module: /.*/ }
    ];
    
    return config;
  },
};

export default nextConfig;

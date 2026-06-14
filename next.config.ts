import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.eu-west-1.convex.site',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.eu-west-1.convex.cloud',
        port: '',
        pathname: '/**',
      }
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
};

export default nextConfig;
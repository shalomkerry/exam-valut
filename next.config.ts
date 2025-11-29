import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb', // Adjust this (e.g., '10mb')
    },
  },
   images: {
    remotePatterns: [new URL('https://res.cloudinary.com/dg7ncfozj/image/upload/**')],
  },
};

export default nextConfig;

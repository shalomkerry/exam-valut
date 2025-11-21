import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb', // Adjust this (e.g., '10mb')
    },
  },
};

export default nextConfig;

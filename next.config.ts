import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: '/api-proxy/:path*',
        destination: 'https://stork-helpers-api.onrender.com/api/:path*',
      },
    ];
  },
};

export default nextConfig;

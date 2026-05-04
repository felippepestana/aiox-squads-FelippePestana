/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
  // Allow the metrics proxy to reach the local F6 engine
  async rewrites() {
    return [];
  },
};

module.exports = nextConfig;

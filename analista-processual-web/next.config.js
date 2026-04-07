/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
  images: {
    domains: ["localhost", "supabase.co"],
  },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typedRoutes: false,
  images: {
    domains: ["localhost", "supabase.co"],
  },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typedRoutes: false,
  // Transpile the source-first design system package.
  transpilePackages: ["@aiox/design-system"],
  // Keep document parsers out of the bundler so they run with their native
  // module resolution in the Node serverless runtime.
  serverExternalPackages: ["unpdf", "mammoth"],
  images: {
    domains: ["localhost", "supabase.co"],
  },
};

module.exports = nextConfig;

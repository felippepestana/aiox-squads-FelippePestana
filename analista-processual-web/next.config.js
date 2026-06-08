/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typedRoutes: false,
  // Keep document parsers/OCR out of the bundler so they run with their native
  // module resolution in the Node serverless runtime.
  serverExternalPackages: ["unpdf", "mammoth", "tesseract.js", "@napi-rs/canvas"],
  images: {
    domains: ["localhost", "supabase.co"],
  },
};

module.exports = nextConfig;

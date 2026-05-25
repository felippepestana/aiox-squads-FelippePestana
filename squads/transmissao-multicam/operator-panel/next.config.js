/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
    // Enable instrumentation.ts hook so the OSC bridge boots once at server
    // startup. Required on Next 14; in Next 15+ this is enabled by default.
    instrumentationHook: true,
    // The `osc` package contains a native dgram dependency and must not be
    // bundled into the server build.
    serverComponentsExternalPackages: ["osc"],
  },
  // Allow the metrics proxy to reach the local F6 engine
  async rewrites() {
    return [];
  },
};

module.exports = nextConfig;

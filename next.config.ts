import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Providers supply arbitrary image URLs (backend only validates they are
    // well-formed URLs, not which host they're on), so we allow any https
    // host here and still get next/image's optimization + lazy loading.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;

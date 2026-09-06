import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Gear photos are arbitrary URLs providers paste into the "images" field
    // (see gearSchema in lib/validations.ts - the backend just stores strings).
    // In a production app you'd restrict this to your own CDN / an allow-list
    // of trusted hosts; a wildcard is acceptable here since this is a
    // coursework project consuming a shared demo backend with seeded data
    // from various stock-photo hosts.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;

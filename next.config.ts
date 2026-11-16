import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  redirects() {
    return [
      { source: "/components/kalos-tabs", destination: "/components/kalos-segmented-control", permanent: true },
    ];
  },
  turbopack: {
    rules: { "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" } },
  },
};
export default nextConfig;

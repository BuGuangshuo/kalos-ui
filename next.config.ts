import type { NextConfig } from "next";
import { blocks } from "./lib/blocks";

const nextConfig: NextConfig = {
  redirects() {
    return [
      { source: "/block", destination: `/components/${blocks[0].slug}`, permanent: true },
      ...blocks.map(({ slug }) => ({ source: `/block/${slug}`, destination: `/components/${slug}`, permanent: true })),
      { source: "/components/kalos-tabs", destination: "/components/kalos-segmented-control", permanent: true },
    ];
  },
  turbopack: {
    rules: { "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" } },
  },
};
export default nextConfig;

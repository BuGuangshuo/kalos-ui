import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  redirects() {
    return [
      {
        source: "/components/pop-:name",
        destination: "/components/kalos-:name",
        permanent: true,
      },
      {
        source: "/r/pop-:name.json",
        destination: "/r/kalos-:name.json",
        permanent: true,
      },
      {
        source: "/r/:backend/pop-:name.json",
        destination: "/r/:backend/kalos-:name.json",
        permanent: true,
      },
    ];
  },
  turbopack: {
    rules: { "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" } },
  },
};
export default nextConfig;

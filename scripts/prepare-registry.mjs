import { writeFile, mkdir } from "node:fs/promises";
import { catalog } from "../lib/catalog.ts";
import tokens from "../design/tokens.json" with { type: "json" };
const homepage =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
const registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "pop-ui",
  homepage,
  items: catalog.map((item) => ({
    name: item.slug,
    type: "registry:ui",
    title: `Pop ${item.title}`,
    description: item.description,
    author: "Alan Bu <https://github.com/BuGuangshuo>",
    registryDependencies: [...item.dependencies],
    ...(item.slug === "pop-button" ? { dependencies: ["lucide-react"] } : {}),
    files: [{ path: `registry/pop/${item.slug}.tsx`, type: "registry:ui" }],
  })),
};
registry.items.push({
  name: "pop-theme",
  type: "registry:theme",
  title: "Pop Theme",
  description:
    "A thoughtful green palette, with coordinated light and dark semantic tokens.",
  cssVars: {
    light: { ...tokens.light, radius: "0.625rem" },
    dark: tokens.dark,
  },
});
await writeFile("registry.json", JSON.stringify(registry, null, 2) + "\n");
await mkdir("public/r", { recursive: true });
console.log(`Prepared ${registry.items.length} registry items.`);

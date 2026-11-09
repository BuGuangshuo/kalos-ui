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
  description: "参考 Astryx 的中性黑白配色，包含浅色与深色语义变量。",
  cssVars: {
    light: { ...tokens.light, radius: "1rem" },
    dark: tokens.dark,
  },
});
registry.items.push({
  name: "pop-all",
  type: "registry:block",
  title: "Pop UI 完整组件库",
  description: "一次安装全部 12 个组件。",
  dependencies: ["lucide-react"],
  registryDependencies: [
    ...new Set(catalog.flatMap((item) => [...item.dependencies])),
  ],
  files: catalog.map((item) => ({
    path: `registry/pop/${item.slug}.tsx`,
    type: "registry:ui",
  })),
});
await writeFile("registry.json", JSON.stringify(registry, null, 2) + "\n");
await mkdir("public/r", { recursive: true });
console.log(`Prepared ${registry.items.length} registry items.`);

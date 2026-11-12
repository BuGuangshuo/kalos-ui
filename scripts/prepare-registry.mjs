import { writeFile, mkdir } from "node:fs/promises";
import { catalog } from "../lib/catalog.ts";
import { site } from "../lib/site.ts";
import tokens from "../design/tokens.json" with { type: "json" };
const homepage = site.url;
const registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "kalos-ui",
  homepage,
  items: catalog.map((item) => ({
    name: item.slug,
    type: "registry:ui",
    title: `Kalos ${item.title}`,
    description: item.description,
    author: "Alan Bu <https://github.com/BuGuangshuo>",
    registryDependencies: [...item.dependencies],
    dependencies: ["@fontsource/roboto", ...(["kalos-form", "kalos-input", "kalos-select", "kalos-checkbox", "kalos-switch"].includes(item.slug) ? ["motion"] : []), ...(["kalos-form", "kalos-input", "kalos-select", "kalos-button", "kalos-command-menu"].includes(item.slug) ? ["lucide-react"] : [])],
    files: [
      { path: `registry/kalos/${item.slug}.tsx`, type: "registry:ui" },
      { path: "components/ui/kalos-styles.ts", type: "registry:ui" },
      ...(["kalos-form", "kalos-input", "kalos-select", "kalos-checkbox", "kalos-switch"].includes(item.slug) ? [{ path: "components/ui/kalos-field-message.tsx", type: "registry:ui" }] : []),
      ...(["kalos-input", "kalos-form"].includes(item.slug) ? [{ path: "components/ui/input-group.tsx", type: "registry:ui" }] : []),
      ...(item.slug === "kalos-select" ? [{ path: "registry/kalos/kalos-button.tsx", type: "registry:ui" }] : []),
      ...(item.slug === "kalos-form" ? ["input", "select", "checkbox", "switch", "button"].map(name => ({ path: `registry/kalos/kalos-${name}.tsx`, type: "registry:ui" })) : []),
      ...(item.slug === "kalos-form" ? [{ path: "components/ui/kalos-form-state.ts", type: "registry:ui" }] : []),
      ...(item.slug === "kalos-dialog" ? [{ path: "components/ui/dialog.tsx", type: "registry:ui" }] : []),
      ...(item.slug === "kalos-command-menu" ? [{ path: "components/ui/kalos-command-menu-panel.tsx", type: "registry:ui" }] : []),
      ...(item.slug === "kalos-popover" ? [{ path: "components/ui/kalos-popover-menu.tsx", type: "registry:ui" }] : []),
      ...(["kalos-form", "kalos-select", "kalos-tabs", "kalos-popover", "kalos-command-menu"].includes(item.slug)
        ? [{ path: "components/ui/kalos-highlight.ts", type: "registry:ui" }]
        : []),
    ],
  })),
};
registry.items.push({
  name: "kalos-theme",
  type: "registry:theme",
  title: "Kalos Theme",
  description: "中性黑白配色，包含浅色与深色语义变量。",
  css: { "@layer base": { "::selection": { backgroundColor: "var(--selection-background)", color: "var(--selection-foreground)" } } },
  cssVars: {
    light: { ...tokens.light, radius: "0.75rem" },
    dark: tokens.dark,
  },
});
registry.items.push({
  name: "kalos-all",
  type: "registry:block",
  title: "Kalos UI 完整组件库",
  description: `一次安装全部 ${catalog.length} 个组件。`,
  dependencies: ["lucide-react", "@fontsource/roboto", "motion"],
  registryDependencies: [
    ...new Set(catalog.flatMap((item) => [...item.dependencies])),
  ],
  files: [{ path: "components/ui/kalos-field-message.tsx", type: "registry:ui" }, { path: "components/ui/input-group.tsx", type: "registry:ui" }, { path: "components/ui/kalos-form-state.ts", type: "registry:ui" }, { path: "components/ui/dialog.tsx", type: "registry:ui" }, ...catalog.map((item) => ({
    path: `registry/kalos/${item.slug}.tsx`,
    type: "registry:ui",
  })), { path: "components/ui/kalos-command-menu-panel.tsx", type: "registry:ui" }, { path: "components/ui/kalos-popover-menu.tsx", type: "registry:ui" }, { path: "components/ui/kalos-highlight.ts", type: "registry:ui" }, { path: "components/ui/kalos-styles.ts", type: "registry:ui" }],
});
await writeFile("registry.json", JSON.stringify(registry, null, 2) + "\n");
await mkdir("public/r", { recursive: true });
console.log(`Prepared ${registry.items.length} registry items.`);

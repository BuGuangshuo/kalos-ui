import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { dirname, resolve, relative } from "node:path";
import assert from "node:assert/strict";
import { catalog } from "../lib/catalog.ts";
import { site } from "../lib/site.ts";
import tokens from "../design/tokens.json" with { type: "json" };

// Include every local UI import so individual components install independently.
async function collect(filePath, files = new Map()) {
  if (files.has(filePath)) return files;
  const content = await readFile(filePath, "utf8");
  assert(!/from ["'](?:radix-ui|@radix-ui\/|react-aria-components)/.test(content), `${filePath}: unsupported primitive`);
  files.set(filePath, { path: filePath, type: "registry:ui" });
  for (const [, name] of content.matchAll(/from\s+["']([^"']+)["']/g)) {
    const local = name.startsWith("@/components/ui/") || name.startsWith("@/registry/kalos/")
      ? name.slice(2)
      : name.startsWith("./") ? relative(process.cwd(), resolve(dirname(filePath), name)) : undefined;
    if (!local) continue;
    let found = false;
    for (const extension of [".tsx", ".ts"]) {
      try { await collect(local + extension, files); found = true; break; }
      catch (error) { if (error.code !== "ENOENT") throw error; }
    }
    assert(found, `Missing local dependency ${name} in ${filePath}`);
  }
  return files;
}

async function dependencies(files) {
  const names = new Set(["@base-ui/react", "cn"]);
  for (const file of files) {
    const content = await readFile(file.path, "utf8");
    for (const [, name] of content.matchAll(/\b(?:from\s*|import\s*)["']([^"']+)["']/g)) {
      if (name.startsWith(".") || name.startsWith("@/") || name === "react" || name === "react-dom") continue;
      names.add(name.startsWith("@") ? name.split("/").slice(0, 2).join("/") : name.split("/")[0]);
    }
  }
  return [...names].sort();
}

const items = await Promise.all(catalog.map(async item => {
  const files = [...(await collect(`registry/kalos/${item.slug}.tsx`)).values()];
  return {
    name: item.slug, type: "registry:ui", title: `Kalos ${item.title}`,
    description: item.description, author: "Alan Bu <https://github.com/BuGuangshuo>",
    dependencies: await dependencies(files), files,
  };
}));
const allFiles = [...new Map(items.flatMap(item => item.files).map(file => [file.path, file])).values()];
items.push({
  name: "kalos-theme", type: "registry:theme", title: "Kalos Theme",
  description: "中性黑白配色，包含浅色与深色语义变量。",
  css: { "@layer base": { "::selection": { backgroundColor: "var(--selection-background)", color: "var(--selection-foreground)" } } },
  cssVars: { light: { ...tokens.light, radius: "0.75rem" }, dark: tokens.dark },
});
items.push({
  name: "kalos-all", type: "registry:block", title: "Kalos UI 完整组件库",
  description: `一次安装全部 ${catalog.length} 个 Base UI 组件。`,
  dependencies: await dependencies(allFiles), files: allFiles,
});
const registry = { $schema: "https://ui.shadcn.com/schema/registry.json", name: "kalos-ui", homepage: site.url, items };
await writeFile("registry.json", JSON.stringify(registry, null, 2) + "\n");
// Retired endpoints must not survive subsequent builds in an existing checkout.
await Promise.all([
  rm("public/r", { recursive: true, force: true }),
  ...["react-aria", "vue"].map(name => rm(`public/registry-${name}.json`, { force: true })),
]);
await mkdir("public/r", { recursive: true });
console.log(`Prepared ${items.length} Base UI registry items with complete local dependencies.`);

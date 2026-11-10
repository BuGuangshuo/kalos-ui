import { mkdir, readFile, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
import { registrySchema, registryItemSchema } from "shadcn/schema";
import { catalog } from "../lib/catalog.ts";
import { site } from "../lib/site.ts";
import tokens from "../design/tokens.json" with { type: "json" };

const homepage = site.url;
const items = await Promise.all(
  catalog.map(async (item) => ({
    $schema: "https://shadcn-vue.com/schema/registry-item.json",
    name: item.slug,
    type: "registry:ui",
    title: `Kalos ${item.title} · Vue`,
    description: item.description,
    author: "Alan Bu <https://github.com/BuGuangshuo>",
    registryDependencies: item.dependencies.filter((name) => name !== "field"),
    dependencies: ["@fontsource/roboto", ...(item.slug === "kalos-button" ? ["@lucide/vue"] : [])],
    files: [
      { path: "kalos-styles.ts", type: "registry:ui", content: await readFile("components/ui/kalos-styles.ts", "utf8") },
      {
        path: `${item.slug}.vue`,
        type: "registry:ui",
        content: await readFile(`registry/vue/${item.slug}.vue`, "utf8"),
      },
    ],
  })),
);
items.push({
  $schema: "https://shadcn-vue.com/schema/registry-item.json",
  name: "kalos-theme",
  type: "registry:theme",
  title: "Kalos Theme · Vue",
  css: { "@layer base": { "::selection": { backgroundColor: "var(--selection-background)", color: "var(--selection-foreground)" } } },
  cssVars: { light: { ...tokens.light, radius: "0.75rem" }, dark: tokens.dark },
});
items.push({
  $schema: "https://shadcn-vue.com/schema/registry-item.json",
  name: "kalos-all",
  type: "registry:block",
  title: "Kalos UI · Vue 完整组件库",
  description: `一次安装全部 ${catalog.length} 个 Vue 组件。`,
  dependencies: ["@lucide/vue", "@fontsource/roboto"],
  registryDependencies: [
    ...new Set(items.flatMap((item) => item.registryDependencies || [])),
  ],
  files: [...new Map(items.flatMap((item) => item.files || []).map(file => [file.path, file])).values()],
});
const registry = {
  $schema: "https://shadcn-vue.com/schema/registry.json",
  name: "kalos-ui-vue",
  homepage,
  items,
};
registrySchema.parse(registry);
await mkdir("public/r/vue", { recursive: true });
for (const item of items) {
  registryItemSchema.parse(item);
  for (const file of item.files || [])
    assert.equal(
      file.content,
      await readFile(file.path === "kalos-styles.ts" ? "components/ui/kalos-styles.ts" : `registry/vue/${file.path}`, "utf8"),
    );
  await writeFile(
    `public/r/vue/${item.name}.json`,
    JSON.stringify(item, null, 2) + "\n",
  );
}
await writeFile(
  "registry-vue.json",
  JSON.stringify(
    {
      ...registry,
      items: items.map((item) => ({
        ...item,
        files: item.files?.map((file) => ({
          path: file.path === "kalos-styles.ts" ? "components/ui/kalos-styles.ts" : `registry/vue/${file.path}`,
          type: file.type,
        })),
      })),
    },
    null,
    2,
  ) + "\n",
);
await writeFile(
  "public/r/vue/registry.json",
  JSON.stringify(registry, null, 2) + "\n",
);
await writeFile(
  "public/registry-vue.json",
  JSON.stringify(registry, null, 2) + "\n",
);
console.log(
  `Verified ${items.length} Vue registry items: schemas and complete .vue source.`,
);

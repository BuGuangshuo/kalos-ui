import { mkdir, readFile, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
import { registrySchema, registryItemSchema } from "shadcn/schema";
import { catalog } from "../lib/catalog.ts";
import tokens from "../design/tokens.json" with { type: "json" };

const homepage =
  process.env.NEXT_PUBLIC_SITE_URL || "https://pop-ui-six.vercel.app";
const items = await Promise.all(
  catalog.map(async (item) => ({
    $schema: "https://shadcn-vue.com/schema/registry-item.json",
    name: item.slug,
    type: "registry:ui",
    title: `Pop ${item.title} · Vue`,
    description: item.description,
    author: "Alan Bu <https://github.com/BuGuangshuo>",
    registryDependencies: item.dependencies.filter((name) => name !== "field"),
    ...(item.slug === "pop-button" ? { dependencies: ["@lucide/vue"] } : {}),
    files: [
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
  name: "pop-theme",
  type: "registry:theme",
  title: "Pop Theme · Vue",
  cssVars: { light: { ...tokens.light, radius: "1rem" }, dark: tokens.dark },
});
items.push({
  $schema: "https://shadcn-vue.com/schema/registry-item.json",
  name: "pop-all",
  type: "registry:block",
  title: "Pop UI · Vue 完整组件库",
  description: "一次安装全部 12 个 Vue 组件。",
  dependencies: ["@lucide/vue"],
  registryDependencies: [
    ...new Set(items.flatMap((item) => item.registryDependencies || [])),
  ],
  files: items.flatMap((item) => item.files || []),
});
const registry = {
  $schema: "https://shadcn-vue.com/schema/registry.json",
  name: "pop-ui-vue",
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
      await readFile(`registry/vue/${file.path}`, "utf8"),
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
          path: `registry/vue/${file.path}`,
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

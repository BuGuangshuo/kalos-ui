import { mkdir, readFile, writeFile, rm } from "node:fs/promises";
import assert from "node:assert/strict";
import { registrySchema, registryItemSchema } from "shadcn/schema";
import { catalog } from "../lib/catalog.ts";
import { site } from "../lib/site.ts";
import tokens from "../design/tokens.json" with { type: "json" };

const homepage = site.url;
for (const [backend, label, prefix, dependency] of [
  ["base-ui", "Base UI", "kalos-base-", "@base-ui/react"],
  ["react-aria", "React Aria", "kalos-aria-", "react-aria-components"],
]) {
  async function collect(filePath, files = new Map()) {
    if (files.has(filePath)) return files;
    const content = await readFile(filePath, "utf8");
    files.set(filePath, {
      path: filePath.split("/").at(-1),
      type: "registry:ui",
      content,
    });
    const imports = [
      ...content.matchAll(
        new RegExp(`@/components/ui/(${prefix}[\\w-]+)`, "g"),
      ),
    ];
    for (const match of imports)
      await collect(`components/ui/${match[1]}.tsx`, files);
    for (const match of content.matchAll(/from "\.\/(kalos-[\w-]+)"/g)) {
      await collect(`registry/${backend}/${match[1]}.tsx`, files);
    }
    if (content.includes("@/components/ui/kalos-field-message")) await collect("components/ui/kalos-field-message.tsx", files);
    if (content.includes("@/components/ui/kalos-form-state")) await collect("components/ui/kalos-form-state.ts", files);
    return files;
  }
  const items = await Promise.all(
    catalog.map(async (item) => {
      const collected = await collect(`registry/${backend}/${item.slug}.tsx`);
      if (item.slug === "kalos-form") await collect("components/ui/kalos-highlight.ts", collected);
      const files = [...collected.values()];
      if (["kalos-select", "kalos-tabs", "kalos-popover", "kalos-command-menu"].includes(item.slug)) {
        files.push(...(await collect("components/ui/kalos-highlight.ts")).values());
      }
      if (item.slug === "kalos-command-menu") files.push(...(await collect("components/ui/kalos-command-menu-panel.tsx")).values());
      if (item.slug === "kalos-popover") files.push(...(await collect("components/ui/kalos-popover-menu.tsx")).values());
      files.push(...(await collect("components/ui/kalos-styles.ts")).values());
      const combined = files.map((file) => file.content).join("\n");
      const dependencies = [
        dependency,
        "@fontsource/roboto",
        ...(combined.includes('from "motion/react"') ? ["motion"] : []),
        ...["lucide-react", "class-variance-authority", "cn"].filter((name) =>
          combined.includes(`from "${name}"`),
        ),
      ];
      assert(
        !combined.includes('from "radix-ui"'),
        `${backend}/${item.slug} must not import Radix`,
      );
      return {
        $schema: "https://ui.shadcn.com/schema/registry-item.json",
        name: item.slug,
        type: "registry:ui",
        title: `Kalos ${item.title} · ${label}`,
        description: item.description,
        author: "Alan Bu <https://github.com/BuGuangshuo>",
        dependencies,
        files,
      };
    }),
  );
  items.push({
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "kalos-theme",
    type: "registry:theme",
    title: `Kalos Theme · ${label}`,
    css: { "@layer base": { "::selection": { backgroundColor: "var(--selection-background)", color: "var(--selection-foreground)" } } },
    cssVars: { light: { ...tokens.light, radius: "0.75rem" }, dark: tokens.dark },
  });
  const allFiles = new Map(
    items.flatMap((item) => item.files || []).map((file) => [file.path, file]),
  );
  items.push({
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "kalos-all",
    type: "registry:block",
    title: `Kalos UI · ${label} 完整组件库`,
    description: `一次安装全部 ${catalog.length} 个组件及对应基础组件。`,
    dependencies: [
      ...new Set(items.flatMap((item) => item.dependencies || [])),
    ],
    files: [...allFiles.values()],
  });
  const registry = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: `kalos-ui-${backend}`,
    homepage,
    items,
  };
  registrySchema.parse(registry);
  await mkdir(`public/r/${backend}`, { recursive: true });
  for (const item of items) {
    registryItemSchema.parse(item);
    await writeFile(
      `public/r/${backend}/${item.name}.json`,
      JSON.stringify(item, null, 2) + "\n",
    );
  }
  await writeFile(
    `public/r/${backend}/registry.json`,
    JSON.stringify(registry, null, 2) + "\n",
  );
  await writeFile(
    `public/registry-${backend}.json`,
    JSON.stringify(registry, null, 2) + "\n",
  );
  console.log(
    `Verified ${items.length} ${label} items, full source and dependency isolation.`,
  );
}
// Keep existing /r/*.json links working while making the backend explicit in new commands.
const radix = JSON.parse(await readFile("public/registry.json", "utf8"));
await mkdir("public/r/radix", { recursive: true });
for (const item of radix.items)
  await writeFile(
    `public/r/radix/${item.name}.json`,
    JSON.stringify(item, null, 2) + "\n",
  );
await writeFile(
  "public/r/radix/registry.json",
  JSON.stringify(radix, null, 2) + "\n",
);
console.log(
  `Verified ${radix.items.length} explicit Radix endpoints; legacy endpoints retained.`,
);

// Remove retired registries from existing checkouts as well as fresh builds.
await Promise.all([
  rm("registry-vue.json", { force: true }),
  rm("public/registry-vue.json", { force: true }),
  rm("public/r/vue", { recursive: true, force: true }),
]);

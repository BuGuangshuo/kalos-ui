import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { registrySchema, registryItemSchema } from "shadcn/schema";
const registry = registrySchema.parse(
  JSON.parse(await readFile("registry.json", "utf8")),
);
const publicItems = [];
for (const item of registry.items) {
  const output = registryItemSchema.parse(
    JSON.parse(await readFile(`public/r/${item.name}.json`, "utf8")),
  );
  assert.equal(output.name, item.name);
  assert.ok(!(output.dependencies || []).some(name => /^(radix-ui|@radix-ui\/|react-aria-components)/.test(name)), `${item.name}: retired dependency`);
  const installed = new Set((output.files || []).map(file => file.path.split("/").at(-1).replace(/\.(tsx?|jsx?)$/, "")));
  assert.equal(installed.size, (output.files || []).length, `${item.name}: duplicate installation filenames`);
  for (const file of output.files || []) {
    assert.equal(typeof file.content, "string");
    assert.ok(file.content.length > 0);
    assert.equal(file.content, await readFile(file.path, "utf8"));
    for (const [, name] of file.content.matchAll(/from\s+["']([^"']+)["']/g)) {
      if (name.startsWith("@/components/ui/") || name.startsWith("@/registry/kalos/") || name.startsWith("./")) {
        assert.ok(installed.has(name.split("/").at(-1)), `${item.name}: missing local import ${name}`);
      }
    }
  }
  publicItems.push(output);
}
await writeFile(
  "public/registry.json",
  JSON.stringify({ ...registry, items: publicItems }, null, 2) + "\n",
);
await writeFile(
  "public/r/registry.json",
  JSON.stringify({ ...registry, items: publicItems }, null, 2) + "\n",
);
console.log(
  `Verified ${registry.items.length} items: valid shadcn schemas, complete source, consistent dependencies.`,
);

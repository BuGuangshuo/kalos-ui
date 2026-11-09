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
  for (const file of output.files || []) {
    assert.equal(typeof file.content, "string");
    assert.ok(file.content.length > 0);
    assert.equal(file.content, await readFile(file.path, "utf8"));
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

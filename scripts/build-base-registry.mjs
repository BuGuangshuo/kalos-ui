import { mkdir, readFile, writeFile, rm } from "node:fs/promises";

// Existing Base UI URLs share the canonical registry and source.
const registry = JSON.parse(await readFile("public/registry.json", "utf8"));
await rm("public/r/base-ui", { recursive: true, force: true });
await mkdir("public/r/base-ui", { recursive: true });
await Promise.all([
  ...registry.items.map(item => writeFile(`public/r/base-ui/${item.name}.json`, JSON.stringify(item, null, 2) + "\n")),
  writeFile("public/r/base-ui/registry.json", JSON.stringify(registry, null, 2) + "\n"),
  writeFile("public/registry-base-ui.json", JSON.stringify(registry, null, 2) + "\n"),
]);
console.log(`Published ${registry.items.length} Base UI registry aliases.`);

import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import ts from "typescript";
import { templateFileTarget } from "../lib/template-source.ts";
import pkg from "../package.json" with { type: "json" };

const templateLicenses = {
  "dashboard-01": ["LICENSE", "SHADCN-LICENSE.md", "AFFECTUI-LICENSE.md", "BREADCRUMB-LICENSE.md", "EMPTY-STATE-LICENSE.md", "ROBOTO-LICENSE.txt"],
};

async function directoryFiles(directory) {
  const entries = await readdir(directory, { recursive: true, withFileTypes: true });
  return entries.filter(entry => entry.isFile() && !entry.name.startsWith("."))
    .map(entry => join(entry.parentPath, entry.name)).sort();
}

async function resolveImport(from, specifier) {
  const path = specifier.startsWith("@/") ? specifier.slice(2) : join(dirname(from), specifier);
  for (const suffix of ["", ".ts", ".tsx", "/index.ts", "/index.tsx"]) {
    if (await stat(path + suffix).then(entry => entry.isFile(), () => false)) return path + suffix;
  }
  throw new Error(`Missing template import ${specifier} in ${from}`);
}

// Each template installs as a React component; the host owns its router and entry points.
export async function templateRegistryItem(template) {
  const { slug } = template;
  const components = `components/templates/${slug}`;
  const files = new Map();
  const packages = new Set();
  const add = (path, target) => {
    // registry:file is copied verbatim by shadcn. TypeScript needs its alias
    // and JSX transforms for host projects with their own components paths.
    const type = /\.tsx?$/.test(path) ? "registry:component" : "registry:file";
    files.set(target, { path, target, type });
  };

  for (const path of await directoryFiles(components)) add(path, templateFileTarget(path));
  for (const license of templateLicenses[slug] ?? ["LICENSE"]) add(license, `@components/templates/${slug}/licenses/${license}`);

  // Walk the imported shared components as well as the template's own files.
  for (const { path } of files.values()) {
    if (!/\.(?:tsx?|css)$/.test(path)) continue;
    const source = await readFile(path, "utf8");
    const imports = path.endsWith(".css")
      ? [...source.matchAll(/@import\s+["']([^"']+)["']/g)].map(match => match[1])
      : ts.preProcessFile(source, true, true).importedFiles.map(file => file.fileName);
    for (const name of imports) {
      if (name === "@/lib/utils") continue; // shadcn resolves the configured cn helper.
      if (name.startsWith(".") || name.startsWith("@/")) {
        const local = await resolveImport(path, name);
        const target = templateFileTarget(local);
        if (!files.has(target)) add(local, target);
      } else {
        packages.add(name.split("/").slice(0, name.startsWith("@") ? 2 : 1).join("/"));
      }
    }
  }
  const dependencies = [];
  const devDependencies = [];
  for (const name of [...packages].sort()) {
    if (["react", "react-dom"].includes(name)) continue;
    assert.notEqual(name, "next", `${slug} must install in any React host`);
    const version = pkg.dependencies[name];
    if (version) dependencies.push(`${name}@${version}`);
    const types = `@types/${name.replace(/^@/, "").replace("/", "__")}`;
    if (pkg.devDependencies[types]) devDependencies.push(`${types}@${pkg.devDependencies[types]}`);
    assert.ok(version || pkg.devDependencies[types], `Missing package for ${slug}: ${name}`);
  }
  return {
    name: `kalos-${slug}`, type: "registry:block", title: template.english, description: template.description,
    dependencies, devDependencies, files: [...files.values()],
  };
}

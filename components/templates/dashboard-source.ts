import { readFile } from "node:fs/promises";
import path from "node:path";
import tokens from "@/design/tokens.json";
import sitePackage from "@/package.json";
import { dashboardTemplate } from "@/lib/templates";
import { templateSourceFile } from "@/lib/template-source";

export type TemplateFile = { path: string; content: string };

const projectRoot = process.cwd();
const templateDir = `components/templates/${dashboardTemplate.slug}/`;
type DashboardPageScope = "overview" | "empty";

function isPageSource(file: string, scope: DashboardPageScope) {
  if (file.startsWith(templateDir)) {
    const name = file.slice(templateDir.length);
    if (!name.includes("/")) return scope === "empty" || name !== "empty-page.tsx";
    return scope === "overview" && /^overview\/[^/]+$/.test(name) && !name.endsWith("stat-card-font.css");
  }
  return scope === "overview" && ["components/design-stack-table.tsx", "components/stack-brand-icons.tsx", "components/table-row-options.tsx"].includes(file);
}

function standalonePackage(files: TemplateFile[]) {
  const packages = new Set(["react", "react-dom", "next"]);
  // Read bare module specifiers from the same source the user will copy. CSS font
  // imports and scoped-package subpaths resolve to their own npm package.
  const imports = /(?:\bfrom\s+|\bimport\s*(?:\(\s*)?|@import\s+)["']([^"']+)["']/g;
  for (const file of files) {
    if (!/\.(?:tsx?|css)$/.test(file.path)) continue;
    for (const match of file.content.matchAll(imports)) {
      const specifier = match[1];
      if (specifier.startsWith(".") || specifier.startsWith("@/") || specifier.startsWith("node:")) continue;
      const parts = specifier.split("/");
      const name = specifier.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
      // Type-only modules such as geojson may exist solely as @types packages.
      packages.add(name);
    }
  }
  const dependencies = Object.entries(sitePackage.dependencies).filter(([name]) => packages.has(name));
  const devDependencies = Object.entries(sitePackage.devDependencies).filter(([name]) =>
    ["@tailwindcss/turbopack", "@types/node", "@types/react", "@types/react-dom", "tailwindcss", "typescript"].includes(name) ||
    (name.startsWith("@types/") && packages.has(name.slice("@types/".length)))
  );
  return JSON.stringify({
    name: dashboardTemplate.slug,
    version: "0.1.0",
    private: true,
    type: "module",
    scripts: { dev: "next dev", build: "next build", start: "next start" },
    dependencies: Object.fromEntries(dependencies),
    devDependencies: Object.fromEntries(devDependencies),
    engines: sitePackage.engines,
  }, null, 2) + "\n";
}

const colorVariables = (colors: typeof tokens.light) =>
  Object.entries(colors).map(([name, value]) => `  --${name}: ${value};`).join("\n");

const standaloneStyles = `@import "tailwindcss";
@import "tw-animate-css";
@import "@fontsource/roboto/latin-400.css";
@import "@fontsource/roboto/latin-500.css";
@import "@fontsource/roboto/latin-600.css";

@custom-variant dark (&:where(.dark, .dark *));

:root {
  --radius: ${tokens.radius.lg}px;
${colorVariables(tokens.light)}
}

.dark {
${colorVariables(tokens.dark)}
}

@theme inline {
${Object.keys(tokens.light).map(name => `  --color-${name}: var(--${name});`).join("\n")}
  --color-ring: var(--foreground);
  --font-sans: ${tokens.font.fallback};
  --font-heading: var(--font-sans);
  --font-mono: ${tokens.font.code};
  --text-sm: 13px;
  --text-sm--line-height: 20px;
}

@layer base {
  * { @apply border-border; }
  body { @apply bg-background font-sans text-[13px] text-foreground antialiased; }
  button:not(:disabled), a { cursor: pointer; }
  ::selection { background: var(--selection-background); color: var(--selection-foreground); }
}
`;

const rootLayout = `import type { ReactNode } from "react";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
`;

const homePage = `import { KalosDashboard01 } from "@/components/templates/dashboard-01";

export default function Home() {
  return <KalosDashboard01 />;
}
`;

const standaloneConfig = `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" },
    },
  },
};

export default nextConfig;
`;

export async function getDashboardSourceFiles(scope?: DashboardPageScope): Promise<TemplateFile[]> {
  const { default: item } = await import("@/public/r/base-ui/kalos-dashboard-01.json");
  // Show the same files as shadcn add, using the default standalone project's aliases.
  const files = item.files.map(templateSourceFile);
  if (scope) return files.filter(file => isPageSource(file.path, scope));
  const standalone = await Promise.all([
    ["lib/utils.ts", "lib/utils.ts"], ["app/icon.svg", "public/icon.svg"], ["tsconfig.json", "tsconfig.json"],
  ].map(async ([target, source]) => ({ path: target, content: await readFile(path.join(projectRoot, source), "utf8") })));
  files.push(...standalone,
    { path: "app/layout.tsx", content: rootLayout },
    { path: "app/page.tsx", content: homePage },
    { path: "app/globals.css", content: standaloneStyles },
    { path: "next.config.ts", content: standaloneConfig },
  );
  return [...files, { path: "package.json", content: standalonePackage(files) }];
}

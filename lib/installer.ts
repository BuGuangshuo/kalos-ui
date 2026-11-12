import cliPackage from "@/packages/cli/package.json";
import { site } from "@/lib/site";

export const installerPath = `/cli/kalos-ui-${cliPackage.version}.tgz`;
const runners: Record<string, string> = {
  npm: "npx",
  pnpm: "pnpm dlx",
  yarn: "yarn dlx",
  bun: "bun x",
};

export type InstallationMode = "init" | "add";

export function installerCommand(origin: string, manager = "npm", slug = "kalos-all", mode: InstallationMode = "add", template?: string) {
  const component = slug.replace(/^kalos-/, "");
  const selection = mode === "init" ? ` init${template ? ` --template ${template}` : ""}` : component === "all" ? " add" : ` add ${component}`;
  const localRegistry = origin.replace(/\/$/, "") === site.url.replace(/\/$/, "")
    ? ""
    : ` --registry ${origin}`;
  return `${runners[manager] || runners.npm} ${origin}${installerPath}${selection}${localRegistry}`;
}

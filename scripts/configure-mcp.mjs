import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve, join } from "node:path";
import { site } from "../lib/site.ts";
import { mcpRegistry, mcpServer, mcpToml } from "../lib/mcp-config.ts";

export async function configureMcp(cwd = process.cwd(), origin = site.url) {
  async function readJson(file) {
    try { return JSON.parse(await readFile(file, "utf8")); }
    catch (error) { if (error.code === "ENOENT") return {}; throw error; }
  }
  const configPath = join(cwd, "components.json");
  const config = await readJson(configPath);
  if (!config.$schema) throw new Error("请先在项目根目录配置 components.json。");
  config.registries = { ...config.registries, ...mcpRegistry(origin).registries };
  await writeFile(configPath, JSON.stringify(config, null, 2) + "\n");
  for (const name of [".mcp.json", ".cursor/mcp.json"]) {
    const file = join(cwd, name);
    const previous = await readJson(file);
    const next = { ...previous, mcpServers: { ...previous.mcpServers, shadcn: previous.mcpServers?.shadcn ?? mcpServer } };
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, JSON.stringify(next, null, 2) + "\n");
  }
  const codexPath = join(cwd, ".codex/config.toml");
  let toml = "";
  try { toml = await readFile(codexPath, "utf8"); }
  catch (error) { if (error.code !== "ENOENT") throw error; }
  if (!/^\s*\[\s*mcp_servers\s*\.\s*(?:shadcn|"shadcn"|'shadcn')\s*\]\s*(?:#.*)?$/m.test(toml)) {
    await mkdir(dirname(codexPath), { recursive: true });
    await writeFile(codexPath, `${toml.trimEnd()}${toml.trim() ? "\n\n" : ""}${mcpToml}\n`);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === import.meta.filename) {
  await configureMcp();
  console.log("Configured the Kalos UI registry and project-scoped Claude Code, Cursor and Codex MCP settings.");
}

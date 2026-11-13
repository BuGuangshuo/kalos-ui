import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { configureMcp } from "./configure-mcp.mjs";
import { mcpServer } from "../lib/mcp-config.ts";

const files = ["components.json", ".mcp.json", ".cursor/mcp.json", ".codex/config.toml"];
async function fixture(t) {
  const directory = await mkdtemp(join(tmpdir(), "kalos-mcp-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await writeFile(join(directory, "components.json"), JSON.stringify({ $schema: "https://ui.shadcn.com/schema.json", aliases: { ui: "~/ui" }, registries: { "@existing": "https://other.example/{name}.json" } }));
  return directory;
}
const json = async (directory, file) => JSON.parse(await readFile(join(directory, file), "utf8"));

test("MCP configuration preserves host settings and is safe to run again", async t => {
  const directory = await fixture(t);
  await writeFile(join(directory, ".mcp.json"), JSON.stringify({ mcpServers: { other: { command: "existing-server" } } }));
  await configureMcp(directory, "https://preview.example/");
  const config = await json(directory, "components.json");
  assert.deepEqual(config.aliases, { ui: "~/ui" });
  assert.equal(config.registries["@existing"], "https://other.example/{name}.json");
  assert.equal(config.registries["@kalos-ui"], "https://preview.example/r/{name}.json");
  assert.deepEqual((await json(directory, ".mcp.json")).mcpServers, { other: { command: "existing-server" }, shadcn: mcpServer });
  assert.deepEqual((await json(directory, ".cursor/mcp.json")).mcpServers.shadcn, mcpServer);
  const before = await Promise.all(files.map(file => readFile(join(directory, file), "utf8")));
  await configureMcp(directory, "https://preview.example/");
  assert.deepEqual(await Promise.all(files.map(file => readFile(join(directory, file), "utf8"))), before);
});

test("MCP configuration retains custom shadcn commands and commented TOML tables", async t => {
  const directory = await fixture(t);
  const custom = { command: "node", args: ["/custom/shadcn.mjs"] };
  await mkdir(join(directory, ".cursor"));
  await mkdir(join(directory, ".codex"));
  for (const file of [".mcp.json", ".cursor/mcp.json"]) {
    await writeFile(join(directory, file), JSON.stringify({ mcpServers: { shadcn: custom } }));
  }
  const toml = '[mcp_servers."shadcn"] # custom server\ncommand = "custom-shadcn"\nargs = []\n';
  await writeFile(join(directory, ".codex/config.toml"), toml);
  await configureMcp(directory);
  for (const file of [".mcp.json", ".cursor/mcp.json"]) assert.deepEqual((await json(directory, file)).mcpServers.shadcn, custom);
  assert.equal(await readFile(join(directory, ".codex/config.toml"), "utf8"), toml);
});

test("MCP configuration requires an initialized project", async t => {
  const directory = await fixture(t);
  await rm(join(directory, "components.json"));
  await assert.rejects(configureMcp(directory), /components.json/);
  await assert.rejects(readFile(join(directory, ".mcp.json")), { code: "ENOENT" });
});

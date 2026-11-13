export const mcpServer = {
  command: "npx",
  args: ["--yes", "shadcn@latest", "mcp"],
};

export const mcpJson = JSON.stringify({ mcpServers: { shadcn: mcpServer } }, null, 2);
export const mcpToml = `[mcp_servers.shadcn]\ncommand = "${mcpServer.command}"\nargs = ${JSON.stringify(mcpServer.args)}`;

export function mcpRegistry(origin: string) {
  return { registries: { "@kalos-ui": `${origin.replace(/\/$/, "")}/r/{name}.json` } };
}

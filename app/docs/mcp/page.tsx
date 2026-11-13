import type { Metadata } from "next";
import Link from "next/link";
import { Sidebar, CodeBlock, OnThisPage } from "@/components/docs-parts";
import { DocsPagination } from "@/components/page-pagination";
import { mcpJson, mcpRegistry, mcpToml } from "@/lib/mcp-config";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "MCP 配置" };
const links = [
  { id: "registry", title: "配置注册表" },
  { id: "claude", title: "Claude Code" },
  { id: "codex", title: "Codex" },
  { id: "cursor", title: "Cursor" },
  { id: "use", title: "验证与使用" },
  { id: "troubleshooting", title: "连接排查" },
];

export default function McpPage() {
  return <div className="workbench">
    <Sidebar active="mcp" />
    <div className="docs-grid">
      <article className="docs-content">
        <header className="docs-title"><h1>MCP 配置</h1></header>
        <p>Kalos UI 通过 shadcn MCP 接入 AI 编程工具，可检索组件、查看组件信息与依赖并生成安装命令。MCP 服务在你的项目目录中运行，组件统一使用 Base UI。</p>
        <section id="registry">
          <h2>配置注册表</h2>
          <p>先完成<Link href="/docs/getting-started">快速开始</Link>中的项目配置，再将以下命名空间合并到项目根目录的 components.json，保留其他字段。</p>
          <CodeBlock filename="components.json" language="json" code={JSON.stringify(mcpRegistry(site.url), null, 2)} />
          <p>选择下面对应的客户端配置。MCP 服务会读取当前项目的注册表、路径别名与安装目录。</p>
        </section>
        <section id="claude">
          <h2>Claude Code</h2>
          <p>在项目目录中运行以下命令，然后重新打开 Claude Code，通过 /mcp 确认 shadcn 已连接。</p>
          <CodeBlock language="bash" code="npx shadcn@latest mcp init --client claude" />
          <p>也可以将以下内容合并到项目的 .mcp.json：</p>
          <CodeBlock filename=".mcp.json" language="json" code={mcpJson} />
        </section>
        <section id="codex">
          <h2>Codex</h2>
          <p>将以下配置合并到项目的 .codex/config.toml。Codex 仅在受信任项目中加载项目级 MCP 配置；重新打开项目后，通过 /mcp 检查连接。</p>
          <CodeBlock filename=".codex/config.toml" language="toml" code={mcpToml} />
        </section>
        <section id="cursor">
          <h2>Cursor</h2>
          <p>在项目目录中运行，随后在 Cursor 的 MCP 设置中启用 shadcn。</p>
          <CodeBlock language="bash" code="npx shadcn@latest mcp init --client cursor" />
          <p>手动配置时，将以下内容合并到项目的 .cursor/mcp.json：</p>
          <CodeBlock filename=".cursor/mcp.json" language="json" code={mcpJson} />
        </section>
        <section id="use">
          <h2>验证与使用</h2>
          <p>连接后，先让 AI 列出 @kalos-ui 中的组件，再查看一个组件的信息与依赖。安装前核对项目使用 Base UI，确认生成命令指向 Kalos UI 注册表。完整源码随安装命令写入项目，也可从组件详情页查看。</p>
          <CodeBlock language="text" filename="给 AI 的提示词" code={"列出 @kalos-ui 注册表中的所有组件。\n\n查看 @kalos-ui/kalos-dialog 的组件信息和安装依赖，生成安装命令。\n\n安装 @kalos-ui/kalos-dialog 和 @kalos-ui/kalos-input，添加一个包含姓名和邮箱地址的联系人对话框。保留现有主题、目录和路径别名。"} />
          <p>已克隆本仓库时，也可以运行 npm run mcp:config，生成三个客户端的项目级配置并更新 Kalos UI 注册表地址；已有其他 MCP 服务和自定义 shadcn 配置会保留。</p>
        </section>
        <section id="troubleshooting">
          <h2>连接排查</h2>
          <ul>
            <li>找不到 @kalos-ui：确认 AI 工具打开的是包含 components.json 的项目目录，并检查命名空间地址。</li>
            <li>首次启动超时：先在终端执行 npx shadcn@latest --help 完成 CLI 下载，再重新连接 MCP。</li>
            <li>Codex 未显示服务：确认项目已受信任、TOML 格式正确，并重新打开项目。</li>
            <li>组件未安装：MCP 提供组件信息和安装命令；在 AI 工具中确认实际安装操作，并查看终端结果。</li>
          </ul>
          <p>协议与客户端配置参考 <a href="https://ui.shadcn.com/docs/mcp" target="_blank" rel="noreferrer">shadcn MCP</a> 和 <a href="https://developers.openai.com/codex/mcp" target="_blank" rel="noreferrer">OpenAI Docs</a>。</p>
        </section>
        <DocsPagination current="/docs/mcp" />
      </article>
      <OnThisPage links={links} />
    </div>
  </div>;
}

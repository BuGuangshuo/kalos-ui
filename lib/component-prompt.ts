export const aiTools = [
  { id: "claude", name: "Claude", url: "https://claude.ai/new", parameter: "q" },
  { id: "codex", name: "Codex", url: "https://chatgpt.com/", parameter: "q" },
  { id: "cursor", name: "Cursor", url: "https://cursor.com/link/prompt", parameter: "text" },
  { id: "v0", name: "v0", url: "https://v0.app/chat", parameter: "q" },
] as const;

export type AITool = (typeof aiTools)[number]["id"];

export function aiToolUrl(tool: AITool, prompt: string) {
  const target = aiTools.find(item => item.id === tool)!;
  return `${target.url}?${target.parameter}=${encodeURIComponent(prompt)}`;
}

export function componentPrompt({ name, description, installation, example, docsUrl, registryUrl }: {
  name: string;
  description: string;
  installation: string;
  example: string;
  docsUrl: string;
  registryUrl: string;
}) {
  return [
    `将 Kalos UI 的「${name}」组件添加到我的 React 项目。`,
    "",
    `组件作用：${description}`,
    "",
    "1. 检查 package.json 和 components.json，沿用项目的框架、包管理器、目录、路径别名与主题。Kalos UI 使用 Base UI，支持 Next.js、Vite 和 React Router。",
    "",
    "2. 在项目根目录安装组件源码及依赖：",
    "```bash", installation, "```",
    "",
    "3. 参考下面的 TSX 示例，将内容和操作接入现有页面。调整导入别名以匹配项目配置：",
    "```tsx", example.trim(), "```",
    "",
    "4. 保留 Kalos UI 的样式、设计变量、浅深主题和动效，保留字段标签、键盘操作、焦点管理与禁用状态。按实际需求连接现有业务逻辑。",
    "",
    `组件文档：${docsUrl}`,
    `组件源码与安装依赖：${registryUrl}`,
  ].join("\n");
}

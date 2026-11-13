"use client";

import Link from "next/link";
import { useEffect, useState, type ReactElement, type ReactNode } from "react";
import { KalosTooltip } from "@/registry/kalos/kalos-tooltip";
import { Check, RotateCcw } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CopyButton } from "@/components/copy-button";
import { AIToolIcon } from "@/components/ai-tool-icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { controlStyles } from "@/components/ui/kalos-styles";
import { aiTools, aiToolUrl, type AITool } from "@/lib/component-prompt";

function ToolHint({ label, children }: { label: string; children: ReactElement }) {
  return <KalosTooltip content={label}>{children}</KalosTooltip>;
}

function PreviewAction({ label, children, ...props }: React.ComponentProps<typeof Button> & { label: string; children: ReactNode }) {
  return <ToolHint label={label}>
    <Button type="button" variant="ghost" size="icon" aria-label={label} className="component-toolbar-control" {...props}>{children}</Button>
  </ToolHint>;
}

export function ComponentToolbar({ source, prompt, onRefresh }: { source: string; prompt: string; onRefresh: () => void }) {
  const [copiedTool, setCopiedTool] = useState<AITool | null>(null);
  useEffect(() => {
    if (!copiedTool) return;
    const timer = setTimeout(() => setCopiedTool(null), 1600);
    return () => clearTimeout(timer);
  }, [copiedTool]);

  function copyPrompt(tool: AITool) {
    // The anchor opens synchronously; clipboard permissions cannot block the handoff.
    navigator.clipboard?.writeText(prompt).then(() => setCopiedTool(tool)).catch(() => {});
  }

  return <>
    <div className={`component-toolbar-controls ${controlStyles.previewToolbar}`} role="group" aria-label="预览设置">
      <div className="component-toolbar-theme" role="group" aria-label="主题">
        <ToolHint label="切换深浅主题"><ThemeToggle className="component-toolbar-control" /></ToolHint>
      </div>
      <Separator orientation="vertical" className="component-toolbar-separator" />
      <PreviewAction label="刷新预览" onClick={onRefresh}><RotateCcw /></PreviewAction>
      <Separator orientation="vertical" className="component-toolbar-separator component-toolbar-end-separator" />
    </div>
    <div className={`component-toolbar-handoff ${controlStyles.previewToolbar}`} role="group" aria-label="组件源码与 AI 工具">
      {aiTools.map(tool => <ToolHint key={tool.id} label={copiedTool === tool.id ? "提示词已复制" : tool.id === "codex" ? "在 ChatGPT / Codex 中打开" : `在 ${tool.name} 中打开`}>
        <a href={aiToolUrl(tool.id, prompt)} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "outline", size: "icon", className: "component-toolbar-tool" })} aria-label={`在 ${tool.name} 中打开`} onClick={() => copyPrompt(tool.id)}>
          {copiedTool === tool.id ? <Check /> : <AIToolIcon tool={tool.id} />}
        </a>
      </ToolHint>)}
      <ToolHint label="配置 MCP">
        <Link href="/docs/mcp" className={buttonVariants({ variant: "outline", className: "component-toolbar-tool component-toolbar-mcp" })} aria-label="配置 MCP">MCP</Link>
      </ToolHint>
      <CopyButton value={source} label="复制" ariaLabel="复制组件源码" variant="default" className="component-toolbar-copy" />
    </div>
  </>;
}

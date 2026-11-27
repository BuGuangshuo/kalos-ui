"use client";

import { useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import { BreadcrumbDemoIcon } from "@/components/breadcrumb-demo-icons";
import { KalosBreadcrumb } from "@/registry/kalos/kalos-breadcrumb";
import "./breadcrumb-demo.css";

type WorkspaceEntry = {
  label: string;
  meta: string;
  kind: "folder" | "agent" | "run" | "file";
  children?: string[];
};

const entries: Record<string, WorkspaceEntry> = {
  workspace: { label: "Acme", meta: "工作区", kind: "folder", children: ["agents", "library"] },
  agents: { label: "智能体", meta: "3 个智能体", kind: "folder", children: ["research", "triage", "notes"] },
  library: { label: "知识库", meta: "2 份文件", kind: "folder", children: ["handbook", "pricing"] },
  research: { label: "研究助手", meta: "工作日 09:00", kind: "agent", children: ["runs", "sources"] },
  triage: { label: "工单分流", meta: "收到新工单时", kind: "agent", children: ["triage-runs"] },
  notes: { label: "发布说明助手", meta: "每次合并后", kind: "agent", children: ["notes-runs"] },
  runs: { label: "运行", meta: "3 条记录", kind: "folder", children: ["4821", "4820", "4819"] },
  sources: { label: "资料来源", meta: "1 份文件", kind: "folder", children: ["handbook"] },
  "triage-runs": { label: "运行", meta: "1 条记录", kind: "folder", children: ["912"] },
  "notes-runs": { label: "运行", meta: "1 条记录", kind: "folder", children: ["77"] },
  "4821": { label: "#4821 · 工单汇总", meta: "4 分钟前", kind: "run" },
  "4820": { label: "#4820 · 竞品周报", meta: "12 分钟前", kind: "run" },
  "4819": { label: "#4819 · 定价审阅", meta: "28 分钟前", kind: "run" },
  "912": { label: "#912 · 工单分类", meta: "16 分钟前", kind: "run" },
  "77": { label: "#77 · 发布说明", meta: "8 分钟前", kind: "run" },
  handbook: { label: "客服手册.md", meta: "2 天前编辑", kind: "file" },
  pricing: { label: "定价说明-2026.pdf", meta: "上周添加", kind: "file" },
};

const initialPath = ["workspace", "agents", "research", "runs", "4821"];

const agentMarks: Record<string, string> = {
  research: "111010101",
  triage: "000101111",
  notes: "010111111",
};

function EntryIcon({ id }: { id: string }) {
  const { kind } = entries[id];
  if (kind === "agent") {
    return (
      <span className="breadcrumb-demo__mark" data-agent={id} aria-hidden="true">
        {Array.from(agentMarks[id], (pixel, index) => <i key={index} data-on={pixel === "1" || undefined} />)}
      </span>
    );
  }
  return <BreadcrumbDemoIcon name={kind} className="breadcrumb-demo__icon" />;
}

export function BreadcrumbDemo() {
  const [path, setPath] = useState(initialPath);
  const navigation = useRef<HTMLElement>(null);
  const returnFocus = useRef(false);
  const currentId = path[path.length - 1];
  const current = entries[currentId];

  useLayoutEffect(() => {
    if (returnFocus.current) {
      returnFocus.current = false;
      navigation.current?.focus({ preventScroll: true });
    }
  }, [path]);

  function navigate(next: string[], event: MouseEvent<HTMLElement>) {
    returnFocus.current = event.detail === 0;
    setPath(next);
  }

  return (
    <section className="breadcrumb-demo" aria-label="Acme 工作区">
      <header className="breadcrumb-demo__bar">
        <KalosBreadcrumb
          ref={navigation}
          tabIndex={-1}
          aria-label="工作区路径"
          maxItems={current.kind === "run" ? 3 : undefined}
          items={path.map((id, index) => ({
            label: entries[id].kind === "run" ? `#${id}` : entries[id].label,
            icon: index === 0 ? <BreadcrumbDemoIcon name="workspace" /> : undefined,
            onClick: index < path.length - 1 ? event => navigate(path.slice(0, index + 1), event) : undefined,
          }))}
        />
      </header>
      <div key={currentId} className="breadcrumb-demo__body">
        {current.children ? (
          <ul className="breadcrumb-demo__rows">
            {current.children.map(id => {
              const entry = entries[id];
              return (
                <li key={id}>
                  <button type="button" className="breadcrumb-demo__row" data-run={entry.kind === "run" || undefined}
                    onClick={event => navigate([...path, id], event)}>
                    <EntryIcon id={id} />
                    <span className="breadcrumb-demo__name" dir="auto">{entry.label}</span>
                    <span className="breadcrumb-demo__meta">{entry.meta}</span>
                    <BreadcrumbDemoIcon name="arrow" className="breadcrumb-demo__arrow" />
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="breadcrumb-demo__leaf" data-run={current.kind === "run" || undefined}>
            <EntryIcon id={currentId} />
            <div className="breadcrumb-demo__leaf-text">
              <span dir="auto">{current.label}</span>
              <span className="breadcrumb-demo__meta">{current.meta}</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

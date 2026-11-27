"use client";

import { ChevronDown, ChevronRight, File, Folder, FolderOpen, PanelLeft } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { CodeBlock } from "@/components/code-block";
import { templateSourceFile } from "@/lib/template-source";
import type { TemplateFile } from "./dashboard-source";

type Entry = { name: string; path: string; parent: string; directory: boolean; depth: number };
type SourceBundle = { files: TemplateFile[]; dependencies?: string[]; devDependencies?: string[] };

function sourceTree(files: TemplateFile[], defaultPath: string) {
  const paths = new Set<string>();
  const children = new Map<string, Entry[]>();
  for (const file of files) {
    const parts = file.path.split("/");
    let parent = "";
    parts.forEach((name, depth) => {
      const path = parent ? `${parent}/${name}` : name;
      if (!paths.has(path)) {
        const entry = { name, path, parent, directory: depth < parts.length - 1, depth };
        paths.add(path);
        const siblings = children.get(parent) ?? [];
        siblings.push(entry);
        children.set(parent, siblings);
      }
      parent = path;
    });
  }
  for (const siblings of children.values()) {
    siblings.sort((a, b) => Number(b.directory) - Number(a.directory) || Number(b.path === defaultPath) - Number(a.path === defaultPath) || a.name.localeCompare(b.name, "en"));
  }
  return children;
}

async function loadPageFiles(href: string, signal: AbortSignal, registry: boolean): Promise<SourceBundle> {
  const response = await fetch(href, { cache: "no-cache", signal });
  if (!response.ok) throw new Error("源码暂时无法加载");
  if (registry) {
    const item: {
      files: { target: string; content: string }[];
      dependencies?: string[];
      devDependencies?: string[];
    } = await response.json();
    return { files: item.files.map(templateSourceFile), dependencies: item.dependencies, devDependencies: item.devDependencies };
  }
  const files: TemplateFile[] = await response.json();
  if (!files.length) throw new Error("当前页面没有源码文件");
  return { files };
}

export default function TemplateSourceViewer({ href, defaultPath, visible, registry = false }: {
  href: string; defaultPath: string; visible: boolean; registry?: boolean;
}) {
  const [source, setSource] = useState<SourceBundle>();
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!visible) return;
    const controller = new AbortController();
    loadPageFiles(href, controller.signal, registry).then(
      result => { if (!controller.signal.aborted) setSource(result); },
      () => {
        if (!controller.signal.aborted) {
          setSource(undefined);
          setFailed(true);
        }
      },
    );
    return () => controller.abort();
  }, [href, attempt, visible, registry]);

  if (source) {
    const viewer = <SourceTreeViewer files={source.files} defaultPath={defaultPath} />;
    if (!registry) return viewer;
    return <div className="block-source">
      <p>安装依赖，再按文件树中的路径复制源码。若项目使用自定义别名，请同步调整导入路径。</p>
      {!!source.dependencies?.length && <CodeBlock code={`npm install ${source.dependencies.join(" ")}`} language="bash" />}
      {!!source.devDependencies?.length && <CodeBlock code={`npm install -D ${source.devDependencies.join(" ")}`} language="bash" />}
      {viewer}
    </div>;
  }
  return <div className="grid h-[clamp(30rem,68dvh,46rem)] place-content-center gap-2 rounded-xl border border-border bg-card text-center text-[13px] text-muted-foreground">
    <span role="status">{failed ? "源码暂时无法加载" : "正在加载源码…"}</span>
    {failed && <button type="button" className="rounded-md px-2 py-1 text-foreground hover:bg-muted focus-visible:outline-2" onClick={() => {
      setFailed(false);
      setAttempt(value => value + 1);
    }}>重新加载</button>}
  </div>;
}

function SourceTreeViewer({ files, defaultPath }: { files: TemplateFile[]; defaultPath: string }) {
  const [path, setPath] = useState(defaultPath);
  const [focused, setFocused] = useState(defaultPath);
  const [mobileOpen, setMobileOpen] = useState(false);
  const treeId = useId();
  const treeRef = useRef<HTMLDivElement>(null);
  const mobileTrigger = useRef<HTMLButtonElement>(null);
  const children = useMemo(() => sourceTree(files, defaultPath), [files, defaultPath]);
  const [collapsed, setCollapsed] = useState<ReadonlySet<string>>(() =>
    new Set([...children.keys()].filter(folder => folder && !defaultPath.startsWith(`${folder}/`))),
  );
  const rows = useMemo(() => {
    const result: Entry[] = [];
    function visit(parent: string) {
      for (const entry of children.get(parent) ?? []) {
        result.push(entry);
        if (entry.directory && !collapsed.has(entry.path)) visit(entry.path);
      }
    }
    visit("");
    return result;
  }, [children, collapsed]);
  const file = files.find(file => file.path === path) ?? files[0];

  function toggleFolder(path: string) {
    setCollapsed(current => {
      const next = new Set(current);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }

  function open(entry: Entry) {
    setFocused(entry.path);
    if (entry.directory) {
      toggleFolder(entry.path);
      return;
    }
    setPath(entry.path);
    if (mobileOpen) closeMobileTree();
  }

  function closeMobileTree() {
    setMobileOpen(false);
    if (mobileTrigger.current?.offsetParent) mobileTrigger.current.focus({ preventScroll: true });
  }

  function navigate(event: KeyboardEvent<HTMLButtonElement>, entry: Entry, index: number) {
    let target: Entry | undefined;
    switch (event.key) {
      case "ArrowUp": target = rows[index - 1]; break;
      case "ArrowDown": target = rows[index + 1]; break;
      case "Escape":
        if (!mobileOpen) return;
        closeMobileTree();
        break;
      case "Home": target = rows[0]; break;
      case "End": target = rows.at(-1); break;
      case "ArrowRight":
        if (entry.directory && collapsed.has(entry.path)) toggleFolder(entry.path);
        else if (entry.directory) target = rows[index + 1];
        break;
      case "ArrowLeft":
        if (entry.directory && !collapsed.has(entry.path)) toggleFolder(entry.path);
        else target = rows.find(row => row.path === entry.parent);
        break;
      default: return;
    }
    event.preventDefault();
    if (target) treeRef.current?.querySelector<HTMLElement>(`[data-path="${CSS.escape(target.path)}"]`)?.focus();
  }

  const rowClass = "flex w-full items-center px-4 text-left text-[13px] text-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:ring-inset";
  return (
    <div className="template-source-grid grid h-[clamp(30rem,68dvh,46rem)] min-w-0 grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-xl border border-border bg-card md:grid-cols-[clamp(12rem,20%,18rem)_minmax(0,1fr)] md:grid-rows-1">
      <aside className="flex min-h-0 min-w-0 flex-col border-b border-border md:border-r md:border-b-0">
        <div className="hidden h-10 shrink-0 items-center border-b border-border px-4 text-[13px] font-medium md:flex">文件</div>
        <button type="button" ref={mobileTrigger} className={`${rowClass} h-11 shrink-0 gap-2 font-medium md:hidden`}
          aria-expanded={mobileOpen} aria-controls={treeId} onClick={() => setMobileOpen(!mobileOpen)}>
          <PanelLeft className="size-4" aria-hidden="true" />文件
          <ChevronDown className={`ml-auto size-4 transition-transform ${mobileOpen ? "rotate-180" : ""}`} aria-hidden="true" />
        </button>
        <div ref={treeRef} id={treeId} role="tree" aria-label="模版源文件"
          className={`${mobileOpen ? "block" : "hidden"} max-h-52 min-h-0 overflow-auto overscroll-contain py-2 md:block md:max-h-none`}>
          {rows.map((entry, index) => {
            const expanded = entry.directory && !collapsed.has(entry.path);
            const Icon = entry.directory ? (expanded ? FolderOpen : Folder) : File;
            return <button key={entry.path} type="button" role="treeitem" data-path={entry.path}
              tabIndex={entry.path === focused ? 0 : -1} aria-level={entry.depth + 1}
              aria-expanded={entry.directory ? expanded : undefined} aria-selected={entry.directory ? undefined : file.path === entry.path}
              onFocus={() => setFocused(entry.path)} onClick={() => open(entry)} onKeyDown={event => navigate(event, entry, index)}
              className={`${rowClass} h-8 gap-1.5 aria-selected:bg-foreground/[0.07] aria-selected:font-medium`}
              style={{ paddingInlineStart: 10 + entry.depth * 12 }}>
              {entry.directory
                ? <ChevronRight className={`size-3.5 shrink-0 transition-transform ${expanded ? "rotate-90" : ""}`} aria-hidden="true" />
                : <span className="w-3.5 shrink-0" />}
              <Icon className="size-4 shrink-0 stroke-[1.6]" aria-hidden="true" />
              <span className="truncate" title={entry.name}>{entry.name}</span>
            </button>;
          })}
        </div>
      </aside>
      <CodeBlock key={file.path} filename={file.path} code={file.content} language={file.path.endsWith(".svg") ? "markup" : "text"} />
    </div>
  );
}

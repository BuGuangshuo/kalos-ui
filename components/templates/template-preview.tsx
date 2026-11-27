"use client";

import dynamic from "next/dynamic";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Code2, Eye } from "lucide-react";
import { ComponentToolbar } from "@/components/component-toolbar";
import { DocTabsList, DocTabsTrigger } from "@/components/doc-tabs";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import type { TemplateSources } from "@/lib/templates";

const desktopWidth = 1440;
const previewScale = 2 / 3;

const TemplateSourceViewer = dynamic(() => import("./template-source-viewer"));

export function TemplateManualSource({ href, entry }: { href: string; entry: string }) {
  return <TemplateSourceViewer href={href} defaultPath={entry} visible registry />;
}

export function TemplatePreview({ name, previewHref, sourceHref, sources, prompt }: {
  name: string;
  previewHref: string;
  sourceHref: string;
  sources: TemplateSources;
  prompt: string;
}) {
  const [revision, setRevision] = useState(0);
  const [view, setView] = useState("preview");
  const [openedSourcePage, setOpenedSourcePage] = useState<string | null>(null);
  const [activeHref, setActiveHref] = useState(previewHref);
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const activePage = activeHref.slice(previewHref.length + 1) || sources.defaultPage;
  const sourceView = sources.pages[activePage] ?? sources.fallback;

  async function loadCompleteSource() {
    const response = await fetch(`${sourceHref}/complete`);
    if (!response.ok) throw new Error("模版源码加载失败");
    return response.text();
  }

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    function resize(width: number) {
      if (width > 0) {
        stage?.style.setProperty("--template-preview-scale", String(Math.min(previewScale, width / desktopWidth)));
      }
    }

    resize(stage.clientWidth);
    const sizes = new ResizeObserver(([entry]) => resize(entry.contentRect.width));
    sizes.observe(stage);
    return () => sizes.disconnect();
  }, []);

  useEffect(() => {
    function receiveRoute(event: MessageEvent) {
      if (!frameRef.current || event.source !== frameRef.current.contentWindow || event.origin !== window.location.origin) return;
      const data = event.data;
      if (data?.type !== "kalos-template-route" || typeof data.pathname !== "string") return;
      const { pathname } = data;
      if (pathname !== previewHref && !pathname.startsWith(`${previewHref}/`)) return;
      if (new URL(pathname, window.location.origin).pathname === pathname) setActiveHref(pathname);
    }
    window.addEventListener("message", receiveRoute);
    return () => window.removeEventListener("message", receiveRoute);
  }, [previewHref]);

  function refresh() {
    setActiveHref(previewHref);
    setOpenedSourcePage(null);
    setRevision(value => value + 1);
    setView("preview");
  }

  function changeView(value: unknown) {
    if (value === "code") setOpenedSourcePage(activePage);
    setView(value === "code" ? "code" : "preview");
  }

  return <Tabs value={view} onValueChange={changeView} className="detail-tabs">
    <div className="detail-preview-toolbar detail-preview-toolbar--component block-preview-toolbar">
      <DocTabsList className="detail-view-tabs" aria-label="模版视图">
        <DocTabsTrigger value="preview"><Eye data-icon="inline-start" />预览</DocTabsTrigger>
        <DocTabsTrigger value="code"><Code2 data-icon="inline-start" />源码</DocTabsTrigger>
      </DocTabsList>
      <ComponentToolbar source={loadCompleteSource} prompt={prompt} copyLabel="复制模版全部源码" onRefresh={refresh} previewHref={activeHref} />
    </div>
    <TabsContent value="preview" keepMounted>
      <div ref={stageRef} className="block-stage template-preview-stage" role="region" aria-label={`${name} 模版预览`}>
        <div className="template-preview-viewport">
          <iframe ref={frameRef} key={revision} src={previewHref} title={`${name} 交互预览`} className="block size-full border-0" />
        </div>
      </div>
    </TabsContent>
    <TabsContent value="code" keepMounted>
      {(view === "code" || openedSourcePage === activePage) && (
        <TemplateSourceViewer
          key={activePage}
          href={`${sourceHref}/${sourceView.scope}`}
          defaultPath={sourceView.file}
          visible={view === "code"}
        />
      )}
    </TabsContent>
  </Tabs>;
}

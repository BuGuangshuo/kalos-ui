"use client";

import { Code2, Eye } from "lucide-react";
import { DrawerDemo } from "@/components/drawer-demo";
import { CodeBlock } from "@/components/code-block";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { DocTabsList, DocTabsTrigger } from "@/components/doc-tabs";
import { drawerDirectionsExample } from "@/lib/drawer-examples";

export function DrawerExamples() {
  return <section id="drawer-directions">
    <h2>弹出方向</h2>
    <Tabs defaultValue="preview" className="detail-tabs">
      <div className="detail-preview-toolbar">
        <DocTabsList className="detail-view-tabs" aria-label="弹出方向视图">
          <DocTabsTrigger value="preview"><Eye data-icon="inline-start" />预览</DocTabsTrigger>
          <DocTabsTrigger value="code"><Code2 data-icon="inline-start" />使用</DocTabsTrigger>
        </DocTabsList>
      </div>
      <TabsContent value="preview"><div className="detail-preview"><div className="detail-preview-surface" data-component="kalos-drawer">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <DrawerDemo direction="up" trigger="上方抽屉" />
          <DrawerDemo direction="right" trigger="右侧抽屉" />
          <DrawerDemo direction="down" trigger="下方抽屉" />
          <DrawerDemo direction="left" trigger="左侧抽屉" />
        </div>
      </div></div></TabsContent>
      <TabsContent value="code"><CodeBlock code={drawerDirectionsExample} filename="drawer-directions.tsx" language="tsx" /></TabsContent>
    </Tabs>
  </section>;
}

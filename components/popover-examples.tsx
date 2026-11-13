"use client";

import { Code2, Eye } from "lucide-react";
import { ComponentDemo } from "@/components/demos";
import { CodeBlock } from "@/components/code-block";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { DocTabsList as TabsList, DocTabsTrigger as TabsTrigger } from "@/components/doc-tabs";
import { popoverExample } from "@/lib/component-examples";

const examples = [
  { variant: "basic", title: "基础用法" },
  { variant: "align", title: "对齐" },
  { variant: "form", title: "浮层表单" },
] as const;

export function PopoverExamples() {
  return examples.map(({ variant, title }) => <section id={`popover-${variant}`} key={variant}>
    <h2>{title}</h2>
    <Tabs defaultValue="preview" className="detail-tabs">
      <div className="detail-preview-toolbar">
        <TabsList className="detail-view-tabs" aria-label={`${title}视图`}>
          <TabsTrigger value="preview"><Eye data-icon="inline-start" />预览</TabsTrigger>
          <TabsTrigger value="code"><Code2 data-icon="inline-start" />使用</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="preview">
        <div className="detail-preview">
          <div className="detail-preview-surface" data-component="kalos-popover">
            <ComponentDemo slug="kalos-popover" popoverVariant={variant} />
          </div>
        </div>
      </TabsContent>
      <TabsContent value="code"><CodeBlock code={popoverExample(variant)} filename={`popover-${variant}.tsx`} language="tsx" /></TabsContent>
    </Tabs>
  </section>);
}

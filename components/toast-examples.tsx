"use client";

import { Code2, Eye } from "lucide-react";
import { ToastDemo } from "@/components/toast-demo";
import { CodeBlock } from "@/components/code-block";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { DocTabsList as TabsList, DocTabsTrigger as TabsTrigger } from "@/components/doc-tabs";
import { toastExample, toastExampleVariants } from "@/lib/toast-examples";

export function ToastExamples() {
  return toastExampleVariants.map(({ variant, title }) => <section id={`toast-${variant}`} key={variant}>
    <h2>{title}</h2>
    {variant === "stack" ? <p>最多显示 3 条；悬停或聚焦时展开并暂停计时，向上或向右滑动可关闭。</p> : null}
    <Tabs defaultValue="preview" className="detail-tabs">
      <div className="detail-preview-toolbar">
        <TabsList className="detail-view-tabs" aria-label={`${title}视图`}>
          <TabsTrigger value="preview"><Eye data-icon="inline-start" />预览</TabsTrigger>
          <TabsTrigger value="code"><Code2 data-icon="inline-start" />使用</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="preview"><div className="detail-preview"><div className="detail-preview-surface" data-component="kalos-toast"><ToastDemo variant={variant} /></div></div></TabsContent>
      <TabsContent value="code"><CodeBlock code={toastExample(variant)} filename={`toast-${variant}.tsx`} language="tsx" /></TabsContent>
    </Tabs>
  </section>);
}

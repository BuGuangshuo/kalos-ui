"use client";

import { Clock, Code2, Eye } from "lucide-react";
import { KalosBadge } from "@/registry/kalos/kalos-badge";
import { CodeBlock } from "@/components/code-block";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { DocTabsList, DocTabsTrigger } from "@/components/doc-tabs";
import { badgeExample } from "@/lib/badge-examples";

export function BadgeExamples() {
  return ([{ variant: "solid", title: "全色背景" }, { variant: "ghost", title: "无背景" }] as const).map(({ variant, title }) => <section id={`badge-${variant}`} key={variant}>
    <h2>{title}</h2>
    <Tabs defaultValue="preview" className="detail-tabs">
      <div className="detail-preview-toolbar">
        <DocTabsList className="detail-view-tabs" aria-label={`${title}变体视图`}>
          <DocTabsTrigger value="preview"><Eye data-icon="inline-start" />预览</DocTabsTrigger>
          <DocTabsTrigger value="code"><Code2 data-icon="inline-start" />使用</DocTabsTrigger>
        </DocTabsList>
      </div>
      <TabsContent value="preview">
        <div className="detail-preview badge-variant-preview">
          <div className="detail-preview-surface badge-variant-surface flex-wrap items-center gap-3">
            <KalosBadge variant={variant} tone="info" live>进行中</KalosBadge>
            <KalosBadge variant={variant} tone="warning" dot>待处理</KalosBadge>
            <KalosBadge variant={variant} tone="success">已完成</KalosBadge>
            <KalosBadge variant={variant} tone="danger">失败</KalosBadge>
            <KalosBadge variant={variant} icon={<Clock />}>已计划</KalosBadge>
            <KalosBadge variant={variant} tone="purple">内测</KalosBadge>
            <KalosBadge variant={variant} tone="pink">草稿</KalosBadge>
            <KalosBadge variant={variant} count={7} aria-label="共 7 项任务" />
          </div>
        </div>
      </TabsContent>
      <TabsContent value="code"><CodeBlock code={badgeExample(variant)} filename={`badge-${variant}.tsx`} language="tsx" /></TabsContent>
    </Tabs>
  </section>);
}

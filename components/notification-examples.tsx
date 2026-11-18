"use client";

import { Code2, Eye } from "lucide-react";
import { NotificationDemo } from "@/components/notification-demo";
import { CodeBlock } from "@/components/code-block";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { DocTabsList as TabsList, DocTabsTrigger as TabsTrigger } from "@/components/doc-tabs";
import { notificationFloatingExample } from "@/lib/notification-examples";

export function NotificationExamples() {
  return <section id="notification-floating">
    <h2>四角弹出</h2>
    <p>floating 变体通过 Portal 固定在视口内；position 默认右上，底部位置向上层叠。通知不会定时消失，点击关闭或操作成功后移除；新增通知使用唯一 id。</p>
    <Tabs defaultValue="preview" className="detail-tabs">
      <div className="detail-preview-toolbar">
        <TabsList className="detail-view-tabs" aria-label="四角弹出视图">
          <TabsTrigger value="preview"><Eye data-icon="inline-start" />预览</TabsTrigger>
          <TabsTrigger value="code"><Code2 data-icon="inline-start" />使用</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="preview"><div className="detail-preview"><NotificationDemo floating /></div></TabsContent>
      <TabsContent value="code"><CodeBlock code={notificationFloatingExample} filename="notification-floating.tsx" language="tsx" /></TabsContent>
    </Tabs>
  </section>;
}

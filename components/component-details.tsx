"use client";
import { useState } from "react";
import { Code2, Eye } from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { DocTabsList as TabsList, DocTabsTrigger as TabsTrigger } from "@/components/doc-tabs";
import { ComboboxDemo } from "@/components/combobox-demo";
import { ComponentDemo } from "@/components/demos";
import { CodeBlock } from "@/components/docs-parts";
import { ComponentToolbar } from "@/components/component-toolbar";
import { componentReference } from "@/lib/component-reference";
export { ComponentInstallation } from "@/components/component-installation";
import { ReferenceTable } from "@/components/reference-table";

export function ComponentDetails({
  slug,
  source,
  prompt,
}: {
  slug: string;
  source: string;
  prompt: string;
}) {
  const [revision, setRevision] = useState(0);
  const code = source;
  return (
    <Tabs defaultValue="preview" className="detail-tabs">
      <div className="detail-preview-toolbar detail-preview-toolbar--component">
        <TabsList className="detail-view-tabs" aria-label="组件视图">
          <TabsTrigger value="preview"><Eye data-icon="inline-start" />预览</TabsTrigger>
          <TabsTrigger value="code"><Code2 data-icon="inline-start" />源码</TabsTrigger>
        </TabsList>
        <ComponentToolbar source={code} prompt={prompt} onRefresh={() => setRevision(value => value + 1)} />
      </div>
      <TabsContent value="preview">
        <div className="detail-preview">
          <div className="detail-preview-surface" data-component={slug}>{slug === "kalos-combobox" ? <ComboboxDemo key={revision} initialOpen /> : <ComponentDemo key={revision} slug={slug} />}</div>
        </div>
      </TabsContent>
      <TabsContent value="code">
        <CodeBlock
          code={code}
          filename={`${slug}.tsx`}
          language="tsx"
        />
      </TabsContent>
    </Tabs>
  );
}

export function ComponentReference({ slug }: { slug: string }) {
  const { props, keyboard } = componentReference(slug);
  return <ReferenceTable props={props} keyboard={keyboard} />;
}

"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ComponentDemo } from "@/components/demos";
import { CodeBlock } from "@/components/docs-parts";
export function ComponentDetails({
  slug,
  source,
}: {
  slug: string;
  source: string;
}) {
  return (
    <Tabs defaultValue="preview" className="detail-tabs">
      <TabsList>
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Source code</TabsTrigger>
      </TabsList>
      <TabsContent value="preview">
        <div className="detail-preview">
          <ComponentDemo slug={slug} />
        </div>
      </TabsContent>
      <TabsContent value="code">
        <CodeBlock code={source} filename={`${slug}.tsx`} />
      </TabsContent>
    </Tabs>
  );
}

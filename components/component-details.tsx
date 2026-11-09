"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ComponentDemo } from "@/components/demos";
import { CodeBlock } from "@/components/docs-parts";
import { useFramework } from "@/components/framework";
export function ComponentDetails({
  slug,
  source,
  vueSource,
}: {
  slug: string;
  source: string;
  vueSource: string;
}) {
  const { framework } = useFramework();
  return (
    <Tabs defaultValue="preview" className="detail-tabs">
      <TabsList>
        <TabsTrigger value="preview">预览</TabsTrigger>
        <TabsTrigger value="code">源码</TabsTrigger>
      </TabsList>
      <TabsContent value="preview">
        <div className="detail-preview">
          <ComponentDemo slug={slug} />
        </div>
      </TabsContent>
      <TabsContent value="code">
        <CodeBlock
          code={framework === "vue" ? vueSource : source}
          filename={`${slug}.${framework === "vue" ? "vue" : "tsx"}`}
        />
      </TabsContent>
    </Tabs>
  );
}

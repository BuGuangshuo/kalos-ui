"use client";

import { Code2, Eye } from "lucide-react";
import { ComponentDemo } from "@/components/demos";
import { CodeBlock } from "@/components/code-block";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { DocTabsList, DocTabsTrigger } from "@/components/doc-tabs";
import { numberInputExample, numberInputExampleVariants } from "@/lib/number-input-examples";

export function NumberInputExamples() {
  return numberInputExampleVariants.map(({ variant, title }) => <section id={`number-${variant}`} key={variant}>
    <h2>{title}</h2>
    <Tabs defaultValue="preview" className="detail-tabs">
      <div className="detail-preview-toolbar">
        <DocTabsList className="detail-view-tabs" aria-label={`${title}视图`}>
          <DocTabsTrigger value="preview"><Eye data-icon="inline-start" />预览</DocTabsTrigger>
          <DocTabsTrigger value="code"><Code2 data-icon="inline-start" />使用</DocTabsTrigger>
        </DocTabsList>
      </div>
      <TabsContent value="preview"><div className="detail-preview"><div className="detail-preview-surface" data-component="kalos-number-input"><ComponentDemo slug="kalos-number-input" numberVariant={variant} /></div></div></TabsContent>
      <TabsContent value="code"><CodeBlock code={numberInputExample(variant)} filename={`number-${variant}.tsx`} language="tsx" /></TabsContent>
    </Tabs>
  </section>);
}

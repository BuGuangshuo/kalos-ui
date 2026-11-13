"use client";

import { Code2, Eye } from "lucide-react";
import { ComponentDemo } from "@/components/demos";
import { CodeBlock } from "@/components/code-block";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { DocTabsList as TabsList, DocTabsTrigger as TabsTrigger } from "@/components/doc-tabs";
import { dropdownExampleVariants, dropdownMenuExample } from "@/lib/dropdown-menu-examples";

export function DropdownMenuExamples() {
  return dropdownExampleVariants.map(({ variant, title }) => <section id={`dropdown-${variant}`} key={variant}>
    <h2>{title}</h2>
    <Tabs defaultValue="preview" className="detail-tabs">
      <div className="detail-preview-toolbar"><TabsList className="detail-view-tabs" aria-label={`${title}视图`}>
        <TabsTrigger value="preview"><Eye data-icon="inline-start" />预览</TabsTrigger>
        <TabsTrigger value="code"><Code2 data-icon="inline-start" />使用</TabsTrigger>
      </TabsList></div>
      <TabsContent value="preview"><div className="detail-preview"><div className="detail-preview-surface" data-component="kalos-dropdown-menu"><ComponentDemo slug="kalos-dropdown-menu" dropdownVariant={variant} /></div></div></TabsContent>
      <TabsContent value="code"><CodeBlock code={dropdownMenuExample(variant)} filename={`dropdown-${variant}.tsx`} language="tsx" /></TabsContent>
    </Tabs>
  </section>);
}

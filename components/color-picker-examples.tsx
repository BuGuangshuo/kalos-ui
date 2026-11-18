import { Code2, Eye } from "lucide-react";
import { ColorPickerDemo } from "@/components/color-picker-demo";
import { CodeBlock } from "@/components/code-block";
import { DocTabsList, DocTabsTrigger } from "@/components/doc-tabs";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { colorPickerExample, colorPickerVariants } from "@/lib/color-picker-examples";

export function ColorPickerExamples() {
  return colorPickerVariants.map(({ variant, title }) => <section id={`color-picker-${variant}`} key={variant}>
    <h2>{title}</h2>
    <Tabs defaultValue="preview" className="detail-tabs">
      <div className="detail-preview-toolbar">
        <DocTabsList className="detail-view-tabs" aria-label={`${title}视图`}>
          <DocTabsTrigger value="preview"><Eye data-icon="inline-start" />预览</DocTabsTrigger>
          <DocTabsTrigger value="code"><Code2 data-icon="inline-start" />使用</DocTabsTrigger>
        </DocTabsList>
      </div>
      <TabsContent value="preview">
        <div className="detail-preview">
          <div className="detail-preview-surface"><ColorPickerDemo variant={variant} /></div>
        </div>
      </TabsContent>
      <TabsContent value="code"><CodeBlock code={colorPickerExample(variant)} filename={`color-picker-${variant}.tsx`} language="tsx" /></TabsContent>
    </Tabs>
  </section>);
}

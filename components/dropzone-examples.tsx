import { Code2, Eye } from "lucide-react";
import { CodeBlock } from "@/components/code-block";
import { DocTabsList, DocTabsTrigger } from "@/components/doc-tabs";
import { DropzoneDemo } from "@/components/dropzone-demo";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { dropzoneButtonExample } from "@/lib/dropzone-example";

export function DropzoneExamples() {
  return (
    <section id="dropzone-button">
      <h2>按钮上传</h2>
      <Tabs defaultValue="preview" className="detail-tabs">
        <div className="detail-preview-toolbar">
          <DocTabsList className="detail-view-tabs" aria-label="按钮上传视图">
            <DocTabsTrigger value="preview"><Eye data-icon="inline-start" />预览</DocTabsTrigger>
            <DocTabsTrigger value="code"><Code2 data-icon="inline-start" />使用</DocTabsTrigger>
          </DocTabsList>
        </div>
        <TabsContent value="preview">
          <div className="detail-preview dropzone-button-preview">
            <div className="detail-preview-surface"><DropzoneDemo variant="button" /></div>
          </div>
        </TabsContent>
        <TabsContent value="code"><CodeBlock code={dropzoneButtonExample} filename="dropzone-button.tsx" /></TabsContent>
      </Tabs>
    </section>
  );
}

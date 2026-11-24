"use client";

import { useMemo, useState } from "react";
import { Code2, Eye } from "lucide-react";
import { DocTabsList, DocTabsTrigger } from "@/components/doc-tabs";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ComponentToolbar } from "@/components/component-toolbar";
import { BlockSource, blockSourceText, type BlockRegistrySource } from "@/components/block-source";
import type { BlockSlug } from "@/lib/blocks";
import { blockPreviews } from "@/components/block-previews";

export function BlockPreview({ slug, source, prompt }: { slug: BlockSlug; source: BlockRegistrySource; prompt: string }) {
  const [revision, setRevision] = useState(0);
  const Preview = blockPreviews[slug];
  const allFiles = useMemo(() => blockSourceText(source), [source]);

  return <Tabs defaultValue="preview" className="detail-tabs">
    <div className="detail-preview-toolbar detail-preview-toolbar--component block-preview-toolbar">
      <DocTabsList className="detail-view-tabs" aria-label="Block 视图">
        <DocTabsTrigger value="preview"><Eye data-icon="inline-start" />预览</DocTabsTrigger>
        <DocTabsTrigger value="code"><Code2 data-icon="inline-start" />源码</DocTabsTrigger>
      </DocTabsList>
      <ComponentToolbar source={allFiles} copyLabel="复制 Block 全部源码" prompt={prompt} onRefresh={() => setRevision(value => value + 1)} />
    </div>
    <TabsContent value="preview">
      <div className="block-stage" data-block={slug}>
        <Preview key={revision} />
      </div>
    </TabsContent>
    <TabsContent value="code"><BlockSource source={source} /></TabsContent>
  </Tabs>;
}

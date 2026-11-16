"use client";

import { useState } from "react";
import { Code2, Eye } from "lucide-react";
import { KalosPagination } from "@/registry/kalos/kalos-pagination";
import { CodeBlock } from "@/components/code-block";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { DocTabsList, DocTabsTrigger } from "@/components/doc-tabs";
import { paginationExample } from "@/lib/pagination-examples";

export function PaginationExamples() {
  const [page, setPage] = useState(1);
  const title = "简洁模式";
  return <section id="pagination-compact">
    <h2>{title}</h2>
    <Tabs defaultValue="preview" className="detail-tabs">
      <div className="detail-preview-toolbar">
        <DocTabsList className="detail-view-tabs" aria-label={`${title}视图`}>
          <DocTabsTrigger value="preview"><Eye data-icon="inline-start" />预览</DocTabsTrigger>
          <DocTabsTrigger value="code"><Code2 data-icon="inline-start" />使用</DocTabsTrigger>
        </DocTabsList>
      </div>
      <TabsContent value="preview"><div className="detail-preview pagination-example-preview"><div className="detail-preview-surface"><KalosPagination aria-label="简洁分页" page={page} onPageChange={setPage} total={1284} pageSize={20} compact /></div></div></TabsContent>
      <TabsContent value="code"><CodeBlock code={paginationExample("compact")} filename="pagination-compact.tsx" language="tsx" /></TabsContent>
    </Tabs>
  </section>;
}

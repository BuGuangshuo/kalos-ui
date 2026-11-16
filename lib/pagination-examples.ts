export type PaginationExampleVariant = "default" | "compact";

export function paginationExample(variant: PaginationExampleVariant = "default") {
  return `"use client";

import { useState } from "react";
import { KalosPagination } from "@/components/ui/kalos-pagination";

export default function Example() {
  const [page, setPage] = useState(1);${variant === "default" ? '\n  const [pageSize, setPageSize] = useState(20);' : ""}

  return <KalosPagination
    aria-label="文档分页"
    page={page}
    onPageChange={setPage}
    total={1284}
    pageSize={${variant === "default" ? "pageSize" : "20"}}${variant === "default" ? '\n    pageSizes={[20, 50, 100]}\n    onPageSizeChange={setPageSize}' : "\n    compact"}
  />;
}`;
}

"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { KalosPagination } from "@/registry/kalos/kalos-pagination";

const titles = ["设计规范", "会议纪要", "使用指南", "联系人清单", "产品说明", "每周简报", "文件归档说明", "反馈记录", "接口文档", "发布清单", "培训资料", "操作手册"];
const authors = ["陈晓", "林舟", "周宁", "吴昕"];
const pageSizes = [20, 50, 100];

export function PaginationDemo({ compact = false }: { compact?: boolean }) {
  const [page, setPage] = useState(5);
  const [pageSize, setPageSize] = useState(20);
  const first = (page - 1) * pageSize;
  const total = 1284;

  return <section className="pagination-demo" aria-label="文档列表">
    <header className="pagination-demo-header"><h3>文档</h3><span>{total.toLocaleString("zh-CN")}</span></header>
    <ol key={`${page}-${pageSize}`} className="pagination-demo-list" start={first + 1}>
      {Array.from({ length: Math.min(pageSize, total - first) }, (_, index) => {
        const row = first + index;
        return <li key={row}><FileText aria-hidden="true" /><span className="pagination-demo-id">{String(row + 1).padStart(4, "0")}</span><span className="pagination-demo-name">{titles[row % titles.length]}.pdf</span><span className="pagination-demo-author">{authors[row % authors.length]}</span><span className="pagination-demo-date">11月{String(16 - row % 12).padStart(2, "0")}日</span></li>;
      })}
    </ol>
    <footer className="pagination-demo-footer"><KalosPagination aria-label="文档分页" page={page} onPageChange={setPage}
      total={total} pageSize={pageSize} pageSizes={compact ? undefined : pageSizes} onPageSizeChange={setPageSize} /></footer>
  </section>;
}

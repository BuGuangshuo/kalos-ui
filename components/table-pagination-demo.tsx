"use client";

import { useState } from "react";
import { KalosTable, type KalosTableColumn, type KalosTableRow } from "@/registry/kalos/kalos-table";
import { KalosPagination } from "@/registry/kalos/kalos-pagination";

const columns: KalosTableColumn[] = [
  { key: "number", label: "编号", width: 80 },
  { key: "name", label: "姓名", type: "title", width: 120 },
  { key: "email", label: "邮箱地址", width: 240 },
  { key: "department", label: "部门", type: "tag", width: 140 },
];
const names = ["陈晓", "林舟", "周宁", "吴昕", "张悦", "李明", "王珂", "赵然"];
const departments = ["设计部", "研发部", "运营部"];
const contacts: KalosTableRow[] = Array.from({ length: 67 }, (_, index) => ({
  id: `contact-${index + 1}`,
  number: String(index + 1).padStart(3, "0"),
  name: names[index % names.length],
  email: `contact${index + 1}@example.com`,
  department: departments[index % departments.length],
}));
const pageSizes = [20, 50, 100];

export function TablePaginationDemo() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const start = (page - 1) * pageSize;
  const rows = contacts.slice(start, start + pageSize);

  return <KalosTable aria-label="分页联系人" columns={columns} rows={rows}
    tagTones={{ 设计部: "violet", 研发部: "blue", 运营部: "green" }}
    scrollAreaProps={{ key: `${page}-${pageSize}`, style: { maxHeight: 280 } }}
    pagination={<KalosPagination aria-label="联系人表格分页" page={page} onPageChange={setPage}
      total={contacts.length} pageSize={pageSize} pageSizes={pageSizes} onPageSizeChange={setPageSize} />}
  />;
}

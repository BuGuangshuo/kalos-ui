export type TableExampleVariant = "data" | "basic" | "bordered" | "footer" | "actions" | "merged" | "reorder" | "filters";

export const tableExampleVariants = [
  { variant: "basic", title: "基础表格" },
  { variant: "bordered", title: "表格线" },
  { variant: "footer", title: "汇总行" },
  { variant: "actions", title: "行操作" },
  { variant: "data", title: "可编辑数据表格" },
  { variant: "merged", title: "合并单元格" },
  { variant: "reorder", title: "拖拽排序" },
  { variant: "filters", title: "列筛选" },
] as const;

export function basicTableExample() {
  return `import { KalosTable, type KalosTableColumn } from "@/components/ui/kalos-table";

const columns: KalosTableColumn[] = [
  { key: "name", label: "姓名", type: "title", width: 160 },
  { key: "email", label: "邮箱地址", width: 240 },
];

export default function Example() {
  return <KalosTable
    aria-label="联系人"
    columns={columns}
    defaultRows={[
      { id: "1", name: "陈晓", email: "chen@example.com" },
      { id: "2", name: "林舟", email: "lin@example.com" },
    ]}
  />;
}`;
}

/** Read the real demo definitions on the server so examples include their SVG icons and data. */
export function tableExample(variant: TableExampleVariant, demoSource: string, optionsSource = "") {
  const importTable = 'import { KalosTable, type KalosTableColumn, type KalosTableRow } from "@/components/ui/kalos-table";';
  if (variant === "data") {
    const definitions = demoSource.slice(demoSource.indexOf("export function StackBrandIcon"), demoSource.indexOf("const invoiceColumns"));
    return `"use client";

import { useId, useState, type ComponentType } from "react";
import { AlignLeft, CalendarDays, Grid2X2, Link2, Copy, Download, ExternalLink, Folder, FolderInput, MoreHorizontal, Pencil, Star, Trash2 } from "lucide-react";
${importTable}
import { KalosButton } from "@/components/ui/kalos-button";
import { KalosDialog } from "@/components/ui/kalos-dialog";
import { KalosInput } from "@/components/ui/kalos-input";
import { KalosDropdownMenu, type KalosDropdownMenuProps } from "@/components/ui/kalos-dropdown-menu";
import { tableLink } from "@/components/ui/kalos-table-model";
import { FieldGroup } from "@/components/ui/field";
import { toast, Toaster } from "sonner";

type DropdownDemoComponents = { KalosDialog: typeof KalosDialog; KalosButton: typeof KalosButton; KalosInput: typeof KalosInput };

${optionsSource.slice(optionsSource.indexOf("type StackMenuProps"))}

${definitions}
export default function Example() {
  const [rows, setRows] = useState<KalosTableRow[]>(stackRows);
  return <><Toaster /><KalosTable
    title="Design Stack"
    icon={<StackTitleIcon />}
    columns={stackColumns}
    rows={rows}
    onRowsChange={setRows}
    tagTones={stackTones}
    editable
    selectable
    sortable
    defaultSort={{ key: "tool", direction: "ascending" }}
    addRowLabel="Add row"
    rowActionsLabel="Options"
    rowActionsWidth={84}
    className="max-w-[804px]"
    rowActions={row => <StackRowOptions row={row} categories={Object.keys(stackTones)} KalosDropdownMenu={KalosDropdownMenu} components={{ KalosDialog, KalosButton, KalosInput }}
      onSave={next => setRows(current => current.map(item => item.id === row.id ? next : item))}
      onDuplicate={() => { setRows(current => [...current, { ...row, id: crypto.randomUUID(), tool: String(row.tool) + " 副本" }]); toast.success("已创建副本"); }}
      onDelete={() => { setRows(current => current.filter(item => item.id !== row.id)); toast.success("记录已删除"); }}
    />}
  /></>;
}`;
  }
  if (variant === "merged" || variant === "reorder") {
    const definitions = variant === "merged"
      ? demoSource.slice(demoSource.indexOf("export const mergedColumns"), demoSource.indexOf("export const reorderColumns"))
      : demoSource.slice(demoSource.indexOf("export const reorderColumns"), demoSource.indexOf("type TableActionComponents"));
    return `"use client";

${importTable}

${definitions}
export default function Example() {
  return <KalosTable
    aria-label="${variant === "merged" ? "文件归档与合并单元格" : "可拖拽文件"}"
    ${variant === "merged" ? 'variant="bordered"' : ""}
    columns={${variant === "merged" ? "mergedColumns" : "reorderColumns"}}
    defaultRows={${variant === "merged" ? "mergedRows" : "reorderRows"}}
    tagTones={{ PDF: "blue", Figma: "violet", "PDF / SVG": "blue", CSV: "green", Markdown: "gray" }}${variant === "reorder" ? "\n    reorderable" : ""}
  />;
}`;
  }
  if (variant === "actions") {
    const source = demoSource.slice(demoSource.indexOf("function FileRowActions"), demoSource.indexOf("export function TableDemo"))
      .replace("row, onSave, onDelete, components", "row, onSave, onDelete")
      .replace("  components: TableActionComponents;\n", "")
      .replace("  const { KalosButton, KalosDialog, KalosAlertDialog, KalosInput } = components;\n", "");
    return `"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { KalosTable, type KalosTableRow } from "@/components/ui/kalos-table";
import { KalosButton } from "@/components/ui/kalos-button";
import { KalosDialog } from "@/components/ui/kalos-dialog";
import { KalosAlertDialog } from "@/components/ui/kalos-alert-dialog";
import { KalosInput } from "@/components/ui/kalos-input";
import { FieldGroup } from "@/components/ui/field";

${source}
export default function Example() {
  const [rows, setRows] = useState<KalosTableRow[]>([
    { id: "doc1", name: "组件使用指南.pdf", size: "2.4 MB" },
    { id: "doc2", name: "联系人.csv", size: "128 KB" },
    { id: "doc3", name: "设计规范.fig", size: "8.1 MB" },
  ]);
  const [result, setResult] = useState("");
  return <div className="flex w-full flex-col gap-3">
    <KalosTable aria-label="文件" columns={[
      { key: "name", label: "文件", type: "title", width: 440 },
      { key: "size", label: "大小", width: 196 },
    ]} rows={rows} rowActionsWidth={84} rowActions={row => <FileRowActions row={row}
      onSave={next => { setRows(current => current.map(item => item.id === row.id ? next : item)); setResult("已保存 " + next.name); }}
      onDelete={() => { setRows(current => current.filter(item => item.id !== row.id)); setResult("已删除 " + row.name); }}
    />} />
    {result ? <span role="status" className="text-xs text-muted-foreground">{result}</span> : null}
  </div>;
}`;
  }
  const definitions = demoSource.slice(demoSource.indexOf("const invoiceColumns"), demoSource.indexOf("export const mergedColumns"));
  return `"use client";

${importTable}

${definitions}
export default function Example() {
  return <KalosTable
    aria-label="近期账单"
    ${variant === "bordered" ? 'variant="bordered"' : ""}
    columns={${variant === "filters" ? 'invoiceColumns.map(column => ["status", "method"].includes(column.key) ? { ...column, filterable: true } : column)' : "invoiceColumns"}}
    defaultRows={invoices}
    tagTones={{ 已支付: "green", 待支付: "amber", 未支付: "gray" }}${variant === "footer" ? '\n    footer={["合计", null, null, "¥750.00"]}' : ""}
  />;
}`;
}

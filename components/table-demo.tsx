"use client";

import { useId, useState, type ComponentType } from "react";
import { AlignLeft, CalendarDays, Grid2X2, Link2, Pencil, Trash2 } from "lucide-react";
import type { KalosTableColumn, KalosTableProps, KalosTableRow } from "@/components/ui/kalos-table-model";
import type { DemoComponents } from "@/components/demo-content";
import { FieldGroup } from "@/components/ui/field";
import type { TableExampleVariant } from "@/lib/table-examples";
import { StackRowOptions } from "@/components/table-row-options";
import { toast } from "sonner";

export function StackBrandIcon({ name }: { name: string }) {
  const clipId = useId();
  if (name === "Figma") return <svg viewBox="0 0 18 27" aria-hidden="true"><path fill="#0acf83" d="M4.5 27A4.5 4.5 0 0 0 9 22.5V18H4.5a4.5 4.5 0 0 0 0 9Z"/><path fill="#a259ff" d="M4.5 9H9v9H4.5a4.5 4.5 0 0 1 0-9Z"/><path fill="#f24e1e" d="M4.5 0H9v9H4.5a4.5 4.5 0 0 1 0-9Z"/><path fill="#ff7262" d="M9 0h4.5a4.5 4.5 0 0 1 0 9H9Z"/><circle fill="#1abcfe" cx="13.5" cy="13.5" r="4.5"/></svg>;
  if (name === "Framer") return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5 0h14v8h-7l7 8h-7v8l-7-8V8h7L5 0Z"/></svg>;
  if (name === "Linear") return <svg viewBox="0 0 24 24" aria-hidden="true"><defs><clipPath id={clipId}><circle cx="12" cy="12" r="11"/></clipPath></defs><g clipPath={`url(#${clipId})`}><circle cx="12" cy="12" r="11" fill="#6864df"/><path d="m-2 8 18 18M-2 12l14 14M-2 16l10 10M0 4l20 20M3 1l21 21" stroke="white" strokeWidth="1.2"/></g></svg>;
  if (name === "Loom") return <svg viewBox="0 0 24 24" fill="none" stroke="#6254ff" strokeWidth="2.5" aria-hidden="true"><circle cx="12" cy="12" r="4"/>{Array.from({ length: 12 }, (_, index) => <path key={index} d="M12 1v4" transform={`rotate(${index * 30} 12 12)`}/>)}</svg>;
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2 12 21H0Z"/></svg>;
}

export function StackTitleIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true"><rect x="1" y="1" width="18" height="18" rx="4" fill="currentColor"/><path d="M6 6.5h8M6 10h8M6 13.5h4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}

export const stackColumns: KalosTableColumn[] = [
  { key: "tool", label: "Tool", type: "title", icon: <AlignLeft />, width: 216 },
  { key: "category", label: "Category", type: "tag", icon: <Grid2X2 />, width: 188 },
  { key: "website", label: "Website", type: "link", icon: <Link2 />, width: 148 },
  { key: "renews", label: "Renews", type: "date", icon: <CalendarDays />, width: 128 },
];

export const stackRows: KalosTableRow[] = [
  { id: "figma", tool: "Figma", icon: <StackBrandIcon name="Figma" />, category: "Design", website: "figma.com", renews: "Mar 12, 2026" },
  { id: "framer", tool: "Framer", icon: <StackBrandIcon name="Framer" />, category: "Website", website: "framer.com", renews: "May 2, 2026" },
  { id: "linear", tool: "Linear", icon: <StackBrandIcon name="Linear" />, category: "Issue tracking", website: "linear.app", renews: "Jan 4, 2026" },
  { id: "loom", tool: "Loom", icon: <StackBrandIcon name="Loom" />, category: "Video", website: "loom.com", renews: "Nov 18, 2026" },
  { id: "vercel", tool: "Vercel", icon: <StackBrandIcon name="Vercel" />, category: "Hosting", website: "vercel.com", renews: "Aug 21, 2026" },
];
export const stackTones = { Design: "violet", Website: "pink", "Issue tracking": "blue", Video: "green", Hosting: "gray" } as const;

const invoiceColumns: KalosTableColumn[] = [
  { key: "invoice", label: "账单", type: "title", width: 140 },
  { key: "status", label: "状态", type: "tag", width: 120 },
  { key: "method", label: "付款方式", width: 160 },
  { key: "amount", label: "金额", type: "number", width: 120, format: value => `¥${Number(value).toFixed(2)}` },
];
const invoices: KalosTableRow[] = [
  { id: "inv1", invoice: "INV001", status: "已支付", method: "信用卡", amount: 250 },
  { id: "inv2", invoice: "INV002", status: "待支付", method: "支付宝", amount: 150 },
  { id: "inv3", invoice: "INV003", status: "未支付", method: "银行转账", amount: 350 },
];

export const mergedColumns: KalosTableColumn[] = [
  {
    key: "category",
    label: "分类",
    type: "title",
    width: 96,
    colSpan: (row) =>
      row.kind === "group"
        ? 6
        : row.kind === "summary"
          ? 4
          : ["bundle", "shared"].includes(String(row.kind))
            ? 2
            : 1,
    format: (value, row) =>
      ["group", "summary"].includes(String(row.kind)) ? (
        <span className="font-medium">{value}</span>
      ) : (
        value
      ),
  },
  {
    key: "name",
    label: "文件",
    width: 200,
    colSpan: (row) => (row.kind === "note" ? 5 : 1),
  },
  {
    key: "type",
    label: "格式",
    type: "tag",
    width: 100,
    colSpan: (row) => (row.kind === "bundle" ? 2 : 1),
  },
  { key: "size", label: "大小", width: 80 },
  {
    key: "updated",
    label: "最近更新",
    width: 152,
    colSpan: (row) =>
      ["bundle", "shared", "summary"].includes(String(row.kind)) ? 2 : 1,
  },
  { key: "owner", label: "负责人", width: 92 },
];
export const mergedRows: KalosTableRow[] = [
  { id: "design", kind: "group", category: "设计资料" },
  {
    id: "spec",
    category: "设计",
    name: "设计规范.fig",
    type: "Figma",
    size: "8.1 MB",
    updated: "11 月 12 日",
    owner: "陈晓",
  },
  {
    id: "guide",
    kind: "bundle",
    category: "组件指南与图标 · 2.4 MB",
    type: "PDF / SVG",
    updated: "11 月 12 日 · 林舟",
  },
  {
    id: "note",
    kind: "note",
    category: "备注",
    name: "包含组件使用指南、图标源文件与导出资源",
  },
  { id: "shared", kind: "group", category: "共享文档" },
  {
    id: "contacts",
    category: "联系人",
    name: "联系人.csv",
    type: "CSV",
    size: "128 KB",
    updated: "11 月 11 日",
    owner: "林舟",
  },
  {
    id: "minutes",
    kind: "shared",
    category: "会议纪要.md",
    type: "Markdown",
    size: "24 KB",
    updated: "11 月 10 日 · 周宁",
  },
  {
    id: "total",
    kind: "summary",
    category: "合计 · 5 个文件",
    updated: "10.7 MB · 3 位负责人",
  },
];

export const reorderColumns: KalosTableColumn[] = [
  { key: "name", label: "文件", type: "title", width: 320 },
  { key: "type", label: "类型", type: "tag", width: 140 },
  { key: "size", label: "大小", width: 220 },
];
export const reorderRows: KalosTableRow[] = [
  { id: "guide", name: "组件使用指南.pdf", type: "PDF", size: "2.4 MB" },
  { id: "contacts", name: "联系人.csv", type: "CSV", size: "128 KB" },
  { id: "spec", name: "设计规范.fig", type: "Figma", size: "8.1 MB" },
  { id: "notes", name: "会议纪要.md", type: "Markdown", size: "24 KB" },
];

type TableActionComponents = Pick<DemoComponents, "KalosButton" | "KalosDialog" | "KalosAlertDialog" | "KalosInput">;

function FileRowActions({ row, onSave, onDelete, components }: {
  row: KalosTableRow;
  onSave: (row: KalosTableRow) => void;
  onDelete: () => void;
  components: TableActionComponents;
}) {
  const { KalosButton, KalosDialog, KalosAlertDialog, KalosInput } = components;
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(String(row.name));
  const [size, setSize] = useState(String(row.size));
  return <div className="flex items-center gap-1">
    <KalosDialog trigger={<Pencil />} triggerProps={{ variant: "ghost", size: "icon", "aria-label": `编辑 ${row.name}` }} title="编辑文件" open={open} onOpenChange={next => {
      if (next) { setName(String(row.name)); setSize(String(row.size)); }
      setOpen(next);
    }} footer={<>
      <KalosButton variant="outline" onClick={() => setOpen(false)}>取消</KalosButton>
      <KalosButton disabled={!name.trim()} onClick={() => { onSave({ ...row, name: name.trim(), size }); setOpen(false); }}>保存</KalosButton>
    </>}>
      <FieldGroup className="gap-3.5">
        <KalosInput label="文件名" value={name} onChange={event => setName(event.target.value)} />
        <KalosInput label="文件大小" value={size} onChange={event => setSize(event.target.value)} />
      </FieldGroup>
    </KalosDialog>
    <KalosAlertDialog trigger={<Trash2 />} triggerProps={{ variant: "ghost", size: "icon", "aria-label": `删除 ${row.name}` }} title="删除这个文件？" description={`“${row.name}”将从列表中删除。`} actionLabel="删除文件" onConfirm={onDelete} />
  </div>;
}

export function TableDemo({ KalosTable, KalosDropdownMenu, KalosButton, KalosDialog, KalosAlertDialog, KalosInput, variant = "data", compact = false }: {
  KalosTable: ComponentType<KalosTableProps>;
  KalosDropdownMenu: DemoComponents["KalosDropdownMenu"];
  variant?: TableExampleVariant;
  compact?: boolean;
} & TableActionComponents) {
  const [tools, setTools] = useState<KalosTableRow[]>(stackRows);
  const [documents, setDocuments] = useState<KalosTableRow[]>([
    { id: "doc1", name: "组件使用指南.pdf", size: "2.4 MB" },
    { id: "doc2", name: "联系人.csv", size: "128 KB" },
    { id: "doc3", name: "设计规范.fig", size: "8.1 MB" },
  ]);
  const [actionResult, setActionResult] = useState("");
  const options = (row: KalosTableRow) => <StackRowOptions row={row} categories={Object.keys(stackTones)} KalosDropdownMenu={KalosDropdownMenu} components={{ KalosDialog, KalosButton, KalosInput }}
    onSave={next => setTools(current => current.map(item => item.id === row.id ? next : item))}
    onDuplicate={() => { setTools(current => [...current, { ...row, id: crypto.randomUUID(), tool: `${row.tool} 副本` }]); toast.success("已创建副本"); }}
    onDelete={() => { setTools(current => current.filter(item => item.id !== row.id)); toast.success("记录已删除"); }}
  />;
  if (compact) return <div className="table-compact-demo"><KalosTable title="Design Stack" icon={<StackTitleIcon />} columns={stackColumns} rows={tools} tagTones={stackTones} rowActions={options} rowActionsLabel="Options" rowActionsWidth={84} className="max-w-[804px]" /></div>;
  if (variant === "basic" || variant === "footer" || variant === "bordered") return <KalosTable variant={variant === "bordered" ? "bordered" : "default"} columns={invoiceColumns} defaultRows={invoices} aria-label="近期账单" tagTones={{ 已支付: "green", 待支付: "amber", 未支付: "gray" }} footer={variant === "footer" ? ["合计", null, null, "¥750.00"] : undefined} />;
  if (variant === "merged") return <KalosTable variant="bordered" columns={mergedColumns} defaultRows={mergedRows} aria-label="文件归档与合并单元格" tagTones={{ Figma: "violet", "PDF / SVG": "blue", CSV: "green", Markdown: "gray" }} />;
  if (variant === "reorder") return <KalosTable columns={reorderColumns} defaultRows={reorderRows} aria-label="可拖拽文件" tagTones={{ PDF: "blue", Figma: "violet", CSV: "green", Markdown: "gray" }} reorderable />;
  if (variant === "filters") return <KalosTable columns={invoiceColumns.map(column => ["status", "method"].includes(column.key) ? { ...column, filterable: true } : column)} defaultRows={invoices} aria-label="可筛选账单" tagTones={{ 已支付: "green", 待支付: "amber", 未支付: "gray" }} />;
  if (variant === "actions") return <div className="flex w-full flex-col gap-3"><KalosTable aria-label="文件" columns={[{ key: "name", label: "文件", type: "title", width: 440 }, { key: "size", label: "大小", width: 196 }]} rows={documents} rowActionsWidth={84} rowActions={row => <FileRowActions row={row} components={{ KalosButton, KalosDialog, KalosAlertDialog, KalosInput }} onSave={next => {
    setDocuments(current => current.map(document => document.id === row.id ? next : document)); setActionResult(`已保存 ${next.name}`);
  }} onDelete={() => { setDocuments(current => current.filter(document => document.id !== row.id)); setActionResult(`已删除 ${row.name}`); }} />} />{actionResult ? <span role="status" className="text-xs text-muted-foreground">{actionResult}</span> : null}</div>;
  return <KalosTable
    title="Design Stack"
    icon={<StackTitleIcon />}
    columns={stackColumns}
    rows={tools}
    onRowsChange={setTools}
    tagTones={stackTones}
    editable
    selectable
    sortable
    defaultSort={{ key: "tool", direction: "ascending" }}
    addRowLabel="Add row"
    rowActionsLabel="Options"
    rowActionsWidth={84}
    rowActions={options}
    className="max-w-[804px]"
  />;
}

"use client";

import { useState } from "react";
import { AlignLeft, CalendarDays, Grid2X2, Link2 } from "lucide-react";
import { toast } from "sonner";
import { KalosTable, type KalosTableColumn, type KalosTableRow } from "@/registry/kalos/kalos-table";
import { StackBrandIcon, StackTitleIcon } from "@/components/stack-brand-icons";
import { StackRowOptions } from "@/components/table-row-options";

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

export function DesignStackTable({
  columns = stackColumns,
  initialRows = stackRows,
  compact = false,
  className = "max-w-[804px]",
}: {
  columns?: KalosTableColumn[];
  initialRows?: KalosTableRow[];
  compact?: boolean;
  className?: string;
}) {
  const [rows, setRows] = useState(initialRows);

  return (
    <KalosTable
      title="Design Stack"
      icon={<StackTitleIcon />}
      columns={columns}
      rows={rows}
      onRowsChange={setRows}
      tagTones={stackTones}
      editable={!compact}
      selectable={!compact}
      sortable={!compact}
      defaultSort={compact ? undefined : { key: "tool", direction: "ascending" }}
      addRowLabel="Add row"
      rowActionsLabel="Options"
      rowActionsWidth={84}
      className={className}
      rowActions={row => (
        <StackRowOptions
          row={row}
          categories={Object.keys(stackTones)}
          onSave={next => setRows(current => current.map(item => item.id === row.id ? next : item))}
          onDuplicate={() => {
            setRows(current => [...current, { ...row, id: crypto.randomUUID(), tool: `${row.tool} 副本` }]);
            toast.success("已创建副本");
          }}
          onDelete={() => {
            setRows(current => current.filter(item => item.id !== row.id));
            toast.success("记录已删除");
          }}
        />
      )}
    />
  );
}

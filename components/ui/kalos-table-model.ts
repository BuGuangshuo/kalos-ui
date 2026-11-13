import type { ReactNode } from "react";

export type KalosTableTone = "gray" | "violet" | "pink" | "blue" | "green" | "amber";
export type KalosTableRow = { id: string; icon?: ReactNode; [key: string]: string | number | ReactNode };
export type KalosTableColumn = {
  key: string;
  label: string;
  icon?: ReactNode;
  width?: number;
  type?: "title" | "text" | "tag" | "link" | "number" | "date";
  editable?: boolean;
  sortable?: boolean;
  options?: string[];
  filterable?: boolean;
  colSpan?: number | ((row: KalosTableRow) => number);
  format?: (value: string | number, row: KalosTableRow) => ReactNode;
};
export type KalosTableProps = {
  variant?: "default" | "bordered";
  columns: KalosTableColumn[];
  rows?: KalosTableRow[];
  defaultRows?: KalosTableRow[];
  onRowsChange?: (rows: KalosTableRow[]) => void;
  onSelectionChange?: (ids: string[]) => void;
  title?: string;
  icon?: ReactNode;
  "aria-label"?: string;
  caption?: string;
  editable?: boolean;
  selectable?: boolean;
  sortable?: boolean;
  reorderable?: boolean;
  defaultSort?: { key: string; direction: "ascending" | "descending" };
  tagTones?: Record<string, KalosTableTone>;
  footer?: ReactNode[];
  rowActions?: (row: KalosTableRow) => ReactNode;
  rowActionsLabel?: string;
  rowActionsWidth?: number;
  addRowLabel?: string;
  emptyMessage?: string;
  dir?: "ltr" | "rtl";
  className?: string;
};
export type TablePosition = { row: number; column: number };
export type TableRange = { start: TablePosition; end: TablePosition };

/** Covered columns remain in the data model but do not render an extra cell. */
export function tableCellSpans(columns: KalosTableColumn[], row: KalosTableRow): number[] {
  const spans = Array<number>(columns.length).fill(0);
  for (let index = 0; index < columns.length;) {
    const value = columns[index].colSpan;
    const requested = typeof value === "function" ? value(row) : value ?? 1;
    const span = Number.isFinite(requested) ? Math.max(1, Math.min(columns.length - index, Math.floor(requested))) : 1;
    spans[index] = span;
    index += span;
  }
  return spans;
}

export function filterTableRows(rows: KalosTableRow[], filters: Record<string, string | undefined>) {
  const active = Object.entries(filters).filter((entry): entry is [string, string] => entry[1] !== undefined);
  return active.length ? rows.filter(row => active.every(([key, value]) => cellText(row[key]) === value)) : rows;
}

export function reorderTableRows(rows: KalosTableRow[], ids: string[], targetId: string, position: "before" | "after") {
  const moving = new Set(ids);
  if (moving.has(targetId) || !rows.some(row => row.id === targetId)) return rows;
  const next = rows.filter(row => !moving.has(row.id));
  const index = next.findIndex(row => row.id === targetId) + (position === "after" ? 1 : 0);
  next.splice(index, 0, ...rows.filter(row => moving.has(row.id)));
  return next;
}

export function cellText(value: ReactNode): string {
  return typeof value === "string" || typeof value === "number" ? String(value) : "";
}

export function inTableRange(range: TableRange | null, row: number, column: number) {
  return !!range && row >= Math.min(range.start.row, range.end.row) && row <= Math.max(range.start.row, range.end.row)
    && column >= Math.min(range.start.column, range.end.column) && column <= Math.max(range.start.column, range.end.column);
}

export function tableColumnName(index: number): string {
  let name = "";
  for (let n = index + 1; n > 0; n = Math.floor((n - 1) / 26)) name = String.fromCharCode(65 + (n - 1) % 26) + name;
  return name;
}

export function tableLink(value: string): string | undefined {
  if (!value.trim()) return;
  try {
    const url = new URL(/^[a-z][a-z\d+.-]*:/i.test(value) ? value : `https://${value}`);
    if ((url.protocol === "https:" || url.protocol === "http:") && url.hostname) return url.href;
  } catch { /* Invalid URLs remain plain text. */ }
}

export function parseTableValue(value: string, column: KalosTableColumn): string | number | undefined {
  if (column.type === "number" && value.trim() !== "") {
    const number = Number(value.replaceAll(",", "").replace("−", "-"));
    return Number.isFinite(number) ? number : undefined;
  }
  if (column.options && value !== "" && !column.options.includes(value)) return undefined;
  return value;
}

export function sortTableRows(rows: KalosTableRow[], columns: KalosTableColumn[], sort: { key: string; direction: "ascending" | "descending" } | null) {
  if (!sort) return rows;
  const column = columns.find(column => column.key === sort.key);
  return rows.toSorted((a, b) => {
    const left = cellText(a[sort.key]), right = cellText(b[sort.key]);
    const comparison = column?.type === "number" ? Number(left) - Number(right)
      : column?.type === "date" && Number.isFinite(Date.parse(left)) && Number.isFinite(Date.parse(right)) ? Date.parse(left) - Date.parse(right)
      : left.localeCompare(right, "zh-CN", { numeric: true });
    return sort.direction === "ascending" ? comparison : -comparison;
  });
}

/** Applies a tab-separated clipboard rectangle by stable row IDs, including under sorting. */
export function pasteTableCells(rows: KalosTableRow[], visible: KalosTableRow[], columns: KalosTableColumn[], origin: TablePosition, text: string) {
  const changes = new Map<string, KalosTableRow>();
  const matrix = text.replace(/\r\n?/g, "\n").replace(/\n$/, "").split("\n").map(line => line.split("\t"));
  matrix.forEach((values, rowOffset) => {
    const row = visible[origin.row + rowOffset];
    if (!row) return;
    values.forEach((value, columnOffset) => {
      const column = columns[origin.column + columnOffset];
      if (!column || column.editable === false) return;
      const parsed = parseTableValue(value, column);
      if (parsed === undefined) return;
      changes.set(row.id, { ...(changes.get(row.id) ?? row), [column.key]: parsed });
    });
  });
  return rows.map(row => changes.get(row.id) ?? row);
}

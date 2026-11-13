"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import { Reorder, useDragControls } from "motion/react";
import { ArrowUp, GripVertical, Plus, Redo2, Trash2, Undo2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { controlStyles as styles } from "@/components/ui/kalos-styles";
import { TableCellContent } from "@/components/ui/kalos-table-cell";
import { cellText, filterTableRows, inTableRange, parseTableValue, pasteTableCells, reorderTableRows, sortTableRows, tableCellSpans, tableColumnName, tableLink, type KalosTableProps, type KalosTableRow, type KalosTableTone, type TablePosition, type TableRange } from "@/components/ui/kalos-table-model";

export type TableCheckProps = { label: string; checked: boolean; indeterminate?: boolean; onChange: (checked: boolean) => void };
export type TableTagSelectProps = { ownerId: string; label: string; value: string; options: string[]; tagTones: NonNullable<KalosTableProps["tagTones"]>; open: boolean; onOpenChange: (open: boolean) => void; onChange: (value: string) => void; kind?: "cell" | "filter"; optionLabels?: Record<string, string> };
export type TableGridModel = {
  label: string;
  descriptionId?: string;
  interactive: boolean;
  minWidth: number;
  headers: { key: string; label: string; content: ReactNode; width: number; sort?: "ascending" | "descending"; numeric?: boolean }[];
  rows: { id: string; selected: boolean; cells: { content: ReactNode; text: string; selected: boolean; className?: string; colSpan?: number }[] }[];
  onReorder?: (ids: string[], targetId: string, position: "before" | "after") => void;
  footer?: ReactNode[];
  emptyMessage: string;
};

export function NativeTableGrid({ label, descriptionId, interactive, minWidth, headers, rows, footer, emptyMessage, onReorder }: TableGridModel) {
  const [previewOrder, setPreviewOrder] = useState<string[] | null>(null);
  const previewRef = useRef<string[] | null>(null);
  const [keyboardDrag, setKeyboardDrag] = useState<{ id: string; targetId: string; position: "before" | "after" } | null>(null);
  const instructionsId = useId();
  const orderedRows = previewOrder ? previewOrder.map(id => rows.find(row => row.id === id)).filter((row): row is TableGridModel["rows"][number] => !!row) : rows;
  const finishDrag = (id: string) => {
    const order = previewRef.current;
    if (order) {
      const index = order.indexOf(id);
      const targetId = order[index + 1] ?? order[index - 1];
      if (targetId) onReorder?.([id], targetId, order[index + 1] ? "before" : "after");
    }
    previewRef.current = null; setPreviewOrder(null);
  };
  const keyboard = (event: React.KeyboardEvent, id: string) => {
    if (event.key === "Escape") { event.preventDefault(); setKeyboardDrag(null); }
    else if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      if (keyboardDrag?.id === id) { onReorder?.([id], keyboardDrag.targetId, keyboardDrag.position); setKeyboardDrag(null); }
      else setKeyboardDrag({ id, targetId: id, position: "before" });
    } else if (keyboardDrag?.id === id && ["ArrowUp", "ArrowDown"].includes(event.key)) {
      event.preventDefault();
      const index = Math.max(0, Math.min(rows.length - 1, rows.findIndex(row => row.id === keyboardDrag.targetId) + (event.key === "ArrowDown" ? 1 : -1)));
      setKeyboardDrag({ id, targetId: rows[index].id, position: index > rows.findIndex(row => row.id === id) ? "after" : "before" });
    }
  };
  const bodyRows = rows.length ? orderedRows.map(row => onReorder ? <NativeDraggableRow key={row.id} row={row} headers={headers} interactive={interactive} instructionsId={instructionsId} keyboardDrag={keyboardDrag} onKeyDown={event => keyboard(event, row.id)} onDragStart={() => { setKeyboardDrag(null); }} onDragEnd={() => finishDrag(row.id)} /> : <tr key={row.id} data-selected={row.selected || undefined} aria-selected={interactive ? row.selected : undefined} className={styles.tableRow}>
    {row.cells.map((cell, index) => cell.colSpan === 0 ? null : <td key={headers[index].key} colSpan={cell.colSpan} role={interactive ? "gridcell" : undefined} aria-selected={interactive ? cell.selected : undefined} data-range={cell.selected || undefined} className={cn(styles.tableCell, cell.className)}>{cell.content}</td>)}
  </tr>) : <tr><td colSpan={headers.length} className={styles.tableEmpty}>{emptyMessage}</td></tr>;
  return <table aria-label={label} aria-describedby={descriptionId} role={interactive ? "grid" : undefined} className={styles.tableGrid} style={{ minWidth }}>
    {onReorder ? <caption id={instructionsId} className="sr-only">按空格拾取行，方向键选择位置，Enter 放置，Escape 取消；也可拖动行首手柄。</caption> : null}
    <colgroup>{headers.map(header => <col key={header.key} style={{ width: header.width }} />)}</colgroup>
    <thead><tr>{headers.map(header => <th key={header.key} scope="col" aria-sort={header.sort} className={styles.tableHead}>{header.content}</th>)}</tr></thead>
    {onReorder ? <Reorder.Group as="tbody" axis="y" values={previewOrder ?? rows.map(row => row.id)} onReorder={order => { previewRef.current = order; setPreviewOrder(order); }}>{bodyRows}</Reorder.Group> : <tbody>{bodyRows}</tbody>}
    {footer ? <tfoot className={styles.tableSummary}><tr>{headers.map((header, index) => <td key={header.key} className={header.numeric ? "tabular-nums" : undefined}>{footer[index]}</td>)}</tr></tfoot> : null}
  </table>;
}

function NativeDraggableRow({ row, headers, interactive, instructionsId, keyboardDrag, onKeyDown, onDragStart, onDragEnd }: {
  row: TableGridModel["rows"][number];
  headers: TableGridModel["headers"];
  interactive: boolean;
  instructionsId: string;
  keyboardDrag: { id: string; targetId: string; position: "before" | "after" } | null;
  onKeyDown: (event: React.KeyboardEvent) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}) {
  const controls = useDragControls();
  const [dragging, setDragging] = useState(false);
  return <Reorder.Item as="tr" value={row.id} dragListener={false} dragControls={controls} layout="position" transition={{ layout: { duration: .2, ease: [.25, .1, .25, 1] } }} onDragStart={() => { setDragging(true); onDragStart(); }} onDragEnd={() => { setDragging(false); onDragEnd(); }} data-table-row={row.id} data-dragging={dragging || keyboardDrag?.id === row.id || undefined} data-drop-position={keyboardDrag?.targetId === row.id ? keyboardDrag.position : undefined} data-selected={row.selected || undefined} aria-selected={interactive ? row.selected : undefined} className={styles.tableRow}>
    {row.cells.map((cell, index) => cell.colSpan === 0 ? null : <td key={headers[index].key} colSpan={cell.colSpan} role={interactive ? "gridcell" : undefined} aria-selected={interactive ? cell.selected : undefined} data-range={cell.selected || undefined} className={cn(styles.tableCell, cell.className)}>{headers[index].key === "__drag" ? <button type="button" className={styles.tableDragHandle} aria-label={`拖动 ${cell.text} 排序`} aria-describedby={instructionsId} aria-pressed={dragging || keyboardDrag?.id === row.id} onPointerDown={event => { if (event.button === 0) controls.start(event); }} onKeyDown={onKeyDown}><GripVertical aria-hidden /></button> : cell.content}</td>)}
  </Reorder.Item>;
}

const tones: Record<KalosTableTone, string> = {
  gray: styles.tableTagGray, violet: styles.tableTagViolet, pink: styles.tableTagPink,
  blue: styles.tableTagBlue, green: styles.tableTagGreen, amber: styles.tableTagAmber,
};

export function TableTag({ value, tagTones }: Pick<TableTagSelectProps, "value" | "tagTones">) {
  return value ? <span className={cn(styles.tableTag, tones[tagTones[value] ?? "gray"])}><span data-table-text className={styles.tableText}>{value}</span></span> : null;
}

export function KalosTableView({ Grid = NativeTableGrid, Check, TagSelect, ...props }: KalosTableProps & {
  Grid?: ComponentType<TableGridModel>;
  Check: ComponentType<TableCheckProps>;
  TagSelect: ComponentType<TableTagSelectProps>;
}) {
  const { columns, rows: controlledRows, defaultRows = [], onRowsChange, title, icon, caption, editable = false,
    selectable = false, sortable = false, reorderable = false, tagTones = {}, footer, rowActions, addRowLabel = "添加行", emptyMessage = "暂无数据", dir, className } = props;
  const [internalRows, setRows] = useState(defaultRows);
  const rows = controlledRows ?? internalRows;
  const [sort, setSort] = useState<{ key: string; direction: "ascending" | "descending" } | null>(props.defaultSort ?? null);
  const [filters, setFilters] = useState<Record<string, string | undefined>>({});
  const [filterOpen, setFilterOpen] = useState<string | null>(null);
  const visible = sortTableRows(filterTableRows(rows, filters), columns, sort);
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [range, setRange] = useState<TableRange | null>(null);
  const [editing, setEditing] = useState<{ id: string; key: string; value: string; error?: string } | null>(null);
  const [history, setHistory] = useState<{ past: KalosTableRow[][]; future: KalosTableRow[][] }>({ past: [], future: [] });
  const [status, setStatus] = useState("");
  const root = useRef<HTMLDivElement>(null);
  const captionId = useId();
  const pendingFocus = useRef<{ id: string; column: number } | null>(null);
  const cancelBlur = useRef(false);
  const outsideInteraction = useRef(false);
  const visibleSelected = rows.filter(row => selected.has(row.id));
  const allSelected = rows.length > 0 && visibleSelected.length === rows.length;
  const interactive = editable || selectable;
  const label = props["aria-label"] ?? title ?? "表格";
  const editorId = editing?.id;
  const editorKey = editing?.key;

  useEffect(() => {
    const dismissFocus = (event: Event) => {
      if (!(event.target instanceof Element)) return;
      const inPopup = event.target.closest("[data-table-owner]")?.getAttribute("data-table-owner") === captionId;
      if (inPopup) return;
      const inTable = root.current?.contains(event.target);
      if (inTable && event.target.closest("[data-grid-cell]")) return;
      outsideInteraction.current = true;
      pendingFocus.current = null;
      setRange(null);
    };
    document.addEventListener("pointerdown", dismissFocus, true);
    document.addEventListener("focusin", dismissFocus, true);
    return () => {
      document.removeEventListener("pointerdown", dismissFocus, true);
      document.removeEventListener("focusin", dismissFocus, true);
    };
  }, [captionId]);

  useLayoutEffect(() => {
    if (editorId) {
      const input = root.current?.querySelector<HTMLInputElement | HTMLSelectElement>("[data-table-editor]");
      input?.focus();
      if (input instanceof HTMLInputElement) input.select();
    }
    // Focus only when an editor is explicitly opened, not on each keystroke.
  }, [editorId, editorKey]);

  useLayoutEffect(() => {
    const next = pendingFocus.current;
    if (!next || editing) return;
    const cells = root.current?.querySelectorAll<HTMLElement>("[data-grid-cell]");
    const target = [...(cells ?? [])].find(cell => cell.dataset.rowId === next.id && Number(cell.dataset.column) === next.column);
    target?.focus();
    pendingFocus.current = null;
  });

  function commit(next: KalosTableRow[]) {
    if (next.length === rows.length && next.every((row, index) => row === rows[index])) return;
    setHistory(current => ({ past: [...current.past, rows].slice(-100), future: [] }));
    if (controlledRows === undefined) setRows(next);
    onRowsChange?.(next);
  }

  function travel(direction: "undo" | "redo") {
    if (!editable) return;
    const stack = direction === "undo" ? history.past : history.future;
    const next = stack.at(-1);
    if (!next) return;
    setEditing(null);
    setRange(null);
    setHistory(direction === "undo"
      ? { past: history.past.slice(0, -1), future: [...history.future, rows] }
      : { past: [...history.past, rows], future: history.future.slice(0, -1) });
    if (controlledRows === undefined) setRows(next);
    onRowsChange?.(next);
    setStatus(direction === "undo" ? "已撤销" : "已重做");
  }

  function choose(position: TablePosition, extend = false, focus = false) {
    if (!visible.length || !columns.length) return;
    const next = { row: Math.max(0, Math.min(visible.length - 1, position.row)), column: Math.max(0, Math.min(columns.length - 1, position.column)) };
    outsideInteraction.current = false;
    setRange(current => ({ start: extend && current ? current.start : next, end: next }));
    if (focus) pendingFocus.current = { id: visible[next.row].id, column: next.column };
  }

  function startEdit(position: TablePosition, initial?: string) {
    const column = columns[position.column], row = visible[position.row];
    if (!editable || !row || !column || column.editable === false) return;
    choose(position);
    cancelBlur.current = false;
    setEditing({ id: row.id, key: column.key, value: initial ?? cellText(row[column.key]) });
  }

  function finishEdit(move?: TablePosition, restoreFocus = true) {
    if (!editing) return;
    const column = columns.find(column => column.key === editing.key);
    if (!column) { setEditing(null); return; }
    const parsed = parseTableValue(editing.value, column);
    if (parsed === undefined) {
      setEditing({ ...editing, error: column.type === "number" ? "请输入有效数字" : "请选择列表中的标签" });
      return;
    }
    commit(rows.map(row => row.id === editing.id && row[editing.key] !== parsed ? { ...row, [editing.key]: parsed } : row));
    if (restoreFocus && !outsideInteraction.current) pendingFocus.current = { id: editing.id, column: columns.indexOf(column) };
    setEditing(null);
    if (move) choose(move, false, true);
    setStatus("已保存单元格");
  }

  function clearRange() {
    if (!editable || !range) return;
    const changes = new Map<string, KalosTableRow>();
    visible.forEach((row, rowIndex) => columns.forEach((column, columnIndex) => {
      if (column.editable !== false && inTableRange(range, rowIndex, columnIndex)) changes.set(row.id, { ...(changes.get(row.id) ?? row), [column.key]: "" });
    }));
    commit(rows.map(row => changes.get(row.id) ?? row));
  }

  function clipboardText() {
    if (!range) return "";
    return visible.slice(Math.min(range.start.row, range.end.row), Math.max(range.start.row, range.end.row) + 1)
      .map(row => columns.slice(Math.min(range.start.column, range.end.column), Math.max(range.start.column, range.end.column) + 1)
        .map(column => cellText(row[column.key]).replace(/[\t\r\n]/g, " ")).join("\t")).join("\n");
  }

  const headers: TableGridModel["headers"] = [
    ...(reorderable ? [{ key: "__drag", label: "拖拽排序", width: 40, content: <span className="sr-only">拖拽排序</span> }] : []),
    ...(selectable ? [{ key: "__selection", label: "选择行", width: 40, content: <div className={styles.tableCheck}><Check label="选择所有行" checked={allSelected} indeterminate={!allSelected && visibleSelected.length > 0} onChange={checked => {
      const next = checked ? rows.map(row => row.id) : [];
      setSelected(new Set(next));
      props.onSelectionChange?.(next);
    }} /></div> }] : []),
    ...columns.map(column => {
      const values = [...new Set(rows.map(row => cellText(row[column.key])))];
      const optionLabels = Object.fromEntries(["全部", ...values].map((value, index) => [String(index), value || "空白"]));
      return { key: column.key, label: column.label, width: column.width ?? 160, numeric: column.type === "number", sort: sort?.key === column.key ? sort.direction : undefined,
      content: <TableCellContent className="flex h-full min-w-0 items-center gap-2"><button type="button" disabled={!sortable || column.sortable === false} className={styles.tableSort} onClick={() => {
        setSort(current => current?.key === column.key ? current.direction === "ascending" ? { key: column.key, direction: "descending" } : null : { key: column.key, direction: "ascending" });
        setRange(null);
      }}>{column.icon}<span data-table-text className={styles.tableText}>{column.label}</span>{sort?.key === column.key ? <ArrowUp aria-hidden className={styles.tableSortArrow} data-descending={sort.direction === "descending" || undefined} /> : null}</button>{column.filterable ? <TagSelect ownerId={captionId} kind="filter" label={`筛选${column.label}`} value={String(filters[column.key] === undefined ? 0 : values.indexOf(filters[column.key]!) + 1)} options={Object.keys(optionLabels)} optionLabels={optionLabels} tagTones={{}} open={filterOpen === column.key} onOpenChange={open => setFilterOpen(open ? column.key : null)} onChange={value => { setFilters(current => ({ ...current, [column.key]: Number(value) === 0 ? undefined : values[Number(value) - 1] })); setFilterOpen(null); setRange(null); setEditing(null); }} /> : null}</TableCellContent> };
    }),
    ...(rowActions ? [{ key: "__actions", label: props.rowActionsLabel ?? "操作", width: props.rowActionsWidth ?? 160, content: <span>{props.rowActionsLabel ?? "操作"}</span> }] : []),
  ];

  const gridRows: TableGridModel["rows"] = visible.map((row, rowIndex) => ({
    id: row.id, selected: selected.has(row.id),
    cells: [
      ...(reorderable ? [{ text: cellText(row[columns[0]?.key]) || row.id, selected: false, content: null }] : []),
      ...(selectable ? [{ text: `选择 ${cellText(row[columns[0]?.key]) || row.id}`, selected: false, className: styles.tableCheckCell, content: <div className={styles.tableCheck}><Check label={`选择 ${cellText(row[columns[0]?.key]) || row.id}`} checked={selected.has(row.id)} onChange={checked => {
        const next = new Set(selected);
        if (checked) next.add(row.id); else next.delete(row.id);
        setSelected(next);
        props.onSelectionChange?.([...next].filter(id => rows.some(row => row.id === id)));
      }} /></div> }] : []),
      ...columns.map((column, columnIndex) => {
        const text = cellText(row[column.key]);
        const isEditing = editing?.id === row.id && editing.key === column.key;
        const active = !!range && range.end.row === rowIndex && range.end.column === columnIndex;
        const href = column.type === "link" ? tableLink(text) : undefined;
        const editorProps = {
          "data-table-editor": true,
          "aria-label": `${column.label}，第 ${rowIndex + 1} 行`,
          "aria-invalid": !!editing?.error,
          className: styles.tableEditor,
          value: editing?.value ?? "",
          onBlur: () => { if (!cancelBlur.current) finishEdit(undefined, false); },
          onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setEditing(current => current ? { ...current, value: event.target.value, error: undefined } : null),
          onKeyDown: (event: React.KeyboardEvent) => {
            event.stopPropagation();
            if (event.nativeEvent.isComposing) return;
            if (event.key === "Escape") {
              event.preventDefault(); cancelBlur.current = true;
              pendingFocus.current = { id: row.id, column: columnIndex };
              setEditing(null);
            } else if (event.key === "Enter") {
              event.preventDefault(); finishEdit({ row: rowIndex + 1, column: columnIndex });
            } else if (event.key === "Tab") {
              event.preventDefault();
              const index = rowIndex * columns.length + columnIndex + (event.shiftKey ? -1 : 1);
              finishEdit({ row: Math.floor(index / columns.length), column: (index + columns.length) % columns.length });
            }
          },
        };
        const content = column.format ? <span data-table-text className={styles.tableText}>{column.format(typeof row[column.key] === "number" ? row[column.key] as number : text, row)}</span>
          : column.type === "tag" && text ? <TableTag value={text} tagTones={tagTones} />
          : href ? <a data-table-text href={href} target="_blank" rel="noreferrer" tabIndex={interactive ? -1 : undefined} className={styles.tableLink} onClick={event => event.stopPropagation()}>{text.replace(/^https?:\/\//, "")}</a>
          : <span data-table-text className={styles.tableText}>{column.type === "number" && text ? Number(text).toLocaleString("en-US").replace("-", "−") : row[column.key]}</span>;
        return { text, colSpan: tableCellSpans(columns, row)[columnIndex], selected: inTableRange(range, rowIndex, columnIndex), content: <TableCellContent tooltipDisabled={isEditing}
          data-grid-cell data-row-id={row.id} data-column={columnIndex} data-active={active || undefined} data-editing={isEditing || undefined} data-tag={column.type === "tag" && editable && column.editable !== false || undefined}
          tabIndex={interactive ? (active || (!range && rowIndex === 0 && columnIndex === 0) ? 0 : -1) : undefined}
          className={cn(styles.tableCellContent, column.type === "title" && styles.tableTitleCell, column.type === "number" && styles.tableNumber)}
          onClick={event => {
            if (!event.currentTarget.contains(event.target as Node)) return;
            if (!isEditing && interactive) {
              choose({ row: rowIndex, column: columnIndex }, event.shiftKey);
              if (column.type === "tag" && !event.shiftKey) startEdit({ row: rowIndex, column: columnIndex });
            }
          }}
          onDoubleClick={event => { if (event.currentTarget.contains(event.target as Node)) startEdit({ row: rowIndex, column: columnIndex }); }}
          onKeyDown={event => {
            if (isEditing || event.target !== event.currentTarget || event.nativeEvent.isComposing) return;
            const modifier = event.ctrlKey || event.metaKey;
            if (modifier && event.key.toLowerCase() === "a") {
              event.preventDefault();
              setRange({ start: { row: 0, column: 0 }, end: { row: visible.length - 1, column: columns.length - 1 } });
            } else if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
              event.preventDefault(); event.stopPropagation();
              const horizontal = (event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0) * (dir === "rtl" ? -1 : 1);
              choose({ row: modifier && event.key === "ArrowUp" ? 0 : modifier && event.key === "ArrowDown" ? visible.length - 1 : rowIndex + (event.key === "ArrowDown" ? 1 : event.key === "ArrowUp" ? -1 : 0),
                column: event.key === "Home" || (modifier && horizontal < 0) ? 0 : event.key === "End" || (modifier && horizontal > 0) ? columns.length - 1 : columnIndex + horizontal }, event.shiftKey, true);
            } else if (event.key === "Enter" || event.key === "F2") {
              event.preventDefault(); startEdit({ row: rowIndex, column: columnIndex });
            } else if (event.key === "Tab") {
              const index = rowIndex * columns.length + columnIndex + (event.shiftKey ? -1 : 1);
              if (index >= 0 && index < visible.length * columns.length) {
                event.preventDefault(); choose({ row: Math.floor(index / columns.length), column: index % columns.length }, false, true);
              }
            } else if (event.key === "Delete" || event.key === "Backspace") {
              event.preventDefault(); clearRange();
            } else if (event.key === "Escape") {
              setRange({ start: { row: rowIndex, column: columnIndex }, end: { row: rowIndex, column: columnIndex } });
            } else if (!modifier && !event.altKey && event.key.length === 1) {
              event.preventDefault(); startEdit({ row: rowIndex, column: columnIndex }, event.key);
            }
          }}
        >{column.type === "tag" && editable && column.editable !== false ? <TagSelect
          ownerId={captionId}
          label={`${column.label}，第 ${rowIndex + 1} 行`}
          value={text} tagTones={tagTones}
          options={column.options ?? [...new Set([...Object.keys(tagTones), ...rows.map(row => cellText(row[column.key]))].filter(Boolean))]}
          open={isEditing}
          onOpenChange={open => {
            if (open) { choose({ row: rowIndex, column: columnIndex }); startEdit({ row: rowIndex, column: columnIndex }); }
            else { setEditing(null); if (!outsideInteraction.current) pendingFocus.current = { id: row.id, column: columnIndex }; }
          }}
          onChange={value => {
            commit(rows.map(item => item.id === row.id && item[column.key] !== value ? { ...item, [column.key]: value } : item));
            setEditing(null); pendingFocus.current = { id: row.id, column: columnIndex }; setStatus("已更新标签");
          }}
        /> : isEditing ? <div className="flex w-full flex-col">
          <input {...editorProps} inputMode={column.type === "number" ? "decimal" : undefined} />
          {editing.error ? <span role="alert" className="text-xs text-destructive">{editing.error}</span> : null}
        </div> : <>{column.type === "title" ? row.icon : null}{content}</>}</TableCellContent> };
      }),
      ...(rowActions ? [{ text: props.rowActionsLabel ?? "操作", selected: false, content: <div className={styles.tableActions}>{rowActions(row)}</div> }] : []),
    ],
  }));

  return <div ref={root} dir={dir} className={cn(styles.table, props.variant === "bordered" && styles.tableBordered, className)} data-slot="kalos-table" data-variant={props.variant ?? "default"} onKeyDown={event => {
    if (event.target instanceof HTMLElement && event.target.closest("input,select,textarea")) return;
    if ((event.metaKey || event.ctrlKey) && ["z", "y"].includes(event.key.toLowerCase()) && editable) {
      event.preventDefault(); travel(event.shiftKey || event.key.toLowerCase() === "y" ? "redo" : "undo");
    }
  }} onCopy={event => {
    if (!range || editing) return;
    event.preventDefault(); event.clipboardData.setData("text/plain", clipboardText());
    setStatus("已复制单元格");
  }} onCut={event => {
    if (!range || editing) return;
    event.preventDefault(); event.clipboardData.setData("text/plain", clipboardText());
    clearRange();
  }} onPaste={event => {
    if (!editable || !range || editing) return;
    event.preventDefault();
    const origin = { row: Math.min(range.start.row, range.end.row), column: Math.min(range.start.column, range.end.column) };
    commit(pasteTableCells(rows, visible, columns, origin, event.clipboardData.getData("text/plain")));
    setStatus("已粘贴；无效数字、固定标签以外的值与锁定列不作更改");
  }}>
    {title ? <div className={styles.tableTitle}>
      <h3 className={styles.tableHeading}>{icon}<span className="truncate">{title}</span></h3>
      {editable ? <div className="flex items-center gap-1">
        <button type="button" className={styles.tableToolbarButton} aria-label="撤销" title="撤销 (⌘/Ctrl+Z)" disabled={!history.past.length} onClick={() => travel("undo")}><Undo2 /></button>
        <button type="button" className={styles.tableToolbarButton} aria-label="重做" title="重做 (⌘/Ctrl+Shift+Z)" disabled={!history.future.length} onClick={() => travel("redo")}><Redo2 /></button>
      </div> : null}
    </div> : null}
    <div className={styles.tableScroll}><Grid label={label} descriptionId={caption ? captionId : undefined} interactive={interactive} minWidth={headers.reduce((sum, header) => sum + header.width, 0)} headers={headers} rows={gridRows} onReorder={reorderable ? (ids, targetId, position) => {
      const reordered = reorderTableRows(visible, ids, targetId, position);
      const visibleIds = new Set(visible.map(row => row.id));
      let index = 0;
      commit(rows.map(row => visibleIds.has(row.id) ? reordered[index++] : row));
      setSort(null); setRange(null); setStatus("已更新行顺序");
    } : undefined} footer={footer ? [...(reorderable ? [null] : []), ...(selectable ? [null] : []), ...footer, ...(rowActions ? [null] : [])] : undefined} emptyMessage={emptyMessage} /></div>
    {editable || selectable ? <div className={styles.tableFooter}>
      <div className="flex items-center gap-3">
        {editable ? <button type="button" className={styles.tableAdd} onClick={() => {
          outsideInteraction.current = false;
          cancelBlur.current = false;
          const id = crypto.randomUUID();
          const row = { id, ...Object.fromEntries(columns.map(column => [column.key, ""])) };
          commit([...rows, row]);
          setSort(null);
          const column = Math.max(0, columns.findIndex(column => column.editable !== false));
          setRange({ start: { row: rows.length, column }, end: { row: rows.length, column } });
          setEditing({ id, key: columns[column].key, value: "" });
          setStatus("已添加行");
        }} disabled={!columns.length}><Plus />{addRowLabel}</button> : <span>{rows.length} 行</span>}
        {visibleSelected.length ? <span>{visibleSelected.length} 行已选</span> : null}
        {editable && visibleSelected.length ? <button type="button" className={styles.tableToolbarButton} aria-label="删除选中行" onClick={() => {
          commit(rows.filter(row => !selected.has(row.id)));
          setSelected(new Set()); props.onSelectionChange?.([]); setRange(null);
          setStatus("已删除选中行，可撤销恢复");
        }}><Trash2 /></button> : null}
      </div>
      <span className="shrink-0 tabular-nums">{range ? `${tableColumnName(range.end.column)}${range.end.row + 1}` : `${tableColumnName(0)}${rows.length + 1}`}</span>
    </div> : null}
    {caption ? <p id={captionId} className="px-3.5 py-2 text-xs text-muted-foreground">{caption}</p> : null}
    <span role="status" aria-live="polite" className="sr-only">{status}</span>
  </div>;
}

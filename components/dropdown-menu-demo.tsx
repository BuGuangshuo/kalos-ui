"use client";

import { useState, type ComponentType } from "react";
import { Bell, ChevronDown, Copy, Download, FileText, Folder, FolderInput, Pencil, Settings2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { KalosDropdownMenuProps } from "@/components/ui/kalos-dropdown-menu-shared";
import type { DropdownExampleVariant } from "@/lib/dropdown-menu-examples";
import type { DemoComponents } from "@/components/demo-content";
import { stackColumns, stackRows, stackTones, StackTitleIcon } from "@/components/table-demo";
import { type KalosTableRow } from "@/components/ui/kalos-table-model";
import { StackMoreMenu, StackRowOptions } from "@/components/table-row-options";

type DropdownDemoComponents = Pick<DemoComponents, "KalosTable" | "KalosDialog" | "KalosButton" | "KalosInput">;

export function DropdownMenuDemo({ KalosDropdownMenu, components, variant = "default", compact = false }: {
  KalosDropdownMenu: ComponentType<KalosDropdownMenuProps>;
  components: DropdownDemoComponents;
  variant?: DropdownExampleVariant;
  compact?: boolean;
}) {
  const [selected, setSelected] = useState<string[]>(["updated"]);
  const [notifications, setNotifications] = useState(true);
  const [rows, setRows] = useState<KalosTableRow[]>(stackRows);
  const { KalosTable } = components;
  if (compact) {
    const row = rows[0] ?? stackRows[0];
    return <StackMoreMenu standalone row={row} categories={Object.keys(stackTones)} KalosDropdownMenu={KalosDropdownMenu}
      onSave={next => setRows(current => current.map(item => item.id === row.id ? next : item))}
      onDuplicate={() => { setRows(current => [...current, { ...row, id: crypto.randomUUID(), tool: `${row.tool} 副本` }]); toast.success("已创建副本"); }}
      onDelete={() => { setRows(current => current.filter(item => item.id !== row.id)); toast.success("记录已删除"); }}
    />;
  }
  const choices: KalosDropdownMenuProps["items"] = [
    ...[{ value: "updated", label: "最近更新" }, { value: "name", label: "名称" }, { value: "size", label: "文件大小" }].map(item => ({ ...item, checked: selected.includes(item.value), keepOpen: true, onSelect: () => setSelected(current => current.includes(item.value) ? current.filter(value => value !== item.value) : [...current, item.value]) })),
    { value: "notifications", label: "消息通知", icon: <Bell />, divider: true, type: "checkbox", checked: notifications, keepOpen: true, onSelect: () => setNotifications(current => !current) },
  ];
  if (variant === "choices") return <KalosDropdownMenu trigger={<><Settings2 />显示设置<ChevronDown /></>} items={choices} />;
  if (variant === "basic") return <KalosDropdownMenu trigger={<>文件操作<ChevronDown /></>} items={[
    { value: "open", label: "打开文件", icon: <FileText />, shortcut: "↵" },
    { value: "rename", label: "重命名", icon: <Pencil /> },
    { value: "duplicate", label: "创建副本", icon: <Copy />, shortcut: "⌘D" },
    { value: "delete", label: "删除文件", icon: <Trash2 />, danger: true, divider: true },
  ]} onAction={value => toast({ open: "已打开文件", rename: "已选择重命名", duplicate: "已创建副本", delete: "文件已删除" }[value])} />;
  if (variant === "submenu") return <KalosDropdownMenu trigger={<><FolderInput />移动到<ChevronDown /></>} items={[
    { value: "documents", label: "文档", icon: <Folder />, submenu: [{ value: "personal", label: "个人文档" }, { value: "shared", label: "共享文档" }] },
    { value: "archive", label: "归档", icon: <Folder /> },
    { value: "locked", label: "只读文件夹", icon: <Folder />, disabled: true },
  ]} onAction={value => toast.success(`已移动到${{ personal: "个人文档", shared: "共享文档", archive: "归档" }[value]}`)} />;
  if (variant === "states") return <div className="flex flex-wrap justify-center gap-3">
    <KalosDropdownMenu trigger="禁用菜单" disabled items={[]} />
    <KalosDropdownMenu trigger="空菜单" items={[]} />
    <KalosDropdownMenu trigger="账号" align="end" header={<span className="font-medium">陈晓</span>} items={[{ value: "settings", label: "账号设置", icon: <Settings2 /> }, { value: "export", label: "导出数据", icon: <Download />, disabled: true }]} onAction={() => toast("已打开账号设置")} />
  </div>;

  return <KalosTable
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
    rowActions={row => <StackRowOptions row={row} categories={Object.keys(stackTones)} KalosDropdownMenu={KalosDropdownMenu} components={components} onSave={next => setRows(current => current.map(item => item.id === row.id ? next : item))} onDuplicate={() => { setRows(current => [...current, { ...row, id: crypto.randomUUID(), tool: `${row.tool} 副本` }]); toast.success("已创建副本"); }} onDelete={() => { setRows(current => current.filter(item => item.id !== row.id)); toast.success("记录已删除"); }} />}
  />;
}

export type DropdownExampleVariant = "default" | "basic" | "choices" | "submenu" | "states";

export const dropdownExampleVariants = [
  { variant: "basic", title: "图标与快捷键" },
  { variant: "choices", title: "复选菜单" },
  { variant: "submenu", title: "子菜单" },
  { variant: "states", title: "禁用与空状态" },
] as const;

export function dropdownMenuExample(variant: DropdownExampleVariant = "default") {
  const imports = `"use client";

import { KalosDropdownMenu } from "@/components/ui/kalos-dropdown-menu";`;
  if (variant === "choices") return `${imports}
import { useState } from "react";

export default function Example() {
  const [selected, setSelected] = useState<string[]>(["updated"]);
  const [notifications, setNotifications] = useState(true);

  return <KalosDropdownMenu trigger="显示设置" items={[
    ...[
      { value: "updated", label: "最近更新" },
      { value: "name", label: "名称" },
      { value: "size", label: "文件大小" },
    ].map(item => ({
      ...item,
      checked: selected.includes(item.value),
      keepOpen: true,
      onSelect: () => setSelected(current => current.includes(item.value)
        ? current.filter(value => value !== item.value)
        : [...current, item.value]),
    })),
    { value: "notifications", label: "消息通知", type: "checkbox", checked: notifications, keepOpen: true, divider: true, onSelect: () => setNotifications(current => !current) },
  ]} />;
}`;
  if (variant === "submenu") return `${imports}
import { Folder } from "lucide-react";

export default function Example() {
  return <KalosDropdownMenu trigger="移动到" items={[
    { value: "documents", label: "文档", icon: <Folder />, submenu: [
      { value: "personal", label: "个人文档" },
      { value: "shared", label: "共享文档" },
    ] },
    { value: "archive", label: "归档", icon: <Folder /> },
    { value: "locked", label: "只读文件夹", disabled: true },
  ]} onAction={value => console.log("目标文件夹：", value)} />;
}`;
  if (variant === "states") return `${imports}

export default function Example() {
  return <div className="flex flex-wrap gap-3">
    <KalosDropdownMenu trigger="禁用菜单" disabled items={[]} />
    <KalosDropdownMenu trigger="空菜单" items={[]} />
    <KalosDropdownMenu trigger="账号" align="end" header={<span className="font-medium">陈晓</span>} items={[
      { value: "settings", label: "账号设置" },
      { value: "export", label: "导出数据", disabled: true },
    ]} onAction={value => console.log(value)} />
  </div>;
}`;
  if (variant === "basic") return `${imports}
import { ChevronDown, Copy, FileText, Pencil, Trash2 } from "lucide-react";

export default function Example() {
  return <KalosDropdownMenu trigger={<>文件操作<ChevronDown /></>} items={[
    { value: "open", label: "打开文件", icon: <FileText />, shortcut: "↵" },
    { value: "rename", label: "重命名", icon: <Pencil /> },
    { value: "duplicate", label: "创建副本", icon: <Copy />, shortcut: "⌘D" },
    { value: "delete", label: "删除文件", icon: <Trash2 />, danger: true, divider: true },
  ]} onAction={value => console.log("文件操作：", value)} />;
}`;
  return `${imports}
import { useState } from "react";
import { Bell, Copy, FileText, Folder, FolderInput, Link, MoreHorizontal, Trash2 } from "lucide-react";

export default function Example() {
  const [notifications, setNotifications] = useState(true);
  const [folder, setFolder] = useState("personal");

  return <KalosDropdownMenu
    trigger={<MoreHorizontal />}
    triggerProps={{ variant: "ghost", size: "icon", "aria-label": "文档操作" }}
    align="end"
    items={[
      { value: "open", label: "打开文档", icon: <FileText /> },
      { value: "duplicate", label: "创建副本", icon: <Copy /> },
      { value: "copy-link", label: "复制链接", icon: <Link /> },
      { value: "move", label: "移动到", icon: <FolderInput />, divider: true, submenu: [
        { value: "personal", label: "个人文档", icon: <Folder />, type: "radio", checked: folder === "personal", onSelect: () => setFolder("personal") },
        { value: "shared", label: "共享文档", icon: <Folder />, type: "radio", checked: folder === "shared", onSelect: () => setFolder("shared") },
      ] },
      { value: "notifications", label: "更新时通知", icon: <Bell />, type: "checkbox", checked: notifications, keepOpen: true, onSelect: () => setNotifications(current => !current) },
      { value: "delete", label: "删除文档", icon: <Trash2 />, danger: true, divider: true },
    ]}
    onAction={value => console.log("文件操作：", value)}
  />;
}`;
}

"use client";

import { useState, type ComponentType } from "react";
import { Copy, Download, ExternalLink, Folder, FolderInput, Link2, MoreHorizontal, Pencil, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { KalosDropdownMenuProps } from "@/components/ui/kalos-dropdown-menu-shared";
import type { DemoComponents } from "@/components/demo-content";
import { tableLink, type KalosTableRow } from "@/components/ui/kalos-table-model";
import { FieldGroup } from "@/components/ui/field";

type DropdownDemoComponents = Pick<DemoComponents, "KalosDialog" | "KalosButton" | "KalosInput">;

type StackMenuProps = {
  row: KalosTableRow;
  categories: string[];
  KalosDropdownMenu: ComponentType<KalosDropdownMenuProps>;
  onSave: (row: KalosTableRow) => void;
  onDuplicate: () => void;
  onDelete: () => void;
};

export function StackMoreMenu({ row, categories, KalosDropdownMenu, onSave, onDuplicate, onDelete, standalone = false }: StackMenuProps & { standalone?: boolean }) {
  const [starred, setStarred] = useState(false);
  return <KalosDropdownMenu
    trigger={standalone ? <><MoreHorizontal />更多菜单</> : <MoreHorizontal />}
    triggerProps={standalone ? undefined : { variant: "ghost", size: "icon", "aria-label": `${row.tool}的更多操作` }}
    align={standalone ? "start" : "end"}
    items={[
      { value: "open", label: "打开网站", icon: <ExternalLink />, shortcut: "↵", disabled: !tableLink(String(row.website)), onSelect: () => { const url = tableLink(String(row.website)); if (url) window.open(url, "_blank", "noopener,noreferrer"); } },
      { value: "duplicate", label: "创建副本", icon: <Copy />, shortcut: "⌘D", onSelect: onDuplicate },
      { value: "copy", label: "复制链接", icon: <Link2 />, shortcut: "⌘L", onSelect: () => { navigator.clipboard.writeText(tableLink(String(row.website)) ?? String(row.website)).then(() => toast.success("链接已复制"), () => toast.error("复制失败，请重试")); } },
      { value: "move", label: "移动到", icon: <FolderInput />, divider: true, submenu: categories.map(category => ({ value: category, label: category, icon: <Folder />, onSelect: () => { onSave({ ...row, category }); toast.success(`已移动到 ${category}`); } })) },
      { value: "star", label: "收藏", icon: <Star />, type: "checkbox", checked: starred, keepOpen: true, onSelect: () => setStarred(current => !current) },
      { value: "export", label: "导出记录", icon: <Download />, disabled: true },
      { value: "delete", label: "删除记录", icon: <Trash2 />, divider: true, danger: true, onSelect: onDelete },
    ]}
  />;
}

export function StackRowOptions({ row, categories, KalosDropdownMenu, components, onSave, onDuplicate, onDelete }: StackMenuProps & { components: DropdownDemoComponents }) {
  const { KalosDialog, KalosButton, KalosInput } = components;
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(String(row.tool));
  const [website, setWebsite] = useState(String(row.website));
  return <div className="flex items-center gap-4">
    <KalosDialog trigger={<Pencil />} triggerProps={{ variant: "ghost", size: "icon", "aria-label": `编辑 ${row.tool}` }} title="编辑工具" open={open} onOpenChange={next => {
      if (next) { setName(String(row.tool)); setWebsite(String(row.website)); }
      setOpen(next);
    }} footer={<>
      <KalosButton variant="outline" onClick={() => setOpen(false)}>取消</KalosButton>
      <KalosButton disabled={!name.trim()} onClick={() => { onSave({ ...row, tool: name.trim(), website: website.trim() }); setOpen(false); toast.success("已保存更改"); }}>保存</KalosButton>
    </>}>
      <FieldGroup className="gap-3.5">
        <KalosInput label="名称" placeholder="工具名称" value={name} onChange={event => setName(event.target.value)} />
        <KalosInput label="网站" placeholder="example.com" value={website} onChange={event => setWebsite(event.target.value)} />
      </FieldGroup>
    </KalosDialog>
    <StackMoreMenu row={row} categories={categories} KalosDropdownMenu={KalosDropdownMenu} onSave={onSave} onDuplicate={onDuplicate} onDelete={onDelete} />
  </div>;
}

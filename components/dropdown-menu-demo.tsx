"use client";

import { Fragment, useState, type ComponentType } from "react";
import { Bell, ChevronDown, Copy, Download, FileText, Folder, FolderInput, Link, MoreHorizontal, Pencil, Settings2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DropdownItemContent, type KalosDropdownMenuItem, type KalosDropdownMenuProps } from "@/components/ui/kalos-dropdown-menu-shared";
import { controlStyles } from "@/components/ui/kalos-styles";
import type { DropdownExampleVariant } from "@/lib/dropdown-menu-examples";
import { KalosCard } from "@/registry/kalos/kalos-card";

const initialDocuments = [
  { id: "meeting-notes", name: "会议记录", updated: "今天 14:02", size: "24 KB", folder: "personal", notifications: true },
  { id: "user-guide", name: "使用指南", updated: "今天 13:50", size: "128 KB", folder: "shared", notifications: false },
  { id: "release-notes", name: "更新说明", updated: "今天 11:12", size: "36 KB", folder: "personal", notifications: false },
];
const sortOptions = [
  { value: "newest", label: "最近更新" },
  { value: "oldest", label: "最早更新" },
  { value: "name", label: "名称" },
] as const;

const fileActions: KalosDropdownMenuItem[] = [
  { value: "open", label: "打开文件", icon: <FileText />, shortcut: "↵" },
  { value: "rename", label: "重命名", icon: <Pencil /> },
  { value: "duplicate", label: "创建副本", icon: <Copy />, shortcut: "⌘D" },
  { value: "delete", label: "删除文件", icon: <Trash2 />, danger: true, divider: true },
];

export function DropdownMenuPanelPreview() {
  return <ul aria-label="文件操作预览" className={controlStyles.dropdownPanel} style={{ width: 200 }}>
    {fileActions.map(item => <Fragment key={item.value}>
      {item.divider ? <li aria-hidden="true" className={controlStyles.dropdownSeparator} /> : null}
      <li className={controlStyles.dropdownItem} data-danger={item.danger || undefined}>
        <DropdownItemContent item={item} />
      </li>
    </Fragment>)}
  </ul>;
}

function DocumentMenuDemo({ KalosDropdownMenu, compact }: { KalosDropdownMenu: ComponentType<KalosDropdownMenuProps>; compact: boolean }) {
  const [documents, setDocuments] = useState(initialDocuments);
  const [sort, setSort] = useState<string>("newest");
  const [openDocument, setOpenDocument] = useState<string | null>(compact ? null : initialDocuments[0].id);
  const sortedDocuments = documents.toSorted((a, b) => sort === "name" ? a.name.localeCompare(b.name, "zh-CN") : sort === "oldest" ? a.updated.localeCompare(b.updated) : b.updated.localeCompare(a.updated));

  function documentMenu(document: typeof initialDocuments[number]) {
    const update = (changes: Partial<typeof document>) => setDocuments(current => current.map(item => item.id === document.id ? { ...item, ...changes } : item));
    return <KalosDropdownMenu
      trigger={<MoreHorizontal />}
      triggerProps={{ variant: "ghost", size: "icon", "aria-label": `${document.name}的操作` }}
      align="end"
      width={180}
      open={openDocument === document.id}
      onOpenChange={open => setOpenDocument(current => open ? document.id : current === document.id ? null : current)}
      items={[
        { value: "open", label: "打开文档", icon: <FileText />, onSelect: () => toast.success(`已打开${document.name}`) },
        { value: "duplicate", label: "创建副本", icon: <Copy />, onSelect: () => {
          setDocuments(current => [...current, { ...document, id: crypto.randomUUID(), name: `${document.name} 副本` }]);
          toast.success("已创建副本");
        } },
        { value: "copy-link", label: "复制链接", icon: <Link />, onSelect: () => {
          const url = new URL(window.location.href);
          url.hash = document.id;
          navigator.clipboard.writeText(url.href).then(() => toast.success("链接已复制"), () => toast.error("复制失败，请重试"));
        } },
        { value: "move", label: "移动到", icon: <FolderInput />, divider: true, submenu: [
          { value: "personal", label: "个人文档", icon: <Folder />, type: "radio", checked: document.folder === "personal", onSelect: () => { update({ folder: "personal" }); toast.success("已移动到个人文档"); } },
          { value: "shared", label: "共享文档", icon: <Folder />, type: "radio", checked: document.folder === "shared", onSelect: () => { update({ folder: "shared" }); toast.success("已移动到共享文档"); } },
        ] },
        { value: "notifications", label: "更新时通知", icon: <Bell />, type: "checkbox", checked: document.notifications, keepOpen: true, onSelect: () => update({ notifications: !document.notifications }) },
        { value: "delete", label: "删除文档", icon: <Trash2 />, danger: true, divider: true, onSelect: () => {
          setDocuments(current => current.filter(item => item.id !== document.id));
          toast.success("文档已删除", { action: { label: "撤销", onClick: () => setDocuments(current => [...current, document]) } });
        } },
      ]}
    />;
  }

  if (compact) return documents[0] ? documentMenu(documents[0]) : <span role="status">暂无文档</span>;

  return <div className="dropdown-demo-stage"><KalosCard role="region" aria-label="文档列表" title="文档" className="dropdown-demo-card"
    action={<KalosDropdownMenu
      trigger={<><span className="text-muted-foreground">排序：</span>{sortOptions.find(option => option.value === sort)?.label}<ChevronDown /></>}
      triggerProps={{ variant: "ghost" }}
      align="end"
      items={sortOptions.map(option => ({ ...option, type: "radio", checked: sort === option.value, onSelect: () => setSort(option.value) }))}
    />}
  >
    {sortedDocuments.length ? <ul className="dropdown-demo-list">
      {sortedDocuments.map(document => <li key={document.id}>
        <span className="dropdown-demo-icon" aria-hidden="true"><FileText /></span>
        <div className="dropdown-demo-text"><span>{document.name}</span><span>{document.updated} · {document.size}</span></div>
        {documentMenu(document)}
      </li>)}
    </ul> : <p className="dropdown-demo-empty" role="status">暂无文档</p>}
  </KalosCard></div>;
}

export function DropdownMenuDemo({ KalosDropdownMenu, variant = "default", compact = false }: {
  KalosDropdownMenu: ComponentType<KalosDropdownMenuProps>;
  variant?: DropdownExampleVariant;
  compact?: boolean;
}) {
  const [selected, setSelected] = useState<string[]>(["updated"]);
  const [notifications, setNotifications] = useState(true);
  if (compact || variant === "default") return <DocumentMenuDemo KalosDropdownMenu={KalosDropdownMenu} compact={compact} />;
  const choices: KalosDropdownMenuProps["items"] = [
    ...[{ value: "updated", label: "最近更新" }, { value: "name", label: "名称" }, { value: "size", label: "文件大小" }].map(item => ({ ...item, checked: selected.includes(item.value), keepOpen: true, onSelect: () => setSelected(current => current.includes(item.value) ? current.filter(value => value !== item.value) : [...current, item.value]) })),
    { value: "notifications", label: "消息通知", icon: <Bell />, divider: true, type: "checkbox", checked: notifications, keepOpen: true, onSelect: () => setNotifications(current => !current) },
  ];
  if (variant === "choices") return <KalosDropdownMenu trigger={<><Settings2 />显示设置<ChevronDown /></>} items={choices} />;
  if (variant === "basic") return <KalosDropdownMenu trigger={<>文件操作<ChevronDown /></>} items={fileActions} onAction={value => toast({ open: "已打开文件", rename: "已选择重命名", duplicate: "已创建副本", delete: "文件已删除" }[value])} />;
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

  return null;
}

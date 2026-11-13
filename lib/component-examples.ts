import { avatarExample } from "@/lib/avatar-examples";
import { dropdownMenuExample } from "@/lib/dropdown-menu-examples";
import type { Item } from "@/lib/catalog";
import { segmentedControlExample } from "@/lib/segmented-control-examples";
import { basicTableExample } from "@/lib/table-examples";
import { skeletonExample, spinnerExample } from "@/lib/loading-examples";
import { datePickerExample, dateRangePickerExample, timePickerExample } from "@/lib/date-time-examples";

export type PopoverExampleVariant = "default" | "basic" | "align" | "form";

export function popoverExample(variant: PopoverExampleVariant = "default") {
  if (variant === "form") return `"use client";

import { useState } from "react";
import { KalosPopover } from "@/components/ui/kalos-popover";
import { KalosInput } from "@/components/ui/kalos-input";
import { KalosSelect } from "@/components/ui/kalos-select";
import { KalosButton } from "@/components/ui/kalos-button";
import { FieldGroup } from "@/components/ui/field";

export default function Example() {
  const [open, setOpen] = useState(false);
  const [applied, setApplied] = useState({ name: "", email: "", department: "", role: "", status: "", joined: "" });
  const [filters, setFilters] = useState(applied);

  return <KalosPopover trigger="更多筛选" label="更多筛选" contentClassName="w-[480px]" align="start" open={open} onOpenChange={next => {
    if (next) setFilters(applied);
    setOpen(next);
  }}>
    <form className="flex flex-col gap-4 p-3" onSubmit={event => {
      event.preventDefault();
      setApplied(filters);
      setOpen(false);
      // 在这里使用 filters 筛选列表。
    }}>
      <h3 className="text-base font-medium">更多筛选</h3>
      <FieldGroup className="grid grid-cols-2 gap-3.5">
        <KalosInput label="姓名" placeholder="输入姓名" value={filters.name} onChange={event => setFilters(current => ({ ...current, name: event.target.value }))} />
        <KalosInput label="邮箱地址" placeholder="输入邮箱关键词" value={filters.email} onChange={event => setFilters(current => ({ ...current, email: event.target.value }))} />
        <KalosSelect label="部门" placeholder="全部部门" value={filters.department} onValueChange={department => setFilters(current => ({ ...current, department }))} items={[{ value: "design", label: "设计部" }, { value: "engineering", label: "研发部" }, { value: "operations", label: "运营部" }]} />
        <KalosSelect label="角色" placeholder="全部角色" value={filters.role} onValueChange={role => setFilters(current => ({ ...current, role }))} items={[{ value: "admin", label: "管理员" }, { value: "editor", label: "编辑者" }, { value: "viewer", label: "查看者" }]} />
        <KalosSelect label="状态" placeholder="全部状态" value={filters.status} onValueChange={status => setFilters(current => ({ ...current, status }))} items={[{ value: "active", label: "已启用" }, { value: "inactive", label: "已停用" }]} />
        <KalosSelect label="加入时间" placeholder="不限时间" value={filters.joined} onValueChange={joined => setFilters(current => ({ ...current, joined }))} items={[{ value: "7d", label: "最近 7 天" }, { value: "30d", label: "最近 30 天" }, { value: "90d", label: "最近 90 天" }]} />
      </FieldGroup>
      <div className="flex justify-end gap-3">
        <KalosButton type="button" variant="outline" onClick={() => setOpen(false)}>取消</KalosButton>
        <KalosButton type="submit">筛选</KalosButton>
      </div>
    </form>
  </KalosPopover>;
}`;
  if (variant === "align") return `"use client";

import { KalosPopover } from "@/components/ui/kalos-popover";

const alignments = [
  { value: "start", label: "左对齐" },
  { value: "center", label: "居中对齐" },
  { value: "end", label: "右对齐" },
] as const;

export default function Example() {
  return <div className="flex flex-wrap justify-center gap-3">
    {alignments.map(({ value, label }) => (
      <KalosPopover key={value} trigger={label} label={label} align={value}>
        <p className="p-3">{label}的浮层</p>
      </KalosPopover>
    ))}
  </div>;
}`;

  const hasFields = variant !== "basic";
  return `"use client";

import { KalosPopover } from "@/components/ui/kalos-popover";${hasFields ? '\nimport { KalosInput } from "@/components/ui/kalos-input";\nimport { FieldGroup } from "@/components/ui/field";' : ''}

export default function Example() {
  return <KalosPopover trigger="打开浮层" label="尺寸" align="start">
    <div className="flex flex-col gap-4 p-3">
      <div className="flex flex-col gap-1">
        <h3 className="font-medium">尺寸</h3>
        <p className="text-muted-foreground">设置浮层的尺寸。</p>
      </div>${hasFields ? `
      <FieldGroup className="gap-3 [&>[data-slot=field]]:grid [&>[data-slot=field]]:grid-cols-[72px_minmax(0,1fr)] [&>[data-slot=field]]:items-center">
        <KalosInput label="宽度" defaultValue="100%" placeholder="100%" />${variant === "default" ? '\n        <KalosInput label="最大宽度" defaultValue="300px" placeholder="300px" />' : ''}
        <KalosInput label="高度" defaultValue="25px" placeholder="25px" />${variant === "default" ? '\n        <KalosInput label="最大高度" defaultValue="none" placeholder="none" />' : ''}
      </FieldGroup>` : ''}
    </div>
  </KalosPopover>;
}`;
}

export function reactExample(item: Item) {
  if (item.slug === "kalos-date-picker") return datePickerExample();
  if (item.slug === "kalos-date-range-picker") return dateRangePickerExample();
  if (item.slug === "kalos-time-picker") return timePickerExample();
  if (item.slug === "kalos-skeleton") return skeletonExample();
  if (item.slug === "kalos-spinner") return spinnerExample();
  if (item.slug === "kalos-tooltip") return `"use client";

import { Search } from "lucide-react";
import { KalosTooltip, KalosTooltipProvider } from "@/components/ui/kalos-tooltip";
import { KalosButton } from "@/components/ui/kalos-button";

export default function Example() {
  return <KalosTooltipProvider>
    <KalosTooltip content="搜索记录" shortcut="⌘K" side="bottom">
      <KalosButton variant="outline" size="icon" aria-label="搜索记录"><Search /></KalosButton>
    </KalosTooltip>
  </KalosTooltipProvider>;
}`;
  if (item.slug === "kalos-avatar-stack") return avatarExample();
  if (item.slug === "kalos-dropdown-menu") return dropdownMenuExample();
  if (item.slug === "kalos-card") return `"use client";

import { MoreHorizontal } from "lucide-react";
import { KalosCard } from "@/components/ui/kalos-card";
import { KalosButton } from "@/components/ui/kalos-button";

function ActivityIcon() {
  return <span aria-hidden="true" className="grid size-10 place-items-center rounded-lg bg-muted">
    <style>{\`@keyframes card-activity-pixel { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }\`}</style>
    <span className="grid size-4 grid-cols-[repeat(3,3px)] auto-rows-[3px] place-content-center gap-[1.5px]">
      {Array.from({ length: 9 }, (_, index) => <i key={index} className="rounded-[0.75px] bg-[var(--k-card-activity)]" style={{
        opacity: index === 1 || index === 7 ? 0 : 1,
        animation: index === 1 || index === 7 ? undefined : "card-activity-pixel 1.2s ease-in-out infinite both",
        animationDelay: (Math.floor(index / 3) + index % 3) * 120 + "ms",
      }} />)}
    </span>
  </span>;
}

export default function Example() {
  return <div className="w-full max-w-[400px]">
    <KalosCard
      as="section"
      aria-label="文档资料"
      title="文档资料"
      description="最近 30 天"
      icon={<ActivityIcon />}
      action={<KalosButton variant="ghost" size="icon" aria-label="查看文档信息" onClick={() => window.alert("142 份文档，已使用 4.2 GB 存储空间")}><MoreHorizontal /></KalosButton>}
      footer={<>
        <span>2 分钟前同步</span>
        <span className="ms-auto"><KalosButton onClick={() => window.alert("已打开文档资料")}>打开</KalosButton></span>
      </>}
    >
      <dl className="grid grid-cols-3 gap-3">
        <div><dt className="text-xs text-muted-foreground">文档</dt><dd className="text-base tabular-nums">142</dd></div>
        <div><dt className="text-xs text-muted-foreground">已同步</dt><dd className="text-base tabular-nums">96%</dd></div>
        <div><dt className="text-xs text-muted-foreground">存储</dt><dd className="text-base tabular-nums">4.2 GB</dd></div>
      </dl>
    </KalosCard>
  </div>;
}`;
  if (item.slug === "kalos-segmented-control") return segmentedControlExample();
  if (item.slug === "kalos-table") return basicTableExample();
  if (item.slug === "kalos-number-input") return `"use client";

import { useState } from "react";
import { KalosNumberInput } from "@/components/ui/kalos-number-input";

export default function Example() {
  const [files, setFiles] = useState<number | null>(3);

  return <form className="flex flex-col gap-4">
    <KalosNumberInput label="文件数量" name="files" value={files} onValueChange={setFiles} min={1} max={20} />
    <KalosNumberInput label="上传限额" name="limit" defaultValue={250} min={10} max={1000} step={10} unit="MB" />
    <KalosNumberInput label="打印费用" name="cost" prefix="¥" defaultValue={25} min={0} max={100} step={0.5} formatOptions={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }} />
    <KalosNumberInput label="缩放比例" name="scale" defaultValue={0.75} min={0.1} max={2} step={0.05} formatOptions={{ style: "percent", maximumFractionDigits: 0 }} />
  </form>;
}`;
  if (item.slug === "kalos-popover") return popoverExample();
  if (item.slug === "kalos-form") return `"use client";

import { KalosForm, type KalosFormField, type KalosFormValues } from "@/components/ui/kalos-form";

const fields: KalosFormField[] = [
  { name: "email", label: "邮箱地址", type: "email", required: true, autoComplete: "email" },
  { name: "password", label: "密码", type: "password", required: true, placeholder: "请输入密码", minLength: 8, hint: "至少 8 位", autoComplete: "new-password" },
  { name: "role", label: "成员角色", type: "select", required: true, items: [{ value: "editor", label: "编辑者" }, { value: "viewer", label: "查看者" }] },
  { name: "notifications", label: "消息通知", type: "switch" },
  { name: "terms", label: "同意服务条款", type: "checkbox", required: true },
];

export default function Example() {
  async function save(values: KalosFormValues) {
    // 替换为你的保存接口；失败时抛出异常，表单会保留输入并显示重试提示。
    const response = await fetch("/api/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!response.ok) throw new Error("保存失败");
  }

  return <KalosForm title="成员设置" fields={fields} defaultValues={{ notifications: true }} onSubmit={save} aria-label="成员设置" />;
}`;
  if (item.slug === "kalos-dialog") return `"use client";

import { useState } from "react";
import { KalosDialog } from "@/components/ui/kalos-dialog";
import { KalosInput } from "@/components/ui/kalos-input";
import { KalosButton } from "@/components/ui/kalos-button";
import { FieldGroup } from "@/components/ui/field";

export default function Example() {
  const [open, setOpen] = useState(false);
  const [contact, setContact] = useState({ name: "", email: "" });

  function changeOpen(nextOpen: boolean) {
    if (nextOpen) setContact({ name: "", email: "" });
    setOpen(nextOpen);
  }

  return (
    <KalosDialog
      trigger="打开对话框"
      title="添加联系人"
      open={open}
      onOpenChange={changeOpen}
      footer={<>
        <KalosButton variant="outline" onClick={() => setOpen(false)}>取消</KalosButton>
        <KalosButton onClick={() => setOpen(false)}>保存</KalosButton>
      </>}
    >
      <FieldGroup className="gap-3.5">
        <KalosInput label="姓名" placeholder="请输入姓名" autoComplete="off" value={contact.name} onChange={event => setContact({ ...contact, name: event.target.value })} />
        <KalosInput label="邮箱地址" type="email" placeholder="you@example.com" autoComplete="off" value={contact.email} onChange={event => setContact({ ...contact, email: event.target.value })} />
      </FieldGroup>
    </KalosDialog>
  );
}`;
  const name = item.slug.split("-").map(part => part[0].toUpperCase() + part.slice(1)).join("");
  const samples: Record<string, { state: string; jsx: string }> = {
    "kalos-input": { state: 'const [email, setEmail] = useState("");', jsx: '<KalosInput\n      label="邮箱地址"\n      type="email"\n      value={email}\n      onChange={event => setEmail(event.target.value)}\n      placeholder="you@example.com"\n    />' },
    "kalos-switch": { state: 'const [enabled, setEnabled] = useState(true);', jsx: '<KalosSwitch\n      label="消息通知"\n      checked={enabled}\n      onCheckedChange={setEnabled}\n    />' },
    "kalos-checkbox": { state: 'const [accepted, setAccepted] = useState(false);', jsx: '<KalosCheckbox\n      label="同意接收产品更新"\n      checked={accepted}\n      onCheckedChange={value => setAccepted(value === true)}\n    />' },
    "kalos-select": { state: 'const [framework, setFramework] = useState("next");', jsx: '<KalosSelect\n      label="开发框架"\n      value={framework}\n      onValueChange={setFramework}\n      items={[\n        { value: "next", label: "Next.js" },\n        { value: "vite", label: "React + Vite" },\n        { value: "router", label: "React Router" },\n      ]}\n    />' },
  };
  const sample = samples[item.slug];
  const jsx = sample?.jsx || (item.slug === "kalos-button" ? '<KalosButton onClick={() => console.log("saved")}>保存更改</KalosButton>' : item.usage);
  return `"use client";\n\n${sample ? 'import { useState } from "react";\n' : ""}import { ${name} } from "@/components/ui/${item.slug}";\n\nexport default function Example() {\n${sample ? `  ${sample.state}\n\n` : ""}  return (\n    ${jsx}\n  );\n}`;
}

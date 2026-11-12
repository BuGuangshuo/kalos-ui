"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FieldGroup } from "@/components/ui/field";
import type { DemoComponents } from "@/components/demo-content";
import type { PopoverExampleVariant } from "@/lib/component-examples";

const alignments = [
  { value: "start", label: "左对齐" },
  { value: "center", label: "居中对齐" },
  { value: "end", label: "右对齐" },
] as const;

function DimensionHeader() {
  return <div className="flex flex-col gap-1">
    <h3 className="font-medium">尺寸</h3>
    <p className="text-muted-foreground">设置浮层的尺寸。</p>
  </div>;
}

function FilterPopover({ KalosPopover, KalosInput, KalosSelect, KalosButton }: Pick<DemoComponents, "KalosPopover" | "KalosInput" | "KalosSelect" | "KalosButton">) {
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
      toast.success("已应用筛选");
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
}

export function PopoverDemo({ KalosPopover, KalosInput, KalosSelect, KalosButton, variant = "default" }: Pick<DemoComponents, "KalosPopover" | "KalosInput" | "KalosSelect" | "KalosButton"> & { variant?: PopoverExampleVariant }) {
  if (variant === "form") return <FilterPopover KalosPopover={KalosPopover} KalosInput={KalosInput} KalosSelect={KalosSelect} KalosButton={KalosButton} />;
  if (variant === "align") return <div className="flex flex-wrap justify-center gap-3">
    {alignments.map(({ value, label }) => <KalosPopover key={value} trigger={label} label={label} align={value}>
      <p className="p-3">{label}的浮层</p>
    </KalosPopover>)}
  </div>;

  return <KalosPopover trigger="打开浮层" label="尺寸" align="start">
    <div className="flex flex-col gap-4 p-3">
      <DimensionHeader />
      {variant !== "basic" && <FieldGroup className="gap-3 [&>[data-slot=field]]:grid [&>[data-slot=field]]:grid-cols-[72px_minmax(0,1fr)] [&>[data-slot=field]]:items-center">
        <KalosInput label="宽度" defaultValue="100%" placeholder="100%" />
        {variant === "default" && <KalosInput label="最大宽度" defaultValue="300px" placeholder="300px" />}
        <KalosInput label="高度" defaultValue="25px" placeholder="25px" />
        {variant === "default" && <KalosInput label="最大高度" defaultValue="none" placeholder="none" />}
      </FieldGroup>}
    </div>
  </KalosPopover>;
}

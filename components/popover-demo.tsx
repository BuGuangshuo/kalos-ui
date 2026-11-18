"use client";

import { useState } from "react";
import { BriefcaseBusiness, CalendarDays, Info, Sun } from "lucide-react";
import { Radio } from "@base-ui/react/radio";
import { toast } from "sonner";
import { FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field";
import { RadioGroup } from "@/components/ui/radio-group";
import { KalosCard } from "@/registry/kalos/kalos-card";
import type { DemoComponents } from "@/components/demo-content";
import type { PopoverExampleVariant } from "@/lib/component-examples";

const alignments = [
  { value: "start", label: "左对齐" },
  { value: "center", label: "居中对齐" },
  { value: "end", label: "右对齐" },
] as const;

const schedules = [
  { value: "daily", label: "每天", description: "每天 09:00", icon: Sun },
  { value: "weekdays", label: "工作日", description: "周一至周五 09:00", icon: BriefcaseBusiness },
  { value: "weekly", label: "每周一", description: "汇总上一周的文档", icon: CalendarDays },
] as const;

function DigestPopover({ KalosPopover, KalosButton, compact }: Pick<DemoComponents, "KalosPopover" | "KalosButton"> & { compact: boolean }) {
  const [open, setOpen] = useState(!compact);
  const [saved, setSaved] = useState("weekly");
  const [schedule, setSchedule] = useState(saved);
  const currentSchedule = schedules.find(option => option.value === saved) ?? schedules[2];

  const card = <KalosCard role="region" aria-label="每周摘要" className="popover-demo-card" title="每周摘要"
    description="汇总新增与更新的文档，发送到 #文档动态。"
    action={<KalosPopover
      trigger={<><CalendarDays data-icon="inline-start" />{currentSchedule.label}</>}
      label="发送日程"
      contentClassName="popover-schedule-panel"
      align="end"
      open={open}
      onOpenChange={next => { if (next) setSchedule(saved); setOpen(next); }}
    >
      <form className="popover-schedule-form" onSubmit={event => {
        event.preventDefault();
        setSaved(schedule);
        setOpen(false);
        toast.success("发送日程已保存");
      }}>
        <div className="popover-demo-heading"><h3>发送日程</h3><p>自动生成摘要，并在完成后发送。</p></div>
        <FieldSet className="gap-0">
          <FieldLegend className="sr-only">重复频率</FieldLegend>
          <RadioGroup value={schedule} onValueChange={setSchedule} aria-label="重复频率" className="gap-1">
            {schedules.map(({ value, label, description, icon: Icon }) => <Radio.Root key={value} value={value} className="popover-schedule-option">
              <Icon aria-hidden="true" />
              <span className="popover-schedule-text"><span>{label}</span><span>{description}</span></span>
              <Radio.Indicator className="popover-schedule-dot" />
            </Radio.Root>)}
          </RadioGroup>
        </FieldSet>
        <div className="popover-demo-actions">
          <KalosButton type="button" variant="outline" onClick={() => setOpen(false)}>取消</KalosButton>
          <KalosButton type="submit">保存</KalosButton>
        </div>
      </form>
    </KalosPopover>}
    footer={<><span>发送到 #文档动态</span><KalosPopover
      trigger={<Info />}
      triggerProps={{ variant: "ghost", size: "icon", "aria-label": "查看摘要范围" }}
      label="摘要范围"
      align="end"
      contentClassName="popover-info-panel"
    ><div className="popover-demo-heading"><h3>摘要范围</h3><p>包含所选周期内新增和更新的文档，不包含已删除的内容。</p></div></KalosPopover></>}
  />;
  return compact ? card : <div className="popover-demo-stage">{card}</div>;
}

function DimensionHeader() {
  return <div className="flex flex-col gap-1">
    <h3 className="font-medium">尺寸</h3>
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
        <KalosSelect label="部门" clearable placeholder="全部部门" value={filters.department} onValueChange={department => setFilters(current => ({ ...current, department }))} items={[{ value: "design", label: "设计部" }, { value: "engineering", label: "研发部" }, { value: "operations", label: "运营部" }]} />
        <KalosSelect label="角色" clearable placeholder="全部角色" value={filters.role} onValueChange={role => setFilters(current => ({ ...current, role }))} items={[{ value: "admin", label: "管理员" }, { value: "editor", label: "编辑者" }, { value: "viewer", label: "查看者" }]} />
        <KalosSelect label="状态" clearable placeholder="全部状态" value={filters.status} onValueChange={status => setFilters(current => ({ ...current, status }))} items={[{ value: "active", label: "已启用" }, { value: "inactive", label: "已停用" }]} />
        <KalosSelect label="加入时间" clearable placeholder="不限时间" value={filters.joined} onValueChange={joined => setFilters(current => ({ ...current, joined }))} items={[{ value: "7d", label: "最近 7 天" }, { value: "30d", label: "最近 30 天" }, { value: "90d", label: "最近 90 天" }]} />
      </FieldGroup>
      <div className="flex justify-end gap-3">
        <KalosButton type="button" variant="outline" onClick={() => setOpen(false)}>取消</KalosButton>
        <KalosButton type="submit">筛选</KalosButton>
      </div>
    </form>
  </KalosPopover>;
}

export function PopoverDemo({ KalosPopover, KalosInput, KalosSelect, KalosButton, variant = "default", compact = false }: Pick<DemoComponents, "KalosPopover" | "KalosInput" | "KalosSelect" | "KalosButton"> & { variant?: PopoverExampleVariant; compact?: boolean }) {
  if (variant === "default") return <DigestPopover KalosPopover={KalosPopover} KalosButton={KalosButton} compact={compact} />;
  if (variant === "form") return <FilterPopover KalosPopover={KalosPopover} KalosInput={KalosInput} KalosSelect={KalosSelect} KalosButton={KalosButton} />;
  if (variant === "align") return <div className="flex flex-wrap justify-center gap-3">
    {alignments.map(({ value, label }) => <KalosPopover key={value} trigger={label} label={label} align={value}>
      <p className="p-3">{label}的浮层</p>
    </KalosPopover>)}
  </div>;

  return <KalosPopover trigger="打开浮层" label="尺寸" align="start">
    <div className="flex flex-col gap-4 p-3">
      <DimensionHeader />
    </div>
  </KalosPopover>;
}

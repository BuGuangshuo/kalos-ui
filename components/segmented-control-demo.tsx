"use client";

import { type ComponentType } from "react";
import {
  Bell,
  CalendarDays,
  Columns3,
  Grid2X2,
  List,
  ListFilter,
} from "lucide-react";
import type { KalosSegmentedControlProps } from "@/components/ui/kalos-segmented-control-view";
import type { SegmentedExampleVariant } from "@/lib/segmented-control-examples";

const layoutOptions = [
  { value: "list", label: "列表", icon: <List /> },
  { value: "board", label: "看板", icon: <Columns3 /> },
  { value: "calendar", label: "日历", icon: <CalendarDays /> },
];
const sectionOptions = [
  { value: "overview", label: "概览" },
  { value: "activity", label: "动态" },
  { value: "files", label: "文件" },
  { value: "notifications", label: "通知", count: 3 },
];

export function SegmentedControlDemo({
  Control,
  variant = "default",
}: {
  Control: ComponentType<KalosSegmentedControlProps>;
  variant?: SegmentedExampleVariant;
}) {
  if (variant === "sizes")
    return (
      <div className="flex flex-col items-start gap-5">
        {(["sm", "md", "lg"] as const).map((size) => (
          <Control
            key={size}
            size={size}
            variant="tray"
            aria-label={`${size} 显示方式`}
            defaultValue="board"
            options={layoutOptions}
          />
        ))}
      </div>
    );
  if (variant === "icons")
    return (
      <Control
        variant="tray"
        aria-label="显示方式"
        defaultValue="board"
        options={[
          { value: "list", icon: <List />, ariaLabel: "列表" },
          { value: "board", icon: <Grid2X2 />, ariaLabel: "网格" },
          { value: "filter", icon: <ListFilter />, ariaLabel: "筛选" },
          {
            value: "notifications",
            icon: <Bell />,
            ariaLabel: "通知",
            disabled: true,
          },
        ]}
      />
    );
  if (variant === "full-width")
    return (
      <div className="w-full max-w-[420px]">
        <Control
          variant="tray"
          fullWidth
          aria-label="文件状态"
          options={[
            { value: "all", label: "全部文件", count: 24 },
            { value: "recent", label: "最近" },
            { value: "shared", label: "已共享", disabled: true },
          ]}
        />
      </div>
    );
  return (
    <div className="w-full max-w-[440px] rounded-xl bg-card p-5 shadow-[0_0_0_0.5px_var(--border),0_1px_2px_rgba(0,0,0,.04)]">
      <div className="flex flex-col items-start gap-2 pb-4">
        <span className="text-xs text-muted-foreground">工作台</span>
        <Control aria-label="工作台内容" options={sectionOptions} />
      </div>
      <div className="flex flex-col items-start gap-2 border-t border-border py-4">
        <span className="text-xs text-muted-foreground">布局</span>
        <Control
          size="sm"
          variant="tray"
          aria-label="布局"
          defaultValue="board"
          options={layoutOptions}
        />
      </div>
      <div className="flex flex-col items-start gap-2 border-t border-border pt-4">
        <span className="text-xs text-muted-foreground">账单</span>
        <Control
          variant="underline"
          aria-label="账单周期"
          defaultValue="yearly"
          options={[
            { value: "monthly", label: "月付" },
            { value: "yearly", label: "年付", badge: "节省 20%" },
          ]}
        />
      </div>
    </div>
  );
}

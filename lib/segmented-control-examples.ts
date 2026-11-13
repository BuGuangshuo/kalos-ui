export const segmentedExampleVariants = [
  { variant: "sizes", title: "尺寸" },
  { variant: "icons", title: "图标选项" },
  { variant: "full-width", title: "等宽与禁用选项" },
] as const;
export type SegmentedExampleVariant =
  "default" | (typeof segmentedExampleVariants)[number]["variant"];

const examples = {
  default: `"use client";

import { KalosSegmentedControl } from "@/components/ui/kalos-segmented-control";
import { List, Columns3, CalendarDays } from "lucide-react";

export default function Example() {
  return (
    <div className="w-full max-w-[440px] rounded-xl bg-card p-5 shadow-[0_0_0_0.5px_var(--border),0_1px_2px_rgba(0,0,0,.04)]">
      <div className="flex flex-col items-start gap-2 pb-4">
        <span className="text-xs text-muted-foreground">工作台</span>
        <KalosSegmentedControl
          aria-label="工作台内容"
          options={[
            { value: "overview", label: "概览" },
            { value: "activity", label: "动态" },
            { value: "files", label: "文件" },
            { value: "notifications", label: "通知", count: 3 },
          ]}
        />
      </div>
      <div className="flex flex-col items-start gap-2 border-t border-border py-4">
        <span className="text-xs text-muted-foreground">布局</span>
        <KalosSegmentedControl
          size="sm"
          variant="tray"
          aria-label="布局"
          defaultValue="board"
          options={[
            { value: "list", label: "列表", icon: <List /> },
            { value: "board", label: "看板", icon: <Columns3 /> },
            { value: "calendar", label: "日历", icon: <CalendarDays /> },
          ]}
        />
      </div>
      <div className="flex flex-col items-start gap-2 border-t border-border pt-4">
        <span className="text-xs text-muted-foreground">账单</span>
        <KalosSegmentedControl
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
`,
  sizes: `"use client";

import { KalosSegmentedControl } from "@/components/ui/kalos-segmented-control";
import { List, Columns3, CalendarDays } from "lucide-react";

const options = [
  { value: "list", label: "列表", icon: <List /> },
  { value: "board", label: "看板", icon: <Columns3 /> },
  { value: "calendar", label: "日历", icon: <CalendarDays /> },
];

export default function Example() {
  return (
    <div className="flex flex-col items-start gap-5">
      {(["sm", "md", "lg"] as const).map((size) => (
        <KalosSegmentedControl
          key={size}
          size={size}
          variant="tray"
          aria-label={size + " 显示方式"}
          defaultValue="board"
          options={options}
        />
      ))}
    </div>
  );
}
`,
  icons: `"use client";

import { KalosSegmentedControl } from "@/components/ui/kalos-segmented-control";
import { List, Grid2X2, ListFilter, Bell } from "lucide-react";

export default function Example() {
  return (
    <KalosSegmentedControl
      variant="tray"
      aria-label="显示方式"
      defaultValue="board"
      options={[
        { value: "list", icon: <List />, ariaLabel: "列表" },
        { value: "board", icon: <Grid2X2 />, ariaLabel: "网格" },
        { value: "filter", icon: <ListFilter />, ariaLabel: "筛选" },
        { value: "notifications", icon: <Bell />, ariaLabel: "通知", disabled: true },
      ]}
    />
  );
}
`,
  "full-width": `"use client";

import { KalosSegmentedControl } from "@/components/ui/kalos-segmented-control";

export default function Example() {
  return (
    <div className="w-full max-w-[420px]">
      <KalosSegmentedControl
        fullWidth
        variant="tray"
        aria-label="文件状态"
        options={[
          { value: "all", label: "全部文件", count: 24 },
          { value: "recent", label: "最近" },
          { value: "shared", label: "已共享", disabled: true },
        ]}
      />
    </div>
  );
}
`,
};

export function segmentedControlExample(
  variant: SegmentedExampleVariant = "default",
) {
  return examples[variant];
}

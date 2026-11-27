import { comboboxExample } from "@/lib/combobox-examples";
import { colorPickerExample } from "@/lib/color-picker-examples";
import { textAreaExample } from "@/lib/text-area-examples";
import { otpInputExample } from "@/lib/otp-input-examples";
import { dropzoneExample } from "@/lib/dropzone-example";
import { drawerExample } from "@/lib/drawer-examples";
import { toastExample } from "@/lib/toast-examples";
import { notificationExample } from "@/lib/notification-examples";
import { badgeExample } from "@/lib/badge-examples";
import { paginationExample } from "@/lib/pagination-examples";
import { avatarExample } from "@/lib/avatar-examples";
import { dropdownMenuExample } from "@/lib/dropdown-menu-examples";
import type { Item } from "@/lib/catalog";
import { segmentedControlExample } from "@/lib/segmented-control-examples";
import { basicTableExample } from "@/lib/table-examples";
import { skeletonExample, spinnerExample } from "@/lib/loading-examples";
import { datePickerExample, dateRangePickerExample, timePickerExample } from "@/lib/date-time-examples";

export type PopoverExampleVariant = "default" | "basic" | "align" | "form";

export function popoverExample(variant: PopoverExampleVariant = "default") {
  if (variant === "default") return `"use client";

import { useState } from "react";
import { BriefcaseBusiness, CalendarDays, Sun } from "lucide-react";
import { Radio } from "@base-ui/react/radio";
import { KalosPopover } from "@/components/ui/kalos-popover";
import { KalosButton } from "@/components/ui/kalos-button";
import { FieldLegend, FieldSet } from "@/components/ui/field";
import { RadioGroup } from "@/components/ui/radio-group";

const schedules = [
  { value: "daily", label: "每天", description: "每天 09:00", icon: Sun },
  { value: "weekdays", label: "工作日", description: "周一至周五 09:00", icon: BriefcaseBusiness },
  { value: "weekly", label: "每周一", description: "汇总上一周的文档", icon: CalendarDays },
] as const;

export default function Example() {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState("weekly");
  const [schedule, setSchedule] = useState(saved);
  const currentSchedule = schedules.find(option => option.value === saved) ?? schedules[2];

  return <KalosPopover
    trigger={<><CalendarDays data-icon="inline-start" />{currentSchedule.label}</>}
    label="发送日程"
    align="end"
    contentClassName="w-[300px] max-w-[calc(100vw-32px)] rounded-xl p-3.5"
    open={open}
    onOpenChange={next => { if (next) setSchedule(saved); setOpen(next); }}
  >
    <form className="flex flex-col gap-4" onSubmit={event => {
      event.preventDefault();
      setSaved(schedule);
      setOpen(false);
      // 在这里保存发送日程。
    }}>
      <div className="flex flex-col gap-1">
        <h3 className="text-[13px] font-medium leading-5">发送日程</h3>
        <p className="text-xs leading-[18px] text-muted-foreground">自动生成摘要，并在完成后发送。</p>
      </div>
      <FieldSet className="gap-0">
        <FieldLegend className="sr-only">重复频率</FieldLegend>
        <RadioGroup value={schedule} onValueChange={setSchedule} aria-label="重复频率" className="gap-1">
          {schedules.map(({ value, label, description, icon: Icon }) => (
            <Radio.Root key={value} value={value} className="flex min-h-[52px] cursor-pointer items-center gap-3 rounded-lg p-2 outline-none transition-colors duration-180 hover:bg-muted data-checked:bg-muted focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring">
              <Icon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
              <span className="flex min-w-0 flex-1 flex-col"><span>{label}</span><span className="text-xs leading-[18px] text-muted-foreground">{description}</span></span>
              <Radio.Indicator className="size-1.5 shrink-0 rounded-full bg-current" />
            </Radio.Root>
          ))}
        </RadioGroup>
      </FieldSet>
      <div className="flex justify-end gap-2">
        <KalosButton type="button" variant="outline" onClick={() => setOpen(false)}>取消</KalosButton>
        <KalosButton type="submit">保存</KalosButton>
      </div>
    </form>
  </KalosPopover>;
}`;
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

  return `"use client";

import { KalosPopover } from "@/components/ui/kalos-popover";

export default function Example() {
  return <KalosPopover trigger="打开浮层" label="尺寸" align="start">
    <div className="flex flex-col gap-4 p-3">
      <div className="flex flex-col gap-1">
        <h3 className="font-medium">尺寸</h3>
      </div>
    </div>
  </KalosPopover>;
}`;
}

export function reactExample(item: Item) {
  if (item.slug === "kalos-breakdown-chart") return `"use client";

import { KalosBreakdownChart } from "@/components/ui/kalos-breakdown-chart";

const documents = [
  { status: "待审核", format: "PDF", pages: 8 },
  { status: "待审核", format: "Word", pages: 4 },
  { status: "已归档", format: "PDF", pages: 12 },
  { status: "已归档", format: "PDF", pages: 6 },
];

export default function DocumentBreakdown() {
  return <KalosBreakdownChart
    title="文档审核"
    records={documents}
    dimensions={[
      { key: "status", label: "审核状态", values: ["待审核", "已归档"] },
      { key: "format", label: "文件格式", values: ["PDF", "Word"] },
    ]}
    measures={[
      { key: "count", label: "文档数", unit: "份" },
      { key: "pages", label: "页数", unit: "页", field: "pages" },
    ]}
    defaultMeasure="count"
    defaultSlice="status"
    defaultSegment="format"
  />;
}`;

  if (item.slug === "kalos-usage-meter") return `"use client";

import { useState } from "react";
import { KalosUsageMeter, type UsageMeterState } from "@/components/ui/kalos-usage-meter";

const periods = [
  { id: "month", label: "本月" },
  { id: "last", label: "上月" },
];

const usage = {
  month: [
    { label: "文档问答", value: 3760 },
    { label: "全文检索", value: 1940 },
  ],
  last: [
    { label: "文档问答", value: 6120 },
    { label: "全文检索", value: 3040 },
  ],
};

export default function UsageExample({ openTopUp }: {
  openTopUp: (state: UsageMeterState) => void;
}) {
  const [period, setPeriod] = useState("month");

  return <KalosUsageMeter
    title="文档助手"
    plan="专业版"
    total={10_000}
    used={period === "month" ? usage.month : usage.last}
    limits={[{ label: "成员席位", used: 8, total: 10 }]}
    periods={periods}
    period={period}
    onPeriodChange={setPeriod}
    onUpgrade={openTopUp}
    locale="zh-CN"
  />;
}`;

  if (item.slug === "kalos-collaboration-stream") return `"use client";

import { useState } from "react";
import { KalosCollaborationStream, type StreamAgent, type StreamMessage } from "@/components/ui/kalos-collaboration-stream";

const agents: StreamAgent[] = [
  { id: "editor", name: "编辑助手", model: "Gemini Flash" },
  { id: "reviewer", name: "审核助手" },
];

export default function Example() {
  const [messages, setMessages] = useState<StreamMessage[]>([
    { id: "m1", from: "you", to: "editor", kind: "ask", text: "更新快速开始指南。" },
    { id: "m2", from: "editor", to: "reviewer", kind: "handoff", text: "请核对成员邀请流程。",
      attachments: [{ label: "onboarding.md", preview: "打开设置，进入成员页面并发送邀请。" }] },
  ]);

  return <KalosCollaborationStream
    agents={agents}
    messages={messages}
    task="更新快速开始指南"
    live
    onSend={({ text, to, replyTo }) => {
      const id = crypto.randomUUID();
      setMessages(current => [...current, { id, from: "you", to, kind: replyTo ? "reply" : "ask", text, replyTo }]);
    }}
  />;
}`;

  if (item.slug === "kalos-thinking-state") return `"use client";

import { BookOpen } from "lucide-react";
import { KalosThinkingState, type ThinkingStep } from "@/components/ui/kalos-thinking-state";

const steps: readonly ThinkingStep[] = [
  {
    kind: "search",
    label: "已搜索文档",
    activeLabel: "正在搜索文档",
    sources: [
      { label: "MDN · 无障碍指南", href: "https://developer.mozilla.org/zh-CN/docs/Web/Accessibility", icon: <BookOpen /> },
    ],
    moreSources: [
      { label: "WAI · 设计模式", href: "https://www.w3.org/WAI/ARIA/apg/patterns/", tooltip: "查看键盘交互模式" },
    ],
  },
  { kind: "step", label: "核对键盘操作" },
  { kind: "step", label: "整理更新清单" },
];

export function DocumentReview({ runId }: { runId: string }) {
  return <KalosThinkingState
    key={runId}
    steps={steps}
    doneLabel="已整理更新清单"
    onDone={seconds => console.log(seconds)}
  />;
}`;

  if (item.slug === "kalos-response-stream") return `"use client";

import { KalosResponseStream, type ResponseStreamStatus } from "@/components/ui/kalos-response-stream";

type ReplyProps = {
  text: string;
  status: ResponseStreamStatus;
  error?: string;
  stop: () => void;
  resume: () => void;
  retry: () => void;
};

export function Reply({ text, status, error, stop, resume, retry }: ReplyProps) {
  return <KalosResponseStream
    text={text}
    status={status}
    error={error}
    agent={{ id: "atlas", name: "Atlas" }}
    onStop={stop}
    onContinue={resume}
    onRetry={retry}
  />;
}`;

  if (item.slug === "kalos-permission-request") return `"use client";

import { useState } from "react";
import { KalosPermissionRequest, type PermissionDecision } from "@/components/ui/kalos-permission-request";

export default function Example() {
  const [decision, setDecision] = useState<PermissionDecision | null>(null);

  return <KalosPermissionRequest
    agent={{ name: "文档助手" }}
    action="发布文档更新"
    target="kalos-ui/docs"
    reason="两份文档已通过审核。"
    preview={[
      { id: "tokens", label: "docs/design/tokens.mdx", meta: "+12 −4" },
      { id: "components", label: "docs/components/index.mdx", meta: "+31 −2" },
    ]}
    decision={decision}
    onDecisionChange={setDecision}
  />;
}`;

  if (item.slug === "kalos-decision-card") return `"use client";

import { useState } from "react";
import { KalosDecisionCard, type KalosDecision } from "@/components/ui/kalos-decision-card";

const initialDecisions: KalosDecision[] = [
  {
    id: "index",
    task: "文档索引",
    question: "何时重建文档索引？",
    options: [
      { id: "nightly", title: "每天凌晨", summary: "在文档编辑较少时运行", recommended: true },
      { id: "on-change", title: "文档变更后", summary: "立即更新搜索结果" },
    ],
  },
  {
    id: "weekly-update",
    kind: "approval",
    question: "将本周简报发送给协作者？",
    facts: [{ label: "收件人", value: "周宁" }, { label: "主题", value: "本周文档更新" }],
  },
];

export function ConversationDecisions() {
  const [pending, setPending] = useState(initialDecisions);

  return (
    <KalosDecisionCard
      decisions={pending}
      onDecide={(id, answer) => {
        console.log(id, answer);
        setPending(items => items.filter(item => item.id !== id));
      }}
    />
  );
}`;
  if (item.slug === "kalos-command-menu") return `"use client";

import { useState } from "react";
import { FilePlus2, Globe, PenTool } from "lucide-react";
import { KalosCommandMenu, type KalosCommandGroup } from "@/components/ui/kalos-command-menu";

const groups: KalosCommandGroup[] = [
  { label: "推荐操作", items: [
    { value: "design", label: "打开设计文件", hint: "Figma", icon: <PenTool />, shortcut: 1 },
    { value: "website", label: "编辑网页", hint: "Framer", icon: <Globe />, shortcut: 2 },
  ] },
  { label: "常用操作", items: [
    { value: "document", label: "新建文档", icon: <FilePlus2 /> },
  ] },
];

export default function Example() {
  const [selection, setSelection] = useState("");

  return <>
    <KalosCommandMenu groups={groups} placeholder="输入命令或搜索…" onRun={value => {
      const item = groups.flatMap(group => group.items).find(item => item.value === value);
      if (item) setSelection(item.label);
    }} />
    {selection && <p role="status">已选择「{selection}」</p>}
  </>;
}`;
  if (item.slug === "kalos-ai-answer") return `"use client";

import { KalosAIAnswer, type KalosAnswerSource } from "@/components/ui/kalos-ai-answer";

const sources: KalosAnswerSource[] = [
  { name: "Notion", title: "团建计划：候选地点与预算", href: "https://www.notion.so" },
  { name: "维基百科", title: "阿尔法玛：里斯本最古老的街区", href: "https://en.wikipedia.org/wiki/Alfama" },
];

export default function Example() {
  return <KalosAIAnswer
    question="在里斯本哪里办团建最合适？"
    answer="**阿尔法玛**适合 12 人团建。这里适合步行，早晨安静，费用也在预算内 [1, 2]。"
    sources={sources}
    framed
  />;
}`;
  if (item.slug === "kalos-empty-state") return `"use client";

import { CalendarDays, Plus } from "lucide-react";
import { KalosEmptyState } from "@/components/ui/kalos-empty-state";
// 安装本例时，将 button 加入 empty-state 的安装命令。
import { KalosButton } from "@/components/ui/kalos-button";

export function EmptySchedules({ onCreate }: { onCreate: () => void }) {
  return (
    <KalosEmptyState
      icon={<CalendarDays />}
      title="暂无日程"
      text="为任务设置执行时间后，可以在这里查看下次运行时间。"
      action={
        <KalosButton type="button" variant="secondary" size="sm" onClick={onCreate}>
          <Plus data-icon="inline-start" />
          新建日程
        </KalosButton>
      }
    />
  );
}`;
  if (item.slug === "kalos-toast") return toastExample();
  if (item.slug === "kalos-select") return `"use client";

import { useState } from "react";
import { CodeXml, Pencil } from "lucide-react";
import { KalosSelect, type KalosSelectOption } from "@/components/ui/kalos-select";

const roles: KalosSelectOption[] = [
  { value: "design", label: "设计", icon: <Pencil /> },
  { value: "engineering", label: "工程", icon: <CodeXml /> },
  { value: "reviewer", label: "审阅者", description: "由管理员分配", disabled: true },
];

export default function Example() {
  const [role, setRole] = useState<string | null>("design");

  return <KalosSelect label="角色" name="role" options={roles} value={role} onChange={setRole} />;
}`;
  if (item.slug === "kalos-combobox") return comboboxExample();
  if (item.slug === "kalos-text-area") return textAreaExample();
  if (item.slug === "kalos-otp-input") return otpInputExample;
  if (item.slug === "kalos-color-picker") return colorPickerExample();
  if (item.slug === "kalos-dropzone") return dropzoneExample;
  if (item.slug === "kalos-breadcrumb") return `import { KalosBreadcrumb, type KalosBreadcrumbItem } from "@/components/ui/kalos-breadcrumb";

const items: KalosBreadcrumbItem[] = [
  { label: "工作区", href: "/" },
  { label: "文档", href: "/docs" },
  { label: "设计系统", href: "/docs/tokens" },
  { label: "字体" },
];

export default function Example() {
  return <KalosBreadcrumb items={items} />;
}`;
  if (item.slug === "kalos-pagination") return paginationExample();
  if (item.slug === "kalos-badge") return badgeExample();
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
  if (item.slug === "kalos-drawer") return drawerExample;
  if (item.slug === "kalos-notification") return notificationExample;
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
  };
  const sample = samples[item.slug];
  const jsx = sample?.jsx || (item.slug === "kalos-button" ? '<KalosButton onClick={() => console.log("saved")}>保存更改</KalosButton>' : item.usage);
  return `"use client";\n\n${sample ? 'import { useState } from "react";\n' : ""}import { ${name} } from "@/components/ui/${item.slug}";\n\nexport default function Example() {\n${sample ? `  ${sample.state}\n\n` : ""}  return (\n    ${jsx}\n  );\n}`;
}

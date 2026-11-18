"use client";

import { ChartNoAxesColumn, CodeXml, Pencil, Rocket, UserRound } from "lucide-react";
import { FieldGroup } from "@/components/ui/field";
import { KalosSelect, type KalosSelectOption } from "@/registry/kalos/kalos-select";

const roles: KalosSelectOption[] = [
  { value: "design", label: "设计", icon: <Pencil strokeWidth={1.6} /> },
  { value: "engineering", label: "工程", icon: <CodeXml strokeWidth={1.6} /> },
  { value: "product", label: "产品", icon: <ChartNoAxesColumn strokeWidth={1.6} /> },
  { value: "founder", label: "创始人", icon: <Rocket strokeWidth={1.6} /> },
  { value: "other", label: "其他", icon: <UserRound strokeWidth={1.6} /> },
];

const models: KalosSelectOption[] = [
  { value: "auto", label: "自动", description: "按每条消息选择模型" },
  { value: "opus", label: "Claude Opus", description: "处理复杂的长篇任务" },
  { value: "sonnet", label: "Claude Sonnet", description: "适合日常分析和写作" },
  { value: "haiku", label: "Claude Haiku", description: "快速回答简短问题" },
  { value: "custom", label: "自定义模型", description: "请先在模型设置中添加端点", disabled: true },
];

const timeZones: KalosSelectOption[] = [
  { value: "America/Los_Angeles", label: "太平洋时间 · 洛杉矶" },
  { value: "America/Denver", label: "山地时间 · 丹佛" },
  { value: "America/Chicago", label: "中部时间 · 芝加哥" },
  { value: "America/New_York", label: "东部时间 · 纽约" },
  { value: "America/Sao_Paulo", label: "巴西利亚时间 · 圣保罗" },
  { value: "Europe/London", label: "格林尼治时间 · 伦敦" },
  { value: "Europe/Berlin", label: "中欧时间 · 柏林" },
  { value: "Europe/Athens", label: "东欧时间 · 雅典" },
  { value: "Asia/Dubai", label: "海湾时间 · 迪拜" },
  { value: "Asia/Kolkata", label: "印度时间 · 孟买" },
  { value: "Asia/Shanghai", label: "中国标准时间 · 上海" },
  { value: "Asia/Tokyo", label: "日本标准时间 · 东京" },
  { value: "Australia/Sydney", label: "澳大利亚东部时间 · 悉尼" },
];

export function SelectDemo({ compact = false }: { compact?: boolean }) {
  return (
    <FieldGroup className="w-[320px] max-w-full gap-[18px]">
      <KalosSelect label="角色" options={roles} defaultValue="design" />
      {!compact && <>
        <KalosSelect label="默认模型" options={models} defaultValue="auto" />
        <KalosSelect label="时区" options={timeZones} placeholder="请选择时区" hint="提醒按所选时区发送。" clearable />
      </>}
    </FieldGroup>
  );
}

"use client";

import Image from "next/image";
import { ChartNoAxesColumn, CircleHelp, FilePlus2, House, Inbox, Moon, Settings, Upload, UserRoundPlus } from "lucide-react";
import { toast } from "sonner";
import { commandMenuDemoStyles } from "@/components/command-menu-demo-styles";
import { StackBrandIcon } from "@/components/table-demo";
import { KalosCommandMenu, type KalosCommandGroup } from "@/registry/kalos/kalos-command-menu";

function BrandIcon({ name }: { name: "Figma" | "Framer" | "Linear" | "Loom" | "Vercel" | "Slack" | "Notion" }) {
  return (
    <span className={commandMenuDemoStyles.brandIcon}>
      {name === "Slack" || name === "Notion" ? (
        <Image src={`/command-menu/${name.toLowerCase()}.svg`} alt="" width={commandMenuDemoStyles.iconSize} height={commandMenuDemoStyles.iconSize} unoptimized />
      ) : <StackBrandIcon name={name} />}
    </span>
  );
}

const groups: KalosCommandGroup[] = [
  {
    label: "推荐操作",
    items: [
      { value: "design", label: "打开设计文件", hint: "Figma", icon: <BrandIcon name="Figma" />, shortcut: 1 },
      { value: "website", label: "编辑网页", hint: "Framer", icon: <BrandIcon name="Framer" />, shortcut: 2 },
      { value: "task", label: "新建任务", hint: "Linear", icon: <BrandIcon name="Linear" />, shortcut: 3 },
      { value: "record", label: "录制视频", hint: "Loom", icon: <BrandIcon name="Loom" />, shortcut: 4 },
      { value: "deployment", label: "查看部署", hint: "Vercel", icon: <BrandIcon name="Vercel" />, shortcut: 5 },
    ],
  },
  {
    label: "分享",
    items: [
      { value: "post", label: "发布团队动态", hint: "#team-updates", keywords: "Slack", icon: <BrandIcon name="Slack" /> },
      { value: "save", label: "存为页面", hint: "Notion · 会议纪要", icon: <BrandIcon name="Notion" /> },
    ],
  },
  {
    label: "常用操作",
    items: [
      { value: "document", label: "新建文档", icon: <FilePlus2 /> },
      { value: "invite", label: "邀请成员", icon: <UserRoundPlus /> },
      { value: "upload", label: "上传文件", icon: <Upload /> },
      { value: "theme", label: "切换深色模式", icon: <Moon /> },
    ],
  },
  {
    label: "跳转到",
    items: [
      { value: "home", label: "首页", icon: <House /> },
      { value: "inbox", label: "收件箱", icon: <Inbox /> },
      { value: "reports", label: "报表", icon: <ChartNoAxesColumn /> },
      { value: "settings", label: "设置", icon: <Settings /> },
      { value: "help", label: "帮助与反馈", icon: <CircleHelp /> },
    ],
  },
];

const compactGroups = [{ ...groups[0], items: groups[0].items.slice(0, 2) }];
const labels = new Map(groups.flatMap(({ items }) => items.map(({ value, label }) => [value, label])));

export function CommandMenuDemo({ compact, autoFocus = !compact }: { compact: boolean; autoFocus?: boolean }) {
  return (
    <KalosCommandMenu
      className={commandMenuDemoStyles.menu}
      placeholder="输入命令或搜索…"
      groups={compact ? compactGroups : groups}
      autoFocus={autoFocus}
      onRun={value => toast(`已选择「${labels.get(value)}」`)}
    />
  );
}

"use client";
import { KalosForm } from "@/registry/kalos/kalos-form";
import { DemoContent } from "@/components/demo-content";
import type { NumberInputExampleVariant } from "@/lib/number-input-examples";
import type { SegmentedExampleVariant } from "@/lib/segmented-control-examples";
import { KalosDropdownMenu } from "@/registry/kalos/kalos-dropdown-menu";
import type { DropdownExampleVariant } from "@/lib/dropdown-menu-examples";
import type { TableExampleVariant } from "@/lib/table-examples";
import { KalosTable } from "@/registry/kalos/kalos-table";
import type { PopoverExampleVariant } from "@/lib/component-examples";
import {
  Plus,
  Code2,
  MoreHorizontal,
  Command,
  ArrowUp,
  Folder,
  Box,
} from "lucide-react";
import { toast } from "sonner";
import { KalosButton } from "@/registry/kalos/kalos-button";
import { KalosHoverCard } from "@/registry/kalos/kalos-hover-card";
import { KalosPopover } from "@/registry/kalos/kalos-popover";
import { KalosCommandMenu } from "@/registry/kalos/kalos-command-menu";
import { KalosNumberInput } from "@/registry/kalos/kalos-number-input";
import { KalosInput } from "@/registry/kalos/kalos-input";
import { KalosCard } from "@/registry/kalos/kalos-card";
import { KalosBadge } from "@/registry/kalos/kalos-badge";
import { KalosSwitch } from "@/registry/kalos/kalos-switch";
import { KalosCheckbox } from "@/registry/kalos/kalos-checkbox";
import { KalosSegmentedControl } from "@/registry/kalos/kalos-segmented-control";
import { KalosAccordion } from "@/registry/kalos/kalos-accordion";
import { KalosAlertDialog } from "@/registry/kalos/kalos-alert-dialog";
import { KalosDialog } from "@/registry/kalos/kalos-dialog";
import { KalosSelect } from "@/registry/kalos/kalos-select";
import { KalosProgress } from "@/registry/kalos/kalos-progress";
import { KalosAvatar, KalosAvatarStack } from "@/registry/kalos/kalos-avatar-stack";
import { Separator } from "@/components/ui/separator";
const people = [
  { name: "Alan Bu" },
  { name: "陈晓" },
  { name: "林舟" },
  { name: "周宁" },
  { name: "吴昕" },
];
const components = {
  KalosForm,
  KalosDropdownMenu,
  KalosTable,
  KalosButton,
  KalosInput,
  KalosNumberInput,
  KalosHoverCard,
  KalosPopover,
  KalosCommandMenu,
  KalosCard,
  KalosBadge,
  KalosSwitch,
  KalosCheckbox,
  KalosSegmentedControl,
  KalosAccordion,
  KalosDialog,
  KalosAlertDialog,
  KalosSelect,
  KalosProgress,
  KalosAvatar,
  KalosAvatarStack,
};
export function ComponentDemo({
  slug,
  compact = false,
  popoverVariant,
  tableVariant,
  segmentedVariant,
  numberVariant,
  dropdownVariant,
}: {
  slug: string;
  compact?: boolean;
  popoverVariant?: PopoverExampleVariant;
  tableVariant?: TableExampleVariant;
  segmentedVariant?: SegmentedExampleVariant;
  numberVariant?: NumberInputExampleVariant;
  dropdownVariant?: DropdownExampleVariant;
}) {
  return (
    <DemoContent components={components} slug={slug} compact={compact} popoverVariant={popoverVariant} tableVariant={tableVariant} segmentedVariant={segmentedVariant} numberVariant={numberVariant} dropdownVariant={dropdownVariant} />
  );
}
export function HeroShowcase() {
  return (
    <div className="hero-orbits">
      <div className="orbit-card orbit-project">
        <div className="orbit-card-top">
          <span>
            <Folder /> 设计工作空间
          </span>
          <MoreHorizontal />
        </div>
        <div className="abstract-preview">
          <div className="abstract-window">
            <span />
            <span />
            <span />
            <div />
            <div />
            <div />
          </div>
          <div className="abstract-tile">
            <Box />
          </div>
        </div>
        <strong>从一个好想法开始。</strong>
        <div className="orbit-row">
          <KalosAvatarStack people={people.slice(0, 3)} />
          <span>3 位协作者</span>
        </div>
      </div>
      <div className="orbit-composer">
        <span>今天，想构建些什么？</span>
        <div>
          <Plus />
          <span>自由探索每一种可能</span>
          <button
            aria-label="发送示例想法"
            onClick={() => toast.success("想法已记录，开始动手吧！")}
          >
            <ArrowUp />
          </button>
        </div>
      </div>
      <div className="orbit-card orbit-settings">
        <div className="orbit-card-top">
          <span>
            <Command /> 应用偏好
          </span>
          <MoreHorizontal />
        </div>
        <KalosSwitch label="自动保存" defaultChecked />
        <Separator />
        <KalosSwitch label="消息通知" />
        <Separator />
        <KalosCheckbox label="与团队分享文档" defaultChecked />
      </div>
      <div className="orbit-card orbit-progress">
        <div className="orbit-progress-icon">
          <Code2 />
        </div>
        <strong>构建进度</strong>
        <KalosProgress label="组件已准备就绪" value={75} />
        <div className="orbit-row">
          <KalosBadge status="success">已同步</KalosBadge>
          <span>刚刚更新</span>
        </div>
      </div>
    </div>
  );
}
export function HomeControls() {
  return (
    <div className="home-controls">
      <div className="flex items-center gap-3">
        <KalosBadge>默认状态</KalosBadge>
        <KalosBadge status="success">已完成</KalosBadge>
        <KalosSwitch label="" aria-label="示例开关" defaultChecked />
      </div>
      <div className="flex gap-2">
        <KalosButton variant="secondary" onClick={() => toast("次要操作已触发")}>
          次要按钮
        </KalosButton>
        <KalosButton onClick={() => toast.success("主要操作已完成")}>
          主要按钮
        </KalosButton>
      </div>
      <KalosInput label="快速查找" placeholder="搜索你的下一个组件…" />
    </div>
  );
}

"use client";
import dynamic from "next/dynamic";
import { DemoContent } from "@/components/demo-content";
import { useFramework } from "@/components/framework";
import { usePrimitive } from "@/components/primitives";
const BaseDemo = dynamic(() => import("@/components/base-ui-demos"));
const AriaDemo = dynamic(() => import("@/components/react-aria-demos"));
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
import { PopButton } from "@/registry/pop/pop-button";
import { PopInput } from "@/registry/pop/pop-input";
import { PopCard } from "@/registry/pop/pop-card";
import { PopBadge } from "@/registry/pop/pop-badge";
import { PopSwitch } from "@/registry/pop/pop-switch";
import { PopCheckbox } from "@/registry/pop/pop-checkbox";
import { PopTabs } from "@/registry/pop/pop-tabs";
import { PopAccordion } from "@/registry/pop/pop-accordion";
import { PopDialog } from "@/registry/pop/pop-dialog";
import { PopSelect } from "@/registry/pop/pop-select";
import { PopProgress } from "@/registry/pop/pop-progress";
import { PopAvatarStack } from "@/registry/pop/pop-avatar-stack";
import { Separator } from "@/components/ui/separator";
const people = [
  { name: "Alan Bu" },
  { name: "陈晓" },
  { name: "林舟" },
  { name: "周宁" },
  { name: "吴昕" },
];
const radixComponents = {
  PopButton,
  PopInput,
  PopCard,
  PopBadge,
  PopSwitch,
  PopCheckbox,
  PopTabs,
  PopAccordion,
  PopDialog,
  PopSelect,
  PopProgress,
  PopAvatarStack,
};
export function ComponentDemo({
  slug,
  compact = false,
}: {
  slug: string;
  compact?: boolean;
}) {
  const { framework } = useFramework();
  const { primitive } = usePrimitive();
  if (framework === "react" && primitive === "base-ui")
    return <BaseDemo slug={slug} compact={compact} />;
  if (framework === "react" && primitive === "react-aria")
    return <AriaDemo slug={slug} compact={compact} />;
  return (
    <DemoContent components={radixComponents} slug={slug} compact={compact} />
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
        <p>基础已就绪，创意由你定义。</p>
        <div className="orbit-row">
          <PopAvatarStack people={people.slice(0, 3)} />
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
            <Command /> 项目偏好
          </span>
          <MoreHorizontal />
        </div>
        <PopSwitch label="自动保存" defaultChecked />
        <Separator />
        <PopSwitch label="消息通知" description="保持专注，不错过重要动态。" />
        <Separator />
        <PopCheckbox label="与团队分享项目" defaultChecked />
      </div>
      <div className="orbit-card orbit-progress">
        <div className="orbit-progress-icon">
          <Code2 />
        </div>
        <strong>构建进度</strong>
        <PopProgress label="组件已准备就绪" value={75} />
        <div className="orbit-row">
          <PopBadge status="success">已同步</PopBadge>
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
        <PopBadge>默认状态</PopBadge>
        <PopBadge status="success">已完成</PopBadge>
        <PopSwitch label="" aria-label="示例开关" defaultChecked />
      </div>
      <div className="flex gap-2">
        <PopButton variant="secondary" onClick={() => toast("次要操作已触发")}>
          次要按钮
        </PopButton>
        <PopButton onClick={() => toast.success("主要操作已完成")}>
          主要按钮
        </PopButton>
      </div>
      <PopInput label="快速查找" placeholder="搜索你的下一个组件…" />
    </div>
  );
}

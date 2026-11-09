"use client";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  Plus,
  ArrowUpRight,
  Layers,
  Heart,
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
export function ButtonDemo() {
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  return (
    <div className="demo-buttons">
      <div className="flex flex-wrap justify-center gap-2">
        <PopButton
          loading={loading}
          onClick={() => {
            setLoading(true);
            timer.current = setTimeout(() => {
              setLoading(false);
              toast.success("更改已保存");
            }, 900);
          }}
        >
          主要按钮
        </PopButton>
        <PopButton
          variant="secondary"
          onClick={() => toast("这是一条操作反馈")}
        >
          次要按钮
        </PopButton>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <PopButton variant="outline" onClick={() => toast("已添加到项目")}>
          <Plus data-icon="inline-start" />
          添加项目
        </PopButton>
        <PopButton variant="ghost" onClick={() => toast("操作已取消")}>
          取消
        </PopButton>
        <PopButton
          variant="outline"
          size="icon"
          aria-label="喜欢这个组件"
          onClick={() => toast.success("已收藏")}
        >
          <Heart />
        </PopButton>
      </div>
    </div>
  );
}
export function ComponentDemo({
  slug,
  compact = false,
}: {
  slug: string;
  compact?: boolean;
}) {
  const [progress, setProgress] = useState(68);
  const [framework, setFramework] = useState("next");
  switch (slug) {
    case "pop-button":
      return <ButtonDemo />;
    case "pop-input":
      return (
        <div className="demo-form">
          <PopInput
            label="邮箱地址"
            type="email"
            placeholder="you@example.com"
            hint="我们只会发送与你有关的重要通知。"
          />
          {!compact ? (
            <PopInput label="项目名称" placeholder="为你的想法起个名字" />
          ) : null}
        </div>
      );
    case "pop-card":
      return (
        <div className="demo-card">
          <PopCard
            title="一个新的开始"
            description="让你的下一个想法在这里发生。"
            footer={
              <PopButton
                variant="outline"
                onClick={() => toast("工作空间已准备就绪")}
              >
                查看项目 <ArrowUpRight data-icon="inline-end" />
              </PopButton>
            }
          >
            <div className="card-project-visual">
              <Layers />
              <span>你的创意工作空间</span>
            </div>
          </PopCard>
        </div>
      );
    case "pop-badge":
      return (
        <div className="badge-demo">
          <div className="flex flex-wrap justify-center gap-2">
            <PopBadge status="success">已完成</PopBadge>
            <PopBadge>进行中</PopBadge>
            <PopBadge status="warning">待审核</PopBadge>
          </div>
          <p className="tiny-note">以轻量标记，传递清晰状态。</p>
        </div>
      );
    case "pop-switch":
      return (
        <div className="demo-form">
          <PopSwitch
            label="消息通知"
            description="接收与你有关的重要动态。"
            defaultChecked
          />
          <Separator />
          <PopSwitch label="每周摘要" description="用一封邮件回顾本周进展。" />
        </div>
      );
    case "pop-checkbox":
      return (
        <div className="demo-form">
          <PopCheckbox
            label="建立设计规范"
            description="从一致的基础开始。"
            defaultChecked
          />
          <PopCheckbox label="添加你的第一个组件" />
          <PopCheckbox label="分享给团队成员" />
        </div>
      );
    case "pop-tabs":
      return (
        <div className="demo-form">
          <PopTabs
            items={[
              {
                value: "overview",
                label: "概览",
                content: (
                  <div className="tabs-copy">
                    <Layers />
                    <strong>所有信息，一目了然。</strong>
                    <p>在同一上下文中，找到你关心的内容。</p>
                  </div>
                ),
              },
              {
                value: "activity",
                label: "动态",
                content: (
                  <div className="tabs-copy">
                    <Check />
                    <strong>你已掌握最新动态。</strong>
                    <p>所有更改均已同步。</p>
                  </div>
                ),
              },
              {
                value: "settings",
                label: "设置",
                content: (
                  <div className="tabs-copy">
                    <PopSwitch label="自动保存" defaultChecked />
                  </div>
                ),
              },
            ]}
          />
        </div>
      );
    case "pop-accordion":
      return (
        <div className="demo-form">
          <PopAccordion
            items={[
              {
                question: "可以自定义这些组件吗？",
                answer:
                  "可以。完整源码安装到你的项目中，颜色、间距、圆角与行为都由你掌控。",
              },
              {
                question: "如何安装到我的项目？",
                answer:
                  "先初始化 Radix 版 shadcn/ui，然后复制组件的安装命令。依赖会自动安装。",
              },
              ...(!compact
                ? [
                    {
                      question: "可以用于商业项目吗？",
                      answer:
                        "可以。组件以 MIT 许可证开源，支持个人与商业项目。",
                    },
                  ]
                : []),
            ]}
          />
        </div>
      );
    case "pop-dialog":
      return (
        <PopDialog
          trigger="打开对话框"
          title="创建一个新项目"
          description="为你的下一个想法留出空间。"
        >
          <PopInput label="项目名称" placeholder="输入项目名称" />
          <p className="tiny-note">按 Esc、点击遮罩或右上角按钮关闭。</p>
        </PopDialog>
      );
    case "pop-select":
      return (
        <div className="demo-form">
          <PopSelect
            label="开发框架"
            value={framework}
            onValueChange={setFramework}
            items={[
              { value: "next", label: "Next.js" },
              { value: "react", label: "React + Vite" },
              { value: "remix", label: "React Router" },
            ]}
          />
          <p className="tiny-note">为你的下一个项目选择基础框架。</p>
        </div>
      );
    case "pop-progress":
      return (
        <div className="demo-form">
          <PopProgress
            label="项目准备中"
            value={progress}
            description={
              progress === 100
                ? "准备就绪，可以开始构建了。"
                : "每一步，都让想法更近一点。"
            }
          />
          <PopButton
            variant="outline"
            onClick={() =>
              setProgress((value) =>
                value >= 100 ? 0 : Math.min(100, value + 16),
              )
            }
          >
            {progress === 100 ? "重新开始" : "继续下一步"}
            <ArrowRight data-icon="inline-end" />
          </PopButton>
        </div>
      );
    case "pop-avatar-stack":
      return (
        <div className="avatar-demo">
          <PopAvatarStack people={people} />
          <div>
            <strong>一起，把想法变成现实。</strong>
            <p className="tiny-note">5 位成员正在协作</p>
          </div>
        </div>
      );
    default:
      return null;
  }
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

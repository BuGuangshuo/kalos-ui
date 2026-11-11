"use client";
import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
  type InputHTMLAttributes,
} from "react";
import {
  ArrowRight,
  Check,
  Plus,
  ArrowUpRight,
  Layers,
  Heart,
} from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { controlStyles } from "@/components/ui/kalos-styles";
import { FieldGroup } from "@/components/ui/field";
import type { KalosCommandMenuProps } from "@/components/ui/kalos-command-menu-panel";
export interface DemoComponents {
  KalosCommandMenu: ComponentType<KalosCommandMenuProps>;
  KalosButton: ComponentType<{
    children?: ReactNode;
    variant?: "default" | "secondary" | "outline" | "ghost" | "destructive";
    size?: "default" | "icon";
    loading?: boolean;
    disabled?: boolean;
    onClick?: () => void;
    "aria-label"?: string;
  }>;
  KalosPopover: ComponentType<{
    trigger: string;
    items?: { value: string; label: string; disabled?: boolean }[];
    onAction?: (value: string) => void;
  }>;
  KalosInput: ComponentType<
    InputHTMLAttributes<HTMLInputElement> & {
      label: string;
      hint?: string;
      error?: string;
    }
  >;
  KalosCard: ComponentType<{
    title: string;
    description?: string;
    children: ReactNode;
    footer?: ReactNode;
  }>;
  KalosBadge: ComponentType<{
    status?: "neutral" | "success" | "warning";
    children: ReactNode;
  }>;
  KalosSwitch: ComponentType<{
    label: string;
    description?: string;
    defaultChecked?: boolean;
  }>;
  KalosCheckbox: ComponentType<{
    label: string;
    description?: string;
    defaultChecked?: boolean;
  }>;
  KalosTabs: ComponentType<{
    items: { value: string; label: string; content: ReactNode }[];
    defaultValue?: string;
  }>;
  KalosAccordion: ComponentType<{
    items: { question: string; answer: ReactNode }[];
  }>;
  KalosAlertDialog: ComponentType<{
    trigger: string;
    title: string;
    description: string;
    actionLabel?: string;
    cancelLabel?: string;
    onConfirm?: () => void;
  }>;
  KalosDialog: ComponentType<{
    trigger: string;
    title: string;
    description?: string;
    children: ReactNode;
    footer?: ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }>;
  KalosSelect: ComponentType<{
    label: string;
    items: { value: string; label: string }[];
    value?: string;
    onValueChange?: (value: string) => void;
  }>;
  KalosProgress: ComponentType<{
    label: string;
    value: number;
    description?: string;
  }>;
  KalosAvatarStack: ComponentType<{
    people: { name: string; image?: string }[];
    max?: number;
  }>;
}
const people = [
  { name: "Alan Bu" },
  { name: "陈晓" },
  { name: "林舟" },
  { name: "周宁" },
  { name: "吴昕" },
];
function ButtonDemo({ KalosButton }: Pick<DemoComponents, "KalosButton">) {
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
        <KalosButton
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
        </KalosButton>
        <KalosButton
          variant="secondary"
          onClick={() => toast("这是一条操作反馈")}
        >
          次要按钮
        </KalosButton>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <KalosButton variant="outline" onClick={() => toast("已添加到项目")}>
          <Plus data-icon="inline-start" />
          添加项目
        </KalosButton>
        <KalosButton variant="ghost" onClick={() => toast("操作已取消")}>
          取消
        </KalosButton>
        <KalosButton
          variant="outline"
          size="icon"
          aria-label="喜欢这个组件"
          onClick={() => toast.success("已收藏")}
        >
          <Heart />
        </KalosButton>
      </div>
      <div className="flex items-center justify-center gap-2">
        <KalosButton variant="destructive" onClick={() => toast("危险操作已触发")}>危险操作</KalosButton>
        <KalosButton disabled>禁用按钮</KalosButton>
      </div>
    </div>
  );
}
export function DemoContent({
  components,
  slug,
  compact = false,
}: {
  slug: string;
  compact?: boolean;
  components: DemoComponents;
}) {
  const {
    KalosButton,
    KalosInput,
    KalosPopover,
    KalosCommandMenu,
    KalosCard,
    KalosBadge,
    KalosSwitch,
    KalosCheckbox,
    KalosTabs,
    KalosAccordion,
    KalosDialog,
    KalosAlertDialog,
    KalosSelect,
    KalosProgress,
    KalosAvatarStack,
  } = components;
  const [progress, setProgress] = useState(68);
  const [framework, setFramework] = useState("next");
  const [dialogOpen, setDialogOpen] = useState(false);
  switch (slug) {
    case "kalos-button":
      return <ButtonDemo KalosButton={KalosButton} />;
    case "kalos-command-menu":
      return <div className="w-full max-w-[560px] p-2"><KalosCommandMenu
        groups={compact ? [{ label: "项目", items: [{ value: "new", label: "创建项目", icon: <Plus /> }, { value: "settings", label: "项目设置", icon: <Layers /> }] }] : [
          { label: "项目", items: [{ value: "new", label: "创建项目", icon: <Plus />, description: "React · TypeScript" }, { value: "settings", label: "项目设置", icon: <Layers />, description: "成员、权限与通知" }] },
          { label: "文档", items: [{ value: "installation", label: "安装指南", icon: <ArrowUpRight />, description: "选择基础库并安装组件源码" }, { value: "archive", label: "归档项目", disabled: true }] },
        ]}
        onRun={value => toast({ new: "已创建项目", settings: "已打开项目设置", installation: "已打开安装指南" }[value] || value)}
      /></div>;
    case "kalos-popover":
      return <KalosPopover
        trigger="更多操作"
        items={[
          { value: "edit", label: "编辑项目" },
          { value: "duplicate", label: "创建副本" },
          { value: "share", label: "分享项目" },
          { value: "archive", label: "归档项目", disabled: true },
        ]}
        onAction={value => toast.success({ edit: "已打开项目编辑", duplicate: "已创建副本", share: "分享链接已准备就绪" }[value] || value)}
      />;
    case "kalos-input":
      return (
        <div className="demo-form">
          <KalosInput
            label="邮箱地址"
            type="email"
            placeholder="you@example.com"
          />
          {!compact ? (
            <KalosInput label="项目名称" placeholder="输入项目名称" />
          ) : null}
        </div>
      );
    case "kalos-card":
      return (
        <div className="demo-card">
          <KalosCard
            title="设计工作空间"
            footer={
              <KalosButton
                variant="outline"
                onClick={() => toast("工作空间已准备就绪")}
              >
                查看项目 <ArrowUpRight data-icon="inline-end" />
              </KalosButton>
            }
          >
            <div className="card-project-visual">
              <Layers />
              <span>Kalos UI</span>
            </div>
          </KalosCard>
        </div>
      );
    case "kalos-badge":
      return (
        <div className="badge-demo">
          <div className="flex flex-wrap justify-center gap-2">
            <KalosBadge status="success">已完成</KalosBadge>
            <KalosBadge>进行中</KalosBadge>
            <KalosBadge status="warning">待审核</KalosBadge>
          </div>
        </div>
      );
    case "kalos-switch":
      return (
        <div className="demo-form">
          <KalosSwitch label="消息通知" defaultChecked />
          <Separator />
          <KalosSwitch label="每周摘要" />
        </div>
      );
    case "kalos-checkbox":
      return (
        <div className="demo-form">
          <KalosCheckbox label="建立设计规范" defaultChecked />
          <KalosCheckbox label="添加组件" />
          <KalosCheckbox label="邀请成员" />
        </div>
      );
    case "kalos-tabs":
      return (
        <div className="demo-form">
          <KalosTabs
            items={[
              {
                value: "overview",
                label: "概览",
                content: (
                  <div className="tabs-copy">
                    <Layers />
                    <strong>14 个组件</strong>
                  </div>
                ),
              },
              {
                value: "activity",
                label: "动态",
                content: (
                  <div className="tabs-copy">
                    <Check />
                    <strong>所有更改已同步</strong>
                  </div>
                ),
              },
              {
                value: "settings",
                label: "设置",
                content: (
                  <div className="tabs-copy">
                    <KalosSwitch label="自动保存" defaultChecked />
                  </div>
                ),
              },
            ]}
          />
        </div>
      );
    case "kalos-accordion":
      return (
        <div className="demo-form">
          <KalosAccordion
            items={[
              {
                question: "可以自定义这些组件吗？",
                answer:
                  "可以。完整源码安装到你的项目中，颜色、间距、圆角与行为都由你掌控。",
              },
              {
                question: "如何安装到我的项目？",
                answer: "运行安装命令，在终端选择基础组件库。",
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
    case "kalos-alert-dialog":
      return <KalosAlertDialog
        trigger="删除项目"
        title="删除项目？"
        description="项目及其数据将永久删除，无法撤销。"
        actionLabel="删除项目"
        onConfirm={() => toast.success("项目已删除")}
      />;
    case "kalos-dialog":
      return (
        <KalosDialog
          trigger="打开对话框"
          title="创建项目"
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          footer={<>
            <KalosButton variant="outline" onClick={() => setDialogOpen(false)}>取消</KalosButton>
            <KalosButton onClick={() => { setDialogOpen(false); toast.success("项目已创建"); }}>创建项目</KalosButton>
          </>}
        >
          <FieldGroup className={controlStyles.dialogForm}>
            <KalosInput label="项目名称" defaultValue="Kalos UI" />
            <KalosInput label="项目标识" defaultValue="kalos-ui" />
          </FieldGroup>
        </KalosDialog>
      );
    case "kalos-select":
      return (
        <div className="demo-form">
          <KalosSelect
            label="开发框架"
            value={framework}
            onValueChange={setFramework}
            items={[
              { value: "next", label: "Next.js" },
              { value: "react", label: "React + Vite" },
              { value: "remix", label: "React Router" },
            ]}
          />
        </div>
      );
    case "kalos-progress":
      return (
        <div className="demo-form">
          <KalosProgress
            label={progress === 100 ? "准备就绪" : "项目准备中"}
            value={progress}
          />
          <KalosButton
            variant="outline"
            onClick={() =>
              setProgress((value) =>
                value >= 100 ? 0 : Math.min(100, value + 16),
              )
            }
          >
            {progress === 100 ? "重新开始" : "继续下一步"}
            <ArrowRight data-icon="inline-end" />
          </KalosButton>
        </div>
      );
    case "kalos-avatar-stack":
      return (
        <div className="avatar-demo">
          <KalosAvatarStack people={people} />
        </div>
      );
    default:
      return null;
  }
}

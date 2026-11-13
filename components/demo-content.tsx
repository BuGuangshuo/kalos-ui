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
  Plus,
  ArrowUpRight,
  Layers,
  Heart,
} from "lucide-react";
import { toast } from "sonner";
import { AvatarDemo } from "@/components/avatar-demo";
import type { KalosAvatarProps, KalosAvatarStackProps } from "@/components/ui/kalos-avatar-shared";
import { Separator } from "@/components/ui/separator";
import { controlStyles } from "@/components/ui/kalos-styles";
import { FieldGroup } from "@/components/ui/field";
import type { KalosCommandMenuProps } from "@/components/ui/kalos-command-menu-panel";
import type { KalosPopoverProps } from "@/components/ui/kalos-popover-menu";
import type { KalosFormProps } from "@/registry/kalos/kalos-form";
import type { KalosFormField } from "@/components/ui/kalos-form-state";
import { HoverCardActivityDemo } from "@/components/hover-card-activity-demo";
import type { KalosHoverCardProps } from "@/components/ui/kalos-hover-card-shared";
import { PopoverDemo } from "@/components/popover-demo";
import { SegmentedControlDemo } from "@/components/segmented-control-demo";
import type { KalosSegmentedControlProps } from "@/components/ui/kalos-segmented-control-view";
import type { NumberInputExampleVariant } from "@/lib/number-input-examples";
import type { SegmentedExampleVariant } from "@/lib/segmented-control-examples";
import { TableDemo } from "@/components/table-demo";
import { TooltipDemo } from "@/components/tooltip-demo";
import { SkeletonDemo } from "@/components/skeleton-demo";
import { SpinnerDemo } from "@/components/spinner-demo";
import { DatePickerDemo, DateRangePickerDemo, TimePickerDemo } from "@/components/date-time-demo";
import type { KalosTableProps } from "@/components/ui/kalos-table-model";
import type { TableExampleVariant } from "@/lib/table-examples";
import type { PopoverExampleVariant } from "@/lib/component-examples";
import { CardDemo } from "@/components/card-demo";
import type { KalosCardProps } from "@/registry/kalos/kalos-card";

import { DropdownMenuDemo } from "@/components/dropdown-menu-demo";
import type { KalosDropdownMenuProps } from "@/components/ui/kalos-dropdown-menu-shared";
import type { DropdownExampleVariant } from "@/lib/dropdown-menu-examples";

import { NumberInputDemo } from "@/components/number-input-demo";
import type { KalosNumberInputProps } from "@/components/ui/kalos-number-input-model";

const formFields: KalosFormField[] = [
  { name: "email", label: "邮箱地址", type: "email", required: true, placeholder: "you@example.com", autoComplete: "email" },
  { name: "password", label: "密码", type: "password", required: true, placeholder: "请输入密码", minLength: 8, hint: "至少 8 位", autoComplete: "new-password" },
  { name: "role", label: "成员角色", type: "select", required: true, items: [{ value: "editor", label: "编辑者" }, { value: "viewer", label: "查看者" }, { value: "admin", label: "管理员" }] },
  { name: "notifications", label: "消息通知", type: "switch" },
  { name: "terms", label: "同意服务条款", type: "checkbox", required: true },
];

export interface DemoComponents {
  KalosNumberInput: ComponentType<KalosNumberInputProps>;
  KalosDropdownMenu: ComponentType<KalosDropdownMenuProps>;
  KalosTable: ComponentType<KalosTableProps>;
  KalosForm: ComponentType<KalosFormProps>;
  KalosCommandMenu: ComponentType<KalosCommandMenuProps>;
  KalosButton: ComponentType<{
    children?: ReactNode;
    variant?: "default" | "secondary" | "outline" | "ghost" | "destructive";
    size?: "default" | "icon";
    loading?: boolean;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
    "aria-label"?: string;
  }>;
  KalosHoverCard: ComponentType<KalosHoverCardProps>;
  KalosPopover: ComponentType<KalosPopoverProps>;
  KalosInput: ComponentType<
    InputHTMLAttributes<HTMLInputElement> & {
      label: string;
      hint?: string;
      error?: string;
    }
  >;
  KalosCard: ComponentType<KalosCardProps>;
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
  KalosSegmentedControl: ComponentType<KalosSegmentedControlProps>;
  KalosAccordion: ComponentType<{
    items: { question: string; answer: ReactNode }[];
  }>;
  KalosAlertDialog: ComponentType<{
    trigger: ReactNode;
    triggerProps?: { variant?: "outline" | "ghost"; size?: "default" | "icon"; "aria-label"?: string };
    title: string;
    description: string;
    actionLabel?: string;
    cancelLabel?: string;
    onConfirm?: () => void;
  }>;
  KalosDialog: ComponentType<{
    trigger: ReactNode;
    triggerProps?: { variant?: "outline" | "ghost"; size?: "default" | "icon"; "aria-label"?: string };
    title: string;
    description?: string;
    children: ReactNode;
    footer?: ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }>;
  KalosSelect: ComponentType<{
    label: string;
    placeholder?: string;
    items: { value: string; label: string }[];
    value?: string;
    onValueChange?: (value: string) => void;
  }>;
  KalosProgress: ComponentType<{
    label: string;
    value: number;
    description?: string;
  }>;
  KalosAvatar: ComponentType<KalosAvatarProps>;
  KalosAvatarStack: ComponentType<KalosAvatarStackProps>;
}
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
        <KalosButton variant="outline" onClick={() => toast("成员已添加")}>
          <Plus data-icon="inline-start" />
          添加成员
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
  components: DemoComponents;
}) {
  const {
    KalosDropdownMenu,
    KalosForm,
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
  } = components;
  const [progress, setProgress] = useState(68);
  const [framework, setFramework] = useState("next");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [contact, setContact] = useState({ name: "", email: "" });
  const changeDialogOpen = (open: boolean) => {
    if (open) setContact({ name: "", email: "" });
    setDialogOpen(open);
  };
  switch (slug) {
    case "kalos-date-picker":
      return <DatePickerDemo />;
    case "kalos-date-range-picker":
      return <DateRangePickerDemo compact={compact} />;
    case "kalos-time-picker":
      return <TimePickerDemo />;
    case "kalos-skeleton":
      return <SkeletonDemo />;
    case "kalos-spinner":
      return <SpinnerDemo />;
    case "kalos-tooltip":
      return <TooltipDemo compact={compact} />;
    case "kalos-dropdown-menu":
      return <DropdownMenuDemo KalosDropdownMenu={KalosDropdownMenu} components={{ KalosTable, KalosDialog, KalosButton, KalosInput }} variant={dropdownVariant} compact={compact} />;
    case "kalos-table":
      return <TableDemo KalosTable={KalosTable} KalosDropdownMenu={KalosDropdownMenu} KalosButton={KalosButton} KalosDialog={KalosDialog} KalosAlertDialog={KalosAlertDialog} KalosInput={KalosInput} variant={tableVariant} compact={compact} />;
    case "kalos-form":
      return <KalosForm title="成员设置" fields={formFields} defaultValues={{ notifications: true }} aria-label="成员设置" />;
    case "kalos-button":
      return <ButtonDemo KalosButton={KalosButton} />;
    case "kalos-command-menu":
      return <div className="w-full max-w-[560px] p-2"><KalosCommandMenu
        groups={compact ? [{ label: "常用操作", items: [{ value: "new", label: "新建文档", icon: <Plus /> }, { value: "settings", label: "账号设置", icon: <Layers /> }] }] : [
          { label: "文档", items: [{ value: "new", label: "新建文档", icon: <Plus /> }, { value: "archive", label: "归档文档", disabled: true }] },
          { label: "设置", items: [{ value: "settings", label: "账号设置", icon: <Layers /> }, { value: "notifications", label: "通知设置", icon: <ArrowUpRight /> }] },
        ]}
        onRun={value => toast({ new: "文档已创建", settings: "已打开账号设置", notifications: "已打开通知设置" }[value] || value)}
      /></div>;
    case "kalos-hover-card":
      return <HoverCardActivityDemo KalosHoverCard={KalosHoverCard} compact={compact} />;
    case "kalos-popover":
      return <PopoverDemo KalosPopover={KalosPopover} KalosInput={KalosInput} KalosSelect={KalosSelect} KalosButton={KalosButton} variant={popoverVariant} />;
    case "kalos-number-input":
      return <NumberInputDemo Control={KalosNumberInput} KalosButton={KalosButton} variant={numberVariant} compact={compact} />;
    case "kalos-input":
      return (
        <div className="demo-form">
          <KalosInput
            label="邮箱地址"
            type="email"
            placeholder="you@example.com"
          />
          {!compact ? (
            <KalosInput label="姓名" placeholder="请输入姓名" />
          ) : null}
        </div>
      );
    case "kalos-card":
      return <CardDemo KalosCard={KalosCard} KalosButton={KalosButton} />;
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
    case "kalos-segmented-control":
      return <SegmentedControlDemo Control={KalosSegmentedControl} variant={segmentedVariant} />;
    case "kalos-accordion":
      return (
        <div className="demo-form">
          <KalosAccordion
            items={[
              {
                question: "可以自定义这些组件吗？",
                answer:
                  "可以。完整源码安装到你的代码目录，颜色、间距、圆角与行为都由你掌控。",
              },
              {
                question: "如何安装组件？",
                answer: "运行安装命令，按需添加 Base UI 组件。",
              },
              ...(!compact
                ? [
                    {
                      question: "可以用于商业用途吗？",
                      answer:
                        "可以。组件以 MIT 许可证开源，支持个人与商业用途。",
                    },
                  ]
                : []),
            ]}
          />
        </div>
      );
    case "kalos-alert-dialog":
      return <KalosAlertDialog
        trigger="删除文件"
        title="删除这个文件？"
        description="文件将被永久删除，无法撤销。"
        actionLabel="删除文件"
        onConfirm={() => toast.success("文件已删除")}
      />;
    case "kalos-dialog":
      return (
        <KalosDialog
          trigger="打开对话框"
          title="添加联系人"
          open={dialogOpen}
          onOpenChange={changeDialogOpen}
          footer={<>
            <KalosButton variant="outline" onClick={() => setDialogOpen(false)}>取消</KalosButton>
            <KalosButton onClick={() => { setDialogOpen(false); toast.success("联系人已添加"); }}>保存</KalosButton>
          </>}
        >
          <FieldGroup className={controlStyles.dialogForm}>
            <KalosInput label="姓名" placeholder="请输入姓名" autoComplete="off" value={contact.name} onChange={event => setContact({ ...contact, name: event.target.value })} />
            <KalosInput label="邮箱地址" type="email" placeholder="you@example.com" autoComplete="off" value={contact.email} onChange={event => setContact({ ...contact, email: event.target.value })} />
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
            label={progress === 100 ? "上传完成" : "文件上传中"}
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
            {progress === 100 ? "重新上传" : "继续上传"}
            <ArrowRight data-icon="inline-end" />
          </KalosButton>
        </div>
      );
    case "kalos-avatar-stack":
      return <AvatarDemo KalosAvatar={KalosAvatar} KalosAvatarStack={KalosAvatarStack} compact={compact} />;
    default:
      return null;
  }
}

export type Category = "操作" | "表单输入" | "内容展示" | "导航" | "反馈";
export const catalog = [
  {
    slug: "kalos-button",
    title: "按钮",
    english: "Button",
    category: "操作",
    description: "用于触发操作，提供主要、次要、轮廓、危险和加载状态。",
    dependencies: ["button"],
    props: "支持 shadcn Button 的全部属性；loading?: boolean；默认标准尺寸。",
    usage: "<KalosButton loading={saving}>保存更改</KalosButton>",
  },
  {
    slug: "kalos-command-menu",
    title: "命令菜单",
    english: "Command Menu",
    category: "导航",
    description: "在分组列表中搜索并执行操作，支持匹配上下文、键盘导航和连续滑动的选中背景。",
    dependencies: [],
    props: "groups: KalosCommandGroup[]；query?: string；onQueryChange?；onRun?；onClose?；filter?: boolean。",
    usage: '<KalosCommandMenu groups={[{ label: "项目", items: [{ value: "new", label: "创建项目" }, { value: "settings", label: "项目设置" }] }]} onRun={value => console.log(value)} />',
  },
  {
    slug: "kalos-popover",
    title: "浮层",
    english: "Popover",
    category: "操作",
    description: "在触发元素附近展示操作列表或自定义内容，支持键盘导航与背景滑动。",
    dependencies: ["popover", "button"],
    props: "trigger: string；items?: { value: string; label: string; disabled?: boolean }[]；children?: ReactNode；onAction?: (value: string) => void；open?: boolean；onOpenChange?: (open: boolean) => void。",
    usage: '<KalosPopover trigger="更多操作" items={[{ value: "edit", label: "编辑项目" }, { value: "duplicate", label: "创建副本" }, { value: "archive", label: "归档项目" }]} />',
  },
  {
    slug: "kalos-input",
    title: "文本输入",
    english: "Text Input",
    category: "表单输入",
    description: "将标签、输入、说明和校验提示组合在一起。",
    dependencies: ["input", "field"],
    props:
      "label: string；hint?: string；error?: string；支持原生 input 属性。默认高度 32px。",
    usage:
      '<KalosInput label="邮箱地址" type="email" placeholder="you@example.com" />',
  },
  {
    slug: "kalos-card",
    title: "卡片",
    english: "Card",
    category: "内容展示",
    description: "为相关信息与操作提供清晰、紧凑的内容容器。",
    dependencies: ["card"],
    props:
      "title: string；description?: string；children: ReactNode；footer?: ReactNode。标准尺寸卡片。",
    usage:
      '<KalosCard title="设计工作空间">Kalos UI</KalosCard>',
  },
  {
    slug: "kalos-badge",
    title: "徽标",
    english: "Badge",
    category: "反馈",
    description: "使用简洁的标记展示状态、类别与附加信息。",
    dependencies: ["badge"],
    props:
      'status?: "neutral" | "success" | "warning"；children: ReactNode。所有状态采用黑白语义配色。',
    usage: '<KalosBadge status="success">已完成</KalosBadge>',
  },
  {
    slug: "kalos-switch",
    title: "开关",
    english: "Switch",
    category: "表单输入",
    description: "在两个互斥状态间切换，适用于立即生效的设置。",
    dependencies: ["switch"],
    props:
      "label: string；description?: string；checked?: boolean；onCheckedChange?: (checked: boolean) => void。默认标准尺寸。",
    usage:
      '<KalosSwitch label="消息通知" />',
  },
  {
    slug: "kalos-checkbox",
    title: "复选框",
    english: "Checkbox",
    category: "表单输入",
    description: "选择一个或多个选项，支持选中与不确定状态。",
    dependencies: ["checkbox"],
    props:
      "label: string；description?: string；checked?: CheckedState；onCheckedChange?: (checked: CheckedState) => void。",
    usage: '<KalosCheckbox label="同意接收产品更新" />',
  },
  {
    slug: "kalos-tabs",
    title: "选项卡",
    english: "Tabs",
    category: "导航",
    description: "在同一上下文中切换相关内容，支持键盘操作。",
    dependencies: ["tabs"],
    props:
      "items: { value: string; label: string; content: ReactNode }[]；defaultValue?: string。",
    usage:
      '<KalosTabs items={[{ value: "overview", label: "概览", content: "13 个组件" }]} />',
  },
  {
    slug: "kalos-accordion",
    title: "折叠面板",
    english: "Accordion",
    category: "内容展示",
    description: "按需展开详细内容，在有限空间中保持信息层次。",
    dependencies: ["accordion"],
    props:
      "items: { question: string; answer: ReactNode }[]。同一时间展开一项。",
    usage:
      '<KalosAccordion items={[{ question: "可以自定义吗？", answer: "每一行源码都由你掌控。" }]} />',
  },
  {
    slug: "kalos-dialog",
    title: "对话框",
    english: "Dialog",
    category: "操作",
    description: "让用户专注于当前任务，包含焦点管理与关闭行为。",
    dependencies: ["dialog", "button"],
    props:
      "trigger: string；title: string；description?: string；children: ReactNode；footer?: ReactNode；open?: boolean；onOpenChange?: (open: boolean) => void。",
    usage:
      '<KalosDialog trigger="查看项目" title="设计工作空间">Kalos UI</KalosDialog>',
  },
  {
    slug: "kalos-alert-dialog",
    title: "确认对话框",
    english: "Alert Dialog",
    category: "操作",
    description: "在执行重要操作前请求确认，打开时聚焦取消，点击遮罩不会关闭。",
    dependencies: ["alert-dialog", "button"],
    props: "trigger: string；title: string；description: string；actionLabel?: string；cancelLabel?: string；onConfirm?: () => void；open?: boolean；onOpenChange?: (open: boolean) => void。",
    usage: '<KalosAlertDialog trigger="删除项目" title="删除项目？" description="项目及其数据将永久删除，无法撤销。" actionLabel="删除项目" onConfirm={() => console.log("confirmed")} />',
  },
  {
    slug: "kalos-select",
    title: "选择器",
    english: "Select",
    category: "表单输入",
    description: "从一组候选项中进行选择，支持键盘导航与选中反馈。",
    dependencies: ["select"],
    props:
      "label: string；placeholder?: string；items: { value: string; label: string }[]；value?: string；onValueChange?: (value: string) => void。",
    usage:
      '<KalosSelect label="开发框架" items={[{ value: "next", label: "Next.js" }]} />',
  },
  {
    slug: "kalos-progress",
    title: "进度条",
    english: "Progress",
    category: "反馈",
    description: "清晰地展示任务进展，支持数值、标题与辅助说明。",
    dependencies: ["progress"],
    props:
      "label: string；value: number（自动限制为 0–100）；description?: string。",
    usage: '<KalosProgress label="项目准备中" value={68} />',
  },
  {
    slug: "kalos-avatar-stack",
    title: "头像组",
    english: "Avatar Group",
    category: "内容展示",
    description: "以紧凑的头像组合展示成员，包含姓名回退和溢出数量。",
    dependencies: ["avatar"],
    props:
      "people: { name: string; image?: string }[]；max?: number。默认标准尺寸，32px。",
    usage:
      '<KalosAvatarStack people={[{ name: "Alan Bu" }, { name: "陈晓" }]} />',
  },
] as const;
export type Item = (typeof catalog)[number];
export const categories = [
  "操作",
  "表单输入",
  "内容展示",
  "导航",
  "反馈",
] as const;

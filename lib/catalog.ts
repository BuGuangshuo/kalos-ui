export type Category = "操作" | "表单输入" | "内容展示" | "导航" | "反馈";
export const catalog = [
  {
    slug: "pop-button",
    title: "按钮",
    english: "Button",
    category: "操作",
    description: "用于触发操作，提供主要、次要、轮廓、危险和加载状态。",
    dependencies: ["button"],
    props: "支持 shadcn Button 的全部属性；loading?: boolean；默认标准尺寸。",
    usage: "<PopButton loading={saving}>保存更改</PopButton>",
  },
  {
    slug: "pop-input",
    title: "文本输入",
    english: "Text Input",
    category: "表单输入",
    description: "将标签、输入、说明和校验提示组合在一起。",
    dependencies: ["input", "field"],
    props:
      "label: string；hint?: string；error?: string；支持原生 input 属性。默认高度 32px。",
    usage:
      '<PopInput label="邮箱地址" type="email" placeholder="you@example.com" />',
  },
  {
    slug: "pop-card",
    title: "卡片",
    english: "Card",
    category: "内容展示",
    description: "为相关信息与操作提供清晰、紧凑的内容容器。",
    dependencies: ["card"],
    props:
      "title: string；description?: string；children: ReactNode；footer?: ReactNode。标准尺寸卡片。",
    usage:
      '<PopCard title="我的工作空间" description="让灵感在这里发生。">从一个好想法开始。</PopCard>',
  },
  {
    slug: "pop-badge",
    title: "徽标",
    english: "Badge",
    category: "反馈",
    description: "使用简洁的标记展示状态、类别与附加信息。",
    dependencies: ["badge"],
    props:
      'status?: "neutral" | "success" | "warning"；children: ReactNode。所有状态采用黑白语义配色。',
    usage: '<PopBadge status="success">已完成</PopBadge>',
  },
  {
    slug: "pop-switch",
    title: "开关",
    english: "Switch",
    category: "表单输入",
    description: "在两个互斥状态间切换，适用于立即生效的设置。",
    dependencies: ["switch"],
    props:
      "label: string；description?: string；checked?: boolean；onCheckedChange?: (checked: boolean) => void。默认标准尺寸。",
    usage:
      '<PopSwitch label="消息通知" description="接收与你有关的重要动态。" />',
  },
  {
    slug: "pop-checkbox",
    title: "复选框",
    english: "Checkbox",
    category: "表单输入",
    description: "选择一个或多个选项，支持选中与不确定状态。",
    dependencies: ["checkbox"],
    props:
      "label: string；description?: string；checked?: CheckedState；onCheckedChange?: (checked: CheckedState) => void。",
    usage: '<PopCheckbox label="同意接收产品更新" />',
  },
  {
    slug: "pop-tabs",
    title: "选项卡",
    english: "Tabs",
    category: "导航",
    description: "在同一上下文中切换相关内容，支持键盘操作。",
    dependencies: ["tabs"],
    props:
      "items: { value: string; label: string; content: ReactNode }[]；defaultValue?: string。",
    usage:
      '<PopTabs items={[{ value: "overview", label: "概览", content: "所有信息，一目了然。" }]} />',
  },
  {
    slug: "pop-accordion",
    title: "折叠面板",
    english: "Accordion",
    category: "内容展示",
    description: "按需展开详细内容，在有限空间中保持信息层次。",
    dependencies: ["accordion"],
    props:
      "items: { question: string; answer: ReactNode }[]。同一时间展开一项。",
    usage:
      '<PopAccordion items={[{ question: "可以自定义吗？", answer: "每一行源码都由你掌控。" }]} />',
  },
  {
    slug: "pop-dialog",
    title: "对话框",
    english: "Dialog",
    category: "操作",
    description: "让用户专注于当前任务，包含焦点管理与关闭行为。",
    dependencies: ["dialog", "button"],
    props:
      "trigger: string；title: string；description?: string；children: ReactNode。",
    usage:
      '<PopDialog trigger="查看详情" title="专注于当前任务">在这里放置你的内容。</PopDialog>',
  },
  {
    slug: "pop-select",
    title: "选择器",
    english: "Select",
    category: "表单输入",
    description: "从一组候选项中进行选择，支持键盘导航与选中反馈。",
    dependencies: ["select"],
    props:
      "label: string；placeholder?: string；items: { value: string; label: string }[]；value?: string；onValueChange?: (value: string) => void。",
    usage:
      '<PopSelect label="开发框架" items={[{ value: "next", label: "Next.js" }]} />',
  },
  {
    slug: "pop-progress",
    title: "进度条",
    english: "Progress",
    category: "反馈",
    description: "清晰地展示任务进展，支持数值、标题与辅助说明。",
    dependencies: ["progress"],
    props:
      "label: string；value: number（自动限制为 0–100）；description?: string。",
    usage: '<PopProgress label="项目准备中" value={68} />',
  },
  {
    slug: "pop-avatar-stack",
    title: "头像组",
    english: "Avatar Group",
    category: "内容展示",
    description: "以紧凑的头像组合展示成员，包含姓名回退和溢出数量。",
    dependencies: ["avatar"],
    props:
      "people: { name: string; image?: string }[]；max?: number。默认标准尺寸，32px。",
    usage:
      '<PopAvatarStack people={[{ name: "Alan Bu" }, { name: "陈晓" }]} />',
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

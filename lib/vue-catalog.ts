export const vueCatalog: Record<string, { usage: string; props: string }> = {
  "kalos-button": {
    usage: '<KalosButton :loading="saving">保存更改</KalosButton>',
    props:
      "loading?: boolean；disabled?: boolean；支持 shadcn-vue Button 的属性与默认插槽。",
  },
  "kalos-command-menu": {
    usage: `<KalosCommandMenu :groups="[{ label: '项目', items: [{ value: 'new', label: '创建项目' }, { value: 'settings', label: '项目设置' }] }]" @run="value => console.log(value)" />`,
    props: "groups: CommandGroup[]；v-model:query；@run；@close；filter?: boolean；#icon 与 #description 插槽。",
  },
  "kalos-popover": {
    usage: '<KalosPopover trigger="更多操作" :items="[{ value: \'edit\', label: \'编辑项目\' }, { value: \'duplicate\', label: \'创建副本\' }, { value: \'archive\', label: \'归档项目\' }]" />',
    props: "trigger: string；label?: string；items?: { value: string; label: string; disabled?: boolean }[]；v-model:open?: boolean；@action；默认插槽。",
  },
  "kalos-input": {
    usage:
      '<KalosInput v-model="email" label="邮箱地址" type="email" placeholder="you@example.com" />',
    props:
      "v-model: string | number；label: string；hint?: string；error?: string；原生 input 属性。",
  },
  "kalos-card": {
    usage:
      '<KalosCard title="设计工作空间">Kalos UI</KalosCard>',
    props: "title: string；description?: string；默认插槽；footer 插槽。",
  },
  "kalos-badge": {
    usage: '<KalosBadge status="success">已完成</KalosBadge>',
    props: 'status?: "neutral" | "success" | "warning"；默认插槽。',
  },
  "kalos-switch": {
    usage:
      '<KalosSwitch v-model="enabled" label="消息通知" />',
    props:
      "v-model: boolean；label: string；description?: string；disabled?: boolean；name?: string。",
  },
  "kalos-checkbox": {
    usage: '<KalosCheckbox v-model="accepted" label="同意接收产品更新" />',
    props:
      'v-model: boolean | "indeterminate"；label: string；description?: string；disabled?: boolean；name?: string。',
  },
  "kalos-tabs": {
    usage:
      "<KalosTabs :items=\"[{ value: 'overview', label: '概览', content: '14 个组件' }]\" />",
    props:
      "items: { value: string; label: string; content?: string }[]；v-model?: string；defaultValue?: string；以 value 命名的内容插槽。",
  },
  "kalos-accordion": {
    usage:
      "<KalosAccordion :items=\"[{ question: '可以自定义吗？', answer: '每一行源码都由你掌控。' }]\" />",
    props:
      "items: { question: string; answer: string }[]；单项展开；支持键盘操作。",
  },
  "kalos-dialog": {
    usage:
      '<KalosDialog trigger="查看项目" title="设计工作空间">Kalos UI</KalosDialog>',
    props:
      "v-model:open?: boolean；trigger: string；title: string；description?: string；默认插槽与 footer 插槽。",
  },
  "kalos-select": {
    usage:
      '<KalosSelect v-model="framework" label="开发框架" :items="[{ value: \'vue\', label: \'Vue\' }]" />',
    props:
      "v-model?: string；label: string；placeholder?: string；items: { value: string; label: string }[]；disabled?: boolean。",
  },
  "kalos-progress": {
    usage: '<KalosProgress label="项目准备中" :value="68" />',
    props:
      "label: string；value: number（自动限制为 0–100）；description?: string。",
  },
  "kalos-avatar-stack": {
    usage:
      "<KalosAvatarStack :people=\"[{ name: 'Alan Bu' }, { name: '陈晓' }]\" />",
    props:
      "people: { name: string; image?: string }[]；max?: number；32px 头像，包含姓名回退和溢出计数。",
  },
};

export function vueExample(slug: string) {
  const name = slug
    .split("-")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join("");
  const state: Record<string, string> = {
    "kalos-button": "const saving = ref(false)",
    "kalos-input": "const email = ref('')",
    "kalos-switch": "const enabled = ref(false)",
    "kalos-checkbox": "const accepted = ref(false)",
    "kalos-select": "const framework = ref('vue')",
  };
  return `<script setup lang="ts">\n${state[slug] ? "import { ref } from 'vue'\n" : ""}import ${name} from '@/components/ui/${slug}.vue'\n${state[slug] ? `\n${state[slug]}\n` : ""}</script>\n\n<template>\n  ${vueCatalog[slug].usage}\n</template>`;
}

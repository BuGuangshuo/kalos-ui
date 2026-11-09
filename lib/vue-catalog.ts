export const vueCatalog: Record<string, { usage: string; props: string }> = {
  "pop-button": {
    usage: '<PopButton :loading="saving">保存更改</PopButton>',
    props:
      "loading?: boolean；disabled?: boolean；支持 shadcn-vue Button 的属性与默认插槽。",
  },
  "pop-input": {
    usage:
      '<PopInput v-model="email" label="邮箱地址" type="email" placeholder="you@example.com" />',
    props:
      "v-model: string | number；label: string；hint?: string；error?: string；原生 input 属性。",
  },
  "pop-card": {
    usage:
      '<PopCard title="我的工作空间" description="让灵感在这里发生。">从一个好想法开始。</PopCard>',
    props: "title: string；description?: string；默认插槽；footer 插槽。",
  },
  "pop-badge": {
    usage: '<PopBadge status="success">已完成</PopBadge>',
    props: 'status?: "neutral" | "success" | "warning"；默认插槽。',
  },
  "pop-switch": {
    usage:
      '<PopSwitch v-model="enabled" label="消息通知" description="接收与你有关的重要动态。" />',
    props:
      "v-model: boolean；label: string；description?: string；disabled?: boolean；name?: string。",
  },
  "pop-checkbox": {
    usage: '<PopCheckbox v-model="accepted" label="同意接收产品更新" />',
    props:
      'v-model: boolean | "indeterminate"；label: string；description?: string；disabled?: boolean；name?: string。',
  },
  "pop-tabs": {
    usage:
      "<PopTabs :items=\"[{ value: 'overview', label: '概览', content: '所有信息，一目了然。' }]\" />",
    props:
      "items: { value: string; label: string; content?: string }[]；v-model?: string；defaultValue?: string；以 value 命名的内容插槽。",
  },
  "pop-accordion": {
    usage:
      "<PopAccordion :items=\"[{ question: '可以自定义吗？', answer: '每一行源码都由你掌控。' }]\" />",
    props:
      "items: { question: string; answer: string }[]；单项展开；支持键盘操作。",
  },
  "pop-dialog": {
    usage:
      '<PopDialog trigger="查看详情" title="专注于当前任务">在这里放置你的内容。</PopDialog>',
    props:
      "v-model:open?: boolean；trigger: string；title: string；description?: string；默认插槽与 footer 插槽。",
  },
  "pop-select": {
    usage:
      '<PopSelect v-model="framework" label="开发框架" :items="[{ value: \'vue\', label: \'Vue\' }]" />',
    props:
      "v-model?: string；label: string；placeholder?: string；items: { value: string; label: string }[]；disabled?: boolean。",
  },
  "pop-progress": {
    usage: '<PopProgress label="项目准备中" :value="68" />',
    props:
      "label: string；value: number（自动限制为 0–100）；description?: string。",
  },
  "pop-avatar-stack": {
    usage:
      "<PopAvatarStack :people=\"[{ name: 'Alan Bu' }, { name: '陈晓' }]\" />",
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
    "pop-button": "const saving = ref(false)",
    "pop-input": "const email = ref('')",
    "pop-switch": "const enabled = ref(false)",
    "pop-checkbox": "const accepted = ref(false)",
    "pop-select": "const framework = ref('vue')",
  };
  return `<script setup lang="ts">\n${state[slug] ? "import { ref } from 'vue'\n" : ""}import ${name} from '@/components/ui/${slug}.vue'\n${state[slug] ? `\n${state[slug]}\n` : ""}</script>\n\n<template>\n  ${vueCatalog[slug].usage}\n</template>`;
}

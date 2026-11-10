<script setup lang="ts">
import { controlStyles } from "@/components/ui/kalos-styles";
import { useId } from "vue";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
defineProps<{
  label: string;
  placeholder?: string;
  items: { value: string; label: string }[];
  disabled?: boolean;
  name?: string;
  id?: string;
}>();
const autoId = useId();
const model = defineModel<string>();
const moveHighlight = (event: Event) => {
  const root = event.currentTarget;
  const item = event.target instanceof Element ? event.target.closest<HTMLElement>('[role="option"]') : null;
  if (!(root instanceof HTMLElement) || !item || item.matches('[data-disabled], [aria-disabled="true"]')) return;
  const rect = root.getBoundingClientRect();
  const target = item.getBoundingClientRect();
  root.style.setProperty('--kalos-highlight-y', `${target.top - rect.top + root.scrollTop - root.clientTop}px`);
  root.style.setProperty('--kalos-highlight-height', `${target.height}px`);
  root.style.setProperty('--kalos-highlight-opacity', '1');
};
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label :for="id || autoId" :class="controlStyles.label">{{ label }}</label>
    <Select v-model="model" :disabled="disabled" :name="name"
      ><SelectTrigger
        :id="id || autoId"
        :class="controlStyles.selectTrigger"
        ><SelectValue :placeholder="placeholder || '请选择'" /></SelectTrigger
      ><SelectContent
        position="popper"
        align="start"
        :class="[controlStyles.selectMenu, `relative isolate rounded-[10px] before:pointer-events-none before:absolute before:inset-x-1 before:top-[var(--kalos-highlight-y,0px)] before:h-[var(--kalos-highlight-height,0px)] before:rounded-[6px] before:bg-accent before:opacity-[var(--kalos-highlight-opacity,0)] before:transition-[top,height,opacity] before:duration-[180ms] before:content-[''] [&_[role=option]]:relative [&_[role=option]]:bg-transparent!`]"
        @pointermove="moveHighlight"
        @focusin="moveHighlight"
        ><SelectGroup><SelectItem
          v-for="item in items"
          :key="item.value"
          :value="item.value"
          >{{ item.label }}</SelectItem
        ></SelectGroup></SelectContent
      ></Select
    >
  </div>
</template>

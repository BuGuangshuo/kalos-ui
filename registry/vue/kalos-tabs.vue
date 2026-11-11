<script setup lang="ts">
import { controlStyles } from "@/components/ui/kalos-styles";
import { nextTick, onMounted, ref, watch } from "vue";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
defineProps<{
  items: { value: string; label: string; content?: string }[];
  defaultValue?: string;
}>();
const model = defineModel<string>();
const list = ref<{ $el: HTMLElement } | null>(null);
const updateHighlight = async () => {
  await nextTick();
  const root = list.value?.$el;
  const selected = root?.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');
  if (!root || !selected) return;
  const origin = root.getBoundingClientRect();
  const target = selected.getBoundingClientRect();
  root.style.setProperty('--highlight-x', `${target.left - origin.left}px`);
  root.style.setProperty('--highlight-width', `${target.width}px`);
};
onMounted(updateHighlight);
watch(model, updateHighlight);
</script>

<template>
  <Tabs
    v-model="model"
    :default-value="defaultValue ?? items[0]?.value"
    class="w-full gap-4"
  >
    <TabsList ref="list" :class="[controlStyles.tabsList, `relative isolate rounded-[8px] before:pointer-events-none before:absolute before:inset-y-[2px] before:left-[var(--highlight-x,2px)] before:w-[var(--highlight-width,0px)] before:rounded-[6px] before:bg-card before:shadow-sm before:transition-[left,width] before:duration-200 before:content-['']`]"
      ><TabsTrigger
        v-for="item in items"
        :key="item.value"
        :value="item.value"
        :class="controlStyles.tabsTrigger"
        >{{ item.label }}</TabsTrigger
      ></TabsList
    >
    <TabsContent
      v-for="item in items"
      :key="item.value"
      :value="item.value"
      class="rounded-xl border p-4 text-[13px]"
      ><slot :name="item.value">{{ item.content }}</slot></TabsContent
    >
  </Tabs>
</template>

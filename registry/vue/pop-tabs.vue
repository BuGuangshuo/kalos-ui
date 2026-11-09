<script setup lang="ts">
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
defineProps<{
  items: { value: string; label: string; content?: string }[];
  defaultValue?: string;
}>();
const model = defineModel<string>();
</script>

<template>
  <Tabs
    v-model="model"
    :default-value="defaultValue ?? items[0]?.value"
    class="w-full gap-4"
  >
    <TabsList class="rounded-full"
      ><TabsTrigger
        v-for="item in items"
        :key="item.value"
        :value="item.value"
        class="rounded-full focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-transparent"
        >{{ item.label }}</TabsTrigger
      ></TabsList
    >
    <TabsContent
      v-for="item in items"
      :key="item.value"
      :value="item.value"
      class="rounded-xl border p-4 text-sm"
      ><slot :name="item.value">{{ item.content }}</slot></TabsContent
    >
  </Tabs>
</template>

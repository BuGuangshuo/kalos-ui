<script setup lang="ts">
import { useId } from "vue";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
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
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label :for="id || autoId" class="text-sm font-medium">{{ label }}</label>
    <Select v-model="model" :disabled="disabled" :name="name"
      ><SelectTrigger
        :id="id || autoId"
        class="h-8 w-full rounded-[var(--radius-element,12px)]"
        ><SelectValue :placeholder="placeholder || '请选择'" /></SelectTrigger
      ><SelectContent
        ><SelectItem
          v-for="item in items"
          :key="item.value"
          :value="item.value"
          >{{ item.label }}</SelectItem
        ></SelectContent
      ></Select
    >
  </div>
</template>

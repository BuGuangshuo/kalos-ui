<script setup lang="ts">
import { controlStyles } from "@/components/ui/kalos-styles";
import { computed } from "vue";
import { Progress } from "@/components/ui/progress";
const props = defineProps<{
  label: string;
  value: number;
  description?: string;
}>();
const progress = computed(() =>
  Number.isFinite(props.value) ? Math.min(100, Math.max(0, props.value)) : 0,
);
</script>

<template>
  <div :class="[`flex w-full flex-col gap-2.5`, controlStyles.font]">
    <div class="flex items-center justify-between gap-4 text-sm">
      <span class="font-medium">{{ label }}</span
      ><span class="tabular-nums text-muted-foreground">{{ progress }}%</span>
    </div>
    <Progress :model-value="progress" :aria-label="label" class="h-1.5" />
    <p v-if="description" class="text-xs text-muted-foreground">
      {{ description }}
    </p>
  </div>
</template>

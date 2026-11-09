<script setup lang="ts">
import { Badge } from "@/components/ui/badge";
withDefaults(defineProps<{ status?: "neutral" | "success" | "warning" }>(), {
  status: "neutral",
});
</script>

<template>
  <Badge variant="secondary" class="gap-1.5 rounded-full px-2.5 font-medium">
    <span
      v-if="status !== 'neutral'"
      class="size-1.5 shrink-0 rounded-full"
      :class="status === 'success' ? 'bg-foreground' : 'bg-muted-foreground'"
      aria-hidden="true"
    />
    <slot />
  </Badge>
</template>

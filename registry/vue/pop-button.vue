<script setup lang="ts">
import { LoaderCircle } from "@lucide/vue";
import { Button } from "@/components/ui/button";
defineOptions({ inheritAttrs: false });
defineProps<{ loading?: boolean; disabled?: boolean }>();
</script>

<template>
  <Button
    v-bind="$attrs"
    class="h-8 rounded-full focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-transparent"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
  >
    <LoaderCircle
      v-if="loading"
      class="size-4 animate-spin motion-reduce:animate-none"
      aria-hidden="true"
    />
    <slot />
  </Button>
</template>

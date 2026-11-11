<script setup lang="ts">
import { controlStyles } from "@/components/ui/kalos-styles";
import { LoaderCircle } from "@lucide/vue";
import { Button } from "@/components/ui/button";
defineOptions({ inheritAttrs: false });
withDefaults(defineProps<{ loading?: boolean; disabled?: boolean; variant?: "default" | "secondary" | "outline" | "ghost" | "destructive" | "link" }>(), { variant: "default" });
</script>

<template>
  <Button
    v-bind="$attrs"
    :class="[controlStyles.button, variant === 'default' && controlStyles.buttonSolid, variant === 'destructive' && controlStyles.buttonDanger, ['secondary', 'outline'].includes(variant) && controlStyles.buttonSurface, variant === 'ghost' && controlStyles.buttonGhost]"
    :variant="variant"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
  >
    <LoaderCircle
      v-if="loading"
      class="size-4 animate-spin"
      aria-hidden="true"
    />
    <slot />
  </Button>
</template>

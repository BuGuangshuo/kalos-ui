<script setup lang="ts">
import { useId } from "vue";
import { Input } from "@/components/ui/input";
defineOptions({ inheritAttrs: false });
const props = defineProps<{
  label: string;
  hint?: string;
  error?: string;
  id?: string;
}>();
const autoId = useId();
const model = defineModel<string | number>({ default: "" });
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label :for="props.id || autoId" class="text-sm font-medium">{{
      label
    }}</label>
    <Input
      v-bind="$attrs"
      :id="props.id || autoId"
      v-model="model"
      class="h-8 rounded-[var(--radius-element,12px)] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-input"
      :aria-invalid="!!error"
      :aria-describedby="
        error || hint ? `${props.id || autoId}-description` : undefined
      "
    />
    <p
      v-if="error || hint"
      :id="`${props.id || autoId}-description`"
      class="text-xs"
      :class="error ? 'text-destructive' : 'text-muted-foreground'"
    >
      {{ error || hint }}
    </p>
  </div>
</template>

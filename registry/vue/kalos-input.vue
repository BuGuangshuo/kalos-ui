<script setup lang="ts">
import { controlStyles } from "@/components/ui/kalos-styles";
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
    <label :for="props.id || autoId" :class="controlStyles.label">{{
      label
    }}</label>
    <Input
      v-bind="$attrs"
      :id="props.id || autoId"
      v-model="model"
      :class="controlStyles.field"
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

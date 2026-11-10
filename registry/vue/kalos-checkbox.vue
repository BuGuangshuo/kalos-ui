<script setup lang="ts">
import { controlStyles } from "@/components/ui/kalos-styles";
import { useId } from "vue";
import { Checkbox } from "@/components/ui/checkbox";
defineOptions({ inheritAttrs: false });
defineProps<{
  label: string;
  description?: string;
  id?: string;
  disabled?: boolean;
  name?: string;
}>();
const autoId = useId();
const model = defineModel<boolean | "indeterminate">({ default: false });
</script>

<template>
  <div class="flex items-start gap-3">
    <Checkbox
      v-bind="$attrs"
      :id="id || autoId"
      v-model="model"
      :name="name"
      :disabled="disabled"
      :class="controlStyles.checkbox"
    />
    <label
      :for="id || autoId"
      class="flex cursor-pointer flex-col gap-1 text-[14px] font-normal"
      >{{ label
      }}<span
        v-if="description"
        class="text-xs font-normal text-muted-foreground"
        >{{ description }}</span
      ></label
    >
  </div>
</template>

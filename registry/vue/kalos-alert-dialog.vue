<script setup lang="ts">
import { AlertDialogRoot, AlertDialogTrigger, AlertDialogPortal, AlertDialogOverlay, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "reka-ui";
import { Button } from "@/components/ui/button";
import { controlStyles } from "@/components/ui/kalos-styles";

withDefaults(defineProps<{ trigger: string; title: string; description: string; actionLabel?: string; cancelLabel?: string }>(), { actionLabel: "确认", cancelLabel: "取消" });
const open = defineModel<boolean>("open", { default: false });
const emit = defineEmits<{ confirm: [] }>();
</script>

<template>
  <AlertDialogRoot v-model:open="open">
    <AlertDialogTrigger as-child>
      <Button variant="outline" :class="[controlStyles.button, controlStyles.buttonSurface]">{{ trigger }}</Button>
    </AlertDialogTrigger>
    <AlertDialogPortal>
      <AlertDialogOverlay :class="[controlStyles.dialogOverlay, controlStyles.dialogRadixOverlay]" />
      <AlertDialogContent data-slot="alert-dialog-content" :class="[controlStyles.font, controlStyles.dialogPopup, controlStyles.dialogSurface, controlStyles.alertDialogWidth, controlStyles.alertDialogLayout, controlStyles.dialogRadixMotion]">
        <div>
          <AlertDialogTitle class="text-base leading-none font-medium">{{ title }}</AlertDialogTitle>
        </div>
        <div>
          <AlertDialogDescription class="text-[13px] leading-5 text-muted-foreground">{{ description }}</AlertDialogDescription>
        </div>
        <div data-slot="dialog-footer" :class="controlStyles.alertDialogActions">
          <AlertDialogCancel as-child>
            <Button variant="outline" :class="[controlStyles.button, controlStyles.buttonSurface]">{{ cancelLabel }}</Button>
          </AlertDialogCancel>
          <AlertDialogAction as-child>
            <Button variant="destructive" :class="[controlStyles.button, controlStyles.buttonDanger]" @click="emit('confirm')">{{ actionLabel }}</Button>
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>

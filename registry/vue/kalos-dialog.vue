<script setup lang="ts">
import { controlStyles } from "@/components/ui/kalos-styles";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
defineProps<{ trigger: string; title: string; description?: string }>();
const open = defineModel<boolean>("open", { default: false });
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child
      ><Button
        variant="outline"
        :class="[`h-8 rounded-full focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-transparent`, controlStyles.font]"
        >{{ trigger }}</Button
      ></DialogTrigger
    >
    <DialogContent
      class="rounded-[var(--radius-container,12px)] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 [&_button:focus-visible]:outline-none [&_button:focus-visible]:ring-0"
    >
      <DialogHeader
        ><DialogTitle>{{ title }}</DialogTitle
        ><DialogDescription :class="!description ? 'sr-only' : undefined">{{
          description || title
        }}</DialogDescription></DialogHeader
      >
      <div class="text-sm"><slot /></div>
      <DialogFooter v-if="$slots.footer"><slot name="footer" /></DialogFooter>
    </DialogContent>
  </Dialog>
</template>

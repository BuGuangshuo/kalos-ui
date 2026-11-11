<script setup lang="ts">
import { useId } from "vue";
import { controlStyles } from "@/components/ui/kalos-styles";
import {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { DialogContent, DialogOverlay, DialogPortal, DialogClose } from "reka-ui";
import { X } from "@lucide/vue";
import { Button } from "@/components/ui/button";
defineProps<{ trigger: string; title: string; description?: string }>();
const descriptionId = useId();
const open = defineModel<boolean>("open", { default: false });
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child
      ><Button
        variant="outline"
        :class="[controlStyles.button, controlStyles.buttonSurface]"
        >{{ trigger }}</Button
      ></DialogTrigger
    >
    <DialogPortal>
      <DialogOverlay :class="['fixed inset-0 z-50 bg-black/10 supports-backdrop-filter:backdrop-blur-xs', controlStyles.dialogRadixOverlay]" />
      <DialogContent
        :aria-describedby="description ? descriptionId : undefined"
        :class="['fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-popover text-popover-foreground outline-none', controlStyles.font, controlStyles.dialogSurface, controlStyles.dialogWidth, controlStyles.dialogLayout, controlStyles.dialogRadixMotion]"
      >
      <DialogHeader :class="controlStyles.dialogHeader"
        ><DialogTitle>{{ title }}</DialogTitle
        ><DialogDescription v-if="description" :id="descriptionId">{{ description }}</DialogDescription></DialogHeader
      >
      <div :class="controlStyles.dialogBody"><slot /></div>
      <DialogFooter v-if="$slots.footer" :class="controlStyles.dialogFooter"><slot name="footer" /></DialogFooter>
        <DialogClose as-child>
          <Button variant="ghost" size="icon-sm" class="absolute top-3 right-3" aria-label="关闭"><X aria-hidden="true" /></Button>
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </Dialog>
</template>

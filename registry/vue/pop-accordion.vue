<script setup lang="ts">
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
defineProps<{ items: { question: string; answer: string }[] }>();
</script>

<template>
  <Accordion type="single" collapsible class="w-full">
    <AccordionItem
      v-for="(item, index) in items"
      :key="item.question"
      :value="String(index)"
      ><AccordionTrigger
        class="text-sm focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-transparent focus-visible:after:border-transparent"
        >{{ item.question }}</AccordionTrigger
      ><AccordionContent class="text-sm text-muted-foreground">{{
        item.answer
      }}</AccordionContent></AccordionItem
    >
  </Accordion>
</template>

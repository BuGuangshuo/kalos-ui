<script setup lang="ts">
import { controlStyles } from "@/components/ui/kalos-styles";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
defineProps<{ title: string; description?: string }>();
</script>

<template>
  <Card :class="[`gap-4 rounded-[var(--radius-container,12px)] py-5`, controlStyles.font]">
    <CardHeader class="px-5"
      ><CardTitle>{{ title }}</CardTitle
      ><CardDescription v-if="description">{{
        description
      }}</CardDescription></CardHeader
    >
    <CardContent class="px-5 text-sm"><slot /></CardContent>
    <CardFooter v-if="$slots.footer" class="px-5"
      ><slot name="footer"
    /></CardFooter>
  </Card>
</template>

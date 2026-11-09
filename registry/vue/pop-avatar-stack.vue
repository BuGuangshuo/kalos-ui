<script setup lang="ts">
import { computed } from "vue";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
const props = withDefaults(
  defineProps<{ people: { name: string; image?: string }[]; max?: number }>(),
  { max: 4 },
);
const limit = computed(() => Math.max(0, Math.floor(props.max)));
const visible = computed(() => props.people.slice(0, limit.value));
const remaining = computed(() =>
  Math.max(0, props.people.length - visible.value.length),
);
const initials = (name: string) =>
  name.trim().includes(" ")
    ? name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => Array.from(part)[0])
        .join("")
        .toUpperCase()
    : Array.from(name).slice(0, 2).join("");
</script>

<template>
  <div class="flex -space-x-2" role="group" aria-label="团队成员">
    <Avatar
      v-for="(person, index) in visible"
      :key="`${person.name}-${index}`"
      class="size-8 border-2 border-background"
      :title="person.name"
      ><AvatarImage
        v-if="person.image"
        :src="person.image"
        :alt="person.name"
      /><AvatarFallback class="text-xs" :aria-label="person.name">{{
        initials(person.name)
      }}</AvatarFallback></Avatar
    ><span
      v-if="remaining"
      class="flex size-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium"
      :aria-label="`另外 ${remaining} 位成员`"
      >+{{ remaining }}</span
    >
  </div>
</template>

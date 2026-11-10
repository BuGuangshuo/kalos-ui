<script setup lang="ts">
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { controlStyles } from "@/components/ui/kalos-styles";
withDefaults(defineProps<{
  trigger: string;
  label?: string;
  items?: { value: string; label: string; disabled?: boolean }[];
  align?: "start" | "center" | "end";
  disabled?: boolean;
}>(), { align: "start", items: () => [] });
const open = defineModel<boolean>("open", { default: false });
const emit = defineEmits<{ action: [value: string] }>();
const moveHighlight = (event: Event) => {
  const root = event.currentTarget;
  const item = event.target instanceof Element ? event.target.closest<HTMLElement>('[role="menuitem"]') : null;
  if (!(root instanceof HTMLElement) || !item || item.matches(':disabled')) return;
  const rect = root.getBoundingClientRect();
  const target = item.getBoundingClientRect();
  const scale = root.offsetHeight ? rect.height / root.offsetHeight : 1;
  root.style.setProperty('--kalos-highlight-y', `${(target.top - rect.top) / scale + root.scrollTop - root.clientTop}px`);
  root.style.setProperty('--kalos-highlight-height', `${target.height / scale}px`);
  root.style.setProperty('--kalos-highlight-opacity', '1');
};
const navigate = (event: KeyboardEvent) => {
  if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
  const root = event.currentTarget as HTMLElement;
  const options = [...root.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)')];
  if (!options.length) return;
  event.preventDefault();
  const index = options.indexOf(document.activeElement as HTMLButtonElement);
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length;
  options[next].focus();
};
const choose = (value: string) => { open.value = false; emit('action', value); };
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button variant="outline" :disabled="disabled" :class="[controlStyles.button, controlStyles.buttonSurface]">{{ trigger }}</Button>
    </PopoverTrigger>
    <PopoverContent :align="align" :side-offset="8" :class="controlStyles.popover" :aria-label="label || trigger">
      <slot>
        <div
          role="menu"
          :aria-label="label || trigger"
          :class="[controlStyles.popoverList, `relative isolate before:pointer-events-none before:absolute before:inset-x-0 before:top-[var(--kalos-highlight-y,0px)] before:h-[var(--kalos-highlight-height,0px)] before:opacity-[var(--kalos-highlight-opacity,0)] before:transition-[top,height,opacity] before:content-['']`]"
          @pointermove="moveHighlight"
          @focusin="moveHighlight"
          @keydown="navigate"
        >
          <button v-for="item in items" :key="item.value" type="button" role="menuitem" :disabled="item.disabled" :class="controlStyles.popoverItem" @click="choose(item.value)">{{ item.label }}</button>
        </div>
      </slot>
    </PopoverContent>
  </Popover>
</template>

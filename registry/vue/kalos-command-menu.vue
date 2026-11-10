<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useId, watch } from "vue";
import { controlStyles } from "@/components/ui/kalos-styles";
type CommandItem = { value: string; label: string; description?: string; keywords?: string; disabled?: boolean };
type CommandGroup = { label: string; items: CommandItem[] };
const props = withDefaults(defineProps<{ groups: CommandGroup[]; label?: string; placeholder?: string; filter?: boolean; autoFocus?: boolean; emptyMessage?: string; className?: string }>(), { label: "命令菜单", placeholder: "搜索命令…", filter: true, autoFocus: false, emptyMessage: "没有找到匹配的内容" });
const query = defineModel<string>("query", { default: "" });
const emit = defineEmits<{ run: [value: string]; close: [] }>();
const index = ref(0);
const input = ref<HTMLInputElement>();
onMounted(() => { if (props.autoFocus) input.value?.focus(); });
const list = ref<HTMLDivElement>();
const id = useId();
const visible = computed(() => {
  const words = query.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return props.groups.map(group => ({ ...group, items: group.items.filter(item => !props.filter || words.every(word => `${item.label} ${item.description || ""} ${item.keywords || ""}`.toLocaleLowerCase().includes(word))) })).filter(group => group.items.length);
});
const options = computed(() => visible.value.flatMap(group => group.items).filter(item => !item.disabled));
const active = computed(() => options.value.length ? Math.min(index.value, options.value.length - 1) : -1);
const activeItem = computed(() => options.value[active.value]);
watch(query, () => { index.value = 0; });
watch([() => activeItem.value?.value, query, visible], async () => {
  await nextTick();
  const root = list.value;
  const item = root?.querySelector<HTMLElement>('[aria-selected="true"]');
  if (!root || !item) { root?.style.setProperty('--kalos-highlight-opacity', '0'); return; }
  if (document.activeElement === root.parentElement?.querySelector('input')) item.scrollIntoView({ block: 'nearest' });
  const rect = root.getBoundingClientRect();
  const target = item.getBoundingClientRect();
  const scaleX = root.offsetWidth ? rect.width / root.offsetWidth : 1;
  const scaleY = root.offsetHeight ? rect.height / root.offsetHeight : 1;
  root.style.setProperty('--kalos-highlight-x', `${(target.left - rect.left) / scaleX + root.scrollLeft - root.clientLeft}px`);
  root.style.setProperty('--kalos-highlight-y', `${(target.top - rect.top) / scaleY + root.scrollTop - root.clientTop}px`);
  root.style.setProperty('--kalos-highlight-width', `${target.width / scaleX}px`);
  root.style.setProperty('--kalos-highlight-height', `${target.height / scaleY}px`);
  root.style.setProperty('--kalos-highlight-opacity', '1');
}, { immediate: true });
const navigate = (event: KeyboardEvent) => {
  if (event.isComposing) return;
  if (['ArrowDown', 'ArrowUp'].includes(event.key)) {
    event.preventDefault();
    if (options.value.length) index.value = (active.value + (event.key === 'ArrowDown' ? 1 : -1) + options.value.length) % options.value.length;
  } else if ((event.ctrlKey || event.metaKey) && ['Home', 'End'].includes(event.key)) {
    event.preventDefault(); index.value = event.key === 'Home' ? 0 : Math.max(0, options.value.length - 1);
  } else if (event.key === 'Tab' && options.value.length) {
    event.preventDefault();
    const groups = visible.value.filter(group => group.items.some(item => !item.disabled));
    const groupIndex = groups.findIndex(group => group.items.includes(activeItem.value));
    const next = groups[(groupIndex + (event.shiftKey ? -1 : 1) + groups.length) % groups.length].items.find(item => !item.disabled)!;
    index.value = options.value.indexOf(next);
  } else if (event.key === 'Enter' && activeItem.value) {
    event.preventDefault(); emit('run', activeItem.value.value);
  } else if (event.key === 'Escape') {
    event.preventDefault(); event.stopPropagation();
    if (query.value) query.value = ''; else emit('close');
  }
};
</script>

<template>
  <div :class="[controlStyles.commandMenu, className]">
    <label :class="controlStyles.commandSearch">
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      <input ref="input" v-model="query" role="combobox" :aria-label="label" aria-expanded="true" :aria-controls="id" :aria-activedescendant="active >= 0 ? `${id}-${active}` : undefined" aria-autocomplete="list" autocomplete="off" :autofocus="autoFocus" :class="controlStyles.commandInput" :placeholder="placeholder" @keydown="navigate" />
      <kbd aria-hidden="true" :class="controlStyles.commandKey">↵</kbd>
    </label>
    <div :id="id" ref="list" role="listbox" :aria-label="`${label}结果`" :class="[controlStyles.commandList, `relative isolate before:pointer-events-none before:absolute before:left-[var(--kalos-highlight-x,4px)] before:top-[var(--kalos-highlight-y,0px)] before:z-0 before:w-[var(--kalos-highlight-width,0px)] before:h-[var(--kalos-highlight-height,0px)] before:opacity-[var(--kalos-highlight-opacity,0)] before:transition-[left,top,width,height,opacity] before:content-['']` ]">
      <div v-for="group in visible" :key="group.label" role="group" :aria-label="group.label">
        <div aria-hidden="true" :class="controlStyles.commandGroup">{{ group.label }}</div>
        <button v-for="item in group.items" :id="item.disabled ? undefined : `${id}-${options.indexOf(item)}`" :key="item.value" type="button" role="option" :aria-selected="!item.disabled && item.value === activeItem?.value" :disabled="item.disabled" :tabindex="-1" :class="controlStyles.commandItem" @pointermove="!item.disabled && (index = options.indexOf(item))" @mousedown.prevent @click="emit('run', item.value)">
          <span v-if="$slots.icon" :class="controlStyles.commandIcon"><slot name="icon" :item="item" /></span>
          <span :class="controlStyles.commandItemText"><span :class="controlStyles.commandTitle">{{ item.label }}</span><span v-if="item.description" :class="controlStyles.commandDescription"><slot name="description" :item="item">{{ item.description }}</slot></span></span>
        </button>
      </div>
      <p v-if="!visible.length" class="px-3 py-8 text-center text-[14px] text-muted-foreground" role="status">{{ emptyMessage }}</p>
    </div>
    <div aria-hidden="true" :class="controlStyles.commandFooter">
      <span><kbd :class="controlStyles.commandKey">↑</kbd><kbd :class="controlStyles.commandKey">↓</kbd>选择</span>
      <span><kbd :class="controlStyles.commandKey">Tab</kbd>切换分组</span>
      <span><kbd :class="controlStyles.commandKey">↵</kbd>执行</span>
      <span><kbd :class="controlStyles.commandKey">esc</kbd>清空 / 关闭</span>
    </div>
    <span class="sr-only" role="status">{{ options.length }} 个可用结果</span>
  </div>
</template>

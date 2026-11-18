"use client";

import { useId, useImperativeHandle, useLayoutEffect, useRef, useState, type ReactNode, type Ref } from "react";
import { Combobox } from "@base-ui/react/combobox";
import { Check, ChevronDown, Plus, X } from "lucide-react";
import { AnimatePresence, motion, useIsPresent } from "motion/react";
import { KalosAvatar } from "./kalos-avatar-stack";
import { Field } from "@/components/ui/field";
import { KalosFieldMessage } from "@/components/ui/kalos-field-message";
import { slidingHighlightClasses, useSlidingHighlight } from "@/components/ui/kalos-highlight";
import { comboboxDefaults, comboboxStyles } from "@/components/ui/kalos-combobox-styles";
import { controlStyles } from "@/components/ui/kalos-styles";
import { cn } from "@/lib/utils";

export interface KalosComboboxOption {
  value: string;
  label: string;
  hint?: string;
  avatar?: string | boolean;
  color?: string;
  icon?: ReactNode;
  group?: string;
  keywords?: readonly string[];
  disabled?: boolean;
}

export interface KalosComboboxProps {
  options: readonly KalosComboboxOption[];
  label?: string;
  "aria-label"?: string;
  id?: string;
  name?: string;
  form?: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  ref?: Ref<HTMLInputElement>;
  value?: readonly string[];
  defaultValue?: readonly string[];
  onChange?: (value: string[], options: KalosComboboxOption[]) => void;
  placeholder?: string;
  creatable?: boolean;
  onCreate?: (text: string) => KalosComboboxOption | void;
  createLabel?: (text: string) => string;
  maxVisibleTags?: number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: Combobox.Root.Props<unknown, true>["onOpenChange"];
  emptyText?: string;
  className?: string;
}

type Item = KalosComboboxOption | { create: string };
const avatarLetters = new Intl.Segmenter("zh", { granularity: "grapheme" });
const ease: [number, number, number, number] = [...comboboxDefaults.ease];
const tagTransition = { duration: comboboxDefaults.tagDuration / 1000, ease };
const countTransition = { duration: comboboxDefaults.countDuration / 1000, ease };
const countVariants = {
  enter: (direction: number) => ({ y: `${direction * 65}%`, opacity: 0 }),
  visible: { y: 0, opacity: 1 },
  exit: (direction: number) => ({ y: `${-direction * 65}%`, opacity: 0 }),
};

function matchText(text: string, query: string) {
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (!query || index === -1) return text;
  return <>{text.slice(0, index)}<mark className={comboboxStyles.match}>{text.slice(index, index + query.length)}</mark>{text.slice(index + query.length)}</>;
}

function OptionIcon({ item }: { item: KalosComboboxOption }) {
  if (item.avatar) return <KalosAvatar
    name={item.avatar === true ? avatarLetters.segment(item.label.trim()).containing(0)?.segment : item.label}
    seed={item.avatar === true ? "" : item.value}
    src={typeof item.avatar === "string" ? item.avatar : undefined}
    size={comboboxDefaults.avatarSize}
    className={item.avatar === true ? comboboxStyles.initialAvatar : undefined}
    aria-hidden="true"
  />;
  if (item.icon) return <span aria-hidden="true" className={comboboxStyles.icon}>{item.icon}</span>;
  if (item.color) return <span aria-hidden="true" className={comboboxStyles.dot} style={{ backgroundColor: item.color }} />;
  return null;
}

function Tag({ item }: { item: KalosComboboxOption }) {
  const present = useIsPresent();
  const content = <><OptionIcon item={item} /><span className="min-w-0 truncate" title={item.label}>{item.label}</span></>;
  return present ? <Combobox.Chip data-slot="combobox-chip" className={comboboxStyles.tag} aria-label={item.label}>
    {content}
    <Combobox.ChipRemove aria-label={`移除${item.label}`} className={comboboxStyles.remove}>
      <X strokeWidth={1.5} aria-hidden="true" />
    </Combobox.ChipRemove>
  </Combobox.Chip> : <div className={cn(comboboxStyles.tag, comboboxStyles.tagExit)} aria-hidden="true">
    {content}<span className={comboboxStyles.remove}><X /></span>
  </div>;
}

function RollingCount({ count }: { count: number }) {
  const [roll, setRoll] = useState({ count, direction: 1 });
  if (count !== roll.count) setRoll({ count, direction: count > roll.count ? 1 : -1 });

  return <span className="inline-grid overflow-hidden tabular-nums align-bottom">
    <AnimatePresence initial={false} custom={roll.direction}>
      <motion.span
        key={count}
        className="[grid-area:1/1]"
        custom={roll.direction}
        variants={countVariants}
        initial="enter"
        animate="visible"
        exit="exit"
        transition={countTransition}
      >{count}</motion.span>
    </AnimatePresence>
  </span>;
}

function Tags({ selected, limit, children }: { selected: KalosComboboxOption[]; limit: number; children: ReactNode }) {
  const container = useRef<HTMLDivElement>(null);
  const measure = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState(limit);

  useLayoutEffect(() => {
    const row = container.current;
    const sizes = measure.current;
    if (!row || !sizes) return;
    const update = () => {
      const gap = comboboxDefaults.tagGap;
      const searchWidth = (sizes.lastElementChild as HTMLElement).offsetWidth;
      const available = row.clientWidth - searchWidth;
      const widths = Array.from(sizes.children, node => (node as HTMLElement).offsetWidth);
      const summaryWidth = widths[widths.length - 2] + gap;
      let used = 0;
      let count = 0;
      while (count < limit) {
        used += widths[count] + gap;
        if (used + (count + 1 < selected.length ? summaryWidth : 0) > available) break;
        count += 1;
      }
      setFit(count);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(row);
    observer.observe(sizes);
    return () => observer.disconnect();
  }, [limit, selected.length]);

  const visible = selected.slice(0, Math.min(limit, fit));
  const overflow = selected.length - visible.length;
  return <Combobox.Chips ref={container} className={comboboxStyles.tags}>
    <div aria-hidden="true" inert className="invisible pointer-events-none absolute size-0 overflow-hidden">
      <div ref={measure} className={comboboxStyles.measure}>
        {selected.slice(0, limit).map(item => <span key={item.value} className={comboboxStyles.tag}>
          {item.avatar ? <span className={comboboxStyles.measureAvatar} /> : <OptionIcon item={item} />}
          <span className="truncate">{item.label}</span>
          <span className={comboboxStyles.remove}><X /></span>
        </span>)}
        <span className={cn(comboboxStyles.tag, comboboxStyles.more)}>+{selected.length}</span>
        <span className="w-20" />
      </div>
    </div>
    <AnimatePresence initial={false}>
      {visible.map(item => <motion.div
        key={item.value}
        className={comboboxStyles.tagTrack}
        initial={{ width: 0, marginInlineEnd: 0 }}
        animate={{ width: "auto", marginInlineEnd: comboboxDefaults.tagGap }}
        exit={{ width: 0, marginInlineEnd: 0, opacity: [1, 1, 0], pointerEvents: "none" }}
        transition={tagTransition}
      >
        <motion.div
          className="min-w-0"
          initial={{ scale: 0.88, opacity: 0 }}
          animate={{ scale: [0.88, 1.035, 1], opacity: 1 }}
          transition={tagTransition}
        >
          <Tag item={item} />
        </motion.div>
      </motion.div>)}
    </AnimatePresence>
    {overflow > 0 && <span data-slot="combobox-overflow" className={cn(comboboxStyles.tag, comboboxStyles.more)} title={selected.slice(visible.length).map(item => item.label).join("、")} aria-hidden="true">
      <span>+<RollingCount count={overflow} /></span>
    </span>}
    {children}
  </Combobox.Chips>;
}

function ComboboxList({ children }: { children: ReactNode }) {
  const content = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>();
  const highlight = useSlidingHighlight('[role="option"]', '[role="option"][data-highlighted]:not([data-disabled])');

  useLayoutEffect(() => {
    const node = content.current;
    if (!node) return;
    const observer = new ResizeObserver(() => setHeight(node.offsetHeight));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return <div data-slot="combobox-viewport" className={comboboxStyles.viewport} style={{ height }}>
    <div ref={content}>
      <div ref={highlight} className={cn(slidingHighlightClasses, comboboxStyles.scroll)}>{children}</div>
    </div>
  </div>;
}

function ComboboxEmpty({ children }: { children: string }) {
  const groups = Combobox.useFilteredItems<{ key: string; items: Item[] }>();
  const onlyCreate = groups.length === 1 && groups[0].items.every(item => "create" in item);
  return <>
    <Combobox.Empty className={comboboxStyles.empty}>{children}</Combobox.Empty>
    <Combobox.Status className={comboboxStyles.empty}>{onlyCreate ? children : null}</Combobox.Status>
  </>;
}

export function KalosCombobox({
  options, label, "aria-label": ariaLabel, id: providedId, name, form, hint, error, disabled, required, ref,
  value, defaultValue = [], onChange, placeholder = "搜索…",
  creatable = false, onCreate, createLabel = text => `创建“${text}”`, maxVisibleTags,
  open, defaultOpen = false, onOpenChange, emptyText = "无匹配项", className,
}: KalosComboboxProps) {
  const autoId = useId();
  const id = providedId ?? autoId;
  const labelId = label ? `${id}-label` : undefined;
  const messageId = `${id}-message`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [created, setCreated] = useState<KalosComboboxOption[]>([]);
  const [inputText, setInputText] = useState("");
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const query = inputText.trim();
  const expanded = open ?? internalOpen;

  useImperativeHandle(ref, () => inputRef.current!, []);

  const optionMap = new Map(created.map(item => [item.value, item]));
  for (const item of options) optionMap.set(item.value, item);
  const ids = [...new Set(value ?? internalValue)];
  const selected = ids.map(id => optionMap.get(id) ?? { value: id, label: id });
  const grouped = new Map<string, Item[]>();
  for (const item of optionMap.values()) {
    const group = item.group ?? "";
    const items = grouped.get(group) ?? [];
    items.push(item);
    grouped.set(group, items);
  }
  const groups = Array.from(grouped, ([label, items]) => ({ key: label, label, items }));
  const normalized = query.toLowerCase();
  if (creatable && query && !Array.from(optionMap.values()).some(item => [item.label, item.value].some(text => text.trim().toLowerCase() === normalized))) {
    groups.push({ key: "\0create", label: "", items: [{ create: query }] });
  }
  const tagLimit = maxVisibleTags === undefined || Number.isNaN(maxVisibleTags)
    ? selected.length
    : Math.min(selected.length, Math.max(0, Math.floor(maxVisibleTags)));

  function handleChange(next: Item[], details: Combobox.Root.ChangeEventDetails) {
    if (details.reason === "escape-key") {
      details.cancel();
      return;
    }
    const nextSelection = next.map(item => {
      if (!("create" in item)) return item;
      const draft = onCreate?.(item.create) ?? { value: item.create, label: item.create };
      const existing = optionMap.get(draft.value);
      if (existing) return existing;
      const newItem = draft.avatar === undefined && !draft.icon && !draft.color ? { ...draft, avatar: true } : draft;
      setCreated(previous => [...previous.filter(option => option.value !== newItem.value), newItem]);
      return newItem;
    });
    const unique = [...new Map(nextSelection.map(item => [item.value, item])).values()];
    const nextIds = unique.map(item => item.value);
    if (value === undefined) setInternalValue(nextIds);
    if (details.reason === "item-press") {
      setInputText("");
      if (!("pointerType" in details.event && details.event.pointerType === "touch")) {
        inputRef.current?.focus({ preventScroll: true });
      }
    }
    onChange?.(nextIds, unique);
  }

  const input = <Combobox.Input
    ref={inputRef}
    id={id}
    aria-labelledby={labelId}
    aria-label={ariaLabel}
    aria-describedby={hint || error ? messageId : undefined}
    aria-invalid={!!error || undefined}
    placeholder={selected.length > 0 ? undefined : placeholder}
    spellCheck={false}
    className={comboboxStyles.input}
    onKeyDown={event => {
      if (event.key === "Escape" && !expanded) event.preventBaseUIHandler();
      if (selected.length > 0 && event.key === "Backspace" && !event.currentTarget.value && !event.nativeEvent.isComposing && !event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey) {
        const chips = event.currentTarget.parentElement?.querySelectorAll<HTMLElement>("[data-slot=combobox-chip]");
        const lastChip = chips?.[chips.length - 1];
        event.preventDefault();
        event.preventBaseUIHandler();
        lastChip?.focus();
      }
    }}
  />;

  return <Field data-invalid={!!error || undefined} data-disabled={disabled || undefined} className={cn("min-w-0 gap-1.5", comboboxStyles.colors, className)}>
    {label && <label id={labelId} htmlFor={id} className={cn(controlStyles.label, comboboxStyles.label)} onClick={event => event.preventDefault()}>
      {label}{required && <span className={controlStyles.requiredMark} aria-hidden="true">*</span>}
    </label>}
    <Combobox.Root<Item, true>
      items={groups}
      multiple
      value={selected}
      onValueChange={handleChange}
      isItemEqualToValue={(a, b) => "create" in a ? "create" in b && a.create === b.create : !("create" in b) && a.value === b.value}
      itemToStringLabel={item => "create" in item ? item.create : item.label}
      itemToStringValue={item => "create" in item ? item.create : item.value}
      filter={(item, text) => "create" in item || [item.label, item.hint ?? "", ...(item.keywords ?? [])].some(part => part.toLowerCase().includes(text.toLowerCase()))}
      inputValue={inputText}
      onInputValueChange={setInputText}
      open={expanded}
      onOpenChange={(next, details) => {
        if (!next && details.reason === "item-press") {
          details.cancel();
          return;
        }
        onOpenChange?.(next, details);
        if (!details.isCanceled) setInternalOpen(next);
      }}
      onOpenChangeComplete={next => { if (!next) setInputText(""); }}
      autoHighlight
      name={name}
      form={form}
      disabled={disabled}
      required={required}
    >
      <Combobox.InputGroup
        data-slot="combobox-control"
        data-invalid={!!error || undefined}
        data-disabled={disabled || undefined}
        className={cn(controlStyles.selectControlStatic, comboboxStyles.control)}
        onPointerDownCapture={event => {
          if (event.target instanceof Element && event.target.closest("input, button")) {
            event.currentTarget.setAttribute("data-pointer-focus", "");
          }
        }}
        onBlur={event => {
          if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.removeAttribute("data-pointer-focus");
        }}
      >
        <Tags selected={selected} limit={tagLimit}>{input}</Tags>
        <Combobox.Trigger aria-label={expanded ? "关闭选项" : "展开选项"} className={comboboxStyles.action}>
          <ChevronDown className={comboboxStyles.chevron} strokeWidth={1.75} aria-hidden="true" />
        </Combobox.Trigger>
      </Combobox.InputGroup>
      <Combobox.Portal>
        <Combobox.Positioner align="start" sideOffset={comboboxDefaults.popupOffset} className="z-50">
          <Combobox.Popup data-slot="combobox-popup" className={cn(controlStyles.selectMenu, comboboxStyles.popup)}>
            <ComboboxList>
              <ComboboxEmpty>{emptyText}</ComboboxEmpty>
              <Combobox.List aria-label={ariaLabel} aria-labelledby={labelId} className="p-1">
                {(group: (typeof groups)[number]) => <Combobox.Group key={group.key} items={group.items}>
                  {group.label && <Combobox.GroupLabel className={comboboxStyles.group}>{group.label}</Combobox.GroupLabel>}
                  <Combobox.Collection>
                    {(item: Item) => "create" in item ?
                      <Combobox.Item key="create" value={item} className={comboboxStyles.item}>
                        <span className={comboboxStyles.createIcon} aria-hidden="true"><Plus strokeWidth={1.5} /></span><span className="truncate">{createLabel(item.create)}</span>
                      </Combobox.Item> :
                      <Combobox.Item key={item.value} value={item} disabled={item.disabled} className={comboboxStyles.item}>
                        <OptionIcon item={item} />
                        <span className="min-w-0 truncate" title={item.label}>{matchText(item.label, query)}</span>
                        {item.hint && <span className={comboboxStyles.hint} title={item.hint}>{matchText(item.hint, query)}</span>}
                        <Combobox.ItemIndicator keepMounted className={comboboxStyles.indicator}>
                          <Check strokeWidth={1.65} aria-hidden="true" />
                        </Combobox.ItemIndicator>
                      </Combobox.Item>}
                  </Combobox.Collection>
                </Combobox.Group>}
              </Combobox.List>
            </ComboboxList>
            <div className={comboboxStyles.footer} aria-hidden="true">
              <span>已选 <RollingCount count={selected.length} /> 项</span>
              <span data-shortcuts className={comboboxStyles.shortcuts}>
                <kbd className={comboboxStyles.key}>↑</kbd><kbd className={comboboxStyles.key}>↓</kbd>
                <span>移动</span>
                <kbd className={cn(comboboxStyles.key, "ml-1")}>↵</kbd><span>切换</span>
              </span>
            </div>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
    <span className="sr-only" role="status">已选 {selected.length} 项</span>
    <KalosFieldMessage id={messageId} hint={hint} error={error} />
  </Field>;
}

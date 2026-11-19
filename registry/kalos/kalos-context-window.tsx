"use client";

import { Collapsible } from "@base-ui/react/collapsible";
import { Check, ChevronDown, ChevronsDownUp, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { contextWindowCss, contextWindowDefaults, contextWindowStyleHref } from "@/components/ui/kalos-context-window-styles";
import { KalosButton } from "@/registry/kalos/kalos-button";
import { KalosCard } from "@/registry/kalos/kalos-card";
import { cn } from "@/lib/utils";

export type KalosContextItem = {
  id: string;
  label: string;
  tokens: number;
  icon?: ReactNode;
};

export type KalosContextPart = {
  id: string;
  label: string;
  tokens?: number;
  items?: readonly KalosContextItem[];
  icon?: ReactNode;
  color?: string;
  locked?: boolean;
  defaultExpanded?: boolean;
  compact?: boolean;
};

export type KalosContextWindowProps = {
  limit: number;
  parts: readonly KalosContextPart[];
  title?: string;
  model?: string;
  modelIcon?: ReactNode;
  warnAt?: number;
  cells?: number;
  columns?: number;
  onRemoveItem?: (partId: string, itemId: string) => void;
  onCompact?: (partId: string) => void | Promise<void>;
  action?: { label: string; onClick: () => void; icon?: ReactNode };
  className?: string;
};

type ContextPart = KalosContextPart & { count: number; canCompact: boolean; cellColor: string };
type Compaction = { partId: string; before: number; phase: "pending" | "done" | "error" };

const palette = ["system", "tools", "files", "conversation", "memory"] as const;
const tokenFormat = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });
const animatedTokenFormat = new Intl.NumberFormat("en", { notation: "compact", minimumFractionDigits: 1, maximumFractionDigits: 1 });
const exactTokenFormat = new Intl.NumberFormat("zh-CN");
const {
  compactDuration, compactShare, countDuration, swapEnter, swapExit, swapBlur, fullAt, narrowColumns,
} = contextWindowDefaults;
const swapVariants = {
  enter: { opacity: 0, filter: `blur(${swapBlur}px)` },
  visible: { opacity: 1, filter: "blur(0px)", transition: { duration: swapEnter / 1000, ease: "easeInOut" } },
  exit: { opacity: 0, filter: `blur(${swapBlur}px)`, transition: { duration: swapExit / 1000, ease: "easeInOut" } },
} as const;

function tokenCount(value = 0) {
  return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
}

function ContextCount({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const current = useRef(value);

  useEffect(() => {
    const from = current.current;
    if (from === value) return;
    const started = performance.now();
    let frame: number;
    function tick(now: number) {
      const progress = Math.max(0, Math.min(1, (now - started) / countDuration));
      current.current = Math.round(from + (value - from) * (1 - (1 - progress) ** 3));
      setDisplay(current.current);
      if (progress < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  const format = display !== value && display >= 1000 ? animatedTokenFormat : tokenFormat;
  return <strong className="kalos-context-number">{format.format(display)}</strong>;
}

function ContextSwap({
  text, prefix, className, warning, phase,
}: {
  text: string;
  prefix?: string;
  className?: string;
  warning?: "warning" | "full";
  phase?: Compaction["phase"];
}) {
  return <span className={cn("kalos-context-swap", className)} aria-hidden="true">
    <AnimatePresence initial={false}>
      <motion.span
        key={prefix ? `${prefix}:${text}` : text}
        className="kalos-context-swap-layer"
        data-warning={warning}
        data-phase={phase}
        variants={swapVariants}
        initial="enter"
        animate="visible"
        exit="exit"
      >{prefix ? <strong>{prefix}</strong> : null}{text}</motion.span>
    </AnimatePresence>
  </span>;
}

function ContextPartRow({
  part, active, dimmed, busy, pending, done, onHover, onFocus, onRemove, onCompact,
}: {
  part: ContextPart;
  active: boolean;
  dimmed: boolean;
  busy: boolean;
  pending: boolean;
  done: boolean;
  onHover: (id: string | null) => void;
  onFocus: (id: string | null) => void;
  onRemove: (partId: string, itemId: string) => void;
  onCompact: (partId: string, tokens: number) => void;
}) {
  const trigger = useRef<HTMLButtonElement>(null);
  const rowLabel = <>
    <span className="kalos-context-swatch" aria-hidden="true">{part.icon}</span>
    <span className="kalos-context-label">{part.label}</span>
    {part.locked ? <span className="kalos-context-sr">已锁定</span> : null}
  </>;

  return <Collapsible.Root
    render={<li />}
    className="kalos-context-part"
    data-active={active || undefined}
    data-dimmed={dimmed || undefined}
    defaultOpen={part.defaultExpanded}
    style={{ "--kc-part": part.cellColor } as CSSProperties}
    onPointerEnter={event => { if (event.pointerType !== "touch") onHover(part.id); }}
    onPointerLeave={() => onHover(null)}
    onFocus={event => onFocus(event.target.matches(":focus-visible") ? part.id : null)}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) onFocus(null); }}
  >
    <div className="kalos-context-row">
      {part.items ? <Collapsible.Trigger className="kalos-context-toggle" ref={trigger}>
        {rowLabel}<ChevronDown className="kalos-context-chevron" aria-hidden="true" />
      </Collapsible.Trigger> : <span className="kalos-context-row-label">{rowLabel}</span>}
      {part.compact && !part.locked ? <KalosButton
        type="button" size="sm" variant="ghost"
        className="kalos-context-compact"
        aria-label={pending ? "正在压缩" : done ? `${part.label}已压缩` : `压缩${part.label}`}
        aria-busy={pending || undefined}
        aria-disabled={busy || !part.canCompact}
        data-done={done || undefined}
        onClick={() => { if (!busy && part.canCompact) onCompact(part.id, part.count); }}
      >
        {done ? <Check data-icon="inline-start" aria-hidden="true" /> : <ChevronsDownUp data-icon="inline-start" aria-hidden="true" />}
        <span>{pending ? "压缩中" : done ? "已压缩" : "压缩"}</span>
      </KalosButton> : null}
      <span className="kalos-context-part-count" title={`${exactTokenFormat.format(part.count)} tokens`}>{tokenFormat.format(part.count)}</span>
    </div>
    {part.items ? <Collapsible.Panel className="kalos-context-files">
      {part.items.length ? <ul className="kalos-context-items">
        {part.items.map(item => <li key={item.id} className="kalos-context-item">
          {item.icon ? <span aria-hidden="true" className="kalos-context-item-icon">{item.icon}</span> : null}
          <span className="kalos-context-label" title={item.label}>{item.label}</span>
          <span className="kalos-context-part-count" title={`${exactTokenFormat.format(tokenCount(item.tokens))} tokens`}>{tokenFormat.format(tokenCount(item.tokens))}</span>
          {part.locked ? null : <KalosButton
            type="button" variant="ghost" size="icon-sm"
            className="kalos-context-remove"
            aria-label={`移除 ${item.label}`}
            onClick={event => {
              const row = event.currentTarget.closest("li");
              const neighbor = row?.nextElementSibling ?? row?.previousElementSibling;
              (neighbor?.querySelector<HTMLButtonElement>("button") ?? trigger.current)?.focus();
              onRemove(part.id, item.id);
            }}
          ><X aria-hidden="true" /></KalosButton>}
        </li>)}
      </ul> : <p className="kalos-context-empty">没有附加文件</p>}
    </Collapsible.Panel> : null}
  </Collapsible.Root>;
}

export function KalosContextWindow({
  limit, parts, title = "上下文窗口", model, modelIcon,
  warnAt = contextWindowDefaults.warnAt,
  cells = contextWindowDefaults.cells,
  columns = contextWindowDefaults.columns,
  onRemoveItem, onCompact, action, className,
}: KalosContextWindowProps) {
  const titleId = useId();
  const [hovered, setHovered] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const [removed, setRemoved] = useState<Map<string, Set<string>>>(() => new Map());
  const [compacted, setCompacted] = useState<Map<string, { before: number; after: number }>>(() => new Map());
  const [compaction, setCompaction] = useState<Compaction | null>(null);
  const [removal, setRemoval] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout>>(null);
  const working = useRef(false);
  useEffect(() => () => {
    if (timer.current !== null) clearTimeout(timer.current);
  }, []);

  const groups = parts.map<ContextPart>((part, index) => {
    const hiddenItems = onRemoveItem ? undefined : removed.get(part.id);
    const items = hiddenItems ? part.items?.filter(item => !hiddenItems.has(item.id)) : part.items;
    const rawCount = items ? items.reduce((sum, item) => sum + tokenCount(item.tokens), 0) : tokenCount(part.tokens);
    const localCompaction = onCompact || items ? undefined : compacted.get(part.id);
    const isCompacted = localCompaction?.before === rawCount;
    return {
      ...part, items,
      count: isCompacted ? localCompaction.after : rawCount,
      canCompact: rawCount > 0 && !isCompacted && (!!onCompact || !items),
      cellColor: part.color ?? `var(--kc-${palette[index % palette.length]})`,
    };
  });
  const capacity = tokenCount(limit);
  const used = groups.reduce((sum, part) => sum + part.count, 0);
  const ratio = capacity ? used / capacity : Number(used > 0);
  const percent = Math.round(ratio * 100);
  const left = Math.max(0, capacity - used);
  const level = ratio >= fullAt ? "full" : ratio >= warnAt ? "warning" : undefined;
  const cellCount = Math.max(1, Math.min(432, tokenCount(cells) || contextWindowDefaults.cells));
  const columnCount = Math.max(1, Math.min(cellCount, tokenCount(columns) || contextWindowDefaults.columns));
  const scale = Math.max(capacity, used, 1);
  const tiles = Array<ContextPart | undefined>(cellCount).fill(undefined);
  let accounted = 0;
  let start = 0;
  for (const part of groups) {
    accounted += part.count;
    const end = Math.round((accounted / scale) * cellCount);
    tiles.fill(part, start, end);
    start = end;
  }
  const active = hovered ?? focused;
  const highlighted = groups.find(part => part.id === active);
  const pending = compaction?.phase === "pending" ? compaction.partId : null;
  const saved = compaction?.phase === "done"
    ? Math.max(0, compaction.before - (groups.find(part => part.id === compaction.partId)?.count ?? 0))
    : 0;
  const remaining = used > capacity ? `超出 ${tokenFormat.format(used - capacity)} tokens` : `剩余 ${tokenFormat.format(left)} tokens`;
  const status = compaction?.phase === "pending" ? "正在压缩上下文…"
    : compaction?.phase === "error" ? "压缩失败，请重试"
    : compaction?.phase === "done" ? saved > 0 ? `已释放 ${tokenFormat.format(saved)} tokens` : "压缩已完成"
    : remaining;
  const highlightedShare = highlighted && capacity ? Math.round(highlighted.count / capacity * 1000) / 10 : 0;
  const showShare = !!highlighted && !compaction;

  function removeItem(partId: string, itemId: string) {
    const item = groups.find(part => part.id === partId)?.items?.find(item => item.id === itemId);
    if (!item) return;
    setRemoval("");
    if (onRemoveItem) {
      onRemoveItem(partId, itemId);
    } else {
      setRemoved(previous => new Map(previous).set(partId, new Set([...(previous.get(partId) ?? []), itemId])));
      setRemoval(`已移除 ${item.label}`);
    }
    if (!working.current) setCompaction(null);
  }

  async function compact(partId: string, before: number) {
    if (working.current) return;
    working.current = true;
    setCompaction({ partId, before, phase: "pending" });
    try {
      if (onCompact) {
        await onCompact(partId);
      } else {
        await new Promise<void>(resolve => { timer.current = setTimeout(resolve, compactDuration); });
        timer.current = null;
        setCompacted(previous => new Map(previous).set(partId, { before, after: Math.floor(before * compactShare) }));
      }
      setCompaction({ partId, before, phase: "done" });
    } catch {
      setCompaction({ partId, before, phase: "error" });
    } finally {
      working.current = false;
    }
  }

  return <>
    <style href={contextWindowStyleHref} precedence="kalos">{contextWindowCss}</style>
    <KalosCard
      className={cn("kalos-context-window", className)}
      role="group" aria-labelledby={titleId}
      onPointerDownCapture={() => setFocused(null)}
      title={<span id={titleId}>{title}</span>}
      action={model ? <span className="kalos-context-model" title={model}>
        {modelIcon ? <span className="kalos-context-model-icon" aria-hidden="true">{modelIcon}</span> : null}
        <span className="kalos-context-label">{model}</span>
      </span> : undefined}
      footer={<div className="kalos-context-footer">
        <span className="kalos-context-sr" role="status">{status}</span>
        <ContextSwap
          className="kalos-context-share"
          prefix={showShare ? highlighted.label : undefined}
          text={showShare ? ` · 占容量 ${highlightedShare}%` : status}
          warning={!compaction && !showShare ? level : undefined}
          phase={compaction?.phase}
        />
        <span className="kalos-context-sr" role="status">{removal}</span>
        {action ? <KalosButton type="button" size="sm" variant="outline" onClick={action.onClick}>
          {action.label}{action.icon ? <span data-icon="inline-end" aria-hidden="true">{action.icon}</span> : null}
        </KalosButton> : null}
      </div>}
    >
      <div className="kalos-context-meter" data-level={level}>
        <div className="kalos-context-summary">
          <div className="kalos-context-totals" aria-hidden="true">
            <ContextCount value={highlighted?.count ?? used} />
            <ContextSwap text={highlighted?.label ?? `/ ${tokenFormat.format(capacity)} tokens`} />
          </div>
          <span className="kalos-context-percent" aria-hidden="true">{percent}%</span>
          <span className="kalos-context-sr">
            已使用 {exactTokenFormat.format(used)} tokens，容量 {exactTokenFormat.format(capacity)} tokens，占用 {percent}%
          </span>
        </div>
        <div
          className="kalos-context-grid" aria-hidden="true"
          data-highlighting={active !== null || undefined}
          style={{ "--kc-columns": columnCount, "--kc-narrow-columns": Math.min(columnCount, narrowColumns) } as CSSProperties}
          onPointerMove={event => {
            if (event.pointerType !== "touch" && event.target instanceof HTMLElement) {
              const part = event.target.dataset.part ?? null;
              if (part !== hovered) setHovered(part);
            }
          }}
          onPointerLeave={() => setHovered(null)}
        >
          {tiles.map((part, index) => (
            <span
              key={index}
              data-part={part?.id}
              data-active={!!part && part.id === active || undefined}
              data-compacting={!!part && part.id === pending || undefined}
              style={{ "--kc-cell": part?.cellColor, "--kc-stagger": index % 16 } as CSSProperties}
            />
          ))}
        </div>
      </div>
      {groups.length ? <ul className="kalos-context-parts">
        {groups.map(part => <ContextPartRow
          key={part.id} part={part} active={part.id === active}
          dimmed={!!highlighted && part.id !== active}
          busy={pending !== null} pending={pending === part.id} done={compaction?.partId === part.id && compaction.phase === "done" && !part.canCompact}
          onHover={setHovered} onFocus={setFocused} onRemove={removeItem} onCompact={compact}
        />)}
      </ul> : null}
    </KalosCard>
  </>;
}

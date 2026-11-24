"use client";

import { Collapsible } from "@base-ui/react/collapsible";
import { Tooltip } from "@base-ui/react/tooltip";
import { ChevronDown, FileText, Globe } from "lucide-react";
import { useEffect, useEffectEvent, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { thinkingStateCss, thinkingStateDefaults, thinkingStateStyleHref } from "@/components/ui/kalos-thinking-state-styles";

export type ThinkingSource = {
  label: string;
  href?: string;
  icon?: ReactNode;
  tooltip?: string;
};

export type ThinkingStep =
  | { kind: "search"; label: string; activeLabel?: string; sources?: readonly ThinkingSource[]; moreSources?: readonly ThinkingSource[] }
  | { kind: "step"; label: string };

export type KalosThinkingStateProps = {
  steps: readonly ThinkingStep[];
  doneLabel?: string;
  stepMs?: number;
  loop?: boolean;
  collapseOnDone?: boolean;
  onDone?: (seconds: number) => void;
  locale?: "zh-CN" | "en-US";
  className?: string;
};

const labels = {
  "zh-CN": {
    thinking: "正在思考", worked: "思考用时", done: "思考完成",
    time: (seconds: number) => `${seconds} 秒`,
    more: (count: number) => `+${count} 个来源`, less: "收起来源",
  },
  "en-US": {
    thinking: "Thinking", worked: "Worked for", done: "Finished thinking",
    time: (seconds: number) => `${seconds}s`,
    more: (count: number) => `+${count} more`, less: "Show fewer sources",
  },
};

const initialProgress = { cycle: 0, visible: 0, seconds: 0, done: false };

function SearchNode() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.2 21a9 9 0 1 1 8.7-10.3M3.7 8.7h15.8M4.8 16h4.1M12 3C8.2 6.8 7.6 16.3 12 21m0-18c1.6 1.9 2.6 4.4 2.9 7" />
    <circle cx="16.3" cy="15.9" r="3.3" />
    <path d="m18.7 18.3 2.8 2.8" />
  </svg>;
}

function SourceChip({ source, index, container }: {
  source: ThinkingSource;
  index: number;
  container: Tooltip.Portal.Props["container"];
}) {
  const tooltipId = useId();
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const address = source.href?.replace(/^https?:\/\//i, "").replace(/\/$/, "");
  const tooltip = source.tooltip ?? (address || source.href);
  const style = { "--kts-chip-index": index } as CSSProperties;
  const content = <>
    <span className="kalos-thinking-source-icon" data-brand={source.icon ? "" : undefined} aria-hidden="true">
      {source.icon ?? (source.href ? <Globe /> : <FileText />)}
    </span>
    <span>{source.label}</span>
  </>;
  const chip = source.href
    ? <a className="kalos-thinking-chip" style={style} href={source.href} target="_blank" rel="noreferrer">{content}</a>
    : <span className="kalos-thinking-chip" style={style} tabIndex={tooltip ? 0 : undefined}>{content}</span>;

  return tooltip ? <Tooltip.Root onOpenChange={setTooltipOpen}>
    <Tooltip.Trigger render={chip} aria-describedby={tooltipOpen ? tooltipId : undefined} />
    <Tooltip.Portal container={container}>
      <Tooltip.Positioner className="kalos-thinking-tooltip-positioner" side="top" sideOffset={6} collisionPadding={8}>
        <Tooltip.Popup className="kalos-thinking-tooltip" id={tooltipId} role="tooltip">{tooltip}</Tooltip.Popup>
      </Tooltip.Positioner>
    </Tooltip.Portal>
  </Tooltip.Root> : chip;
}

function SearchSources({ sources = [], moreSources = [], copy, container }: {
  sources?: readonly ThinkingSource[];
  moreSources?: readonly ThinkingSource[];
  copy: (typeof labels)[keyof typeof labels];
  container: Tooltip.Portal.Props["container"];
}) {
  const [expanded, setExpanded] = useState(false);
  const moreId = useId();
  if (!sources.length && !moreSources.length) return null;

  return <div className="kalos-thinking-sources">
    {sources.map((source, index) => <SourceChip key={index} source={source} index={index} container={container} />)}
    {moreSources.length ? <>
      <div className="kalos-thinking-extra" id={moreId} hidden={!expanded}>
        {expanded ? moreSources.map((source, index) => <SourceChip key={index} source={source} index={index} container={container} />) : null}
      </div>
      <button
        type="button"
        className="kalos-thinking-chip kalos-thinking-more"
        style={{ "--kts-chip-index": sources.length } as CSSProperties}
        aria-controls={moreId}
        aria-expanded={expanded}
        onClick={() => setExpanded(value => !value)}
      >{expanded ? copy.less : copy.more(moreSources.length)}</button>
    </> : null}
  </div>;
}

export function KalosThinkingState({
  steps,
  doneLabel,
  stepMs = thinkingStateDefaults.stepMs,
  loop = false,
  collapseOnDone = false,
  onDone,
  locale = "zh-CN",
  className,
}: KalosThinkingStateProps) {
  const [cycle, setCycle] = useState(0);
  const [progress, setProgress] = useState(initialProgress);
  const [open, setOpen] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const autoCollapsed = useRef(false);
  const { visible, seconds, done } = progress.cycle === cycle ? progress : initialProgress;
  const copy = labels[locale];

  const getTiming = useEffectEvent(() => {
    const delay = Number.isFinite(stepMs) ? Math.max(0, stepMs) : thinkingStateDefaults.stepMs;
    const searchLead = steps[0]?.kind === "search" ? Math.min(thinkingStateDefaults.searchLead, delay * 0.6) : 0;
    return { delay, searchLead };
  });

  const advance = useEffectEvent((startedAt: number, currentCycle: number, { delay, searchLead }: ReturnType<typeof getTiming>) => {
    const elapsed = performance.now() - startedAt;
    const revealed = delay ? 1 + Math.floor(Math.max(0, elapsed - searchLead) / delay) : steps.length + 1;
    const completed = !steps.length || revealed > steps.length;
    const seconds = Math.floor(elapsed / 1000);
    setProgress({ cycle: currentCycle, visible: Math.min(steps.length, revealed), seconds, done: completed });

    if (completed) {
      onDone?.(seconds);
      return null;
    }

    const nextStep = searchLead + revealed * delay;
    const nextSecond = (seconds + 1) * 1000;
    return Math.max(1, Math.ceil(Math.min(nextStep, nextSecond) - elapsed));
  });

  useEffect(() => {
    const startedAt = performance.now();
    const timing = getTiming();
    const tick = () => {
      const wait = advance(startedAt, cycle, timing);
      if (wait !== null) timer = window.setTimeout(tick, wait);
    };
    let timer = window.setTimeout(tick, 0);
    return () => window.clearTimeout(timer);
  }, [cycle]);

  const collapse = useEffectEvent(() => {
    if (!open) return;
    if (panelRef.current?.contains(document.activeElement)) triggerRef.current?.focus();
    autoCollapsed.current = true;
    setOpen(false);
  });

  useEffect(() => {
    if (!done || !collapseOnDone) return;
    const timer = window.setTimeout(() => collapse(), thinkingStateDefaults.autoCollapseDelay);
    return () => window.clearTimeout(timer);
  }, [cycle, done, collapseOnDone]);

  useEffect(() => {
    if (!done || !loop) return;
    const timer = window.setTimeout(() => {
      if (panelRef.current?.contains(document.activeElement)) triggerRef.current?.focus();
      if (autoCollapsed.current) setOpen(true);
      autoCollapsed.current = false;
      setCycle(current => current + 1);
    }, thinkingStateDefaults.loopDelay);
    return () => window.clearTimeout(timer);
  }, [cycle, done, loop]);

  const time = copy.time(seconds);
  return <Collapsible.Root
    ref={rootRef}
    className={cn("kalos-thinking-state", className)}
    data-state={done ? "done" : "thinking"}
    open={open}
    onOpenChange={next => {
      autoCollapsed.current = false;
      setOpen(next);
    }}
  >
    <style href={thinkingStateStyleHref} precedence="kalos">{thinkingStateCss}</style>
    <Collapsible.Trigger
      ref={triggerRef}
      className="kalos-thinking-header"
      aria-label={done ? `${copy.worked} ${time}` : copy.thinking}
    >
      <svg className="kalos-thinking-mark" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        {Array.from({ length: 9 }, (_, index) => <rect
          key={index}
          x={2.5 + index % 3 * 4}
          y={2.5 + Math.floor(index / 3) * 4}
          width="3"
          height="3"
          rx=".75"
        />)}
      </svg>
      {done
        ? <span key="total" className="kalos-thinking-header-copy">{copy.worked} {time}</span>
        : <span key="live" className="kalos-thinking-header-copy">
          <span className="kalos-thinking-heading" data-shimmer={copy.thinking}>{copy.thinking}</span>
          <span className="kalos-thinking-time" aria-hidden="true">{time}</span>
        </span>}
      <ChevronDown className="kalos-thinking-chevron" aria-hidden="true" />
    </Collapsible.Trigger>
    <Collapsible.Panel
      ref={panelRef}
      className="kalos-thinking-panel"
      inert={!open}
      keepMounted
      render={({ hidden, ...panelProps }) => <div {...panelProps} data-fold-hidden={hidden || undefined} />}
    >
      <Tooltip.Provider delay={250} timeout={200}>
        <ol key={cycle} className="kalos-thinking-timeline" aria-live="polite" aria-relevant="additions">
          {steps.slice(0, visible).map((step, index) => {
            const active = !done && index === visible - 1;
            const label = active && step.kind === "search" ? step.activeLabel ?? step.label : step.label;
            return <li key={index} className="kalos-thinking-row" data-active={active ? "" : undefined}>
              <span className="kalos-thinking-node" aria-hidden="true">
                {step.kind === "search" ? <SearchNode /> : <i />}
              </span>
              <div className="kalos-thinking-step">
                <span className="kalos-thinking-label" data-shimmer={active ? label : undefined} dir="auto">{label}</span>
                {step.kind === "search" ? <SearchSources sources={step.sources} moreSources={step.moreSources} copy={copy} container={rootRef} /> : null}
              </div>
            </li>;
          })}
          {done ? <li className="kalos-thinking-row kalos-thinking-done">
            <span className="kalos-thinking-node" aria-hidden="true">
              <svg viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6.5" fill="currentColor" />
                <path d="m5 8.1 1.9 1.9 4-4.1" pathLength="1" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span dir="auto">{doneLabel ?? copy.done}</span>
          </li> : null}
        </ol>
      </Tooltip.Provider>
    </Collapsible.Panel>
  </Collapsible.Root>;
}

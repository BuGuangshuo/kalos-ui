"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import type { CSSProperties, KeyboardEvent, PointerEvent, RefObject } from "react";
import { usageMeterDefaults } from "./kalos-usage-meter-styles";

export const meterText = {
  "en-US": {
    periods: "Usage period",
    daily: "Daily usage",
    limits: "Plan limits",
    of: "of",
    upcoming: "Upcoming",
    averageLabel: "Avg",
    averageUnit: "/ day",
    reset: (date: string) => `Resets ${date}`,
    resetIn: (days: number) => `Resets in ${days} ${days === 1 ? "day" : "days"}`,
    resetToday: "Resets today",
    resetPast: (date: string) => `Reset on ${date}`,
    remaining: (amount: string) => `${amount} left`,
    warn: (amount: string) => `Running low · ${amount} left`,
    limit: "Usage limit reached",
    over: (amount: string) => `${amount} over the limit`,
    unlimited: "unlimited",
    limitWarn: "Nearing limit",
    limitReached: "Limit reached",
    topUp: "Add credits",
  },
  "zh-CN": {
    periods: "统计周期",
    daily: "每日用量",
    limits: "套餐限制",
    of: "/",
    upcoming: "待统计",
    averageLabel: "日均",
    averageUnit: "",
    reset: (date: string) => `${date}重置`,
    resetIn: (days: number) => `${days} 天后重置`,
    resetToday: "今天重置",
    resetPast: (date: string) => `已于${date}重置`,
    remaining: (amount: string) => `剩余 ${amount}`,
    warn: (amount: string) => `额度不足 · 剩余 ${amount}`,
    limit: "已达用量上限",
    over: (amount: string) => `已超出 ${amount}`,
    unlimited: "无限",
    limitWarn: "接近上限",
    limitReached: "已达上限",
    topUp: "购买额度",
  },
};

export type UsageMeterLocale = keyof typeof meterText;
export type UsageDay = { label: string; value: number | null };

export function usageAmount(value: number) {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

export function AnimatedUsageAmount({ value, format, className }: {
  value: number;
  format: Intl.NumberFormat;
  className?: string;
}) {
  const element = useRef<HTMLSpanElement>(null);
  const displayed = useRef(0);

  useLayoutEffect(() => {
    const node = element.current;
    if (!node || displayed.current === value) return;
    const from = displayed.current;
    const start = performance.now();
    const decimals = format.formatToParts(value).find((part) => part.type === "fraction")?.value.length ?? 0;
    const factor = 10 ** decimals * (format.resolvedOptions().style === "percent" ? 100 : 1);
    let frame = 0;
    const paint = (now: number) => {
      const progress = Math.min(1, (now - start) / usageMeterDefaults.countDuration);
      const eased = progress < 0.5 ? 2 * progress ** 2 : 1 - 2 * (1 - progress) ** 2;
      displayed.current = progress === 1 ? value : from + (value - from) * eased;
      const scaled = displayed.current * factor;
      const visible = Number.isFinite(scaled) ? Math.round(scaled) / factor : displayed.current;
      node.textContent = format.format(visible);
      if (progress < 1) frame = requestAnimationFrame(paint);
    };
    paint(start);
    return () => cancelAnimationFrame(frame);
  }, [value, format]);

  return <span ref={element} className={className} aria-hidden="true">{format.format(value)}</span>;
}

const dayInMs = 86_400_000;
const getUtcDay = () => Math.floor(Date.now() / dayInMs);
const getServerDay = () => null;

function subscribeToUtcDay(callback: () => void) {
  const timer = window.setInterval(callback, 30_000);
  document.addEventListener("visibilitychange", callback);
  return () => {
    window.clearInterval(timer);
    document.removeEventListener("visibilitychange", callback);
  };
}

export function UsageResetDate({ value, locale }: {
  value: Date | string | number;
  locale: UsageMeterLocale;
}) {
  const currentDay = useSyncExternalStore(subscribeToUtcDay, getUtcDay, getServerDay);
  const date = new Date(value instanceof Date ? value.getTime() : value);
  if (!Number.isFinite(date.getTime())) return null;

  const text = meterText[locale];
  const absolute = new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeZone: "UTC" }).format(date);
  const days = currentDay === null ? null : Math.floor(date.getTime() / dayInMs) - currentDay;
  let label = text.reset(absolute);
  if (days === 0) label = text.resetToday;
  if (days !== null && days > 0) label = text.resetIn(days);
  if (days !== null && days < 0) label = text.resetPast(absolute);

  return <time className="kum-reset" dateTime={date.toISOString()} title={absolute}>{label}</time>;
}

type ReadoutSource = "hover" | "focus";

export function useUsageReadout<Item extends string | number>(
  items: readonly Item[],
  period: string | undefined,
  container: RefObject<HTMLDivElement | null>,
  target: RefObject<HTMLDivElement | null>,
) {
  const [selection, setSelection] = useState<{ item: Item; period?: string; source: ReadoutSource | null }>();
  const item = selection?.period === period ? selection?.item : undefined;
  const index = item === undefined ? -1 : items.indexOf(item);
  const isOpen = index >= 0 && Boolean(selection?.source);
  const isPinned = isOpen && selection?.source === "focus";

  const close = useCallback(() => {
    setSelection((current) => current?.source ? { ...current, source: null } : current);
  }, []);

  useEffect(() => {
    if (!isPinned) return;
    function dismissOutside(event: globalThis.PointerEvent) {
      if (event.target instanceof Node && !container.current?.contains(event.target)) close();
    }
    document.addEventListener("pointerdown", dismissOutside);
    return () => document.removeEventListener("pointerdown", dismissOutside);
  }, [close, container, isPinned]);

  return {
    index,
    isOpen,
    hover(item: Item, event: PointerEvent) {
      if (event.pointerType !== "touch") setSelection({ item, period, source: "hover" });
    },
    select(item: Item) {
      target.current?.focus({ preventScroll: true });
      setSelection({ item, period, source: "focus" });
    },
    leave() {
      setSelection((current) => current?.source === "hover" ? { ...current, source: null } : current);
    },
    close,
    onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.key === "Escape" && isOpen) {
        event.preventDefault();
        event.stopPropagation();
        close();
        return;
      }
      if (!items.length || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const direction = getComputedStyle(event.currentTarget).direction === "rtl" ? -1 : 1;
      let next = 0;
      if (event.key === "End") next = items.length - 1;
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        const delta = (event.key === "ArrowRight" ? 1 : -1) * direction;
        next = isOpen
          ? Math.max(0, Math.min(items.length - 1, index + delta))
          : delta > 0 ? 0 : items.length - 1;
      }
      setSelection({ item: items[next], period, source: "focus" });
    },
  };
}

export function UsageCategoryReadout({ label, value, share, color, at, open }: {
  label: string;
  value: string;
  share: string;
  color?: string;
  at: number;
  open: boolean;
}) {
  const style = { "--kum-anchor": `${at}%`, "--kum-series": color } as CSSProperties;
  return <>
    <div className="kum-readout" data-open={open || undefined} style={style} aria-hidden="true">
      <span className="kum-readout-label">
        <span className="kum-swatch" />
        <span className="kum-label">{label}</span>
      </span>
      <span className="kum-readout-data">
        <strong className="kum-value">{value}</strong>
        <span className="kum-value">· {share}</span>
      </span>
    </div>
    <span className="kum-sr-only" role="status" aria-atomic="true">{open ? `${label} · ${value} · ${share}` : ""}</span>
  </>;
}

export function UsageDailyChart({ days, period, format, locale, unit }: {
  days: readonly UsageDay[];
  period?: string;
  format: Intl.NumberFormat;
  locale: UsageMeterLocale;
  unit: string;
}) {
  const text = meterText[locale];
  const dates = days.map((_, index) => index);
  const container = useRef<HTMLDivElement>(null);
  const plot = useRef<HTMLDivElement>(null);
  const readout = useUsageReadout(dates, period, container, plot);
  const { maximum, count, sum, hasFraction } = days.reduce((stats, day) => {
    if (day.value === null) return stats;
    const value = usageAmount(day.value);
    stats.maximum = Math.max(stats.maximum, value);
    stats.count += 1;
    stats.sum += value;
    stats.hasFraction ||= !Number.isInteger(value);
    return stats;
  }, { maximum: 1, count: 0, sum: 0, hasFraction: false });
  const average = count > 0 ? (hasFraction ? sum / count : Math.round(sum / count)) : 0;
  const inspected = readout.isOpen ? days[readout.index] : undefined;
  const upcoming = inspected?.value === null;
  const value = inspected?.value == null ? average : usageAmount(inspected.value);
  const spoken = inspected
    ? `${inspected.label} · ${upcoming ? text.upcoming : [format.format(value), unit].filter(Boolean).join(" ")}`
    : "";

  return <div className="kum-chart" ref={container}>
    <div className="kum-chart-heading">
      <span>{text.daily}</span>
      {(count > 0 || inspected) && <span
        key={inspected ? readout.index : `average-${period ?? ""}`}
        className="kum-chart-average"
        aria-hidden="true"
      >
        <span className="kum-label">{inspected ? `${inspected.label} ·` : text.averageLabel}</span>
        {upcoming ? <span className="kum-chart-current">—</span> : <span className="kum-chart-current">
          <span>{format.format(value)}</span>
          <span>{inspected ? unit : text.averageUnit}</span>
        </span>}
      </span>}
    </div>
    <div className="kum-plot kum-meter-control" role="group" aria-label={text.daily}
      tabIndex={0} ref={plot} onKeyDown={readout.onKeyDown} onBlur={readout.close}
      onPointerLeave={readout.leave} data-inspecting={readout.isOpen || undefined}>
      {days.map((day, index) => {
        const share = day.value === null ? 0.05 : Math.max(0.05, usageAmount(day.value) / maximum);
        return <span
          key={index}
          className="kum-day"
          aria-hidden="true"
          data-upcoming={day.value === null || undefined}
          data-active={readout.isOpen && readout.index === index || undefined}
          onPointerEnter={(event) => readout.hover(index, event)}
          onClick={() => readout.select(index)}
        >
          <span className="kum-day-bar" style={{ "--kum-day-share": share } as CSSProperties} />
        </span>;
      })}
    </div>
    <span className="kum-sr-only" role="status" aria-atomic="true">{spoken}</span>
  </div>;
}

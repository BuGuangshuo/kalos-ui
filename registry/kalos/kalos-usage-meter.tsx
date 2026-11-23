"use client";

import { Meter } from "@base-ui/react/meter";
import { useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { KalosButton } from "./kalos-button";
import { KalosSegmentedControl } from "./kalos-segmented-control";
import {
  AnimatedUsageAmount,
  meterText,
  UsageCategoryReadout,
  UsageDailyChart,
  UsageResetDate,
  usageAmount,
  useUsageReadout,
  type UsageDay,
  type UsageMeterLocale,
} from "@/components/ui/kalos-usage-meter-details";
import {
  usageMeterCss,
  usageMeterDefaults,
  usageMeterStyleHref,
} from "@/components/ui/kalos-usage-meter-styles";

export type { UsageDay, UsageMeterLocale } from "@/components/ui/kalos-usage-meter-details";

export type UsageCategory = { label: string; value: number; color?: string };
export type UsageLimit = { label: string; used: number; total?: number | null; unit?: string; decimals?: number };
export type UsagePeriod = { id: string; label: string };
export type UsageMeterState = "ok" | "warn" | "limit";

export interface KalosUsageMeterProps {
  total: number;
  used: readonly UsageCategory[];
  limits?: readonly UsageLimit[];
  periods?: readonly UsagePeriod[];
  period?: string;
  defaultPeriod?: string;
  onPeriodChange?: (id: string) => void;
  resetAt?: Date | string | number;
  daily?: readonly UsageDay[];
  onUpgrade?: (state: UsageMeterState) => void;
  title?: string;
  plan?: string;
  unit?: string;
  warnAt?: number;
  upgradeLabel?: string;
  topUpLabel?: string;
  locale?: UsageMeterLocale;
  className?: string;
}

const seriesColors = ["base-chart-1", "base-chart-2", "base-chart-3", "base-chart-4", "series-five"];

function usageShare(value: number, total: number) {
  return total > 0 ? value / total : Number(value > 0);
}

function usageState(value: number, total: number, warnAt: number): UsageMeterState {
  if (value === 0) return "ok";
  if (value >= total) return "limit";
  return usageShare(value, total) >= warnAt ? "warn" : "ok";
}

function withUnit(value: string, unit: string) {
  return unit ? `${value}\u00a0${unit}` : value;
}

function UsagePlanLimit({ limit, warnAt, locale }: { limit: UsageLimit; warnAt: number; locale: UsageMeterLocale }) {
  const text = meterText[locale];
  const amount = usageAmount(limit.used);
  const total = limit.total == null ? null : usageAmount(limit.total);
  const state = total === null ? "ok" : usageState(amount, total, warnAt);
  const precision = limit.decimals === undefined ? undefined : Math.min(20, Math.trunc(usageAmount(limit.decimals)));
  const number = new Intl.NumberFormat(locale, {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  });
  const unit = limit.unit ?? "";
  const totalText = withUnit(total === null ? "∞" : number.format(total), unit);
  const visible = `${number.format(amount)} ${text.of} ${totalText}`;
  let spoken = total === null ? `${withUnit(number.format(amount), unit)} · ${text.unlimited}` : visible;
  if (state !== "ok") spoken += ` · ${state === "warn" ? text.limitWarn : text.limitReached}`;

  return <li>
    <Meter.Root
      className="kum-limit"
      aria-label={limit.label}
      aria-valuetext={spoken}
      value={amount}
      max={total ?? Math.max(1, amount)}
      data-usage-state={state}
    >
      <span className="kum-limit-labels" aria-hidden="true">
        <span className="kum-limit-name">
          <span className="kum-label" title={limit.label}>{limit.label}</span>
          {state !== "ok" && <span className="kum-limit-state" title={state === "warn" ? text.limitWarn : text.limitReached} />}
        </span>
        <span className="kum-limit-value kum-value">
          <strong>{number.format(amount)}</strong> {text.of} {totalText}
        </span>
      </span>
      <Meter.Track className="kum-track kum-limit-track" data-unlimited={total === null || undefined} aria-hidden="true">
        {total !== null && <span
          className="kum-limit-fill"
          style={{ "--kum-share": `${Math.min(1, usageShare(amount, total)) * 100}%` } as CSSProperties}
        />}
      </Meter.Track>
    </Meter.Root>
  </li>;
}

export function KalosUsageMeter({
  total: rawTotal,
  used,
  limits,
  periods,
  period,
  defaultPeriod,
  onPeriodChange,
  resetAt,
  daily,
  onUpgrade,
  title,
  plan,
  unit,
  warnAt: rawWarnAt = usageMeterDefaults.warnAt,
  upgradeLabel,
  topUpLabel,
  locale = "en-US",
  className,
}: KalosUsageMeterProps) {
  const headingId = useId();
  const bodyFrame = useRef<HTMLDivElement>(null);
  const bodyContent = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const frame = bodyFrame.current;
    const content = bodyContent.current;
    if (!frame || !content) return;

    const syncHeight = () => {
      frame.style.blockSize = `${content.getBoundingClientRect().height}px`;
    };
    syncHeight();
    const observer = new ResizeObserver(syncHeight);
    observer.observe(content);
    return () => observer.disconnect();
  }, []);

  const text = meterText[locale];
  const localizedTitle = title ?? (locale === "zh-CN" ? "用量" : "Usage");
  const localizedUnit = unit ?? (locale === "zh-CN" ? "积分" : "credits");
  const formatter = useMemo(() => new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }), [locale]);
  const percent = useMemo(() => new Intl.NumberFormat(locale, { style: "percent" }), [locale]);
  const [innerPeriod, setInnerPeriod] = useState(defaultPeriod);
  const selectedPeriod = period ?? (periods?.some(({ id }) => id === innerPeriod) ? innerPeriod : periods?.[0]?.id);
  const total = usageAmount(rawTotal);
  const warnAt = Number.isFinite(rawWarnAt) ? Math.min(1, Math.max(0, rawWarnAt)) : usageMeterDefaults.warnAt;

  const categories = new Map<string, UsageCategory>();
  for (const category of used) {
    const previous = categories.get(category.label);
    categories.set(category.label, {
      label: category.label,
      value: Math.min(Number.MAX_VALUE, (previous?.value ?? 0) + usageAmount(category.value)),
      color: category.color ?? previous?.color,
    });
  }
  const labels = [...categories.keys()];
  const [registeredLabels, setRegisteredLabels] = useState(labels);
  const newLabels = labels.filter((label) => !registeredLabels.includes(label));
  const series = newLabels.length ? [...registeredLabels, ...newLabels] : registeredLabels;
  if (series !== registeredLabels) setRegisteredLabels(series);

  const amount = [...categories.values()].reduce((sum, category) => Math.min(Number.MAX_VALUE, sum + category.value), 0);
  const orderedLabels = series.filter((label) => categories.has(label));
  const breakdown = useRef<HTMLDivElement>(null);
  const meter = useRef<HTMLDivElement>(null);
  const readout = useUsageReadout(orderedLabels, selectedPeriod, breakdown, meter);
  const inspectedLabel = orderedLabels[readout.index];
  const inspected = inspectedLabel === undefined ? undefined : categories.get(inspectedLabel);
  const scale = Math.max(amount, total);
  const segments: { label: string; anchor: number; width: number; color: string }[] = [];
  let offset = 0;
  for (const [index, label] of series.entries()) {
    const category = categories.get(label);
    const width = Math.max(0, Math.min(100 - offset, usageShare(category?.value ?? 0, scale) * 100));
    segments.push({
      label,
      anchor: offset + width / 2,
      width,
      color: category?.color ?? `var(--kum-${seriesColors[Math.min(index, seriesColors.length - 1)]})`,
    });
    offset += width;
  }

  const state = usageState(amount, total, warnAt);
  const statusAmount = Math.abs(total - amount);
  const formattedStatusAmount = formatter.format(statusAmount);
  const statusValue = withUnit(formattedStatusAmount, localizedUnit);
  let status = text.remaining(statusValue);
  if (state === "warn") status = text.warn(statusValue);
  if (state === "limit") status = statusAmount > 0 ? text.over(statusValue) : text.limit;
  const statusNumberStart = status.indexOf(formattedStatusAmount);
  const totalText = withUnit(formatter.format(total), localizedUnit);
  const share = Math.min(1, usageShare(amount, total));
  const canInspect = labels.length > 0;
  const inspectedSegment = segments.find(({ label }) => label === inspectedLabel);
  return <section className={cn("kalos-usage-meter", className)} aria-labelledby={headingId} data-slot="usage-meter">
    <style href={usageMeterStyleHref} precedence="kalos-component">{usageMeterCss}</style>
    <div className="kum-body" ref={bodyFrame}>
      <div className="kum-card" ref={bodyContent}>
        <header className="kum-header">
          <div className="kum-heading">
            <h3 className="kum-title" id={headingId} title={localizedTitle}>{localizedTitle}</h3>
            {(plan || resetAt != null) && <div className="kum-plan">
              {plan && <span>{plan}</span>}
              {resetAt != null && <UsageResetDate value={resetAt} locale={locale} />}
            </div>}
          </div>
          {!!periods?.length && <div className="kum-periods">
            <KalosSegmentedControl
              options={periods.map(({ id, label }) => ({ value: id, label }))}
              value={selectedPeriod}
              onChange={(id) => {
                if (period === undefined) setInnerPeriod(id);
                onPeriodChange?.(id);
              }}
              size="md"
              variant="buttons"
              aria-label={text.periods}
            />
          </div>}
        </header>

        <div className="kum-summary" data-usage-state={state} aria-hidden="true">
          <div className="kum-total">
            <AnimatedUsageAmount value={amount} format={formatter} className="kum-number kum-value" />
            <span className="kum-reference kum-value">{text.of} {totalText}</span>
          </div>
          <span className="kum-percent">
            {state !== "ok" && <span className="kum-status-dot" />}
            <AnimatedUsageAmount value={share} format={percent} />
          </span>
        </div>

        <div className="kum-breakdown" ref={breakdown} onPointerLeave={readout.leave}
          data-inspecting={readout.isOpen || undefined}>
          <Meter.Root
            className="kum-meter-control"
            aria-label={localizedTitle}
            aria-valuetext={`${formatter.format(amount)} ${text.of} ${totalText}`}
            value={amount}
            max={total}
            ref={meter}
            tabIndex={canInspect ? 0 : undefined}
            onKeyDown={readout.onKeyDown}
            onBlur={readout.close}
          >
            <Meter.Track className="kum-track kum-main-track" aria-hidden="true">
              {segments.map(({ label, width, color }) => <span
                key={label}
                className="kum-segment"
                data-active={readout.isOpen && label === inspectedLabel || undefined}
                data-empty={width === 0 || undefined}
                style={{ "--kum-share": `${width}%`, "--kum-series": color } as CSSProperties}
                onPointerEnter={(event) => readout.hover(label, event)}
                onClick={() => readout.select(label)}
              />)}
            </Meter.Track>
          </Meter.Root>
          {canInspect && <ul className="kum-legend">
            {segments.map(({ label, color }) => {
              const category = categories.get(label);
              if (!category) return null;
              const categoryShare = usageShare(category.value, amount);
              return <li key={label}>
                <button type="button" className="kum-legend-item" tabIndex={-1}
                  aria-label={`${label} · ${withUnit(formatter.format(category.value), localizedUnit)} · ${percent.format(categoryShare)}`}
                  data-active={readout.isOpen && label === inspectedLabel || undefined}
                  onPointerEnter={(event) => readout.hover(label, event)}
                  onClick={() => readout.select(label)}
                >
                  <span className="kum-swatch" aria-hidden="true" style={{ "--kum-series": color } as CSSProperties} />
                  <span className="kum-label" title={label}>{label}</span>
                  <AnimatedUsageAmount className="kum-value" value={category.value} format={formatter} />
                  <AnimatedUsageAmount className="kum-value kum-legend-share" value={categoryShare} format={percent} />
                </button>
              </li>;
            })}
          </ul>}
          <UsageCategoryReadout
            label={inspected?.label ?? ""}
            value={inspected ? withUnit(formatter.format(inspected.value), localizedUnit) : ""}
            share={inspected ? percent.format(usageShare(inspected.value, amount)) : ""}
            color={inspectedSegment?.color}
            at={inspectedSegment?.anchor ?? 50}
            open={readout.isOpen}
          />
        </div>

        {!!daily?.length && <UsageDailyChart days={daily} period={selectedPeriod} format={formatter} locale={locale} unit={localizedUnit} />}
        {!!limits?.length && <ul className="kum-limits" aria-label={text.limits}>
          {limits.map((limit) => <UsagePlanLimit key={limit.label} limit={limit} warnAt={warnAt} locale={locale} />)}
        </ul>}

      </div>
    </div>
    <footer className="kum-footer" data-usage-state={state}>
      <span className="kum-status" role="status" aria-atomic="true">
        {state !== "ok" && <span className="kum-status-dot" aria-hidden="true" />}
        <span className="kum-status-label" aria-hidden="true">
          {statusNumberStart < 0 ? status : <>
            {status.slice(0, statusNumberStart)}
            <AnimatedUsageAmount value={statusAmount} format={formatter} />
            {status.slice(statusNumberStart + formattedStatusAmount.length)}
          </>}
        </span>
        <span className="kum-sr-only">{status}</span>
      </span>
      {onUpgrade && <KalosButton type="button" size="sm" onClick={() => onUpgrade(state)}>
        {(state === "ok" ? upgradeLabel : undefined) ?? topUpLabel ?? text.topUp}
      </KalosButton>}
    </footer>
  </section>;
}

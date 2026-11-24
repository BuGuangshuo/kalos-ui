"use client";

import { useId, useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";

export interface BreakdownRow {
  label: string;
  total: number;
  values: number[];
}

export interface BreakdownSeries {
  label: string;
  color: string;
}

interface BreakdownPlotProps {
  rows: readonly BreakdownRow[];
  series: readonly BreakdownSeries[];
  slice: { icons?: Readonly<Record<string, ReactNode>> };
  isSegmented: boolean;
  hidden: ReadonlySet<string>;
  unit: string;
  active: string | null;
  onInspect: (label: string | null) => void;
}

const format = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
const divisions = [5, 4, 3, 2, 1, 0];

function tickInterval(maximum: number) {
  if (maximum <= 0) return 1;
  const unrounded = maximum / 5;
  const magnitude = 10 ** Math.floor(Math.log10(unrounded));
  const fraction = unrounded / magnitude;
  const increment = [1, 2, 2.5, 5, 10].find(step => step >= fraction) ?? 10;
  return increment * magnitude;
}

export function BreakdownPlot({ rows, series, slice, isSegmented, hidden, unit, active, onInspect }: BreakdownPlotProps) {
  const plot = useRef<HTMLDivElement>(null);
  const tooltip = useRef<HTMLDivElement>(null);
  const pill = useRef<HTMLSpanElement>(null);
  const tooltipId = useId();
  const activeIndex = rows.findIndex(row => row.label === active);
  const inspected = rows[activeIndex];
  const interval = tickInterval(rows.reduce((max, row) => Math.max(max, row.total), 0));
  const gridStyle = { gridTemplateColumns: `repeat(${Math.max(1, rows.length)}, minmax(0, 1fr))` };
  const entries = series.map((item, index) => ({ ...item, index })).filter(item => !hidden.has(item.label));
  const details = inspected && isSegmented
    ? entries.filter(item => inspected.values[item.index] > 0).sort((a, b) => inspected.values[b.index] - inspected.values[a.index])
    : [];

  // The plot can use the card's side gutters for its callout and active label.
  // Measure the overlays themselves so custom icons and long labels fit too.
  useLayoutEffect(() => {
    const area = plot.current;
    const card = tooltip.current;
    const badge = pill.current;
    const frame = area?.parentElement;
    if (!area || !card || !badge || !frame || activeIndex < 0) return;
    const position = () => {
      const width = area.clientWidth;
      const center = width * (activeIndex + 0.5) / rows.length;
      const gutter = area.getBoundingClientRect().left - frame.getBoundingClientRect().left;
      const leftEdge = 4 - gutter;
      const rightEdge = frame.clientWidth - gutter - 4;
      const right = activeIndex < rows.length / 2;
      const idealLeft = right ? center + 18 : center - 18 - card.offsetWidth;
      card.style.left = Math.max(leftEdge, Math.min(idealLeft, rightEdge - card.offsetWidth)) + "px";

      const halfBadge = badge.offsetWidth / 2;
      const badgeCenter = Math.max(leftEdge + halfBadge, Math.min(center, rightEdge - halfBadge));
      badge.style.marginLeft = (badgeCenter - center) + "px";
    };
    position();
    const observer = new ResizeObserver(position);
    observer.observe(area);
    observer.observe(card);
    observer.observe(badge);
    return () => observer.disconnect();
  }, [activeIndex, rows.length]);

  return (
    <div className="kbc-chart" onPointerLeave={() => onInspect(null)}>
      <div className="kbc-plot" ref={plot}>
        {divisions.map(tick => (
          <span className="kbc-gridline" key={tick} data-baseline={tick === 0 || undefined} style={{ bottom: `${tick * 20}%` }} aria-hidden="true">
            <span className="kbc-tick">{format.format(tick * interval)}</span>
          </span>
        ))}
        <div className="kbc-bars" style={gridStyle}>
          {/* Preserve physical stack positions so regrouping animates from the previous view. */}
          {rows.map((row, column) => {
            const height = `${Math.max(0, row.total / interval * 20)}%`;
            const selected = row.label === active;
            return (
              <button className="kbc-column" type="button" key={column}
                aria-label={`${row.label}: ${format.format(row.total)} ${unit}`}
                aria-describedby={selected ? tooltipId : undefined}
                data-active={selected || undefined}
                data-dim={!!inspected && !selected || undefined}
                style={{ "--kbc-fill-height": height } as CSSProperties}
                onPointerEnter={event => { if (event.pointerType !== "touch") onInspect(row.label); }}
                onClick={() => onInspect(row.label)}
                onFocus={() => onInspect(row.label)} onBlur={() => onInspect(null)}>
                <span aria-hidden="true" className="kbc-rest" />
                <span aria-hidden="true" className="kbc-stack">
                  {entries.map(({ color, index }) => row.values[index] > 0 && (
                    <span className="kbc-stack-part" key={index} style={{ flexGrow: row.values[index], backgroundColor: color }} />
                  ))}
                </span>
              </button>
            );
          })}
        </div>
        {inspected && (
          <div ref={tooltip} id={tooltipId} className="kbc-tooltip" role="status">
            <p className="kbc-tip-heading">
              <span className="kbc-tip-label">{slice.icons?.[inspected.label]}<span dir="auto">{inspected.label}</span></span>
              <strong>{format.format(inspected.total)}</strong>
            </p>
            {details.length > 0 && (
              <ul>
                {details.map(({ label, color, index }) => (
                  <li key={label}>
                    <i className="kbc-swatch" style={{ backgroundColor: color }} />
                    <span className="kbc-tip-series" dir="auto">{label}</span>
                    <span className="kbc-tip-number">{format.format(inspected.values[index])}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
      <div className="kbc-xaxis" style={gridStyle} aria-hidden="true">
        {rows.map(({ label }, column) => (
          <span className="kbc-xlabel" key={column} title={label}
            onPointerEnter={event => { if (event.pointerType !== "touch") onInspect(label); }}>
            {active === label
              ? <span ref={pill} className="kbc-axis-pill">{slice.icons?.[label]}<span dir="auto">{label}</span></span>
              : slice.icons?.[label] ?? <span className="kbc-axis-text" dir="auto">{label}</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

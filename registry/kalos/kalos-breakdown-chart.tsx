"use client";

import { useId, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { cn } from "cn";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import { BreakdownPicker } from "@/components/ui/kalos-breakdown-picker";
import { BreakdownPlot, type BreakdownRow } from "@/components/ui/kalos-breakdown-plot";
import { breakdownChartCss, breakdownChartStyleHref, breakdownPalette } from "@/components/ui/kalos-breakdown-chart-styles";

export type BreakdownRecord = Record<string, unknown>;

export interface Dimension {
  key: string;
  label: string;
  values: readonly string[];
  colors?: Readonly<Record<string, string>>;
  icons?: Readonly<Record<string, ReactNode>>;
}

export interface Measure {
  key: string;
  label: string;
  unit: string;
  field?: string;
}

export interface KalosBreakdownChartProps {
  records: readonly BreakdownRecord[];
  dimensions: readonly Dimension[];
  measures: readonly Measure[];
  title?: string;
  defaultMeasure?: string;
  defaultSlice?: string;
  defaultSegment?: string;
  className?: string;
}

const noSegment = { key: "none", label: "None" };
const format = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

function groupRecords(records: readonly BreakdownRecord[], measure: Measure | undefined, slice: Dimension | undefined, segment: Dimension | undefined) {
  if (!measure || !slice) return [];
  const labels = slice.values;
  const groupIndex = new Map(labels.map((label, i) => [label, i]));
  const seriesIndex = new Map(segment?.values.map((label, i) => [label, i]));
  const groups = labels.map(label => ({
    label, values: Array<number>(segment ? segment.values.length : 1).fill(0),
  }));
  for (const record of records) {
    const row = groupIndex.get(String(record[slice.key]));
    const column = segment ? seriesIndex.get(String(record[segment.key])) : 0;
    if (row === undefined || column === undefined) continue;
    const amount = measure.field === undefined ? 1 : record[measure.field];
    if (typeof amount === "number" && Number.isFinite(amount)) groups[row].values[column] += amount;
  }
  return groups;
}

export function KalosBreakdownChart({
  records, dimensions, measures, title = "Workload", defaultMeasure, defaultSlice, defaultSegment, className,
}: KalosBreakdownChartProps) {
  const headingId = useId();
  const tableFrame = useRef<HTMLDivElement>(null);
  const tableScroll = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const frame = tableFrame.current;
    const content = tableScroll.current;
    if (!frame || !content) return;
    const measureHeight = () => { frame.style.height = content.offsetHeight + "px"; };
    measureHeight();
    const resize = new ResizeObserver(measureHeight);
    resize.observe(content);
    return () => resize.disconnect();
  }, []);
  const [measureKey, setMeasureKey] = useState(defaultMeasure);
  const [sliceKey, setSliceKey] = useState(defaultSlice);
  const [segmentKey, setSegmentKey] = useState(defaultSegment);
  const [excluded, setExcluded] = useState<ReadonlySet<string>>(() => new Set());
  const [active, setActive] = useState<string | null>(null);
  const measure = measures.find(item => item.key === measureKey) ?? measures[0];
  const slice = dimensions.find(item => item.key === sliceKey) ?? dimensions[0];
  const otherDimensions = dimensions.filter(item => item.key !== slice?.key);
  const segment = dimensions.find(item => item.key !== slice?.key && item.key !== noSegment.key
    && (segmentKey === undefined || item.key === segmentKey));
  const series = useMemo(() => segment ? segment.values.map((label, index) => ({
    label, color: segment.colors?.[label] ?? breakdownPalette[index % breakdownPalette.length],
  })) : [{ label: measure?.label ?? "", color: breakdownPalette[0] }], [segment, measure]);
  const groups = useMemo(() => groupRecords(records, measure, slice, segment), [records, measure, slice, segment]);
  const hidden = useMemo(() => {
    const keys = new Set(series.filter(item => segment && excluded.has(item.label)).map(item => item.label));
    if (keys.size === series.length) keys.clear();
    return keys;
  }, [series, segment, excluded]);
  const rows: BreakdownRow[] = useMemo(() => groups.map(row => ({
    ...row, total: row.values.reduce((sum, value, index) => sum + (hidden.has(series[index].label) ? 0 : value), 0),
  })), [groups, hidden, series]);
  const total = rows.reduce((sum, row) => sum + row.total, 0);

  function changeSlice(next: string) {
    setSliceKey(next);
    // Keep the existing breakdown unless it has become the horizontal axis.
    if (next === segment?.key) {
      setSegmentKey(noSegment.key);
      setExcluded(new Set());
    } else {
      setSegmentKey(segment?.key ?? noSegment.key);
    }
    setActive(null);
  }

  function toggleSeries(label: string) {
    if (!hidden.has(label) && series.length - hidden.size <= 1) return;
    const next = new Set(hidden);
    if (next.has(label)) next.delete(label);
    else next.add(label);
    setExcluded(next);
    setActive(null);
  }

  return <section className={cn("kalos-breakdown-chart", className)} data-slot="breakdown-chart" aria-labelledby={headingId}>
    <style href={breakdownChartStyleHref} precedence="kalos-component">{breakdownChartCss}</style>
    <header className="kbc-head">
      <h3 id={headingId} className="kbc-title" title={title}>{title}</h3>
      <span className="kbc-total" aria-live="polite" aria-atomic="true"><strong>{format.format(total)}</strong> {measure?.unit}</span>
    </header>
    <div className="kbc-controls">
      <BreakdownPicker label="Measure" value={measure?.key ?? ""} options={measures} onChange={next => { setMeasureKey(next); setActive(null); }} />
      <BreakdownPicker label="Slice" value={slice?.key ?? ""} options={dimensions} onChange={changeSlice} />
      <BreakdownPicker label="Segment" value={segment?.key ?? noSegment.key} options={[noSegment, ...otherDimensions]} onChange={next => {
        setSegmentKey(next);
        setExcluded(new Set());
        setActive(null);
      }} />
    </div>
    {slice && measure && <BreakdownPlot rows={rows} series={series} slice={slice} isSegmented={!!segment} hidden={hidden}
      unit={measure.unit} active={active} onInspect={setActive} />}
    <div className="kbc-table-frame" ref={tableFrame}>
      <div className="kbc-table-scroll" ref={tableScroll}>
        <table aria-label={title} className="kbc-table">
          <thead><tr>
            <th scope="col">{slice?.label}</th>
            <th scope="col">{measure?.label}</th>
            {segment && series.map(item => <th key={item.label} scope="col" data-hidden={hidden.has(item.label) || undefined}>
              <span className="kbc-series-heading" title={item.label}><i className="kbc-swatch" style={{ background: item.color }} /><span dir="auto">{item.label}</span></span>
            </th>)}
          </tr></thead>
          <tbody onPointerLeave={() => setActive(null)}>{rows.map(row => <tr key={row.label} data-active={active === row.label || undefined}
            onPointerEnter={event => { if (event.pointerType !== "touch") setActive(row.label); }}>
            <th scope="row"><span className="kbc-row-label" title={row.label}>{slice?.icons?.[row.label]}<span dir="auto">{row.label}</span></span></th>
            <td className="kbc-sum">{format.format(row.total)}</td>
            {segment && series.map((item, i) => <td key={item.label} data-hidden={hidden.has(item.label) || undefined}>{format.format(row.values[i])}</td>)}
          </tr>)}</tbody>
        </table>
      </div>
    </div>
    <footer className="kbc-foot">
      {segment ? <div className="kbc-legend" role="group" aria-label={segment.label}>
        {series.map(item => <button className="kbc-chip" type="button" key={item.label} title={item.label}
          aria-pressed={!hidden.has(item.label)} onClick={() => toggleSeries(item.label)}>
          <i className="kbc-swatch" style={{ background: item.color }} /><span dir="auto">{item.label}</span>
        </button>)}
      </div> : <span className="kbc-empty-legend">Pick a segment to split the bars</span>}
      {hidden.size > 0 && <button type="button" className="kbc-reset" onClick={() => setExcluded(new Set())}>Show all</button>}
    </footer>
  </section>;
}

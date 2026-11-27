import { useState } from "react";
import { ChartHeading, focusRing, panel } from "./chart-controls";
import { metrics, seriesColor, type TrafficChannel, type Metric } from "./data";
import { GroupedBars } from "./grouped-bars";

const comparisonMetrics = metrics
  .map((metric, index) => ({ ...metric, color: seriesColor(index) }))
  .filter((metric) => metric.key !== "newVisitors");

export function TrafficComparison({ channels }: { channels: TrafficChannel[] }) {
  const [shown, setShown] = useState<Metric[]>(comparisonMetrics.map((metric) => metric.key));
  const [hoveredMetric, setHoveredMetric] = useState<Metric | null>(null);
  const series = comparisonMetrics.filter((metric) => shown.includes(metric.key));
  function toggle(metric: Metric) {
    setShown((current) =>
      current.includes(metric) ? current.filter((value) => value !== metric) : [...current, metric],
    );
  }
  return (
    <section
      id="dashboard-comparison"
      tabIndex={-1}
      aria-label="渠道指标对比"
      className={`${panel} flex min-h-[431px] flex-col @min-[900px]/overview:min-h-0`}
    >
      <ChartHeading title="渠道指标对比" />
      <div className="mt-4 flex min-h-0 flex-1 flex-col">
        {channels.length === 0 ? (
          <p role="status" className="grid min-h-0 flex-1 place-items-center text-[13px] text-(--overview-muted)">
            暂无渠道数据
          </p>
        ) : (
          <GroupedBars channels={channels} series={series} hoveredMetric={hoveredMetric} />
        )}
        <div
          role="group"
          aria-label="图表系列"
          className="mt-5 flex shrink-0 flex-wrap items-center justify-center gap-2"
        >
          {comparisonMetrics.map((metric) => (
            <button
              key={metric.key}
              type="button"
              aria-pressed={shown.includes(metric.key)}
              disabled={shown.length === 1 && shown.includes(metric.key)}
              onClick={() => toggle(metric.key)}
              onPointerEnter={() => setHoveredMetric(metric.key)}
              onPointerLeave={() => setHoveredMetric(null)}
              onFocus={() => setHoveredMetric(metric.key)}
              onBlur={() => setHoveredMetric(null)}
              className={`${focusRing} inline-flex h-6 cursor-pointer items-center gap-2 rounded-md px-2 text-xs text-(--overview-muted) hover:bg-(--overview-soft) disabled:cursor-default aria-[pressed=false]:line-through aria-[pressed=false]:opacity-55`}
            >
              <span className="size-2 rounded-full" style={{ backgroundColor: metric.color }} />
              {metric.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

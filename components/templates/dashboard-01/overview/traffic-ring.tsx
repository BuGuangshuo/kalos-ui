"use client";

import { useState } from "react";
import { useDashboardReplay } from "../preview-animation";
import { Legend } from "./bklit/legend/legend";
import { useLegend, useLegendItem } from "./bklit/legend/legend-context";
import { RingCenter } from "./bklit/ring-center";
import { RingChart } from "./bklit/ring-chart";
import { Ring } from "./bklit/ring";
import type { RingData } from "./bklit/ring-context";
import { ChartHeading, ChartLegendKey, chartLegendLayout, focusRing } from "./chart-controls";
import { formatCount, type TrafficChannel } from "./data";

const palette = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
];

function ChannelLegendItem({
  pinned,
  onPin,
}: {
  pinned: number | null;
  onPin: (index: number | null) => void;
}) {
  const { item, index, isHovered, isFaded, percentage } = useLegendItem();
  const { setHoveredIndex } = useLegend();
  const details = `${item.label}，${formatCount(item.value)} 位新访客 / ${formatCount(item.maxValue ?? 0)} 位独立访客`;
  return (
    <button
      type="button"
      aria-label={`${details}，占比 ${percentage.toFixed(1)}%`}
      aria-pressed={pinned === index}
      data-highlighted={isHovered || undefined}
      className={`inline-flex cursor-pointer rounded-sm transition-opacity ${focusRing} ${isFaded ? "opacity-45" : ""}`}
      onPointerEnter={() => setHoveredIndex(index)}
      onPointerLeave={() => setHoveredIndex(null)}
      onFocus={() => setHoveredIndex(index)}
      onBlur={() => setHoveredIndex(null)}
      onClick={() => onPin(pinned === index ? null : index)}
    >
      <ChartLegendKey label={item.label} color={item.color} />
    </button>
  );
}

function VisitorRings({
  items,
  monthLabel,
}: {
  items: (RingData & { color: string })[];
  monthLabel: string;
}) {
  const replay = useDashboardReplay();
  const [hovered, setHovered] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);
  const selected = hovered ?? pinned;
  const newVisitors = items.reduce((sum, item) => sum + item.value, 0);
  const visitors = items.reduce((sum, item) => sum + item.maxValue, 0);
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center">
      <figure
        role="img"
        aria-label={`${monthLabel}所示渠道共 ${formatCount(visitors)} 位独立访客，其中新访客 ${formatCount(newVisitors)} 人`}
        className="my-auto aspect-square w-full max-w-[174px] shrink-0"
      >
        <RingChart
          key={replay}
          data={items}
          padding={4}
          strokeWidth={11}
          ringGap={6}
          baseInnerRadius={51}
          hoveredIndex={selected}
          onHoverChange={setHovered}
        >
          {items.map((item, index) => (
            <Ring key={item.label} index={index} />
          ))}
          <RingCenter
            percentage
            defaultLabel="新访客占比"
            suffix="%"
            formatOptions={{ maximumFractionDigits: 1 }}
            valueClassName="text-[clamp(14px,28cqw,16px)] leading-none font-semibold tracking-tight tabular-nums text-foreground"
            labelClassName="mt-1 truncate text-[10px] leading-4 text-muted-foreground"
          />
        </RingChart>
      </figure>
      <Legend
        items={items}
        hoveredIndex={selected}
        onHoverChange={setHovered}
        className={`${chartLegendLayout} w-full flex-row`}
      >
        <ChannelLegendItem pinned={pinned} onPin={setPinned} />
      </Legend>
    </div>
  );
}

export function TrafficRing({
  channels,
  monthLabel,
}: {
  channels: TrafficChannel[];
  monthLabel: string;
}) {
  const items = channels
    .filter((channel) => channel.visitors > 0)
    .toSorted((a, b) => b.visitors - a.visitors)
    .slice(0, 4)
    .map((channel, index) => ({
      label: channel.name,
      value: channel.newVisitors,
      maxValue: channel.visitors,
      color: palette[index],
    }));
  return (
    <section
      id="dashboard-new-visitors"
      tabIndex={-1}
      aria-label="新访客占比"
      className="flex min-h-[318px] min-w-0 flex-col gap-3 rounded-xl border border-border bg-card p-5 text-card-foreground outline-none"
    >
      <ChartHeading title="新访客占比" description="按独立访客数排名的前四个渠道" />
      {items.length ? (
        <VisitorRings
          key={monthLabel + items.map((item) => item.label).join(",")}
          monthLabel={monthLabel}
          items={items}
        />
      ) : (
        <p
          role="status"
          className="grid flex-1 place-items-center text-xs text-muted-foreground"
        >
          没有符合条件的渠道
        </p>
      )}
    </section>
  );
}

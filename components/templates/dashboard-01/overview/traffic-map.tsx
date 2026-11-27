"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import atlas from "world-atlas/countries-110m.json";
import { useDashboardReplay } from "../preview-animation";
import { DEFAULT_ANIMATION_DURATION_MS } from "./bklit/animation";
import { ChoroplethChart } from "./bklit/choropleth/choropleth-chart";
import { ChoroplethFeature } from "./bklit/choropleth/choropleth-feature";
import { ChoroplethMarker } from "./bklit/choropleth/choropleth-marker";
import { useChoroplethCamera, type ChoroplethPerspective } from "./bklit/choropleth/choropleth-camera";
import { ChoroplethTooltip } from "./bklit/choropleth/choropleth-tooltip";
import {
  type ChoroplethFeature as Region,
  useChoroplethInteraction,
  useChoroplethStable,
} from "./bklit/choropleth/choropleth-context";
import { TooltipContent } from "./bklit/tooltip/tooltip-content";
import { ChartHeading, panel } from "./chart-controls";
import { formatCount, type ReportMonth } from "./data";
import names from "./world-region-names.json";

// The 1:110m geometry and Chinese names are derived from Natural Earth's
// public-domain Admin 0 dataset. World Atlas ships the TopoJSON locally.
const topology = atlas as unknown as Topology<{ countries: GeometryCollection<{ name: string }> }>;
const world = feature(topology, topology.objects.countries);
// Antarctica's polar extent lies outside the displayed Mercator map.
world.features = world.features.filter(region => String(region.id) !== "010");
const regionNames: Record<string, string> = names;
const regionId = (region: Region) => String(region.id ?? region.properties.name);
const regionName = (region: Region) => regionNames[regionId(region)] ?? region.properties.name ?? "";

// Example regional totals use the same monthly visit counts as the channel report.
// An absent country has no observations in this breakdown.
const regionalVisits: Record<ReportMonth, Record<string, number>> = {
  "2026-08": {
    "156": 42010, "840": 24160, "392": 12640, "276": 9120, "826": 7240,
    "124": 5560, "356": 5180, "250": 4350, "036": 3860, "076": 3120,
    "484": 2320, "410": 2180, "360": 1420, "710": 1280, "528": 1060,
    "724": 920, "752": 720, "682": 560, "032": 440, "578": 320,
  },
  "2026-07": {
    "156": 39490, "840": 22770, "392": 9460, "276": 8120, "826": 6750,
    "124": 4780, "356": 4160, "250": 1720, "036": 3580, "076": 3160,
    "484": 1760, "410": 2450, "360": 1810, "710": 1140, "528": 960,
    "724": 820, "752": 560, "682": 430, "032": 520, "578": 290,
  },
};
const camera: ChoroplethPerspective = { focus: { view: "auto", tilt: 24 } };
const cities: { label: string; coordinates: [number, number] }[] = [
  { label: "伦敦", coordinates: [-0.13, 51.51] },
  { label: "纽约", coordinates: [-74.01, 40.71] },
  { label: "东京", coordinates: [139.69, 35.69] },
  { label: "圣保罗", coordinates: [-46.63, -23.55] },
  { label: "悉尼", coordinates: [151.21, -33.87] },
];
const legend = [
  { below: 0, label: "暂无数据", color: "var(--chart-scale-01)" },
  { below: 1000, label: "<1千", color: "var(--chart-scale-02)" },
  { below: 5000, label: "1千–5千", color: "var(--chart-scale-03)" },
  { below: 10000, label: "5千–1万", color: "var(--chart-scale-04)" },
  { below: Infinity, label: "≥1万", color: "var(--chart-scale-05)" },
];
function colorFor(value?: number) {
  if (value === undefined) return legend[0].color;
  return legend.find(group => value < group.below)!.color;
}

function RegionReading({ region, visits }: { region: Region; visits: Record<string, number> }) {
  const value = visits[regionId(region)];
  return (
    <div role="tooltip">
      <TooltipContent title={regionName(region)} rows={[{
        label: "访问次数", color: colorFor(value),
        value: value === undefined ? "暂无数据" : `${formatCount(value)} 次`,
      }]} />
    </div>
  );
}

function KeyboardRegions({ visits }: { visits: Record<string, number> }) {
  const { features, containerRef } = useChoroplethStable();
  const { focusFeature, reset } = useChoroplethCamera();
  const { hoveredFeatureIndex, setHoveredFeatureIndex, tooltipData, setTooltipData, setMarkerTooltip } = useChoroplethInteraction();
  const instructions = useId();
  const [index, setIndex] = useState<number | null>(null);
  const order = useMemo(() => features.map((region, i) => ({
    i, count: visits[regionId(region)] ?? -1,
  })).sort((a, b) => b.count - a.count).map(region => region.i), [features, visits]);
  function select(position: number) {
    setIndex(position);
    setTooltipData(null);
    setHoveredFeatureIndex(order[position]);
  }
  function clear() {
    setIndex(null);
    setHoveredFeatureIndex(null);
    setTooltipData(null);
  }

  useEffect(() => {
    const container = containerRef.current;
    const dismiss = () => {
      setIndex(null);
      setHoveredFeatureIndex(null);
      setTooltipData(null);
      setMarkerTooltip?.(null);
    };
    // The official feature layer moves a hovered path to the front. Listen
    // on the stable host as well so replacing that path cannot strand its tip.
    const leave = (event: PointerEvent) => { if (event.pointerType === "mouse") dismiss(); };
    const leaveLand = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.target instanceof Element && !event.target.closest("[data-region], [role=button]")) {
        dismiss();
      }
    };
    const outsideTap = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" && !container?.contains(event.target as Node)) dismiss();
    };
    container?.addEventListener("pointerleave", leave);
    container?.addEventListener("pointermove", leaveLand);
    document.addEventListener("pointerdown", outsideTap);
    return () => {
      container?.removeEventListener("pointerleave", leave);
      container?.removeEventListener("pointermove", leaveLand);
      document.removeEventListener("pointerdown", outsideTap);
    };
  }, [containerRef, setHoveredFeatureIndex, setTooltipData, setMarkerTooltip]);

  const active = index === null ? undefined : features[order[index]];
  return (
    <div
      role="group" aria-label="按地区浏览访问次数"
      aria-describedby={instructions} tabIndex={0}
      className="pointer-events-none absolute inset-0 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--chart-1)"
      onFocus={() => select(0)} onBlur={clear}
      onKeyDown={event => {
        if (event.key === "Escape") {
          event.preventDefault();
          event.stopPropagation();
          clear();
          reset();
        } else if (event.key === "Enter" && index !== null) {
          event.preventDefault();
          focusFeature(order[index]);
        } else if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
          event.preventDefault();
          const next = event.key === "Home" ? 0 : event.key === "End" ? order.length - 1 :
            ((index ?? 0) + (event.key === "ArrowRight" ? 1 : -1) + order.length) % order.length;
          select(next);
        }
      }}
    >
      <span id={instructions} className="sr-only">左右方向键切换地区，Enter 缩放，Escape 返回。</span>
      <div aria-live="polite" aria-atomic="true" className="absolute top-2 left-2 rounded-xl border bg-popover text-popover-foreground shadow-md empty:hidden">
        {active && !tooltipData && hoveredFeatureIndex === order[index!] && <RegionReading region={active} visits={visits} />}
      </div>
    </div>
  );
}

export function TrafficMap({ month }: { month: ReportMonth }) {
  const replay = useDashboardReplay();
  const visits = regionalVisits[month];
  return (
    <section id="dashboard-geography" aria-label="访问地区分布" tabIndex={-1} className={`${panel} flex min-w-0 flex-col`}>
      <ChartHeading title="访问地区分布" />
      <div className="mt-2 flex flex-1 items-center @min-[900px]/overview:[container-type:size]">
        <ChoroplethChart
          data={world}
          revealSignature={String(replay)}
          animationDuration={DEFAULT_ANIMATION_DURATION_MS}
          aspectRatio="16 / 9"
          className="mx-auto @min-[900px]/overview:max-w-[calc(100cqh*16/9)]"
          clickToZoom
          perspective={camera}
        >
          <ChoroplethFeature getFeatureColor={region => colorFor(visits[regionId(region)])} stroke="var(--chart-background)" />
          {cities.map(city => <ChoroplethMarker key={city.label} {...city} zoomLabel={`缩放至${city.label}`} />)}
          <ChoroplethTooltip locationLabel="坐标" content={({ feature: region }) => <RegionReading region={region} visits={visits} />} />
          <KeyboardRegions visits={visits} />
        </ChoroplethChart>
      </div>
      <ul aria-label="各地区访问次数图例" className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <li className="font-medium">访问次数</li>
        {legend.map(item => <li key={item.label} className="inline-flex items-center gap-1.5 whitespace-nowrap">
          <span aria-hidden="true" className="size-2.5 rounded-[2px]" style={{ backgroundColor: item.color }} />
          {item.label}
        </li>)}
      </ul>
    </section>
  );
}

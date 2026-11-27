"use client";

import { KalosLoading, KalosSkeleton } from "@/registry/kalos/kalos-skeleton";
import { ChartHeading, chartLegendLayout, panel } from "./chart-controls";
import { OverviewLayout } from "./overview-layout";
import { StatCards } from "./stat-cards";
import "./overview-skeleton.css";

const card = `${panel} flex flex-col`;
const channels = [48, 48, 48, 48];
const barGroups = [[78, 55, 24], [51, 37, 19], [64, 45, 23], [48, 34, 16], [38, 26, 12], [30, 20, 9]];

function PlaceholderLegend({ widths, className = chartLegendLayout }: { widths: number[]; className?: string }) {
  return (
    <div aria-hidden="true" className={className}>
      {widths.map((width, index) => (
        <span key={index} className="inline-flex h-4 items-center gap-1.5">
          <KalosSkeleton width={8} height={8} radius="50%" />
          <KalosSkeleton width={width} height={8} />
        </span>
      ))}
    </div>
  );
}

function VisitsSkeleton() {
  return (
    <section data-skeleton-module="ranking" className={`${card} @container/visits`}>
      <div className="flex h-8 items-start justify-between gap-3">
        <ChartHeading title="各渠道访问量" />
        <KalosSkeleton width={98} height={32} radius={9} />
      </div>
      <div className="mt-9 flex min-h-[225px] min-w-0 flex-1 flex-col gap-3 @min-[600px]/visits:min-h-[260px]">
        <div className="relative mx-3 my-2 flex-1">
          <KalosSkeleton height="100%" className="dashboard-skeleton-lines" />
        </div>
        <div className="mx-3 flex h-8 items-center">
          <KalosSkeleton height={20} radius={4} />
        </div>
      </div>
      <PlaceholderLegend widths={[64, 64]} />
    </section>
  );
}

function ComparisonSkeleton() {
  return (
    <section data-skeleton-module="comparison" className={`${card} min-h-[431px] @min-[900px]/overview:min-h-0`}>
      <ChartHeading title="渠道指标对比" />
      <div className="relative mx-2 mt-15 mb-4 min-h-0 flex-1">
        <div className="absolute inset-0 flex justify-around">
          {barGroups.map((group, index) => (
            <div key={index} className="flex h-full w-[11%] items-end justify-center gap-[5%]">
              {group.map(height => <KalosSkeleton key={height} width="30%" height={`${height}%`} radius="3px 3px 0 0" />)}
            </div>
          ))}
        </div>
      </div>
      <PlaceholderLegend widths={[48, 36, 48]} className="mt-5 flex min-h-6 flex-wrap items-center justify-center gap-x-4 gap-y-1" />
    </section>
  );
}

function RingSkeleton() {
  return (
    <section data-skeleton-module="new-visitors" className={`${card} min-h-[318px] gap-3`}>
      <ChartHeading title="新访客占比" description="按独立访客数排名的前四个渠道" />
      <div className="flex min-w-0 flex-1 flex-col items-center">
        <div className="relative my-auto aspect-square w-full max-w-[174px]">
          <KalosSkeleton height="100%" radius="50%" className="dashboard-skeleton-rings" />
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <KalosSkeleton width={38} height={12} /><KalosSkeleton width={32} height={6} />
          </span>
        </div>
        <PlaceholderLegend widths={channels} />
      </div>
    </section>
  );
}

function RadarSkeleton() {
  return (
    <section data-skeleton-module="quality" className={`${card} min-h-[318px]`}>
      <ChartHeading title="渠道质量分布" description="按独立访客数排名的前五个渠道" />
      <div className="mt-3 grid min-h-[196px] min-w-0 flex-1 place-items-center [container-type:size]">
        <div className="relative aspect-square w-[min(100cqw,100cqh)]">
          <div className="absolute inset-[30px]">
            <KalosSkeleton height="100%" className="dashboard-skeleton-radar" />
          </div>
        </div>
      </div>
    </section>
  );
}

function PriceSkeleton() {
  return (
    <section data-skeleton-module="price" className={`${card} min-h-[318px]`}>
      <ChartHeading title="价格走势" />
      <div className="relative mt-4 min-h-[220px] flex-1">
        <div className="absolute inset-0">
          <KalosSkeleton height="100%" radius={0} className="dashboard-skeleton-candles" />
        </div>
      </div>
    </section>
  );
}

function ToolsSkeleton() {
  return (
    <section data-skeleton-module="tools" className="grid h-[431px] min-w-0 grid-rows-[52px_36px_minmax(0,1fr)_40px] overflow-hidden rounded-xl border bg-card">
      <div className="flex items-center gap-2 border-b px-4">
        <KalosSkeleton width={16} height={16} radius={4} />
        <h2 className="text-sm font-medium">Design Stack</h2>
      </div>
      <div className="dashboard-skeleton-table-row border-b">
        {[13, 38, 53, 50, 42, 28].map((w, i) => <KalosSkeleton key={i} width={w} height={8} />)}
      </div>
      <div className="overflow-hidden">
        {[64, 42, 68, 52, 58, 48, 61, 40].map(width => (
          <div key={width} className="dashboard-skeleton-table-row h-[41px] border-b">
            <KalosSkeleton width={14} height={14} radius={4} />
            <span className="flex min-w-0 items-center gap-2"><KalosSkeleton width={16} height={16} radius={4} /><KalosSkeleton width={`${width}%`} height={8} /></span>
            <KalosSkeleton width={`${width}%`} height={16} /><KalosSkeleton width="65%" height={8} />
            <KalosSkeleton width="55%" height={8} /><KalosSkeleton width="45%" height={8} />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t px-4"><KalosSkeleton width={58} height={8} /><KalosSkeleton width={25} height={8} /></div>
    </section>
  );
}

function MapSkeleton() {
  return (
    <section data-skeleton-module="geography" className={card}>
      <ChartHeading title="访问地区分布" />
      <div className="mt-2 flex flex-1 items-center @min-[900px]/overview:[container-type:size]">
        <div className="mx-auto aspect-video w-full @min-[900px]/overview:max-w-[calc(100cqh*16/9)]">
          <KalosSkeleton height="100%" className="dashboard-skeleton-map" />
        </div>
      </div>
      <PlaceholderLegend widths={[34, 48, 26, 38, 42, 34]} className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1" />
    </section>
  );
}

export function OverviewSkeleton() {
  return (
    <KalosLoading label="正在加载数据概览">
      <OverviewLayout
        stats={<StatCards placeholder={
          <div className="flex min-h-8 items-start justify-between gap-1 @min-[561px]/overview:gap-2">
            <KalosSkeleton width={51} height={20} className="mt-1.5" />
            <span className="flex min-w-0 flex-wrap justify-end gap-x-1 pt-3">
              <KalosSkeleton width={41} height={8} line={16} />
              <KalosSkeleton width={46.5} height={8} line={16} />
            </span>
          </div>
        } />}
        visits={<VisitsSkeleton />} comparison={<ComparisonSkeleton />}
        ring={<RingSkeleton />} radar={<RadarSkeleton />} candle={<PriceSkeleton />}
        tools={<ToolsSkeleton />} geography={<MapSkeleton />}
      />
    </KalosLoading>
  );
}

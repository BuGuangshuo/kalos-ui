import { useDashboardReplay } from "../preview-animation";
import { AccessiblePlot } from "./accessible-plot";
import { RadarArea } from "./bklit/radar-area";
import { RadarAxis } from "./bklit/radar-axis";
import { RadarChart } from "./bklit/radar-chart";
import { RadarGrid } from "./bklit/radar-grid";
import { RadarLabels } from "./bklit/radar-labels";
import { ChartHeading, panel } from "./chart-controls";
import type { TrafficChannel } from "./data";

const indicators = [
  { key: "newVisitors", label: "新访客占比", color: "var(--chart-1)" },
  { key: "registrations", label: "注册转化率", color: "var(--chart-3)" },
] as const;
const number = new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 1 });

export function ChannelRadar({ channels, monthLabel }: { channels: TrafficChannel[]; monthLabel: string }) {
  const replay = useDashboardReplay();
  const ranked = channels.filter(channel => channel.visitors > 0)
    .toSorted((a, b) => b.visitors - a.visitors).slice(0, 5);
  const axes = ranked.map(channel => ({ key: channel.id, label: channel.name }));
  const series = indicators.map(({ key, label, color }) => ({
    label, color,
    values: Object.fromEntries(ranked.map(channel => [channel.id, 100 * channel[key] / channel.visitors])),
  }));

  return (
    <section id="dashboard-quality" aria-label="渠道质量分布" tabIndex={-1} className={`${panel} flex min-h-[318px] flex-col`}>
      <ChartHeading title="渠道质量分布" description="按独立访客数排名的前五个渠道" />
      <div className="mt-3 grid min-h-[196px] min-w-0 flex-1 place-items-center [container-type:size]">
        <div className="aspect-square w-[min(100cqw,100cqh)]">
          <AccessiblePlot label={`${monthLabel}各渠道的新访客占比和注册转化率`} values={axes.map(axis =>
            [axis.label, ...series.map(item => `${item.label} ${number.format(item.values[axis.key])}%`)].join("，")
          )}>
            <RadarChart key={`${monthLabel}-${replay}`} data={series} metrics={axes} margin={30}>
              <RadarGrid />
              <RadarAxis />
              <RadarLabels fontSize={10} offset={14} />
              {series.map((item, index) => <RadarArea key={item.label} index={index} />)}
            </RadarChart>
          </AccessiblePlot>
        </div>
      </div>
    </section>
  );
}

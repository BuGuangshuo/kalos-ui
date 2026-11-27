import { useMemo } from "react";
import { useDashboardReplay } from "../preview-animation";
import { AccessiblePlot } from "./accessible-plot";
import { Bar } from "./bklit/bar";
import { BarChart } from "./bklit/bar-chart";
import { BarXAxis } from "./bklit/bar-x-axis";
import { useChartStable } from "./bklit/chart-context";
import { ChartLegendHoverProvider } from "./bklit/chart-legend-hover";
import { TooltipContent } from "./bklit/tooltip/tooltip-content";
import { Grid } from "./bklit/grid";
import { ChartTooltip } from "./bklit/tooltip/chart-tooltip";
import { YAxis } from "./bklit/y-axis";
import { formatCount, metrics, type Metric, type TrafficChannel } from "./data";

type Series = (typeof metrics)[number] & { color: string };
const ignoreHover = () => {};

function ChannelAxis() {
  const { width } = useChartStable();
  return <BarXAxis maxLabels={width < 240 ? 2 : { base: 3, sm: 6 }} />;
}

export function GroupedBars({
  channels,
  series,
  hoveredMetric,
}: {
  channels: TrafficChannel[];
  series: Series[];
  hoveredMetric?: Metric | null;
}) {
  const replay = useDashboardReplay();
  const data = useMemo(() => channels.map((channel) => ({ ...channel })), [channels]);
  const hoveredIndex = series.findIndex((item) => item.key === hoveredMetric);
  const revealSignature = JSON.stringify([
    series.map((item) => item.key),
    channels.map((row) => series.map((item) => row[item.key])),
  ]);
  const descriptions = channels.map(
    (row) =>
      `${row.name}，${series.map((s) => `${s.label} ${formatCount(row[s.key])} ${s.unit}`).join("，")}`,
  );
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <p className="mb-2 text-[11px] text-(--chart-foreground-muted)">访问次数（次）／人数（人）</p>
      <ChartLegendHoverProvider
        hoveredIndex={hoveredIndex < 0 ? null : hoveredIndex}
        onHoverChange={ignoreHover}
      >
        <div className="min-h-0 flex-1">
          <AccessiblePlot label="各渠道分组柱状图" values={descriptions}>
            <BarChart
              key={replay}
              data={data}
              aspectRatio="auto"
              className="size-full"
              margin={{ top: 20, right: 16, bottom: 40, left: 52 }}
              revealSignature={revealSignature}
            >
              <Grid
                horizontal
                fadeHorizontal={false}
                highlightRowValues={[0]}
                highlightRowStroke="var(--chart-grid)"
              />
              <YAxis formatValue={formatCount} />
              <ChannelAxis />
              {series.map((item) => (
                <Bar
                  key={item.key}
                  dataKey={item.key}
                  fill={item.color}
                  lineCap={4}
                />
              ))}
              <ChartTooltip
                className="max-sm:right-2! max-sm:left-auto!"
                content={({ point }) => (
                  <TooltipContent
                    title={String(point.name)}
                    rows={series.map((item) => ({
                      label: item.label,
                      color: item.color,
                      value: `${formatCount(Number(point[item.key]))} ${item.unit}`,
                    }))}
                  />
                )}
              />
            </BarChart>
          </AccessiblePlot>
        </div>
      </ChartLegendHoverProvider>
    </div>
  );
}

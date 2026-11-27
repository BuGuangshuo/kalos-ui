import { useMemo, useState, type ReactNode } from "react";
import { useDashboardReplay } from "../preview-animation";
import { ChartHeading, ChartLegendKey, chartLegendLayout, focusRing, panel } from "./chart-controls";
import { AccessiblePlot } from "./accessible-plot";
import { ChartBrush } from "./bklit/chart-brush";
import { ChartBrushLayout } from "./bklit/chart-brush-layout";
import { chartCssVars } from "./bklit/chart-context";
import { ChartLegendHoverProvider } from "./bklit/chart-legend-hover";
import { TooltipContent } from "./bklit/tooltip/tooltip-content";
import { Grid } from "./bklit/grid";
import { Line } from "./bklit/line";
import { LineChart } from "./bklit/line-chart";
import { ChartTooltip } from "./bklit/tooltip/chart-tooltip";
import { XAxis } from "./bklit/x-axis";
import { YAxis } from "./bklit/y-axis";
import { formatCount, reports, type ReportMonth } from "./data";

// Bklit's time-scale and brush both address a datum by Date. Equally spaced
// day slots keep our categorical channel labels, crosshair and brush aligned.
const day = 86_400_000;
const margin = { top: 22, right: 26, bottom: 34, left: 52 };
const amount = (value: unknown) => (typeof value === "number" ? `${formatCount(value)} 次` : "—");

export function ChannelVisitsChart({ month, action }: { month: ReportMonth; action?: ReactNode }) {
  const replay = useDashboardReplay();
  const [hovered, setHovered] = useState<number | null>(null);
  const { channels, label, previous } = reports[month];
  const data = useMemo(() => {
    const last = new Map(previous.channels.map((row) => [row.id, row.visits]));
    return channels.map((row, i) => ({
      date: new Date(i * day),
      name: row.name,
      current: row.visits,
      previous: last.get(row.id),
    }));
  }, [channels, previous]);
  const series = [
    { key: "current", label, color: chartCssVars.linePrimary },
    { key: "previous", label: previous.label, color: chartCssVars.lineSecondary },
  ] as const;
  const lines = series.map(({ key, color }) => <Line key={key} dataKey={key} stroke={color} />);
  return (
    <section
      className={`${panel} @container/visits flex flex-col`}
      id="dashboard-ranking"
      tabIndex={-1}
      aria-label="各渠道访问量"
    >
      <div className="flex items-start justify-between gap-3">
        <ChartHeading title="各渠道访问量" />
        {action}
      </div>
      <p className="mt-2 text-[11px] text-(--chart-foreground-muted)">访问次数（次）</p>
      <ChartLegendHoverProvider hoveredIndex={hovered} onHoverChange={setHovered}>
        <div className="mt-2 min-h-[225px] min-w-0 flex-1 @min-[600px]/visits:min-h-[260px]">
          <AccessiblePlot
            label="各渠道访问次数"
            values={data.map(
              (row) =>
                `${row.name}，${label} ${amount(row.current)}，${previous.label} ${amount(row.previous)}`,
            )}
          >
            <ChartBrushLayout
              data={data}
              enabled
              height={32}
              brushStrip={({ brushSelection, onBrushSelectionChange }) => (
                <div className="size-full" role="group" aria-label="渠道范围缩略轴">
                  <LineChart
                    data={data}
                    animationDuration={0}
                    aspectRatio="auto"
                    className="size-full"
                    margin={{ top: 5, right: margin.right, bottom: 5, left: margin.left }}
                  >
                    {series.map(({ key, color }) => (
                      <Line key={key} dataKey={key} stroke={color} strokeWidth={1.5} />
                    ))}
                    <ChartBrush
                      initialSelection={brushSelection}
                      onSelectionChange={onBrushSelectionChange}
                    />
                  </LineChart>
                </div>
              )}
            >
              {({ xDomain, xDomainSlotCount }) => {
                const labels = data
                  .filter(row => !xDomain || (row.date >= xDomain[0] && row.date <= xDomain[1]))
                  .map(row => row.name);
                return (
                  <LineChart
                    key={replay}
                    data={data}
                    aspectRatio="auto"
                    className="size-full"
                    margin={margin}
                    revealSignature={month}
                    xDomain={xDomain}
                    xDomainSlotCount={xDomainSlotCount}
                  >
                    <Grid horizontal />
                    {lines}
                    <XAxis numTicks={{ base: 3, sm: 6 }} labels={labels} />
                    <YAxis formatValue={formatCount} />
                    <ChartTooltip
                      dateLabels={labels}
                      datePillAnimation="static"
                      content={({ point }) => (
                        <TooltipContent
                          title={String(point.name)}
                          rows={series.map((line) => ({
                            label: line.label,
                            color: line.color,
                            value: amount(point[line.key]),
                          }))}
                        />
                      )}
                    />
                  </LineChart>
                );
              }}
            </ChartBrushLayout>
          </AccessiblePlot>
        </div>
        <div role="group" aria-label="统计月份图例" className={chartLegendLayout}>
          {series.map((line, index) => (
            <button
              key={line.key}
              type="button"
              className={`inline-flex cursor-pointer rounded-sm ${focusRing}`}
              onPointerEnter={() => setHovered(index)}
              onPointerLeave={() => setHovered(null)}
              onFocus={() => setHovered(index)}
              onBlur={() => setHovered(null)}
            >
              <ChartLegendKey label={line.label} color={line.color} />
            </button>
          ))}
        </div>
      </ChartLegendHoverProvider>
    </section>
  );
}

import { Fragment } from "react";
import { useDashboardReplay } from "../preview-animation";
import { AccessiblePlot } from "./accessible-plot";
import { Candlestick } from "./bklit/candlestick";
import { CandlestickChart, type OHLCDataPoint } from "./bklit/candlestick-chart";
import { ChartTooltip } from "./bklit/tooltip/chart-tooltip";
import { XAxis } from "./bklit/x-axis";
import { ChartHeading, panel } from "./chart-controls";
import type { ReportMonth } from "./data";
import { priceHistory } from "./price-history";

const upColor = "var(--chart-1)";
const downColor = "var(--chart-2)";
const margin = { top: 8, right: 8, bottom: 40, left: 8 };
const currency = new Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY" });
const fullDate = new Intl.DateTimeFormat("zh-CN", { dateStyle: "long", timeZone: "UTC" });
const fields = [
  { key: "open", label: "开盘", color: "" },
  { key: "high", label: "最高", color: "text-(--chart-1)" },
  { key: "low", label: "最低", color: "text-(--chart-2)" },
  { key: "close", label: "收盘", color: "" },
] as const;

function PriceTooltip({ quote }: { quote: OHLCDataPoint }) {
  return (
    <div className="px-3 py-2.5 text-(--chart-tooltip-foreground)">
      <div className="mb-1.5 text-xs font-medium opacity-60">{fullDate.format(quote.date)}</div>
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-sm tabular-nums">
        {fields.map(({ key, label, color }) => (
          <Fragment key={key}>
            <dt className="text-(--chart-tooltip-muted)">{label}</dt>
            <dd className={color}>{currency.format(quote[key])}</dd>
          </Fragment>
        ))}
      </dl>
    </div>
  );
}

export function PriceChart({ month }: { month: ReportMonth }) {
  const replay = useDashboardReplay();
  const quotes = priceHistory[month];
  const labels = quotes.map(({ date }) => `${date.getUTCMonth() + 1}月 ${date.getUTCDate()}日`);

  return (
    <section id="dashboard-price" aria-label="价格走势" tabIndex={-1} className={`${panel} flex min-h-[318px] flex-col`}>
      <ChartHeading title="价格走势" />
      <div className="relative mt-4 min-h-[220px] flex-1">
        <div className="absolute inset-0">
          <AccessiblePlot label="每日开盘、最高、最低和收盘价" values={quotes.map((quote, index) =>
            [labels[index], ...fields.map(({ key, label }) => `${label} ${currency.format(quote[key])}`)].join("，")
          )}>
            <CandlestickChart key={replay} data={quotes} margin={margin} aspectRatio="auto" className="size-full" revealSignature={month}>
              <Candlestick positiveFill={upColor} negativeFill={downColor} fadedOpacity={0.25} />
              <ChartTooltip
                dateLabels={labels}
                showDots={false}
                indicatorColor={point => Number(point.close) >= Number(point.open) ? upColor : downColor}
                content={({ index }) => <PriceTooltip quote={quotes[index]} />}
              />
              <XAxis labels={labels} numTicks={{ base: 3, sm: 5 }} />
            </CandlestickChart>
          </AccessiblePlot>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef, useState } from "react";
import { ChannelRadar } from "./channel-radar";
import { ChannelVisitsChart } from "./channel-visits-chart";
import { ChartSelect, OverviewPortal } from "./chart-controls";
import { reports, type ReportMonth } from "./data";
import DashboardDesignStack from "./design-stack";
import { OverviewLayout } from "./overview-layout";
import { PriceChart } from "./price-chart";
import { StatCards } from "./stat-cards";
import { TrafficComparison } from "./traffic-comparison";
import { TrafficMap } from "./traffic-map";
import { TrafficRing } from "./traffic-ring";

export default function Overview() {
  const root = useRef<HTMLDivElement>(null);
  const [month, setMonth] = useState<ReportMonth>("2026-08");
  const { channels, label } = reports[month];

  return (
    <OverviewPortal.Provider value={root}>
      <OverviewLayout
        rootRef={root}
        stats={<StatCards month={month} />}
        visits={<ChannelVisitsChart month={month} action={
          <ChartSelect label="统计月份" value={month} options={Object.entries(reports).map(([value, report]) => ({ value, label: report.label }))}
            onChange={(value) => { if (value in reports) setMonth(value as ReportMonth); }} />
        } />}
        comparison={<TrafficComparison channels={channels} />}
        ring={<TrafficRing channels={channels} monthLabel={label} />}
        radar={<ChannelRadar channels={channels} monthLabel={label} />}
        candle={<PriceChart month={month} />}
        tools={<DashboardDesignStack />}
        geography={<TrafficMap month={month} />}
      />
    </OverviewPortal.Provider>
  );
}

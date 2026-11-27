import type { ReactNode, Ref } from "react";
import "./overview.css";

type OverviewLayoutProps = {
  rootRef?: Ref<HTMLDivElement>;
  stats: ReactNode;
  visits: ReactNode;
  comparison: ReactNode;
  ring: ReactNode;
  radar: ReactNode;
  candle: ReactNode;
  tools: ReactNode;
  geography: ReactNode;
};

const wideCard = "grid min-w-0 @min-[900px]/overview:col-span-6";
const rightCard = "grid min-w-0 @min-[900px]/overview:col-span-4";
const halfLeftCard = "grid min-w-0 @min-[900px]/overview:col-span-3";

export function OverviewLayout({ rootRef, stats, visits, comparison, ring, radar, candle, tools, geography }: OverviewLayoutProps) {
  return (
    <div ref={rootRef} className="dashboard-overview @container/overview min-h-full w-full bg-background text-foreground">
      <div className="grid min-w-0 gap-4 p-4 @min-[700px]/overview:p-6">
        {stats}
        <div className="grid min-w-0 grid-cols-1 gap-4 @min-[900px]/overview:grid-cols-10">
          <div className={wideCard}>{visits}</div>
          <div className={rightCard}>{comparison}</div>
          <div className={halfLeftCard}>{ring}</div>
          <div className={halfLeftCard}>{radar}</div>
          <div className={rightCard}>{candle}</div>
          <div className={wideCard}>{tools}</div>
          <div className={rightCard}>{geography}</div>
        </div>
      </div>
    </div>
  );
}

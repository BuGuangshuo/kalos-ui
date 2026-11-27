"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import type { ReportMonth } from "./data";
import "./stat-card-font.css";

const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });
const countDuration = 720;
const percent = new Intl.NumberFormat("en", {
  style: "percent",
  signDisplay: "exceptZero",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const cards = [
  { label: "营收额", "2026-07": { firstDay: 4226, latest: 4210 }, "2026-08": { firstDay: 4519, latest: 4587 } },
  { label: "曝光量", "2026-07": { firstDay: 1558, latest: 1751 }, "2026-08": { firstDay: 1926, latest: 1286 } },
  { label: "订单数", "2026-07": { firstDay: 99, latest: 132 }, "2026-08": { firstDay: 129, latest: 170 } },
  { label: "注册数", "2026-07": { firstDay: 52, latest: 85 }, "2026-08": { firstDay: 68, latest: 112 } },
];

function StatReading({ firstDay, latest }: { firstDay: number; latest: number }) {
  const output = useRef<HTMLSpanElement>(null);
  const current = useRef(0);
  const change = (latest - firstDay) / firstDay;

  // Activity reconnects layout effects when Data becomes visible again.
  useLayoutEffect(() => {
    current.current = 0;
  }, []);

  useLayoutEffect(() => {
    const element = output.current;
    if (!element) return;
    const from = current.current;
    const started = performance.now();
    let frame: number;

    const paint = (value: number) => {
      current.current = value;
      const text = compact.format(Math.round(value));
      if (element.textContent !== text) element.textContent = text;
    };

    function tick(now: number) {
      const progress = Math.min(1, Math.max(0, (now - started) / countDuration));
      paint(from + (latest - from) * (1 - (1 - progress) ** 3));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }

    paint(from);
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [latest]);

  return (
    <div className="flex items-baseline justify-between gap-1 tabular-nums @min-[561px]/overview:gap-2">
      <span className="shrink-0 text-2xl leading-8 font-semibold">
        <span ref={output} aria-hidden="true">0</span>
        <span className="sr-only">{compact.format(latest)}</span>
      </span>
      <span className="flex min-w-0 flex-wrap items-baseline justify-end gap-x-1 text-xs leading-4 text-(--stat-muted)">
        <span className={change >= 0 ? "text-(--chart-positive)" : "text-(--chart-negative)"}>
          {percent.format(change)}
        </span>
        <span className="whitespace-nowrap">vs Day 1</span>
      </span>
    </div>
  );
}

export function StatCards(props: { month: ReportMonth } | { placeholder: ReactNode }) {
  return (
    <div className="grid min-w-0 grid-cols-2 gap-2 @min-[561px]/overview:gap-3 @min-[821px]/overview:grid-cols-4">
      {cards.map(card => (
        <section
          key={card.label}
          aria-label={card.label}
          className="dashboard-stat flex min-w-0 flex-col gap-2 rounded-xl border p-3 @min-[561px]/overview:px-4 @min-[561px]/overview:py-3.5"
        >
          <h2 className="text-xs leading-4 font-normal text-(--stat-muted)">{card.label}</h2>
          {"month" in props ? <StatReading {...card[props.month]} /> : props.placeholder}
        </section>
      ))}
    </div>
  );
}

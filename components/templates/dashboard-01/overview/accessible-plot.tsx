import { useState, type ReactNode } from "react";

export function AccessiblePlot({ label, values, children }: {
  label: string;
  values: string[];
  children: ReactNode;
}) {
  const [index, setIndex] = useState<number | null>(null);
  const active = index === null ? undefined : values[index];
  return (
    <figure
      aria-label={label}
      aria-description="使用左右方向键浏览图表数据"
      tabIndex={0}
      className="relative h-full min-w-0 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-(--chart-1)"
      onFocus={(event) => {
        if (event.target === event.currentTarget && event.currentTarget.matches(":focus-visible")) setIndex(0);
      }}
      onPointerDown={() => setIndex(null)}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setIndex(null); }}
      onKeyDown={(event) => {
        if (event.key === "Escape") setIndex(null);
        if (values.length && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
          event.preventDefault();
          const step = event.key === "ArrowLeft" ? -1 : 1;
          setIndex(current => ((current ?? 0) + step + values.length) % values.length);
        }
      }}
    >
      <figcaption className="sr-only">{values.join("；")}</figcaption>
      {children}
      {active && (
        <div role="tooltip" aria-live="polite" className="pointer-events-none absolute top-2 left-2 rounded-lg border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-sm">
          {active}
        </div>
      )}
    </figure>
  );
}

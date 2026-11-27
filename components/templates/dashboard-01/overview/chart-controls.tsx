import { Select } from "@base-ui/react/select";
import { Check, ChevronDown } from "lucide-react";
import { createContext, useContext, type RefObject } from "react";

export const OverviewPortal = createContext<RefObject<HTMLDivElement | null> | undefined>(undefined);

export const panel =
  "min-w-0 rounded-xl border border-border bg-card p-5 text-card-foreground";
export const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--chart-1)";

export const chartLegendLayout =
  "mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs font-normal text-(--chart-foreground-muted)";

export function ChartLegendKey({ label, color }: { label: string; color: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span aria-hidden="true" className="size-2 shrink-0 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}

export function ChartHeading({ title, description }: { title: string; description?: string }) {
  return (
    <div className="min-w-0">
      <h2 className="text-[14px]/5 font-medium">{title}</h2>
      {description && <p className="mt-1 text-xs leading-4 text-(--overview-muted)">{description}</p>}
    </div>
  );
}

type Choice = { label: string; value: string };

export function ChartSelect({
  label,
  value,
  onChange,
  options,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Choice[];
  className?: string;
}) {
  const container = useContext(OverviewPortal);
  return (
    <Select.Root
      items={options}
      value={value}
      onValueChange={(next) => {
        if (next !== null) onChange(next);
      }}
      modal={false}
    >
      <Select.Trigger
        aria-label={label}
        className={`${focusRing} flex h-8 shrink-0 cursor-pointer items-center justify-between gap-2 rounded-[9px] border border-(--overview-line) bg-(--overview-card) px-3 text-[13px] leading-5 text-(--overview-ink) transition-colors hover:bg-(--overview-soft) ${className}`}
      >
        <Select.Value />
        <Select.Icon>
          <ChevronDown className="size-3.5 text-(--overview-muted)" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal container={container}>
        <Select.Positioner
          align="end"
          sideOffset={4}
          alignItemWithTrigger={false}
          positionMethod="absolute"
          className="z-20"
        >
          <Select.Popup className="max-h-64 min-w-[max(var(--anchor-width),100px)] overflow-y-auto rounded-[10px] border border-(--overview-line) bg-(--overview-card) p-1 text-(--overview-ink) shadow-lg outline-none">
            <Select.List aria-label={label}>
              {options.map((option) => (
                <Select.Item
                  key={option.value}
                  value={option.value}
                  className="flex min-h-8 cursor-pointer items-center justify-between gap-3 rounded-md px-2 text-[13px] outline-none data-highlighted:bg-(--overview-soft)"
                >
                  <Select.ItemText>{option.label}</Select.ItemText>
                  <Select.ItemIndicator>
                    <Check className="size-3.5" />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}

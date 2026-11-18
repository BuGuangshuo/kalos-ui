"use client";

import { useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import { colorPickerPresets, type ColorPickerVariant } from "@/lib/color-picker-examples";
import { KalosColorPicker, KalosColorPickerPanel } from "@/registry/kalos/kalos-color-picker";

const desktopQuery = "(min-width: 768px) and (pointer: fine)";
const getDesktop = () => window.matchMedia(desktopQuery).matches;
const getServerDesktop = () => false;
const subscribe = (notify: () => void) => {
  const media = window.matchMedia(desktopQuery);
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
};

function DocumentMark({ color, small }: { color: string; small?: boolean }) {
  return <span aria-hidden="true" className={cn("grid shrink-0 place-items-center rounded-[7px] transition-colors duration-150", small ? "size-5" : "size-8")}
    style={{ color, backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)` }}>
    <span className={cn("grid grid-cols-3", small ? "gap-px [&>i]:size-[2px]" : "gap-px [&>i]:size-[3px]")}>
      {[true, true, true, true, false, true, true, true, false].map((filled, index) => (
        <i key={index} className={filled ? "rounded-[.5px] bg-current" : undefined} />
      ))}
    </span>
  </span>;
}

function ColorPickerActivity({ compact }: { compact: boolean }) {
  const [color, setColor] = useState("#a651f0");
  const [open, setOpen] = useState<boolean>();
  const desktop = useSyncExternalStore(subscribe, getDesktop, getServerDesktop);
  const initialOpen = desktop && !compact;
  return (
    <div data-color-picker-preview="" className="w-full max-w-[400px] min-w-0 rounded-xl bg-card text-card-foreground shadow-[0_0_0_.5px_var(--border),0_1px_2px_color-mix(in_srgb,var(--foreground)_6%,transparent)]">
      <div className="flex min-h-14 items-center gap-2.5 px-3">
        <DocumentMark color={color} />
        <span className="min-w-0 flex-1 truncate font-medium">设计规范</span>
        <KalosColorPicker key={String(initialOpen)} label="文档颜色" value={color} onValueChange={setColor} presets={colorPickerPresets}
          open={open} defaultOpen={initialOpen} onOpenChange={setOpen} align="end" />
      </div>
      <div className="flex min-h-10 items-center gap-2 border-t border-border px-3 text-xs leading-[18px] text-muted-foreground">
        <DocumentMark color={color} small />
        <span className="min-w-0 flex-1 truncate">
          <span className="transition-colors duration-150" style={{ color: `color-mix(in srgb, ${color} 55%, var(--foreground))` }}>设计规范</span> 已更新图标章节
        </span>
        <span className="shrink-0">2 分钟前</span>
      </div>
    </div>
  );
}

export function ColorPickerDemo({ variant, compact = false }: { variant?: ColorPickerVariant; compact?: boolean }) {
  if (variant === "alpha") {
    return <KalosColorPicker label="批注颜色" name="annotationColor" defaultValue="#0190fe80" alpha />;
  }
  if (variant === "panel") {
    return <KalosColorPickerPanel role="group" aria-label="文档标签颜色" defaultValue="#13a89e" presets={["#0190fe", "#13a89e", "#e6aa13", "#a651f0"]} />;
  }
  return <ColorPickerActivity compact={compact} />;
}

"use client";

import { useLayoutEffect, useRef, useState, type ComponentProps } from "react";
import { KalosTooltipView } from "@/components/ui/kalos-tooltip-shared";

export function TableCellContent({ children, tooltipDisabled = false, ...props }: ComponentProps<"div"> & { tooltipDisabled?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState({ overflow: false, text: "", focusable: false });

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const text = root.querySelector<HTMLElement>("[data-table-text]");
    let active = true;
    const measure = () => {
      if (!active) return;
      const overflow = !tooltipDisabled && !!text && text.scrollWidth > text.clientWidth + 1;
      const value = text?.textContent?.trim() ?? "";
      const focusable = overflow && !root.querySelector('a[href],button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex="0"]');
      setTip(previous => previous.overflow === overflow && previous.text === value && previous.focusable === focusable ? previous : { overflow, text: value, focusable });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    if (text) observer.observe(text);
    void document.fonts.ready.then(measure);
    return () => { active = false; observer.disconnect(); };
  }, [children, tooltipDisabled]);

  return <KalosTooltipView content={tip.text} disabled={tooltipDisabled || !tip.overflow}>
    <div {...props} ref={ref} tabIndex={props.tabIndex ?? (tip.focusable ? 0 : undefined)} data-truncated={tip.overflow || undefined}>{children}</div>
  </KalosTooltipView>;
}

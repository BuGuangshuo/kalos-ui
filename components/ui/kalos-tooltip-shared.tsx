"use client";

import { useId, useState, type ReactElement, type ReactNode } from "react";
import { Tooltip } from "@base-ui/react/tooltip";
import { cn } from "@/lib/utils";
import { controlStyles } from "@/components/ui/kalos-styles";

export type KalosTooltipProps = {
  content: ReactNode;
  shortcut?: string;
  children: ReactElement;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  offset?: number;
  delay?: number;
  disabled?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
};

export function KalosTooltipProvider({ children, ...props }: Tooltip.Provider.Props) {
  return <Tooltip.Provider delay={500} timeout={300} {...props}>{children}</Tooltip.Provider>;
}

export function KalosTooltipView({ content, shortcut, children, side = "top", align = "center", offset = 6, delay = 500, disabled = false, open, defaultOpen = false, onOpenChange, className }: KalosTooltipProps) {
  const id = useId();
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const childProps = children.props as { "aria-describedby"?: string; "aria-label"?: string };
  const empty = content == null || typeof content === "boolean" || content === "";
  const shown = !disabled && !empty && (open ?? internalOpen);
  const quiet = typeof content === "string" && childProps["aria-label"] === content;
  const description = [childProps["aria-describedby"], shown && (!quiet ? id : shortcut ? `${id}-shortcut` : undefined)].filter(Boolean).join(" ") || undefined;

  return <Tooltip.Root open={open} defaultOpen={defaultOpen} disabled={disabled || empty} onOpenChange={next => {
    setInternalOpen(next);
    onOpenChange?.(next);
  }}>
    <Tooltip.Trigger render={children} delay={delay} aria-describedby={description} />
    <Tooltip.Portal>
      <Tooltip.Positioner side={side} align={align} sideOffset={offset} collisionPadding={8} className={controlStyles.tooltipPositioner}>
        <Tooltip.Popup id={id} role="tooltip" className={cn(controlStyles.tooltip, className)}>
          <span dir="auto" className="min-w-0 wrap-anywhere">{content}</span>
          {shortcut ? <kbd id={`${id}-shortcut`} className={controlStyles.tooltipShortcut}>{shortcut}</kbd> : null}
        </Tooltip.Popup>
      </Tooltip.Positioner>
    </Tooltip.Portal>
  </Tooltip.Root>;
}

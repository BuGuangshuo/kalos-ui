"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { controlStyles } from "@/components/ui/kalos-styles";
import { slidingHighlightClasses, useSlidingHighlight } from "@/components/ui/kalos-highlight";

export type KalosPopoverItem = { value: string; label: string; disabled?: boolean };
export type KalosPopoverProps = {
  trigger: string;
  label?: string;
  items?: KalosPopoverItem[];
  children?: ReactNode;
  contentClassName?: string;
  onAction?: (value: string) => void;
  align?: "start" | "center" | "end";
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
};

export function usePopoverState({ open, defaultOpen = false, onOpenChange }: KalosPopoverProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  return [open ?? internalOpen, (next: boolean) => {
    if (open === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  }] as const;
}

export function KalosPopoverMenu({ label, items, onAction }: {
  label: string;
  items: KalosPopoverItem[];
  onAction: (value: string) => void;
}) {
  const highlight = useSlidingHighlight('[role="menuitem"]', '[role="menuitem"]:focus', true);
  return <div
    ref={highlight}
    role="menu"
    aria-label={label}
    className={cn(slidingHighlightClasses, controlStyles.popoverList)}
    onKeyDown={event => {
      if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
      const options = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)')];
      if (!options.length) return;
      event.preventDefault();
      const index = options.indexOf(document.activeElement as HTMLButtonElement);
      const next = event.key === "Home" ? 0 : event.key === "End" ? options.length - 1 : (index + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length;
      options[next].focus();
    }}
  >{items.map(item => <button
    key={item.value}
    type="button"
    role="menuitem"
    disabled={item.disabled}
    data-disabled={item.disabled || undefined}
    className={controlStyles.popoverItem}
    onClick={() => onAction(item.value)}
  >{item.label}</button>)}</div>;
}

"use client";

import { Check, ChevronRight } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { controlStyles } from "@/components/ui/kalos-styles";
import { slidingHighlightClasses, useSlidingHighlight } from "@/components/ui/kalos-highlight";

export type KalosDropdownMenuItem = {
  value: string;
  label: string;
  icon?: ReactNode;
  description?: string;
  shortcut?: string;
  checked?: boolean;
  type?: "radio" | "checkbox";
  danger?: boolean;
  divider?: boolean;
  disabled?: boolean;
  keepOpen?: boolean;
  submenu?: KalosDropdownMenuItem[];
  onSelect?: () => void;
};

export type KalosDropdownMenuProps = {
  trigger: ReactNode;
  triggerProps?: { variant?: "outline" | "ghost"; size?: "default" | "icon"; "aria-label"?: string };
  items: KalosDropdownMenuItem[];
  title?: string;
  header?: ReactNode;
  align?: "start" | "center" | "end";
  side?: "bottom" | "top";
  width?: CSSProperties["width"];
  contentClassName?: string;
  empty?: ReactNode;
  disabled?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onAction?: (value: string) => void;
  "aria-label"?: string;
};

export function dropdownItemType(item: KalosDropdownMenuItem) {
  return item.submenu ? "action" : item.type ?? (item.checked === undefined ? "action" : "checkbox");
}

// Selection groups have their own native radio/checkbox semantics. A type change
// starts a group without introducing a visual separator.
export function dropdownGroups(items: KalosDropdownMenuItem[]) {
  const groups: { items: KalosDropdownMenuItem[]; type: ReturnType<typeof dropdownItemType>; divider: boolean }[] = [];
  for (const item of items) {
    const type = dropdownItemType(item);
    const previous = groups.at(-1);
    if (!previous || item.divider || previous.type !== type) groups.push({ items: [item], type, divider: Boolean(item.divider && groups.length) });
    else previous.items.push(item);
  }
  return groups;
}

export function useDropdownHighlight() {
  return useSlidingHighlight('[data-kalos-menu-item]', '[data-kalos-menu-item][data-highlighted], [data-kalos-menu-item][data-focused], [data-kalos-menu-item]:focus', true);
}

export const dropdownPanelClass = () => cn(slidingHighlightClasses, controlStyles.dropdownPanel);

export function dropdownTriggerClass(props: KalosDropdownMenuProps["triggerProps"]) {
  return cn(controlStyles.button, controlStyles.dropdownTrigger, props?.variant === "ghost" ? controlStyles.buttonGhost : controlStyles.buttonSurface, props?.size === "icon" && "size-8 p-0");
}

export function DropdownItemContent({ item }: { item: KalosDropdownMenuItem }) {
  return <>
    {item.icon ? <span aria-hidden="true" className={controlStyles.dropdownIcon}>{item.icon}</span> : null}
    <span className="min-w-0 flex-1">
      <span className="block truncate" title={item.label}>{item.label}</span>
      {item.description ? <span className={controlStyles.dropdownDescription}>{item.description}</span> : null}
    </span>
    {item.shortcut ? <kbd className={controlStyles.dropdownShortcut}>{item.shortcut}</kbd> : null}
    {item.submenu ? <ChevronRight aria-hidden="true" className={controlStyles.dropdownChevron} /> : item.checked !== undefined || item.type ? <span aria-hidden="true" className={controlStyles.dropdownCheck} data-checked={item.checked || undefined}><Check /></span> : null}
  </>;
}

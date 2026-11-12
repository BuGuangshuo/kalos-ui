"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/kalos-base-button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/kalos-base-popover";
import { controlStyles } from "@/components/ui/kalos-styles";
import { KalosPopoverMenu, usePopoverState, type KalosPopoverProps } from "@/components/ui/kalos-popover-menu";

export function KalosPopover(props: KalosPopoverProps) {
  const { trigger, label = trigger, items = [], children, contentClassName, onAction, align = "start", disabled } = props;
  const [open, setOpen] = usePopoverState(props);
  const contentRef = useRef<HTMLDivElement>(null);
  return <Popover open={open} onOpenChange={setOpen}>
    <PopoverTrigger render={<Button variant="outline" disabled={disabled} className={`${controlStyles.button} ${controlStyles.buttonSurface}`} />}>{trigger}</PopoverTrigger>
    <PopoverContent ref={contentRef} initialFocus={() => {
      const content = contentRef.current;
      return content?.contains(document.activeElement) ? document.activeElement as HTMLElement : content;
    }} align={align} className={contentClassName} aria-label={label}>
      {children ?? <KalosPopoverMenu label={label} items={items} onAction={value => { setOpen(false); onAction?.(value); }} />}
    </PopoverContent>
  </Popover>;
}

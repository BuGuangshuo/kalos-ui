"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { controlStyles } from "@/components/ui/kalos-styles";
import { cn } from "@/lib/utils";
import { KalosPopoverMenu, usePopoverState, type KalosPopoverProps } from "@/components/ui/kalos-popover-menu";

export function KalosPopover(props: KalosPopoverProps) {
  const { trigger, label = trigger, items = [], children, contentClassName, onAction, align = "start", disabled } = props;
  const [open, setOpen] = usePopoverState(props);
  return <Popover open={open} onOpenChange={setOpen}>
    <PopoverTrigger asChild>
      <Button variant="outline" disabled={disabled} className={`${controlStyles.button} ${controlStyles.buttonSurface}`}>{trigger}</Button>
    </PopoverTrigger>
    <PopoverContent align={align} sideOffset={8} className={cn(controlStyles.popover, controlStyles.popoverRadixMotion, contentClassName)} aria-label={label} tabIndex={-1} onOpenAutoFocus={event => {
      event.preventDefault();
      const content = event.currentTarget as HTMLElement;
      if (!content.contains(document.activeElement)) content.focus();
    }}>
      {children ?? <KalosPopoverMenu label={label} items={items} onAction={value => { setOpen(false); onAction?.(value); }} />}
    </PopoverContent>
  </Popover>;
}

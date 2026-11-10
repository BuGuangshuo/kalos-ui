"use client";

import { Button } from "@/components/ui/kalos-aria-button";
import { Popover, PopoverContent } from "@/components/ui/kalos-aria-popover";
import { controlStyles } from "@/components/ui/kalos-styles";
import { KalosPopoverMenu, usePopoverState, type KalosPopoverProps } from "@/components/ui/kalos-popover-menu";

export function KalosPopover(props: KalosPopoverProps) {
  const { trigger, label = trigger, items = [], children, onAction, align = "start", disabled } = props;
  const [open, setOpen] = usePopoverState(props);
  return <Popover isOpen={open} onOpenChange={setOpen}>
    <Button variant="outline" isDisabled={disabled} className={`${controlStyles.button} ${controlStyles.buttonSurface}`}>{trigger}</Button>
    <PopoverContent align={align} label={label}>
      {children ?? <KalosPopoverMenu label={label} items={items} onAction={value => { setOpen(false); onAction?.(value); }} />}
    </PopoverContent>
  </Popover>;
}

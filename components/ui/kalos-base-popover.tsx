"use client";

import { Popover as Primitive } from "@base-ui/react/popover";
import { cn } from "@/lib/utils";
import { controlStyles } from "@/components/ui/kalos-styles";

export const Popover = Primitive.Root;
export const PopoverTrigger = Primitive.Trigger;
export function PopoverContent({ align = "start", className, ...props }: Primitive.Popup.Props & { align?: "start" | "center" | "end" }) {
  return <Primitive.Portal>
    <Primitive.Positioner sideOffset={8} align={align} className="z-50">
      <Primitive.Popup {...props} data-slot="popover-content" className={cn(controlStyles.popover, "origin-[var(--transform-origin)] transition-[opacity,transform] duration-150 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0", className)} />
    </Primitive.Positioner>
  </Primitive.Portal>;
}

"use client";

import { Popover as Primitive, Dialog, type PopoverProps } from "react-aria-components";
import { cn } from "@/lib/utils";
import { controlStyles } from "@/components/ui/kalos-styles";
import type { ReactNode } from "react";
export { DialogTrigger as Popover } from "react-aria-components";
export function PopoverContent({ align = "start", label, children, className, ...props }: Omit<PopoverProps, "children"> & { align?: "start" | "center" | "end"; label: string; children: ReactNode }) {
  return <Primitive {...props} placement={align === "center" ? "bottom" : `bottom ${align}`} offset={8} className={state => cn(controlStyles.popover, "origin-[var(--trigger-anchor-point)]", controlStyles.popoverAriaMotion, typeof className === "function" ? className(state) : className)}>
    <Dialog aria-label={label} className="outline-none">{children}</Dialog>
  </Primitive>;
}

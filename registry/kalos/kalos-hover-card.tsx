"use client";

import { useId } from "react";
import { PreviewCard } from "@base-ui/react/preview-card";
import { controlStyles, hoverCardDefaults } from "@/components/ui/kalos-styles";
import { isHoverCardEmpty, type KalosHoverCardProps } from "@/components/ui/kalos-hover-card-shared";
import { cn } from "@/lib/utils";

export type { KalosHoverCardProps } from "@/components/ui/kalos-hover-card-shared";

export function KalosHoverCard({
  children, content, label = "预览", side = "bottom", align = "start",
  offset = hoverCardDefaults.offset, openDelay = hoverCardDefaults.openDelay,
  closeDelay = hoverCardDefaults.closeDelay, width, open, onOpenChange, disabled, className,
}: KalosHoverCardProps) {
  const triggerId = useId();
  if (disabled || isHoverCardEmpty(content)) return children;

  return <PreviewCard.Root open={open} onOpenChange={onOpenChange} triggerId={open === undefined ? undefined : triggerId}>
    <PreviewCard.Trigger id={triggerId} render={children} delay={openDelay} closeDelay={closeDelay} />
    <PreviewCard.Portal>
      <PreviewCard.Positioner side={side} align={align} sideOffset={offset} collisionPadding={16} className="z-50">
        <PreviewCard.Popup
          data-slot="hover-card-content"
          aria-label={label}
          className={cn(controlStyles.hoverCard, controlStyles.hoverCardMotion, "max-h-[var(--available-height)] origin-[var(--transform-origin)]", className)}
          style={{ width, maxWidth: width == null ? undefined : "calc(100vw - 32px)" }}
        >{content}</PreviewCard.Popup>
      </PreviewCard.Positioner>
    </PreviewCard.Portal>
  </PreviewCard.Root>;
}

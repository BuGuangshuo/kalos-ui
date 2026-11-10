import type { ComponentProps } from "react";
import { Disc3Icon } from "@/components/ui/disc-3-icon";
import { KALOS_WORDMARK_VIEWBOX, KALOS_WORDMARK } from "@/lib/brand";
import { cn } from "@/lib/utils";

export function BrandMark({
  className,
  ...props
}: ComponentProps<typeof Disc3Icon>) {
  return (
    <Disc3Icon
      size={64}
      {...props}
      className={cn("brand-symbol", className)}
      aria-hidden="true"
    />
  );
}

export function BrandLogo({ className }: { className?: string }) {
  return (
    <div className={cn("brand-lockup", className)}>
      <BrandMark />
      <svg viewBox={KALOS_WORDMARK_VIEWBOX} className="brand-wordmark" aria-hidden="true">
        <path fill="currentColor" d={KALOS_WORDMARK} />
      </svg>
    </div>
  );
}

"use client";

import { KalosTooltipView, type KalosTooltipProps } from "@/components/ui/kalos-tooltip-shared";

export type { KalosTooltipProps } from "@/components/ui/kalos-tooltip-shared";
export { KalosTooltipProvider } from "@/components/ui/kalos-tooltip-shared";

export function KalosTooltip(props: KalosTooltipProps) {
  return <KalosTooltipView {...props} />;
}

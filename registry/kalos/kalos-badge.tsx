"use client";

import type { ComponentProps, ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { badgeCss } from "@/components/ui/kalos-badge-styles";
import { cn } from "cn";

export type KalosBadgeTone = "neutral" | "info" | "success" | "warning" | "danger" | "purple" | "pink";
export type KalosBadgeVariant = "soft" | "solid" | "ghost";

export type KalosBadgeProps = Omit<ComponentProps<typeof Badge>, "variant"> & {
  tone?: KalosBadgeTone;
  variant?: KalosBadgeVariant;
  /** 兼容旧版状态属性；同时传入时以 tone 为准。 */
  status?: "neutral" | "success" | "warning";
  size?: "sm" | "md";
  dot?: boolean;
  live?: boolean;
  icon?: ReactNode;
  count?: number;
  max?: number;
};

// Visuals adapted from affectUI Badge (MIT). Full notice is in kalos-badge-styles.ts.
export function KalosBadge({
  tone, status, variant = "soft", size = "md", dot = status !== undefined, live = false,
  icon, count, max = 99, children, className, title, ...props
}: KalosBadgeProps) {
  const counted = count !== undefined;
  if (counted && !Number.isFinite(count)) return null;
  const value = counted ? Math.max(0, Math.floor(count)) : undefined;
  const limit = Number.isFinite(max) ? Math.max(0, Math.floor(max)) : 99;
  const label = value !== undefined ? (value > limit ? `${limit}+` : value.toLocaleString("zh-CN")) : children;
  const hasDot = !counted && (dot || live);
  const hasIcon = !counted && icon != null;
  if ((label == null || label === false || label === "") && !hasDot && !hasIcon) return null;

  return <>
    <style href="kalos-badge" precedence="default">{badgeCss}</style>
    <Badge
      {...props}
      variant="secondary"
      className={cn("kalos-badge", className)}
      data-tone={tone ?? status ?? "neutral"}
      data-appearance={variant}
      data-size={size}
      data-count={counted || undefined}
      data-lead={hasIcon ? "icon" : hasDot ? "dot" : undefined}
      title={title ?? (value !== undefined && value > limit ? value.toLocaleString("zh-CN") : undefined)}
    >
      {hasIcon ? <span className="kalos-badge__icon" aria-hidden="true">{icon}</span>
        : hasDot ? <span className="kalos-badge__dot" data-live={live || undefined} aria-hidden="true" /> : null}
      {label != null ? <span className="kalos-badge__label">{label}</span> : null}
    </Badge>
  </>;
}

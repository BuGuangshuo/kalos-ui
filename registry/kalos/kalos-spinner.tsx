import type { ComponentPropsWithRef } from "react";
import { cn } from "cn";
import { spinnerCss, spinnerDefaults } from "@/components/ui/kalos-loading-styles";

// Adapted from affectUI Spinner (MIT). Full notice is in kalos-loading-styles.ts.
export type KalosSpinnerProps = Omit<ComponentPropsWithRef<"svg">, "children" | "width" | "height" | "viewBox"> & {
  size?: number;
  label?: string;
};

export function KalosSpinner({ size = spinnerDefaults.size, label, className, "aria-label": ariaLabel, "aria-labelledby": labelledBy, ...props }: KalosSpinnerProps) {
  const name = label ?? ariaLabel;
  const labelled = Boolean(name || labelledBy);

  return <>
    <style href="kalos-spinner" precedence="default">{spinnerCss}</style>
    <svg
      {...props}
      data-slot="spinner"
      className={cn("kalos-spinner", className)}
      viewBox="0 0 16 16"
      width={size}
      height={size}
      focusable="false"
      role={labelled ? "status" : undefined}
      aria-label={name}
      aria-labelledby={label ? undefined : labelledBy}
      aria-hidden={labelled ? undefined : true}
    >
      <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeOpacity={spinnerDefaults.trackOpacity} strokeWidth={spinnerDefaults.strokeWidth} />
      <path d="M8 2a6 6 0 0 1 6 6" fill="none" stroke="currentColor" strokeWidth={spinnerDefaults.strokeWidth} strokeLinecap="round" />
    </svg>
  </>;
}

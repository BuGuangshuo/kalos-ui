import type { ReactElement, ReactNode } from "react";

export type KalosHoverCardProps = {
  /** A focusable element that forwards its ref and event handlers. */
  children: ReactElement;
  content: ReactNode;
  label?: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  offset?: number;
  openDelay?: number;
  closeDelay?: number;
  width?: number | string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  className?: string;
};

export function isHoverCardEmpty(content: ReactNode) {
  return content == null || typeof content === "boolean" || content === "";
}

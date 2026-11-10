import { controlStyles } from "@/components/ui/kalos-styles";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/kalos-aria-badge";
export function KalosBadge({
  status = "neutral",
  children,
}: {
  status?: "neutral" | "success" | "warning";
  children: ReactNode;
}) {
  return (
    <Badge
      variant={
        status === "success"
          ? "default"
          : status === "warning"
            ? "outline"
            : "secondary"
      }
      className={`rounded-full ${controlStyles.font}`}
    >
      <span aria-hidden="true" className="size-1 rounded-full bg-current" />
      {children}
    </Badge>
  );
}

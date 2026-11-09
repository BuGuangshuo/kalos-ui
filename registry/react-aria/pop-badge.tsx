import type { ReactNode } from "react";
import { Badge } from "@/components/ui/pop-aria-badge";
export function PopBadge({
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
      className="rounded-full"
    >
      <span aria-hidden="true" className="size-1 rounded-full bg-current" />
      {children}
    </Badge>
  );
}

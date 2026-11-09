import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
const styles = {
  neutral: "",
  success: "bg-primary/10 text-primary border-primary/15",
  warning: "bg-muted text-muted-foreground border-border",
};
export function PopBadge({
  status = "neutral",
  children,
}: {
  status?: "neutral" | "success" | "warning";
  children: ReactNode;
}) {
  return (
    <Badge variant="secondary" className={styles[status]}>
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {children}
    </Badge>
  );
}

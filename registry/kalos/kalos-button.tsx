"use client";
import { controlStyles } from "@/components/ui/kalos-styles";
import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
export function KalosButton({
  loading = false,
  variant = "default",
  size = "default",
  disabled,
  children,
  ...props
}: React.ComponentProps<typeof Button> & { loading?: boolean }) {
  return (
    <Button
      {...props}
      variant={variant}
      size={size}
      className={cn(
        controlStyles.button,
        variant === "default" && controlStyles.buttonSolid,
        variant === "destructive" && controlStyles.buttonDanger,
        (variant === "secondary" || variant === "outline") && controlStyles.buttonSurface,
        variant === "ghost" && controlStyles.buttonGhost,
        props.className,
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      {loading ? (
        <Loader2 data-icon="inline-start" className="animate-spin" />
      ) : null}
      {children}
    </Button>
  );
}

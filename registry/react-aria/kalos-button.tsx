"use client";
import { controlStyles } from "@/components/ui/kalos-styles";
import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/kalos-aria-button";
export function KalosButton({
  loading = false,
  variant = "default",
  size = "default",
  disabled,
  onClick,
  onPress,
  children,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "children"> & {
  children?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <Button
      {...props}
      variant={variant}
      size={size}
      className={cn(
        controlStyles.button,
        variant === "default" && controlStyles.buttonSolid,
        (variant === "secondary" || variant === "outline") && controlStyles.buttonSurface,
        variant === "ghost" && controlStyles.buttonGhost,
        props.className,
      )}
      isDisabled={props.isDisabled || disabled || loading}
      onPress={onPress ?? onClick}
      aria-busy={loading || undefined}
    >
      {loading ? (
        <Loader2 data-icon="inline-start" className="animate-spin" />
      ) : null}
      {children}
    </Button>
  );
}

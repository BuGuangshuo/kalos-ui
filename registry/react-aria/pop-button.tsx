"use client";
import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/pop-aria-button";
export function PopButton({
  loading = false,
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
      size={size}
      className={cn(
        "rounded-full focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-transparent",
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

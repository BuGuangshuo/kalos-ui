"use client";
import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/pop-base-button";
export function PopButton({
  loading = false,
  size = "default",
  disabled,
  children,
  ...props
}: React.ComponentProps<typeof Button> & { loading?: boolean }) {
  return (
    <Button
      {...props}
      size={size}
      className={cn(
        "rounded-full focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-transparent",
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

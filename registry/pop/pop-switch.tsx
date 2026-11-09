"use client";
import * as React from "react";
import { Switch } from "@/components/ui/switch";
export function PopSwitch({
  label,
  description,
  id,
  ...props
}: React.ComponentProps<typeof Switch> & {
  label: string;
  description?: string;
}) {
  const autoId = React.useId();
  const fieldId = id || autoId;
  return (
    <div className="flex items-center justify-between gap-6">
      <label
        htmlFor={fieldId}
        className="flex flex-col gap-1 text-sm font-medium cursor-pointer"
      >
        {label}
        {description ? (
          <span className="text-xs font-normal text-muted-foreground">
            {description}
          </span>
        ) : null}
      </label>
      <Switch size="default" {...props} id={fieldId} />
    </div>
  );
}

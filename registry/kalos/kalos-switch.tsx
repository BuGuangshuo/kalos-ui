"use client";
import { controlStyles } from "@/components/ui/kalos-styles";
import * as React from "react";
import { Switch } from "@/components/ui/switch";
export function KalosSwitch({
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
        className={`flex cursor-pointer flex-col gap-1 ${controlStyles.label}`}
      >
        {label}
        {description ? (
          <span className="text-xs font-normal text-muted-foreground">
            {description}
          </span>
        ) : null}
      </label>
      <Switch
        className={controlStyles.switch}
        size="default"
        {...props}
        id={fieldId}
      />
    </div>
  );
}

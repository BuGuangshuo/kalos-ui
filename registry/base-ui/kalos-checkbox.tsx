"use client";
import { controlStyles } from "@/components/ui/kalos-styles";
import * as React from "react";
import { Checkbox } from "@/components/ui/kalos-base-checkbox";
export function KalosCheckbox({
  label,
  description,
  id,
  ...props
}: React.ComponentProps<typeof Checkbox> & {
  label: string;
  description?: string;
}) {
  const autoId = React.useId();
  const fieldId = id || autoId;
  return (
    <div className="flex items-start gap-3">
      <Checkbox
        className={controlStyles.checkbox}
        {...props}
        id={fieldId}
      />
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
    </div>
  );
}

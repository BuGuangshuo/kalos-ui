"use client";
import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
export function PopCheckbox({
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
        className="focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-input data-checked:focus-visible:border-primary"
        {...props}
        id={fieldId}
      />
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
    </div>
  );
}

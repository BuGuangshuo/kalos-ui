"use client";
import * as React from "react";
import { Checkbox } from "@/components/ui/pop-aria-checkbox";
export function PopCheckbox({
  label,
  description,
  id,
  checked,
  defaultChecked,
  disabled,
  onCheckedChange,
  ...props
}: React.ComponentProps<typeof Checkbox> & {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label: string;
  description?: string;
}) {
  const autoId = React.useId();
  const fieldId = id || autoId;
  return (
    <div className="flex items-start gap-3">
      <Checkbox
        isSelected={checked ?? props.isSelected}
        defaultSelected={defaultChecked ?? props.defaultSelected}
        isDisabled={disabled ?? props.isDisabled}
        onChange={onCheckedChange ?? props.onChange}
        aria-label={label}
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

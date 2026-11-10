"use client";
import { controlStyles } from "@/components/ui/kalos-styles";
import * as React from "react";
import { Switch } from "@/components/ui/kalos-aria-switch";
export function KalosSwitch({
  label,
  description,
  id,
  checked,
  defaultChecked,
  disabled,
  onCheckedChange,
  ...props
}: React.ComponentProps<typeof Switch> & {
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
        isSelected={checked ?? props.isSelected}
        defaultSelected={defaultChecked ?? props.defaultSelected}
        isDisabled={disabled ?? props.isDisabled}
        onChange={onCheckedChange ?? props.onChange}
        aria-label={label}
        className={controlStyles.switch}
        size="default"
        {...props}
        id={fieldId}
      />
    </div>
  );
}

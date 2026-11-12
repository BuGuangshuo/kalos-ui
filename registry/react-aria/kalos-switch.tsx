"use client";
import { Field } from "@/components/ui/kalos-aria-field";
import { KalosFieldMessage } from "@/components/ui/kalos-field-message";
import { controlStyles } from "@/components/ui/kalos-styles";
import * as React from "react";
import { Switch } from "@/components/ui/kalos-aria-switch";
export function KalosSwitch({
  label,
  description,
  error,
  id,
  checked,
  defaultChecked,
  disabled,
  required,
  onCheckedChange,
  ...props
}: React.ComponentProps<typeof Switch> & {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  required?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label: string;
  description?: string;
  error?: string;
}) {
  const autoId = React.useId();
  const fieldId = id || autoId;
  const descriptionId = `${fieldId}-description`;
  return (
    <Field data-invalid={!!error} className="gap-1.5">
    <div className="flex items-center justify-between gap-6">
      <label
        htmlFor={`${fieldId}-input`}
        className={`flex cursor-pointer flex-col gap-1 ${controlStyles.label}`}
      >
        <span>{label}{required ? <span aria-hidden="true" className={controlStyles.requiredMark}>*</span> : null}</span>
        {description && !error ? (
          <span id={descriptionId} className="text-xs font-normal text-muted-foreground">
            {description}
          </span>
        ) : null}
      </label>
      <Switch
        aria-required={required || undefined}
        isSelected={checked ?? props.isSelected}
        defaultSelected={defaultChecked ?? props.defaultSelected}
        isDisabled={disabled ?? props.isDisabled}
        onChange={onCheckedChange ?? props.onChange}
        aria-label={label}
        className={controlStyles.switch}
        size="default"
        {...props}
        id={fieldId}
        inputRef={input => { if (input) input.id = `${fieldId}-input`; }}
        aria-invalid={!!error}
        aria-describedby={error || description ? descriptionId : undefined}
      />
    </div>
    <KalosFieldMessage id={descriptionId} error={error} />
    </Field>
  );
}

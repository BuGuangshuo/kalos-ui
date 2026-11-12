"use client";
import { Field } from "@/components/ui/kalos-aria-field";
import { KalosFieldMessage } from "@/components/ui/kalos-field-message";
import { controlStyles } from "@/components/ui/kalos-styles";
import * as React from "react";
import { Checkbox } from "@/components/ui/kalos-aria-checkbox";
export function KalosCheckbox({
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
}: React.ComponentProps<typeof Checkbox> & {
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
    <div className="flex items-start gap-3">
      <Checkbox
        isRequired={required ?? props.isRequired}
        isInvalid={!!error || props.isInvalid}
        isSelected={checked ?? props.isSelected}
        defaultSelected={defaultChecked ?? props.defaultSelected}
        isDisabled={disabled ?? props.isDisabled}
        onChange={onCheckedChange ?? props.onChange}
        aria-label={label}
        className={controlStyles.checkbox}
        {...props}
        id={fieldId}
        inputRef={input => { if (input) input.id = `${fieldId}-input`; }}
        aria-invalid={!!error}
        aria-describedby={error || description ? descriptionId : undefined}
      />
      <label
        htmlFor={`${fieldId}-input`}
        className={`flex cursor-pointer flex-col gap-1 ${controlStyles.label}`}
      >
        <span>{label}</span>
        {description && !error ? (
          <span id={descriptionId} className="text-xs font-normal text-muted-foreground">
            {description}
          </span>
        ) : null}
      </label>
    </div>
    <KalosFieldMessage id={descriptionId} error={error} />
    </Field>
  );
}

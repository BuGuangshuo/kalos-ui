"use client";
import { Field } from "@/components/ui/kalos-base-field";
import { KalosFieldMessage } from "@/components/ui/kalos-field-message";
import { controlStyles } from "@/components/ui/kalos-styles";
import * as React from "react";
import { Checkbox } from "@/components/ui/kalos-base-checkbox";
export function KalosCheckbox({
  label,
  description,
  error,
  id,
  ...props
}: React.ComponentProps<typeof Checkbox> & {
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
        className={controlStyles.checkbox}
        {...props}
        id={fieldId}
        aria-invalid={!!error}
        aria-describedby={error || description ? descriptionId : undefined}
      />
      <label
        htmlFor={fieldId}
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

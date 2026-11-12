"use client";
import { Field } from "@/components/ui/field";
import { KalosFieldMessage } from "@/components/ui/kalos-field-message";
import { controlStyles } from "@/components/ui/kalos-styles";
import * as React from "react";
import { Switch } from "@/components/ui/switch";
export function KalosSwitch({
  label,
  description,
  error,
  id,
  ...props
}: React.ComponentProps<typeof Switch> & {
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
        htmlFor={fieldId}
        className={`flex cursor-pointer flex-col gap-1 ${controlStyles.label}`}
      >
        <span>{label}{props.required ? <span aria-hidden="true" className={controlStyles.requiredMark}>*</span> : null}</span>
        {description && !error ? (
          <span id={descriptionId} className="text-xs font-normal text-muted-foreground">
            {description}
          </span>
        ) : null}
      </label>
      <Switch
        className={controlStyles.switch}
        size="default"
        {...props}
        id={fieldId}
        aria-invalid={!!error}
        aria-describedby={error || description ? descriptionId : undefined}
      />
    </div>
    <KalosFieldMessage id={descriptionId} error={error} />
    </Field>
  );
}

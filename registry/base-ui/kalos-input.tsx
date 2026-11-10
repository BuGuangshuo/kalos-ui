"use client";
import { controlStyles } from "@/components/ui/kalos-styles";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/kalos-base-input";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/kalos-base-field";
export function KalosInput({
  label,
  hint,
  error,
  id,
  ...props
}: React.ComponentProps<typeof Input> & {
  label: string;
  hint?: string;
  error?: string;
}) {
  const autoId = React.useId();
  const fieldId = id || autoId;
  const descriptionId = `${fieldId}-description`;
  return (
    <Field data-invalid={!!error} className="gap-1.5">
      <FieldLabel htmlFor={fieldId} className={controlStyles.label}>{label}</FieldLabel>
      <Input
        {...props}
        className={cn(
          controlStyles.field,
          props.className,
        )}
        id={fieldId}
        aria-invalid={!!error}
        aria-describedby={error || hint ? descriptionId : undefined}
      />
      {error ? (
        <FieldError id={descriptionId} className="text-xs">
          {error}
        </FieldError>
      ) : hint ? (
        <FieldDescription id={descriptionId} className="text-xs">
          {hint}
        </FieldDescription>
      ) : null}
    </Field>
  );
}

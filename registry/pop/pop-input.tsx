"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
export function PopInput({
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
      <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>
      <Input
        {...props}
        className={cn("rounded-[var(--radius-element,12px)]", props.className)}
        id={fieldId}
        aria-invalid={!!error}
        aria-describedby={error || hint ? descriptionId : undefined}
      />
      {error ? (
        <FieldError id={descriptionId} className="text-xs">{error}</FieldError>
      ) : hint ? (
        <FieldDescription id={descriptionId} className="text-xs">{hint}</FieldDescription>
      ) : null}
    </Field>
  );
}

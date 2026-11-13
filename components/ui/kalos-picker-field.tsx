"use client";
import { useId, type ReactNode } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { KalosFieldMessage } from "@/components/ui/kalos-field-message";
import { controlStyles } from "@/components/ui/kalos-styles";
import { cn } from "cn";

export type KalosPickerFieldProps = { id?: string; label?: ReactNode; hint?: string; error?: string; optional?: boolean; required?: boolean; disabled?: boolean; className?: string; "aria-label"?: string };
export function usePickerIds(id?: string) { const generated = useId(); const field = id ?? generated; return { id: field, labelId: `${field}-label`, messageId: `${field}-message` }; }
export function KalosPickerField({ id, label, labelId, hint, error, optional, required, disabled, className, children }: KalosPickerFieldProps & { id: string; labelId: string; children: ReactNode }) {
  return <Field className={cn("kalos-picker", className)} data-disabled={disabled || undefined} data-invalid={!!error}>
    {label != null ? <div className="kalos-picker-label"><FieldLabel id={labelId} htmlFor={id} className={controlStyles.label} onClickCapture={event => { event.preventDefault(); event.stopPropagation(); }}>{label}{required ? <span aria-hidden="true" className={controlStyles.requiredMark}>*</span> : null}</FieldLabel>{optional ? <span>可选</span> : null}</div> : null}
    {children}
    <KalosFieldMessage id={`${id}-message`} hint={hint} error={error} />
  </Field>;
}

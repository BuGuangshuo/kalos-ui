"use client";

import * as React from "react";
import { NumberField } from "@base-ui/react/number-field";
import { Minus, Plus } from "lucide-react";
import { Field, FieldLabel } from "@/components/ui/field";
import { KalosFieldMessage } from "@/components/ui/kalos-field-message";
import { KalosNumberInputValue, useNumberInputMotion, useNumberInputReset } from "@/components/ui/kalos-number-input-parts";
import { clampNumber, stepNumber, type KalosNumberInputProps } from "@/components/ui/kalos-number-input-model";
import { controlStyles } from "@/components/ui/kalos-styles";
import { cn } from "@/lib/utils";

type Props = Omit<KalosNumberInputProps, "onValueChange"> & {
  onValueChange?: NumberField.Root.Props["onValueChange"];
  onValueCommitted?: NumberField.Root.Props["onValueCommitted"];
};
export type { Props as KalosNumberInputProps };

export function KalosNumberInput({ label, value, defaultValue = null, onValueChange, onValueCommitted, min, max, step = 1, largeStep = step * 10, prefix, unit, locale = "zh-CN", formatOptions, hint, error, id, name, form, disabled, readOnly, required, className, inputClassName, ref, onKeyDown, ...props }: Props) {
  const autoId = React.useId();
  const fieldId = id ?? autoId;
  const messageId = `${fieldId}-description`;
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [internal, setInternal] = React.useState(() => clampNumber(defaultValue, min, max));
  const current = value !== undefined ? value : internal;
  const committed = React.useRef(current);
  const [restoreRevision, setRestoreRevision] = React.useState(0);
  React.useLayoutEffect(() => { if (restoreRevision) inputRef.current?.focus(); }, [restoreRevision]);
  useNumberInputMotion(inputRef, current);
  useNumberInputReset(inputRef, () => { setInternal(clampNumber(defaultValue, min, max)); committed.current = clampNumber(defaultValue, min, max); });
  return <Field data-invalid={!!error} data-disabled={disabled || undefined} className={cn("gap-1.5", className)}>
    <FieldLabel htmlFor={fieldId} onClickCapture={event => { event.preventDefault(); event.stopPropagation(); }} className={controlStyles.label}>{label}{required ? <span aria-hidden="true" className={controlStyles.requiredMark}>*</span> : null}</FieldLabel>
    <NumberField.Root key={restoreRevision} id={fieldId} value={current} min={min} max={max} step={step} largeStep={largeStep} smallStep={step} snapOnStep locale={locale} format={{ maximumFractionDigits: 20, ...formatOptions }} name={name} form={form} disabled={disabled} readOnly={readOnly} required={required}
      onValueChange={(next, details) => { onValueChange?.(next, details); if (!details.isCanceled && value === undefined) setInternal(next); }}
      onValueCommitted={(next, details) => { committed.current = next; onValueCommitted?.(next, details); }}>
      <NumberField.Group data-invalid={!!error} data-disabled={disabled || undefined} className={cn(controlStyles.inputGroup, "items-center")}>
        <KalosNumberInputValue prefix={prefix} unit={unit}>
          <NumberField.Input {...props} role="spinbutton" aria-valuenow={current ?? undefined} aria-valuemin={min} aria-valuemax={max} ref={element => { inputRef.current = element; if (typeof ref === "function") ref(element); else if (ref) ref.current = element; }} className={cn(controlStyles.numberInput, inputClassName)}
            aria-invalid={!!error || props["aria-invalid"]} aria-describedby={[props["aria-describedby"], error || hint ? messageId : undefined].filter(Boolean).join(" ") || undefined}
            aria-valuetext={current === null ? undefined : [typeof prefix === "string" ? prefix : "", new Intl.NumberFormat(locale, { maximumFractionDigits: 20, ...formatOptions }).format(current), unit].filter(Boolean).join(" ")}
            onFocus={event => { committed.current = current; props.onFocus?.(event); }}
            onKeyDown={event => {
              onKeyDown?.(event);
              if (event.defaultPrevented || event.nativeEvent.isComposing || disabled || readOnly) return;
              if (["PageUp", "PageDown", "Escape"].includes(event.key)) {
                event.preventDefault();
                const next = event.key === "Escape" ? committed.current : stepNumber(current, event.key === "PageUp" ? 1 : -1, step, min, max, largeStep);
                const details: NumberField.Root.ChangeEventDetails = { reason: "keyboard", event: event.nativeEvent, trigger: event.currentTarget, cancel() { this.isCanceled = true; }, allowPropagation() { this.isPropagationAllowed = true; }, isCanceled: false, isPropagationAllowed: false };
                if (next !== current) onValueChange?.(next, details);
                if (!details.isCanceled) {
                  if (value === undefined) setInternal(next);
                  if (event.key === "Escape") setRestoreRevision(revision => revision + 1);
                  else { committed.current = next; onValueCommitted?.(next, { reason: "keyboard", event: event.nativeEvent }); }
                }
              }
            }} />
        </KalosNumberInputValue>
        <div className={controlStyles.numberActions}>
          <NumberField.Decrement tabIndex={-1} aria-label={`减少${label}`} aria-controls={fieldId} className={controlStyles.numberAction}><Minus aria-hidden="true" /></NumberField.Decrement>
          <NumberField.Increment tabIndex={-1} aria-label={`增加${label}`} aria-controls={fieldId} className={controlStyles.numberAction}><Plus aria-hidden="true" /></NumberField.Increment>
        </div>
      </NumberField.Group>
    </NumberField.Root>
    <KalosFieldMessage id={messageId} hint={hint} error={error} />
  </Field>;
}

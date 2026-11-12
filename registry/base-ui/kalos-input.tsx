"use client";
import * as React from "react";
import { Eye, EyeOff, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { KalosFieldMessage } from "@/components/ui/kalos-field-message";
import { controlStyles } from "@/components/ui/kalos-styles";
import { InputGroup, InputGroupInput, InputGroupAddon, InputGroupButton } from "@/components/ui/kalos-base-input-group";
import { Field, FieldLabel } from "@/components/ui/kalos-base-field";

export function KalosInput({ label, hint, error, id, type, clearable = true, onClear, value, defaultValue, onChange, ref, className, ...props }: React.ComponentProps<"input"> & {
  label: string;
  hint?: string;
  error?: string;
  clearable?: boolean;
  onClear?: () => void;
}) {
  const autoId = React.useId();
  const fieldId = id || autoId;
  const descriptionId = `${fieldId}-description`;
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [revealed, setRevealed] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
  const hasValue = String(value ?? internalValue).length > 0;
  const showClear = type !== "password" && clearable && hasValue && !props.disabled && !props.readOnly;
  React.useEffect(() => {
    const form = inputRef.current?.form;
    if (!form) return;
    const reset = (event: Event) => queueMicrotask(() => {
      if (event.defaultPrevented) return;
      setInternalValue(defaultValue ?? "");
      setRevealed(false);
    });
    form.addEventListener("reset", reset);
    return () => form.removeEventListener("reset", reset);
  }, [defaultValue]);
  function clear() {
    const input = inputRef.current;
    if (!input || props.disabled || props.readOnly) return;
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(input, "");
    input.dispatchEvent(new Event("input", { bubbles: true }));
    setInternalValue("");
    onClear?.();
    input.focus();
  }
  return (
    <Field data-invalid={!!error} data-disabled={props.disabled || undefined} className="gap-1.5">
      <FieldLabel htmlFor={fieldId} onClickCapture={event => { event.preventDefault(); event.stopPropagation(); }} className={controlStyles.label}>{label}{props.required ? <span aria-hidden="true" className={controlStyles.requiredMark}>*</span> : null}</FieldLabel>
      <InputGroup data-invalid={!!error} data-disabled={props.disabled || undefined} className={controlStyles.inputGroup}>
        <InputGroupInput {...props} id={fieldId} type={type === "password" && revealed ? "text" : type} value={value} defaultValue={defaultValue}
          ref={element => { inputRef.current = element; if (typeof ref === "function") ref(element); else if (ref) ref.current = element; }}
          className={cn(controlStyles.inputContent, className)} aria-invalid={!!error} aria-describedby={error || hint ? descriptionId : undefined}
          onChange={event => { setInternalValue(event.target.value); onChange?.(event); }}
          onKeyDown={event => { props.onKeyDown?.(event); if (event.key === "Escape" && showClear && !event.defaultPrevented) { event.preventDefault(); clear(); } }}
        />
        {showClear || type === "password" ? <InputGroupAddon align="inline-end" className={controlStyles.inputAddon}>
          {showClear ? <InputGroupButton className={cn(controlStyles.inputAction, controlStyles.inputClear)} aria-label={`清空${label}`} aria-controls={fieldId} onClick={clear}><X aria-hidden="true" /></InputGroupButton> : null}
          {type === "password" ? <InputGroupButton className={controlStyles.inputAction} disabled={props.disabled} aria-label={revealed ? "隐藏密码" : "显示密码"} aria-pressed={revealed} aria-controls={fieldId} onClick={() => { setRevealed(current => !current); inputRef.current?.focus(); }}>{revealed ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}</InputGroupButton> : null}
        </InputGroupAddon> : null}
      </InputGroup>
      <KalosFieldMessage id={descriptionId} error={error} hint={hint} />
    </Field>
  );
}

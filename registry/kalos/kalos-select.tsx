"use client";
import { X } from "lucide-react";
import { KalosButton } from "./kalos-button";
import { cn } from "@/lib/utils";
import { Field } from "@/components/ui/field";
import { KalosFieldMessage } from "@/components/ui/kalos-field-message";
import { controlStyles } from "@/components/ui/kalos-styles";
import { useId, useRef, useState } from "react";
import { slidingHighlightClasses, useSlidingHighlight } from "@/components/ui/kalos-highlight";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
export function KalosSelect({
  label,
  placeholder = "请选择",
  items,
  value,
  onValueChange,
  id: providedId,
  name,
  hint,
  error,
  disabled,
  required,
  clearable = true,
}: {
  id?: string;
  name?: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  clearable?: boolean;
  label: string;
  placeholder?: string;
  items: { value: string; label: string }[];
  value?: string;
  onValueChange?: (value: string) => void;
}) {
  const [internalValue, setInternalValue] = useState("");
  const currentValue = value ?? internalValue;
  const clearRef = useRef<HTMLDivElement>(null);
  const showClear = clearable && !!currentValue && !disabled;
  const change = (next: string) => { setInternalValue(next); onValueChange?.(next); };
  const autoId = useId();
  const id = providedId || autoId;
  const descriptionId = `${id}-description`;
  const highlight = useSlidingHighlight('[role="option"]', '[role="option"][data-highlighted], [role="option"][data-focused], [role="option"][data-state="checked"], [role="option"][aria-selected="true"]', true);
  return (
    <Field data-invalid={!!error} data-disabled={disabled || undefined} className="gap-1.5">
      <label htmlFor={id} className={controlStyles.label}>
        {label}{required ? <span aria-hidden="true" className={controlStyles.requiredMark}>*</span> : null}
      </label>
      <Select name={name} disabled={disabled} required={required} value={currentValue} onValueChange={change}>
      <div ref={clearRef} className="group/select-control relative w-full min-w-0">
        <SelectTrigger
          size="default"
          aria-invalid={!!error}
          aria-describedby={error || hint ? descriptionId : undefined}
          id={id}
          className={cn(controlStyles.selectTrigger, showClear && controlStyles.selectClearable)}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        {showClear ? <KalosButton type="button" variant="ghost" size="icon" data-slot="select-clear" className={controlStyles.selectClear} aria-label={`清空${label}`} onClick={() => { change(""); clearRef.current?.querySelector<HTMLElement>('[role="combobox"], [data-slot="select-trigger"]')?.focus(); }}><X aria-hidden="true" /></KalosButton> : null}
      </div>
        <SelectContent ref={highlight} position="popper" align="start" className={cn(slidingHighlightClasses, controlStyles.selectMenu)}>
          <SelectGroup>
            {items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <KalosFieldMessage id={descriptionId} error={error} hint={hint} />
    </Field>
  );
}

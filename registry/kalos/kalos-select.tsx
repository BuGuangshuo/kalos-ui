"use client";

import { useCallback, useId, useRef, useState, type KeyboardEvent, type ReactNode, type Ref } from "react";
import { X } from "lucide-react";
import { KalosButton } from "./kalos-button";
import { cn } from "@/lib/utils";
import { Field } from "@/components/ui/field";
import { hasFieldContent, KalosFieldMessage } from "@/components/ui/kalos-field-message";
import { controlStyles } from "@/components/ui/kalos-styles";
import { useSelectFocus } from "@/components/ui/kalos-select-focus";
import { slidingHighlightClasses, useSlidingHighlight } from "@/components/ui/kalos-highlight";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";

export interface KalosSelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export type KalosSelectProps = (
  | { options: KalosSelectOption[]; items?: never }
  | { items: KalosSelectOption[]; options?: never }
) & {
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string, option: KalosSelectOption) => void;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  optional?: boolean;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  name?: string;
  required?: boolean;
  id?: string;
  className?: string;
  "aria-label"?: string;
  ref?: Ref<HTMLButtonElement>;
  clearable?: boolean;
};

function skipDisabledOptions(event: KeyboardEvent<HTMLDivElement>) {
  const { key } = event;
  if (key !== "ArrowUp" && key !== "ArrowDown" && key !== "Home" && key !== "End") return;

  const options = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('[role="option"]'));
  const current = options.findIndex(option => option === event.target);
  const step = key === "ArrowUp" || key === "End" ? -1 : 1;
  let next = key === "Home" ? 0 : key === "End" || (key === "ArrowUp" && current < 0)
    ? options.length - 1 : current + step;
  if (!options[next]?.hasAttribute("data-disabled")) return;

  // Base UI allows arrow-key focus on disabled items. Select skips over those rows.
  event.preventDefault();
  event.stopPropagation();
  while (options[next]?.hasAttribute("data-disabled")) next += step;
  options[next]?.focus();
}

export function KalosSelect({
  options,
  items,
  value,
  defaultValue = null,
  onChange,
  onValueChange,
  placeholder = "请选择",
  label,
  hint,
  error,
  optional,
  size = "md",
  disabled,
  name,
  required,
  id: providedId,
  className,
  "aria-label": ariaLabel,
  ref,
  clearable = false,
}: KalosSelectProps) {
  const choices = options ?? items;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = value === undefined ? internalValue : value;
  const selected = choices.find(option => option.value === currentValue);
  const controlRef = useRef<HTMLDivElement>(null);
  const { focused, popupRef, onOpenChange, finalFocus } = useSelectFocus(controlRef, disabled);
  const autoId = useId();
  const id = providedId ?? `${autoId}-trigger`;
  const labelId = `${autoId}-label`;
  const messageId = `${autoId}-message`;
  const hasLabel = hasFieldContent(label);
  const invalid = hasFieldContent(error);
  const describedBy = invalid || hasFieldContent(hint) ? messageId : undefined;
  const showClear = clearable && !!selected && !disabled;
  const clearName = ariaLabel ?? (typeof label === "string" && label ? label : "选择");
  const highlight = useSlidingHighlight(
    '[role="option"]',
    '[role="option"][data-highlighted]:not([data-disabled]), [role="option"][aria-selected="true"]:not([data-disabled])',
    true,
  );
  const contentRef = useCallback((node: HTMLElement | null) => {
    popupRef.current = node;
    highlight(node);
  }, [popupRef, highlight]);

  return (
    <Field data-invalid={invalid} data-disabled={disabled || undefined} className={cn("min-w-0 gap-1.5", className)}>
      {hasLabel && (
        <div className="flex items-baseline justify-between gap-2">
          <label
            id={labelId}
            htmlFor={id}
            onClickCapture={event => {
              event.preventDefault();
              event.stopPropagation();
            }}
            className={controlStyles.label}
          >
            {label}{required && <span aria-hidden="true" className={controlStyles.requiredMark}>*</span>}
          </label>
          {optional && !required && <span className={controlStyles.formStatus}>选填</span>}
        </div>
      )}
      <Select
        modal={false}
        name={name}
        disabled={disabled}
        required={required}
        items={choices}
        value={selected?.value ?? null}
        onOpenChange={(open, details) => {
          if (open && !choices.length) {
            details.cancel();
            return;
          }
          onOpenChange(open);
        }}
        onValueChange={(next) => {
          const option = choices.find(choice => choice.value === next);
          if (!option || option.disabled || next === currentValue) return;
          if (value === undefined) setInternalValue(option.value);
          onValueChange?.(option.value);
          onChange?.(option.value, option);
        }}
      >
        <div
          ref={controlRef}
          data-slot="select-control"
          data-size={size}
          data-focus-managed
          data-focused={focused || undefined}
          data-invalid={invalid}
          data-disabled={disabled || undefined}
          className={cn("group/select-control", controlStyles.selectControl)}
        >
          <SelectTrigger
            ref={ref}
            id={id}
            aria-label={ariaLabel ?? (hasLabel ? undefined : placeholder)}
            aria-labelledby={ariaLabel === undefined && hasLabel ? labelId : undefined}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            className={cn(controlStyles.selectTrigger, showClear && controlStyles.selectClearable)}
          >
            <SelectValue className="gap-2">
              {selected?.icon && <span aria-hidden="true" className={controlStyles.selectOptionIcon}>{selected.icon}</span>}
              <span className={cn("min-w-0 truncate", !selected && controlStyles.selectPlaceholder)} title={selected?.label}>
                {selected?.label ?? placeholder}
              </span>
            </SelectValue>
          </SelectTrigger>
          {showClear && (
            <KalosButton
              type="button"
              variant="ghost"
              size="icon"
              data-slot="select-clear"
              className={controlStyles.selectClear}
              aria-label={`清空${clearName}`}
              onClick={() => {
                if (value === undefined) setInternalValue(null);
                onValueChange?.("");
                controlRef.current?.querySelector<HTMLButtonElement>('[data-slot="select-trigger"]')?.focus();
              }}
            >
              <X aria-hidden="true" />
            </KalosButton>
          )}
        </div>
        <SelectContent
          ref={contentRef}
          finalFocus={finalFocus}
          alignItemWithTrigger={false}
          align="start"
          aria-labelledby={hasLabel ? labelId : undefined}
          aria-label={hasLabel ? undefined : ariaLabel ?? placeholder}
          onKeyDownCapture={choices.some(option => option.disabled) ? skipDisabledOptions : undefined}
          className={cn(slidingHighlightClasses, controlStyles.selectMenu)}
        >
          <SelectGroup>
            {choices.map(option => (
              <SelectItem key={option.value} value={option.value} label={option.label} disabled={option.disabled}>
                {option.icon && <span aria-hidden="true" className={controlStyles.selectOptionIcon}>{option.icon}</span>}
                <span className="grid min-w-0 flex-1">
                  <span className={controlStyles.selectOptionLabel}>{option.label}</span>
                  {option.description && <span className={controlStyles.selectOptionDescription}>{option.description}</span>}
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <KalosFieldMessage id={messageId} error={error} hint={hint} />
    </Field>
  );
}

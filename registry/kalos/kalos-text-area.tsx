"use client";

import * as React from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { controlStyles, textAreaDefaults } from "@/components/ui/kalos-styles";
import { cn } from "@/lib/utils";

export interface KalosTextAreaProps extends React.ComponentProps<"textarea"> {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  optional?: boolean;
  counter?: boolean;
  minRows?: number;
  maxRows?: number;
  onSubmitShortcut?: (value: string) => void;
  resizable?: boolean;
  inputClassName?: string;
}

export function KalosTextArea({
  label, hint, error, optional = false, counter = false,
  minRows = textAreaDefaults.minRows, maxRows = textAreaDefaults.maxRows,
  onSubmitShortcut, resizable = true,
  id, ref, className, inputClassName, value, defaultValue, onChange, onKeyDown,
  disabled, readOnly, required, maxLength, rows, ...props
}: KalosTextAreaProps) {
  const autoId = React.useId();
  const fieldId = id ?? autoId;
  const messageId = `${fieldId}-message`;
  const countId = `${fieldId}-count`;
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const manualHeight = React.useRef<number | null>(null);
  const drag = React.useRef<{ id: number; y: number; height: number } | null>(null);
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
  const minimumRows = Math.max(1, Math.floor(rows ?? minRows));
  const maximumRows = Math.max(minimumRows, Math.floor(maxRows));
  const text = String(value ?? internalValue);
  const showCount = counter && maxLength !== undefined && maxLength >= 0;
  const overLimit = showCount && text.length > maxLength;
  const invalid = !!error || overLimit || props["aria-invalid"] === true || props["aria-invalid"] === "true";
  const message = error || hint;
  const describedBy = [props["aria-describedby"], message ? messageId : null, showCount ? countId : null].filter(Boolean).join(" ") || undefined;

  React.useImperativeHandle(ref, () => inputRef.current!, []);

  const fit = React.useCallback(() => {
    const input = inputRef.current;
    if (!input) return;
    const style = getComputedStyle(input);
    const lineHeight = parseFloat(style.lineHeight) || textAreaDefaults.lineHeight;
    const padding = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    const minimum = minimumRows * lineHeight + padding;
    const maximum = maximumRows * lineHeight + padding;
    input.style.minHeight = `${minimum}px`;
    input.style.maxHeight = `${maximum}px`;
    input.style.height = "0px";
    const height = resizable && manualHeight.current !== null
      ? Math.max(minimum, Math.min(manualHeight.current, maximum))
      : Math.max(minimum, Math.min(input.scrollHeight, maximum));
    input.style.height = `${height}px`;
    input.style.overflowY = input.scrollHeight > height ? "auto" : "hidden";
  }, [minimumRows, maximumRows, resizable]);

  React.useLayoutEffect(() => { fit(); }, [fit, text, inputClassName]);
  React.useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    let width = input.getBoundingClientRect().width;
    const observer = new ResizeObserver(() => {
      const nextWidth = input.getBoundingClientRect().width;
      if (nextWidth !== width) { width = nextWidth; fit(); }
    });
    observer.observe(input);
    let active = true;
    document.fonts.ready.then(() => { if (active) fit(); });
    return () => { active = false; observer.disconnect(); };
  }, [fit]);
  React.useEffect(() => {
    const input = inputRef.current;
    const form = input?.form;
    if (!input || !form) return;
    let frame = 0;
    const reset = (event: Event) => {
      cancelAnimationFrame(frame);
      // React restores textarea defaults after its reset handlers finish.
      frame = requestAnimationFrame(() => {
        if (event.defaultPrevented) return;
        setInternalValue(input.value);
        manualHeight.current = null;
        fit();
      });
    };
    form.addEventListener("reset", reset);
    return () => { form.removeEventListener("reset", reset); cancelAnimationFrame(frame); };
  }, [fit, props.form]);

  function resize(height: number) {
    const input = inputRef.current;
    if (!input) return;
    manualHeight.current = Math.min(parseFloat(input.style.maxHeight), Math.max(parseFloat(input.style.minHeight), height));
    input.style.height = `${manualHeight.current}px`;
    input.style.overflowY = input.scrollHeight > manualHeight.current ? "auto" : "hidden";
  }

  return <Field data-slot="kalos-text-area" data-invalid={invalid} data-disabled={disabled || undefined} className={cn(controlStyles.textAreaField, className)}>
    {label ? <FieldLabel htmlFor={fieldId} className={controlStyles.label} onClickCapture={event => { event.preventDefault(); event.stopPropagation(); }}>
      {label}{required ? <span aria-hidden="true" className={controlStyles.requiredMark}>*</span> : optional ? <span className={controlStyles.textAreaOptional}>可选</span> : null}
    </FieldLabel> : null}
    <div className={controlStyles.textAreaSurface} data-invalid={invalid} data-disabled={disabled || undefined}>
      <Textarea {...props} id={fieldId} ref={inputRef} rows={minimumRows}
        value={value} defaultValue={defaultValue} disabled={disabled} readOnly={readOnly} required={required} maxLength={maxLength}
        className={cn(controlStyles.textAreaInput, resizable && controlStyles.textAreaWithResize, inputClassName)}
        aria-invalid={invalid || props["aria-invalid"]} aria-describedby={describedBy}
        aria-keyshortcuts={onSubmitShortcut ? "Meta+Enter Control+Enter" : props["aria-keyshortcuts"]}
        onChange={event => { setInternalValue(event.target.value); onChange?.(event); }}
        onKeyDown={event => {
          onKeyDown?.(event);
          if (!event.defaultPrevented && !event.nativeEvent.isComposing && !event.repeat && !disabled && !readOnly && event.key === "Enter" && (event.metaKey || event.ctrlKey) && onSubmitShortcut) {
            event.preventDefault();
            onSubmitShortcut(event.currentTarget.value);
          }
        }}
      />
      {resizable && !disabled ? <button type="button" className={controlStyles.textAreaResize} aria-label="调整文本域高度" aria-controls={fieldId} title="拖动调整高度，或使用上下方向键"
        onPointerDown={event => {
          if (!event.isPrimary || event.button !== 0 || !inputRef.current) return;
          event.preventDefault();
          event.currentTarget.focus({ preventScroll: true });
          event.currentTarget.setPointerCapture(event.pointerId);
          drag.current = { id: event.pointerId, y: event.clientY, height: inputRef.current.getBoundingClientRect().height };
        }}
        onPointerMove={event => { if (drag.current?.id === event.pointerId) resize(drag.current.height + event.clientY - drag.current.y); }}
        onPointerUp={event => { if (drag.current?.id === event.pointerId) { drag.current = null; event.currentTarget.releasePointerCapture(event.pointerId); } }}
        onPointerCancel={() => { drag.current = null; }} onLostPointerCapture={() => { drag.current = null; }}
        onKeyDown={event => {
          const input = inputRef.current;
          if (!input || !["ArrowUp", "ArrowDown", "Home"].includes(event.key)) return;
          event.preventDefault();
          const step = (parseFloat(getComputedStyle(input).lineHeight) || textAreaDefaults.lineHeight) * (event.shiftKey ? 5 : 1);
          resize(event.key === "Home" ? 0 : input.getBoundingClientRect().height + (event.key === "ArrowDown" ? step : -step));
        }}
      ><svg viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="m3 9 6-6M7 9l2-2" stroke="currentColor" strokeLinecap="round" /></svg></button> : null}
    </div>
    {message || showCount ? <div className={controlStyles.textAreaMeta}>
      {message ? <div id={messageId} role={error ? "alert" : undefined} className={error ? controlStyles.formError : controlStyles.formStatus}>{message}</div> : null}
      {showCount ? <span id={countId} className={cn(controlStyles.textAreaCount, overLimit && controlStyles.formError)}>{text.length.toLocaleString("zh-CN")} / {maxLength.toLocaleString("zh-CN")}</span> : null}
    </div> : null}
  </Field>;
}

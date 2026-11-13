"use client";
import { useCallback, useMemo, useRef, useState, type Ref } from "react";
import { Combobox } from "@base-ui/react/combobox";
import { Check, ChevronDown, Clock3 } from "lucide-react";
import { cn } from "cn";
import { KalosPickerField, usePickerIds, type KalosPickerFieldProps } from "@/components/ui/kalos-picker-field";
import { dateFormatter } from "@/components/ui/kalos-date-model";
import { parseTime, timeSlots, timeValue } from "@/components/ui/kalos-time-model";
import { useSelectFocus } from "@/components/ui/kalos-select-focus";
import { slidingHighlightClasses, useSlidingHighlight } from "@/components/ui/kalos-highlight";
import { controlStyles } from "@/components/ui/kalos-styles";
import { pickerCss } from "@/components/ui/kalos-picker-styles";

export type KalosTimePickerProps = KalosPickerFieldProps & {
  value?: string | null; defaultValue?: string | null; onChange?: (value: string | null) => void;
  step?: number; min?: string; max?: string; hourCycle?: 12 | 24; locale?: string; placeholder?: string; name?: string; readOnly?: boolean;
  open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void; ref?: Ref<HTMLInputElement>;
};
export function KalosTimePicker({ value, defaultValue = null, onChange, step = 15, min, max, hourCycle = 24, locale = "zh-CN", placeholder = "09:00", name, readOnly = false, open: controlledOpen, defaultOpen = false, onOpenChange, ref, ...field }: KalosTimePickerProps) {
  const minimum = parseTime(min) ?? 0, maximum = parseTime(max) != null && parseTime(max)! >= minimum ? parseTime(max)! : 1439;
  const normalize = (text?: string | null) => { const minutes = parseTime(text); return minutes == null ? null : timeValue(minutes); };
  const [own, setOwn] = useState(() => normalize(defaultValue));
  const current = normalize(value === undefined ? own : value);
  const [draft, setDraft] = useState<string | null>(null), [ownOpen, setOwnOpen] = useState(defaultOpen);
  const control = useRef<HTMLDivElement>(null), input = useRef<HTMLInputElement>(null), navigated = useRef(false);
  const { focused, popupRef, onOpenChange: focusOpenChange, finalFocus } = useSelectFocus(control, field.disabled);
  const ids = usePickerIds(field.id);
  const options = useMemo(() => timeSlots(step, minimum, maximum), [step, minimum, maximum]);
  const formatter = useMemo(() => dateFormatter(locale, { hour: "2-digit", minute: "2-digit", hour12: hourCycle === 12 }), [locale, hourCycle]);
  const format = useCallback((time: string) => { const minutes = parseTime(time); return minutes == null ? "" : formatter.format(new Date(2000, 0, 1, Math.floor(minutes / 60), minutes % 60)); }, [formatter]);
  const shown = current ? format(current) : "";
  const open = !field.disabled && !readOnly && (controlledOpen ?? ownOpen);
  const highlight = useSlidingHighlight('[role="option"]', '[role="option"][data-highlighted], [role="option"][aria-selected="true"]', true);
  const listRef = useCallback((node: HTMLDivElement | null) => { popupRef.current = node; highlight(node); }, [popupRef, highlight]);
  function changeOpen(next: boolean) { if (controlledOpen === undefined) setOwnOpen(next); focusOpenChange(next); onOpenChange?.(next); }
  function commit(next: string | null) { if (value === undefined) setOwn(next); if (next !== current) onChange?.(next); setDraft(null); }
  function settle() { if (draft === null) return; const minutes = parseTime(draft); if (!draft.trim()) commit(null); else if (minutes != null && minutes >= minimum && minutes <= maximum) commit(timeValue(minutes)); else setDraft(null); }
  return <KalosPickerField {...field} {...ids}>
    <style href="kalos-picker" precedence="default">{pickerCss}</style>
    <Combobox.Root<string> items={options} filter={null} value={current} defaultValue={normalize(defaultValue)} onValueChange={commit} inputValue={draft ?? shown} onInputValueChange={(text, details) => { if (details.reason === "input-change") { setDraft(text); navigated.current = false; } }} itemToStringLabel={format} name={name} disabled={field.disabled} required={field.required} open={open} onOpenChange={changeOpen} onItemHighlighted={(_, details) => { if (details.reason === "keyboard") navigated.current = true; }}>
      <div ref={control} className={cn(controlStyles.selectControl, "kalos-picker-control kalos-time-control")} data-focus-managed data-focused={focused || undefined} data-invalid={!!field.error} data-disabled={field.disabled || undefined}>
        <Clock3 strokeWidth={1.5} aria-hidden="true" />
        <Combobox.Input id={ids.id} ref={node => { input.current = node; if (typeof ref === "function") ref(node); else if (ref) ref.current = node; }} className={controlStyles.inputContent} placeholder={placeholder} readOnly={readOnly} aria-label={field.label == null ? field["aria-label"] ?? "选择时间" : undefined} aria-labelledby={field.label != null ? ids.labelId : undefined} aria-describedby={field.error || field.hint ? ids.messageId : undefined} aria-invalid={!!field.error} onBlur={settle} onKeyDown={event => {
          if (event.key === "Enter" && draft !== null && !navigated.current) { event.preventDefault(); settle(); changeOpen(false); }
          if (event.key === "Escape" && !open) setDraft(null);
        }} />
        <Combobox.Trigger className="kalos-time-toggle" tabIndex={-1} disabled={field.disabled || readOnly} aria-label="展开时间列表"><ChevronDown strokeWidth={1.5} aria-hidden="true" className="kalos-picker-chevron" /></Combobox.Trigger>
      </div>
      <Combobox.Portal><Combobox.Positioner anchor={control} sideOffset={6} align="start" collisionPadding={8} className="kalos-picker-positioner"><Combobox.Popup className="kalos-picker-popup kalos-time-popup" finalFocus={finalFocus}><Combobox.List ref={listRef} aria-label={typeof field.label === "string" ? field.label : field["aria-label"] ?? "可选时间"} className={cn(slidingHighlightClasses, controlStyles.selectMenu, "kalos-time-list")}>
        {options.map(time => <Combobox.Item key={time} value={time} className="kalos-time-option">{format(time)}<Combobox.ItemIndicator className="kalos-time-check"><Check aria-hidden="true" /></Combobox.ItemIndicator></Combobox.Item>)}
      </Combobox.List></Combobox.Popup></Combobox.Positioner></Combobox.Portal>
    </Combobox.Root>
  </KalosPickerField>;
}

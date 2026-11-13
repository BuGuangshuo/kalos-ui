"use client";
import { useRef, useState, type Ref } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";
import { Popover } from "@base-ui/react/popover";
import { cn } from "cn";
import { KalosCalendar } from "@/components/ui/kalos-calendar";
import { clampDay, dateFormatter, dateKey, localDay, monthStart, validDate } from "@/components/ui/kalos-date-model";
import { KalosPickerField, usePickerIds, type KalosPickerFieldProps } from "@/components/ui/kalos-picker-field";
import { useSelectFocus } from "@/components/ui/kalos-select-focus";
import { controlStyles } from "@/components/ui/kalos-styles";
import { pickerCss } from "@/components/ui/kalos-picker-styles";

export type KalosDatePickerProps = KalosPickerFieldProps & {
  value?: Date | null; defaultValue?: Date | null; onChange?: (date: Date) => void;
  min?: Date; max?: Date; isDateDisabled?: (date: Date) => boolean; locale?: string; weekStartsOn?: 0 | 1;
  placeholder?: string; name?: string; today?: Date; open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void; ref?: Ref<HTMLButtonElement>;
};
export function KalosDatePicker({ value, defaultValue = null, onChange, min, max, isDateDisabled, locale = "zh-CN", weekStartsOn = 1, placeholder = "选择日期", name, today: todayProp, open: controlledOpen, defaultOpen = false, onOpenChange, ref, ...field }: KalosDatePickerProps) {
  const today = localDay(validDate(todayProp) ? todayProp : new Date());
  const minimum = validDate(min) ? localDay(min) : undefined;
  const maximum = validDate(max) && (!minimum || max >= minimum) ? localDay(max) : undefined;
  const [own, setOwn] = useState(defaultValue);
  const selected = value === undefined ? own : value;
  const current = validDate(selected) ? localDay(selected) : null;
  const [ownOpen, setOwnOpen] = useState(defaultOpen);
  const open = !field.disabled && (controlledOpen ?? ownOpen);
  const [month, setMonth] = useState(() => monthStart(clampDay(current ?? today, minimum, maximum)));
  const ids = usePickerIds(field.id), valueId = `${ids.id}-value`;
  const control = useRef<HTMLDivElement>(null), keyboard = useRef(false);
  const { focused, popupRef, onOpenChange: focusOpenChange, finalFocus } = useSelectFocus(control, field.disabled);
  function changeOpen(next: boolean) {
    if (next && field.disabled) return;
    if (controlledOpen === undefined) setOwnOpen(next);
    if (next) setMonth(monthStart(clampDay(current ?? today, minimum, maximum)));
    focusOpenChange(next); onOpenChange?.(next);
  }
  return <KalosPickerField {...field} {...ids}>
    <style href="kalos-picker" precedence="default">{pickerCss}</style>
    <Popover.Root open={open} onOpenChange={changeOpen}>
      <div ref={control} className={cn(controlStyles.selectControl, "kalos-picker-control")} data-focus-managed data-focused={focused || undefined} data-invalid={!!field.error} data-disabled={field.disabled || undefined}>
        <Popover.Trigger id={ids.id} ref={ref} disabled={field.disabled} className={cn(controlStyles.selectTrigger, "kalos-picker-trigger")} aria-label={field.label == null ? field["aria-label"] ?? "选择日期" : undefined} aria-labelledby={field.label != null ? `${ids.labelId} ${valueId}` : undefined} aria-describedby={field.error || field.hint ? ids.messageId : undefined} aria-invalid={!!field.error} aria-required={field.required || undefined} onKeyDown={event => {
          if (["Enter", " ", "ArrowDown"].includes(event.key)) keyboard.current = true;
          if (event.key === "ArrowDown") { event.preventDefault(); changeOpen(true); }
        }}>
          <CalendarDays strokeWidth={1.5} aria-hidden="true" />
          <span id={valueId} key={current ? dateKey(current) : "empty"} className="kalos-picker-value" data-empty={!current || undefined}>{current ? dateFormatter(locale, { year: "numeric", month: "short", day: "numeric", weekday: "short" }).format(current) : placeholder}</span>
          <ChevronDown strokeWidth={1.5} aria-hidden="true" className="kalos-picker-chevron" />
        </Popover.Trigger>
      </div>
      <Popover.Portal><Popover.Positioner sideOffset={6} align="start" collisionPadding={8} className="kalos-picker-positioner">
        <Popover.Popup ref={node => { popupRef.current = node; }} className="kalos-picker-popup kalos-date-popup" aria-label="选择日期" initialFocus={() => { const target = keyboard.current ? popupRef.current?.querySelector<HTMLElement>('[data-date][tabindex="0"]') : false; keyboard.current = false; return target || (!defaultOpen ? popupRef.current : false); }} finalFocus={finalFocus}>
          <KalosCalendar month={month} onMonthChange={setMonth} value={current} today={today} min={minimum} max={maximum} isDateDisabled={isDateDisabled} locale={locale} weekStartsOn={weekStartsOn} onSelect={date => { if (value === undefined) setOwn(date); onChange?.(date); changeOpen(false); }} />
        </Popover.Popup>
      </Popover.Positioner></Popover.Portal>
    </Popover.Root>
    {name ? <input type="hidden" name={name} value={current ? dateKey(current) : ""} disabled={field.disabled} /> : null}
  </KalosPickerField>;
}

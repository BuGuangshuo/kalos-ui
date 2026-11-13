"use client";
import { useRef, useState, useSyncExternalStore, type Ref } from "react";
import { Popover } from "@base-ui/react/popover";
import { CalendarDays, ChevronDown, X } from "lucide-react";
import { cn } from "cn";
import { KalosButton } from "./kalos-button";
import { KalosCalendar } from "@/components/ui/kalos-calendar";
import { addDays, addMonths, clampDay, dateKey, datePresets, dayCount, formatRange, localDay, monthStart, orderedRange, validDate, type KalosDateRange } from "@/components/ui/kalos-date-model";
import { KalosPickerField, usePickerIds, type KalosPickerFieldProps } from "@/components/ui/kalos-picker-field";
import { useSelectFocus } from "@/components/ui/kalos-select-focus";
import { controlStyles } from "@/components/ui/kalos-styles";
import { pickerCss } from "@/components/ui/kalos-picker-styles";

export type { KalosDateRange } from "@/components/ui/kalos-date-model";
export type KalosDatePreset = { id: string; label: string; range: (today: Date) => KalosDateRange };
export type KalosDateRangePickerProps = KalosPickerFieldProps & {
  value?: KalosDateRange | null; defaultValue?: KalosDateRange | null; onChange?: (range: KalosDateRange | null) => void;
  presets?: KalosDatePreset[]; min?: Date; max?: Date; today?: Date; locale?: string; weekStartsOn?: 0 | 1;
  name?: string; placeholder?: string; clearable?: boolean; open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void; inline?: boolean; ref?: Ref<HTMLButtonElement>;
};
function subscribeSmall(update: () => void) { const query = matchMedia("(max-width: 600px)"); query.addEventListener("change", update); return () => query.removeEventListener("change", update); }
const smallSnapshot = () => matchMedia("(max-width: 600px)").matches;
const serverSmall = () => false;
const validRange = (range?: KalosDateRange | null): range is KalosDateRange => !!range && validDate(range.start) && validDate(range.end);

export function KalosDateRangePicker({ value, defaultValue, onChange, presets = datePresets, min, max, today: todayProp, locale = "zh-CN", weekStartsOn = 1, name, placeholder = "选择日期范围", clearable = true, open: controlledOpen, defaultOpen = false, onOpenChange, inline = false, ref, ...field }: KalosDateRangePickerProps) {
  const today = localDay(validDate(todayProp) ? todayProp : new Date());
  const minimum = validDate(min) ? localDay(min) : undefined;
  const maximum = validDate(max) && (!minimum || localDay(max) >= minimum) ? localDay(max) : !minimum || today >= minimum ? today : undefined;
  const normalize = (range: KalosDateRange) => orderedRange(clampDay(range.start, minimum, maximum), clampDay(range.end, minimum, maximum));
  const initial = normalize(validRange(defaultValue) ? defaultValue : { start: addDays(today, -29), end: today });
  const [own, setOwn] = useState<KalosDateRange | null>(() => defaultValue === null ? null : initial);
  const selected = value === undefined ? own : validRange(value) ? orderedRange(value.start, value.end) : null;
  const [draft, setDraft] = useState<KalosDateRange | null>(selected), [anchor, setAnchor] = useState<Date | null>(null), [hover, setHover] = useState<Date | null>(null);
  const [presetId, setPresetId] = useState<string | null>(null);
  const [appliedPreset, setAppliedPreset] = useState<{ id: string; start: string; end: string } | null>(null);
  const [month, setMonth] = useState(() => addMonths(monthStart((selected ?? initial).end), -1));
  const [ownOpen, setOwnOpen] = useState(defaultOpen);
  const ids = usePickerIds(field.id), control = useRef<HTMLDivElement>(null);
  const { focused, popupRef, onOpenChange: focusOpenChange, finalFocus } = useSelectFocus(control, field.disabled);
  const small = useSyncExternalStore(subscribeSmall, smallSnapshot, serverSmall);
  const open = !field.disabled && (controlledOpen ?? ownOpen);
  const selectedStamp = selected ? `${dateKey(selected.start)}/${dateKey(selected.end)}` : "empty";
  const [knownSelection, setKnownSelection] = useState(selectedStamp);
  const restoredPreset = selected && appliedPreset && dateKey(selected.start) === appliedPreset.start && dateKey(selected.end) === appliedPreset.end ? appliedPreset.id : null;
  const showClear = clearable && !!selected && !field.disabled;
  if (inline && knownSelection !== selectedStamp) { setKnownSelection(selectedStamp); setDraft(selected ? normalize(selected) : null); setPresetId(restoredPreset); setAnchor(null); setHover(null); }
  function resetDraft() { const next = selected ? normalize(selected) : null; setDraft(next); setPresetId(restoredPreset); setAnchor(null); setHover(null); setMonth(addMonths(monthStart((next ?? initial).end), -1)); }
  function changeOpen(next: boolean) { if (next && field.disabled) return; if (controlledOpen === undefined) setOwnOpen(next); if (next) resetDraft(); focusOpenChange(next); onOpenChange?.(next); }
  function clear() { if (field.disabled) return; if (value === undefined) setOwn(null); setDraft(null); setPresetId(null); setAppliedPreset(null); setAnchor(null); setHover(null); setMonth(addMonths(monthStart(initial.end), -1)); onChange?.(null); changeOpen(false); control.current?.querySelector<HTMLButtonElement>('[data-slot="date-range-trigger"]')?.focus(); }
  const panel = <div className="kalos-range-panel">
    <div className="kalos-range-main">
      <div className="kalos-range-presets" role="group" aria-label="快捷日期范围">{presets.map(preset => {
        const raw = preset.range(today), usable = validRange(raw) && !(maximum && raw.start > maximum || minimum && raw.end < minimum);
        const range = usable ? normalize(raw) : null;
        return <button key={preset.id} type="button" disabled={!usable || field.disabled} aria-pressed={presetId === preset.id} onClick={() => { if (!range) return; setDraft(range); setPresetId(preset.id); setAnchor(null); setHover(null); setMonth(addMonths(monthStart(range.end), -1)); }}>{preset.label}</button>;
      })}</div>
      <div className="kalos-range-calendars"><KalosCalendar month={small ? addMonths(month, 1) : month} onMonthChange={next => setMonth(small ? addMonths(next, -1) : next)} months={small ? 1 : 2} disabled={field.disabled} today={today} min={minimum} max={maximum} locale={locale} weekStartsOn={weekStartsOn} range={draft} preview={anchor && hover ? orderedRange(anchor, hover) : null} onHover={setHover} onSelect={date => {
        if (field.disabled) return;
        setPresetId(null);
        if (anchor) { setDraft(orderedRange(anchor, date)); setAnchor(null); setHover(null); }
        else { setDraft({ start: date, end: date }); setAnchor(date); setHover(null); }
      }} /></div>
    </div>
    <div className="kalos-range-footer">
      <div className="kalos-range-summary" aria-live="polite"><span>{draft ? formatRange(draft, locale) : "选择起止日期"}</span>{draft ? <span>{anchor ? "请选择结束日期" : `${dayCount(draft)} 天`}</span> : null}</div>
        <div className="kalos-range-actions"><KalosButton size="sm" variant="outline" disabled={field.disabled} onClick={() => { resetDraft(); changeOpen(false); }}>取消</KalosButton><KalosButton size="sm" disabled={!draft || !!anchor || field.disabled} onClick={() => { if (!draft) return; if (value === undefined) setOwn(draft); setAppliedPreset(presetId ? { id: presetId, start: dateKey(draft.start), end: dateKey(draft.end) } : null); onChange?.(draft); changeOpen(false); }}>应用</KalosButton></div>
    </div>
  </div>;
  const styles = <style href="kalos-picker" precedence="default">{pickerCss}</style>;
  const hidden = name ? <><input type="hidden" name={`${name}.start`} value={selected ? dateKey(selected.start) : ""} disabled={field.disabled} /><input type="hidden" name={`${name}.end`} value={selected ? dateKey(selected.end) : ""} disabled={field.disabled} /></> : null;
  if (inline) return <div className={cn("kalos-picker-popup kalos-range-popup", field.className)} role="group" aria-label={field["aria-label"] ?? "日期范围"}>{styles}{panel}{hidden}</div>;
  return <KalosPickerField {...field} {...ids} className={cn("kalos-range-field", field.className)}>
    {styles}
    <Popover.Root open={open} onOpenChange={changeOpen}>
      <div ref={control} className={cn(controlStyles.selectControl, "group/select-control kalos-picker-control kalos-range-control")} data-focus-managed data-focused={focused || undefined} data-invalid={!!field.error} data-disabled={field.disabled || undefined}>
        <Popover.Trigger ref={ref} id={ids.id} data-slot="date-range-trigger" disabled={field.disabled} className={cn(controlStyles.selectTrigger, "kalos-picker-trigger")} aria-label={field.label == null ? `${field["aria-label"] ?? "日期范围"}：${selected ? formatRange(selected, locale) : placeholder}` : undefined} aria-labelledby={field.label != null ? `${ids.labelId} ${ids.id}-value` : undefined} aria-describedby={field.error || field.hint ? ids.messageId : undefined} aria-invalid={!!field.error} aria-required={field.required || undefined}>
          <CalendarDays strokeWidth={1.5} aria-hidden="true" /><span key={selectedStamp} id={`${ids.id}-value`} className="kalos-picker-value" data-empty={!selected || undefined}>{selected ? formatRange(selected, locale) : placeholder}</span><ChevronDown strokeWidth={1.5} aria-hidden="true" className="kalos-picker-chevron" />
        </Popover.Trigger>
        {showClear ? <KalosButton type="button" variant="ghost" size="icon" data-slot="select-clear" className={controlStyles.selectClear} aria-label="清空日期范围" aria-controls={ids.id} onClick={clear}><X aria-hidden="true" /></KalosButton> : null}
      </div>
      <Popover.Portal><Popover.Positioner sideOffset={6} align="start" collisionPadding={8} className="kalos-picker-positioner"><Popover.Popup ref={node => { popupRef.current = node; }} className="kalos-picker-popup kalos-range-popup" aria-label="选择日期范围" initialFocus={false} finalFocus={finalFocus}>{panel}</Popover.Popup></Popover.Positioner></Popover.Portal>
    </Popover.Root>
    {hidden}
  </KalosPickerField>;
}

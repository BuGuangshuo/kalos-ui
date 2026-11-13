"use client";
import { useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { addDays, addMonths, calendarDays, clampDay, dateFormatter, dateKey, localDay, monthStart, sameDay, sameMonth, type KalosDateRange } from "./kalos-date-model";

export type KalosCalendarProps = {
  month: Date; onMonthChange: (date: Date) => void; value?: Date | null; range?: KalosDateRange | null;
  preview?: KalosDateRange | null; today: Date; min?: Date; max?: Date; isDateDisabled?: (date: Date) => boolean; locale?: string; weekStartsOn?: 0 | 1;
  months?: 1 | 2; disabled?: boolean; onSelect: (date: Date) => void; onHover?: (date: Date | null) => void;
};
export function KalosCalendar({ month, onMonthChange, value, range, preview, today, min, max, isDateDisabled, locale = "zh-CN", weekStartsOn = 1, months = 1, disabled: inactive = false, onSelect, onHover }: KalosCalendarProps) {
  const [focused, setFocused] = useState(() => clampDay(value ?? range?.end ?? today, min, max));
  const root = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef<string | null>(null);
  const [motion, setMotion] = useState({ month: month.getTime(), direction: 1 });
  if (motion.month !== month.getTime()) setMotion({ month: month.getTime(), direction: month.getTime() < motion.month ? -1 : 1 });
  const direction = motion.direction;
  const accessibleDate = dateFormatter(locale, { year: "numeric", month: "long", day: "numeric", weekday: "long" });
  useLayoutEffect(() => { if (pendingFocus.current) { root.current?.querySelector<HTMLButtonElement>(`[data-date="${pendingFocus.current}"]`)?.focus(); pendingFocus.current = null; } }, [month, focused]);
  const endMonth = addMonths(monthStart(month), months);
  const visibleFocus = focused >= monthStart(month) && focused < endMonth ? focused : monthStart(month);
  const disabled = (date: Date) => !!(inactive || min && date < localDay(min) || max && date > localDay(max) || isDateDisabled?.(date));
  const within = (date: Date, selected?: KalosDateRange | null) => !!selected && date >= selected.start && date <= selected.end;
  const navigate = (offset: number) => { const next = addMonths(monthStart(month), offset); onMonthChange(next); setFocused(addMonths(visibleFocus, offset)); };
  function keyboard(event: KeyboardEvent<HTMLButtonElement>, date: Date) {
    if (inactive) return;
    let next: Date;
    const start = (date.getDay() - weekStartsOn + 7) % 7;
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
    switch (event.key) {
      case "ArrowLeft": next = addDays(date, rtl ? 1 : -1); break;
      case "ArrowRight": next = addDays(date, rtl ? -1 : 1); break;
      case "ArrowUp": next = addDays(date, -7); break;
      case "ArrowDown": next = addDays(date, 7); break;
      case "Home": next = addDays(date, -start); break;
      case "End": next = addDays(date, 6 - start); break;
      case "PageUp": next = addMonths(date, event.shiftKey ? -12 : -1); break;
      case "PageDown": next = addMonths(date, event.shiftKey ? 12 : 1); break;
      default: return;
    }
    event.preventDefault(); next = localDay(next); pendingFocus.current = dateKey(next); setFocused(next);
    if (next < monthStart(month)) onMonthChange(monthStart(next)); else if (next >= endMonth) onMonthChange(addMonths(monthStart(next), 1 - months));
    onHover?.(disabled(next) ? null : next);
  }
  return <div ref={root} className="kalos-calendar" data-months={months} onMouseLeave={() => onHover?.(null)}>
    <div className="kalos-calendar-nav">
      <button type="button" aria-label="上个月" disabled={inactive} onClick={() => navigate(-1)}><ChevronLeft aria-hidden="true" /></button>
      <button type="button" aria-label="下个月" disabled={inactive} onClick={() => navigate(1)}><ChevronRight aria-hidden="true" /></button>
    </div>
    {Array.from({ length: months }, (_, index) => {
      const shown = addMonths(monthStart(month), index), days = calendarDays(shown, weekStartsOn);
      const title = dateFormatter(locale, { year: "numeric", month: "long" }).format(shown);
      return <div key={dateKey(shown)} className="kalos-calendar-month" data-second={index === 1 || undefined} data-direction={direction}>
        <div className="kalos-calendar-title" aria-live="polite">{title}</div>
        <div role="grid" aria-label={title} className="kalos-calendar-grid">
          <div role="row" className="kalos-calendar-weekdays">{Array.from({ length: 7 }, (_, day) => <span key={day} role="columnheader" aria-label={`星期${["日", "一", "二", "三", "四", "五", "六"][(day + weekStartsOn) % 7]}`}>{["日", "一", "二", "三", "四", "五", "六"][(day + weekStartsOn) % 7]}</span>)}</div>
          {Array.from({ length: 6 }, (_, week) => <div key={week} role="row" className="kalos-calendar-week">{days.slice(week * 7, week * 7 + 7).map(date => {
            const outside = !sameMonth(date, shown), chosen = sameDay(value, date) || sameDay(range?.start, date) || sameDay(range?.end, date);
            const band = preview ?? range;
            return <span key={dateKey(date)} role="gridcell" aria-selected={sameDay(value, date) || within(date, range)} className="kalos-calendar-cell" data-row-start={!outside && (date.getDay() === weekStartsOn || date.getDate() === 1) || undefined} data-row-end={!outside && ((date.getDay() - weekStartsOn + 7) % 7 === 6 || !sameMonth(addDays(date, 1), shown)) || undefined} data-range={!outside && within(date, band) || undefined} data-preview={!!preview || undefined} data-start={sameDay(band?.start, date) || undefined} data-end={sameDay(band?.end, date) || undefined}>
              {months === 2 && outside ? null : <button type="button" data-date={dateKey(date)} data-outside={outside || undefined} data-selected={chosen || undefined} aria-current={sameDay(date, today) ? "date" : undefined} aria-disabled={disabled(date) || undefined} aria-label={accessibleDate.format(date)} tabIndex={!inactive && sameDay(visibleFocus, date) && (!outside || months === 1) ? 0 : -1} onFocus={() => setFocused(date)} onMouseEnter={() => onHover?.(disabled(date) ? null : date)} onKeyDown={event => keyboard(event, date)} onClick={() => { if (!disabled(date)) onSelect(localDay(date)); }}>{date.getDate()}</button>}
            </span>;
          })}</div>)}
        </div>
      </div>;
    })}
  </div>;
}

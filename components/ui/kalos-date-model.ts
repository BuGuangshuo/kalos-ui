export type KalosDateRange = { start: Date; end: Date };
export const validDate = (value: unknown): value is Date => value instanceof Date && Number.isFinite(value.getTime());
export function localDay(value: Date) { const day = new Date(value); day.setHours(0, 0, 0, 0); return day; }
export function addDays(value: Date, amount: number) { const day = localDay(value); day.setDate(day.getDate() + amount); return day; }
export function monthStart(value: Date) { const day = localDay(value); day.setDate(1); return day; }
export function addMonths(value: Date, amount: number) {
  const day = monthStart(value); day.setMonth(day.getMonth() + amount);
  const last = new Date(day); last.setMonth(last.getMonth() + 1); last.setDate(0);
  day.setDate(Math.min(value.getDate(), last.getDate())); return day;
}
export function dateKey(value: Date) { return `${String(value.getFullYear()).padStart(4, "0")}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`; }
export const sameDay = (a?: Date | null, b?: Date | null) => !!a && !!b && dateKey(a) === dateKey(b);
export const sameMonth = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
export function dayCount(range: KalosDateRange) { return Math.round((Date.UTC(range.end.getFullYear(), range.end.getMonth(), range.end.getDate()) - Date.UTC(range.start.getFullYear(), range.start.getMonth(), range.start.getDate())) / 86400000) + 1; }
export function orderedRange(a: Date, b: Date): KalosDateRange { return a <= b ? { start: localDay(a), end: localDay(b) } : { start: localDay(b), end: localDay(a) }; }
export function calendarDays(month: Date, weekStartsOn = 1) { const first = monthStart(month); const start = addDays(first, -((first.getDay() - weekStartsOn + 7) % 7)); return Array.from({ length: 42 }, (_, index) => addDays(start, index)); }
export function dateFormatter(locale = "zh-CN", options: Intl.DateTimeFormatOptions = {}) {
  try { return new Intl.DateTimeFormat(locale, { calendar: "gregory", ...options }); }
  catch { return new Intl.DateTimeFormat("zh-CN", { calendar: "gregory", ...options }); }
}
export function formatRange(range: KalosDateRange, locale = "zh-CN") { const format = dateFormatter(locale, { year: "numeric", month: "short", day: "numeric" }); return `${format.format(range.start)} – ${format.format(range.end)}`; }
export function clampDay(value: Date, min?: Date, max?: Date) { return min && value < localDay(min) ? localDay(min) : max && value > localDay(max) ? localDay(max) : localDay(value); }
export const datePresets = [
  { id: "today", label: "今天", range: (today: Date) => ({ start: today, end: today }) },
  { id: "yesterday", label: "昨天", range: (today: Date) => ({ start: addDays(today, -1), end: addDays(today, -1) }) },
  ...[7, 30, 90].map(days => ({ id: `last-${days}`, label: `最近 ${days} 天`, range: (today: Date) => ({ start: addDays(today, 1 - days), end: today }) })),
  { id: "month", label: "本月", range: (today: Date) => ({ start: monthStart(today), end: today }) },
  { id: "last-month", label: "上月", range: (today: Date) => ({ start: addMonths(monthStart(today), -1), end: addDays(monthStart(today), -1) }) },
  { id: "quarter", label: "本季度", range: (today: Date) => ({ start: addMonths(monthStart(today), -(today.getMonth() % 3)), end: today }) },
  { id: "year", label: "今年至今", range: (today: Date) => { const start = monthStart(today); start.setMonth(0); return { start, end: today }; } },
];

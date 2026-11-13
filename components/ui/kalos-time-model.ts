export function parseTime(value?: string | null): number | null {
  if (!value?.trim()) return null;
  const text = value.trim().toLowerCase().replace(/[０-９]/g, digit => String(digit.charCodeAt(0) - 65296)).replace(/\s+/g, "");
  const pm = /(?:pm|下午|晚上)/.test(text), am = /(?:am|上午|早上)/.test(text);
  if (pm && am) return null;
  const period = pm ? "pm" : am ? "am" : undefined;
  const clean = text.replace(/(?:am|pm|上午|下午|早上|晚上)/g, "");
  let hour: number, minute: number;
  if (/^\d{1,2}[:.]\d{1,2}$/.test(clean)) [hour, minute] = clean.split(/[:.]/).map(Number);
  else if (/^\d{1,4}$/.test(clean)) { hour = Number(clean.length <= 2 ? clean : clean.slice(0, -2)); minute = clean.length <= 2 ? 0 : Number(clean.slice(-2)); }
  else return null;
  if (minute > 59 || hour > (period ? 12 : 23) || (period && hour < 1)) return null;
  if (period) hour = hour % 12 + (period === "pm" ? 12 : 0);
  return hour * 60 + minute;
}
export function timeValue(minutes: number) { return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`; }
export function timeSlots(step = 15, min = 0, max = 1439) { const interval = Number.isFinite(step) && step >= 1 ? Math.min(1440, Math.floor(step)) : 15; return Array.from({ length: Math.floor((max - min) / interval) + 1 }, (_, index) => timeValue(min + index * interval)); }

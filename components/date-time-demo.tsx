"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { KalosDatePicker } from "@/registry/kalos/kalos-date-picker";
import { KalosDateRangePicker } from "@/registry/kalos/kalos-date-range-picker";
import { KalosTimePicker } from "@/registry/kalos/kalos-time-picker";
import { controlStyles } from "@/components/ui/kalos-styles";
import { cn } from "cn";

// A fixed reference day keeps documentation previews stable during hydration.
const today = new Date(2026, 10, 13);
const weekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6;
export function DatePickerDemo() {
  const [start, setStart] = useState<Date | null>(new Date(2026, 10, 16));
  const [end, setEnd] = useState<Date | null>(null);
  return <Card className={cn(controlStyles.formCard, "picker-demo-card")}><CardContent><FieldGroup>
    <KalosDatePicker label="首次发送" value={start} onChange={setStart} min={today} today={today} isDateDisabled={weekend} hint="仅工作日可选" />
    <KalosDatePicker label="截止日期" optional value={end} onChange={setEnd} min={start ?? today} today={today} placeholder="持续发送" />
  </FieldGroup></CardContent></Card>;
}
export function DateRangePickerDemo({ compact = false }: { compact?: boolean }) {
  return <div className={cn("range-picker-demo", compact && "range-picker-demo-compact")}><KalosDateRangePicker today={today} defaultOpen={!compact} inline={compact} /></div>;
}
export function TimePickerDemo() {
  const [start, setStart] = useState<string | null>("09:30");
  const [end, setEnd] = useState<string | null>(null);
  return <Card className={cn(controlStyles.formCard, "picker-demo-card")}><CardContent><FieldGroup>
    <KalosTimePicker label="发送时间" value={start} onChange={setStart} min="09:00" max="18:00" step={15} hint="可选 09:00–18:00" />
    <KalosTimePicker label="最晚发送" optional value={end} onChange={setEnd} min={start ?? "09:00"} step={30} placeholder="不限时间" />
  </FieldGroup></CardContent></Card>;
}

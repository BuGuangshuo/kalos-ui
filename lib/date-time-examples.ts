export function datePickerExample() { return `"use client";

import { useState } from "react";
import { KalosDatePicker } from "@/components/ui/kalos-date-picker";

export default function Example() {
  const [date, setDate] = useState<Date | null>(null);
  return <KalosDatePicker
    label="发送日期"
    value={date}
    onChange={setDate}
    min={new Date()}
    isDateDisabled={day => day.getDay() === 0 || day.getDay() === 6}
    hint="仅工作日可选"
    name="sendDate"
  />;
}`; }
export function dateRangePickerExample() { return `"use client";

import { useState } from "react";
import { KalosDateRangePicker, type KalosDateRange } from "@/components/ui/kalos-date-range-picker";

export default function Example() {
  const [range, setRange] = useState<KalosDateRange | null>(null);
  return <KalosDateRangePicker
    label="统计时间"
    value={range}
    name="period"
    onChange={next => {
      setRange(next);
      if (!next) return; // null 表示清空已应用的范围。
      // 在这里使用已确认的日期范围请求数据。
      console.log(next);
    }}
  />;
}`; }
export function timePickerExample() { return `"use client";

import { useState } from "react";
import { KalosTimePicker } from "@/components/ui/kalos-time-picker";

export default function Example() {
  const [time, setTime] = useState<string | null>("09:30");
  return <KalosTimePicker
    label="发送时间"
    value={time}
    onChange={setTime}
    step={15}
    min="09:00"
    max="18:00"
    hourCycle={24}
    name="sendAt"
    hint="可选 09:00–18:00"
  />;
}`; }

import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { addMonths, calendarDays, dateKey, dayCount, orderedRange } from "../components/ui/kalos-date-model.ts";
import { parseTime, timeSlots, timeValue } from "../components/ui/kalos-time-model.ts";

test("calendar starts on Monday and keeps six complete weeks across year boundaries", () => {
  const days = calendarDays(new Date(2027, 0, 1));
  assert.equal(days.length, 42); assert.equal(days[0].getDay(), 1);
  assert.equal(dateKey(days[0]), "2026-12-28"); assert.equal(dateKey(days[41]), "2027-02-07");
  assert.equal(calendarDays(new Date(2026, 10, 1), 0)[0].getDay(), 0);
});
test("month navigation clamps the day instead of rolling into another month", () => {
  assert.equal(dateKey(addMonths(new Date(2026, 0, 31), 1)), "2026-02-28");
  assert.equal(dateKey(addMonths(new Date(2024, 1, 29), 12)), "2025-02-28");
  assert.equal(dateKey(addMonths(new Date(2026, 0, 31), -1)), "2025-12-31");
});
test("reverse selection preserves inclusive day counts", () => {
  const range = orderedRange(new Date(2026, 10, 13), new Date(2026, 9, 15));
  assert.equal(dayCount(range), 30);
});
test("date arithmetic and inclusive counts stay local across daylight-saving changes", () => {
  const modelUrl = new URL("../components/ui/kalos-date-model.ts", import.meta.url).href;
  for (const TZ of ["America/New_York", "Europe/Vienna", "Asia/Shanghai"]) {
    const output = execFileSync(process.execPath, ["--input-type=module", "-e", `import {addDays,dateKey,dayCount} from ${JSON.stringify(modelUrl)};const a=new Date(2026,2,7),b=addDays(a,3);console.log(JSON.stringify([dateKey(b),b.getHours(),dayCount({start:a,end:b})]));`], { env: { ...process.env, TZ }, encoding: "utf8" });
    assert.deepEqual(JSON.parse(output), ["2026-03-10", 0, 4], TZ);
  }
});
test("time input accepts shorthand, 12-hour periods and Chinese day periods", () => {
  for (const [input, output] of [["9", "09:00"], ["930", "09:30"], ["21.30", "21:30"], ["9:30 pm", "21:30"], ["下午9:30", "21:30"], ["12am", "00:00"], ["12 PM", "12:00"], ["０９：３０", null]]) {
    const parsed = parseTime(input); assert.equal(parsed == null ? null : timeValue(parsed), output, input);
  }
});
test("invalid or ambiguous clock input never becomes a valid form value", () => {
  for (const input of ["24:00", "23:60", "0 pm", "13am", "9am pm", "tomorrow", "9:30:45", "-9:00"]) assert.equal(parseTime(input), null, input);
});
test("time slots respect offset minima, end limits and invalid steps", () => {
  assert.deepEqual(timeSlots(15, 9 * 60 + 5, 10 * 60), ["09:05", "09:20", "09:35", "09:50"]);
  assert.equal(timeSlots(0, 0, 30).length, 3);
  assert.deepEqual(timeSlots(1440, 0, 1439), ["00:00"]);
});

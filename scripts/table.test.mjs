import test from "node:test";
import assert from "node:assert/strict";
import { pasteTableCells, sortTableRows, tableLink, parseTableValue, inTableRange, tableColumnName, tableCellSpans, filterTableRows, reorderTableRows } from "../components/ui/kalos-table-model.ts";

test("paste follows visible sorted rows without overwriting locked columns or accepting invalid values", () => {
  const columns = [{ key: "name", label: "姓名", editable: false }, { key: "category", label: "分类", type: "tag", options: ["Design", "Video"] }, { key: "amount", label: "数量", type: "number" }];
  const rows = [{ id: "a", name: "Alan", category: "Design", amount: 2 }, { id: "b", name: "Ben", category: "Video", amount: 4 }];
  const visible = sortTableRows(rows, columns, { key: "name", direction: "descending" });
  const pasted = pasteTableCells(rows, visible, columns, { row: 0, column: 0 }, "Changed\tDesign\t1,024\r\nOther\tUnknown\tnot-a-number\r\n");
  assert.deepEqual(pasted, [{ id: "a", name: "Alan", category: "Design", amount: 2 }, { id: "b", name: "Ben", category: "Design", amount: 1024 }]);
  assert.equal(rows[1].amount, 4, "paste must not mutate the controlled input array");
});

test("numeric and date sorting preserve equal-value order and never mutate input", () => {
  const rows = [{ id: "1", amount: 10, date: "Nov 18, 2026" }, { id: "2", amount: 2, date: "Jan 4, 2026" }, { id: "3", amount: 2, date: "Mar 12, 2026" }];
  const columns = [{ key: "amount", label: "金额", type: "number" }, { key: "date", label: "日期", type: "date" }];
  assert.deepEqual(sortTableRows(rows, columns, { key: "amount", direction: "ascending" }).map(row => row.id), ["2", "3", "1"]);
  assert.deepEqual(sortTableRows(rows, columns, { key: "date", direction: "descending" }).map(row => row.id), ["1", "3", "2"]);
  assert.deepEqual(rows.map(row => row.id), ["1", "2", "3"]);
});

test("pasted links cannot become executable or non-web protocols", () => {
  assert.equal(tableLink("figma.com"), "https://figma.com/");
  assert.equal(tableLink("https://example.com/docs?q=1"), "https://example.com/docs?q=1");
  for (const value of ["javascript:alert(1)", "data:text/html,test", "file:///tmp/test", "mailto:a@example.com", ""]) assert.equal(tableLink(value), undefined);
});

test("number and fixed-tag editing validates values while allowing cells to be cleared", () => {
  const number = { key: "amount", label: "金额", type: "number" };
  assert.equal(parseTableValue("−4,200", number), -4200);
  assert.equal(parseTableValue("Infinity", number), undefined);
  assert.equal(parseTableValue("", number), "");
  const tag = { key: "tag", label: "标签", options: ["Design"] };
  assert.equal(parseTableValue("Video", tag), undefined);
  assert.equal(parseTableValue("", tag), "");
});

test("reverse selection produces the same rectangle and spreadsheet coordinates span multiple letters", () => {
  const range = { start: { row: 3, column: 2 }, end: { row: 1, column: 0 } };
  assert.equal(inTableRange(range, 2, 1), true);
  assert.equal(inTableRange(range, 0, 1), false);
  assert.equal(inTableRange(range, 2, 3), false);
  assert.equal(tableColumnName(25), "Z");
  assert.equal(tableColumnName(26), "AA");
});

test("merged cells clamp invalid spans and omit only covered columns", () => {
  const columns = [{ key: "name", label: "文件", colSpan: row => row.group ? 10 : 1 }, { key: "type", label: "类型" }, { key: "size", label: "大小" }];
  assert.deepEqual(tableCellSpans(columns, { id: "group", group: true }), [3, 0, 0]);
  assert.deepEqual(tableCellSpans(columns, { id: "file" }), [1, 1, 1]);
  assert.deepEqual(tableCellSpans([{ key: "a", label: "A", colSpan: NaN }, { key: "b", label: "B", colSpan: -1 }], { id: "1" }), [1, 1]);
});

test("column filters compose and distinguish an empty value from a cleared filter", () => {
  const rows = [{ id: "1", status: "已支付", method: "信用卡" }, { id: "2", status: "待支付", method: "信用卡" }, { id: "3", status: "已支付", method: "" }];
  assert.deepEqual(filterTableRows(rows, { status: "已支付", method: "信用卡" }).map(row => row.id), ["1"]);
  assert.deepEqual(filterTableRows(rows, { status: undefined, method: "" }).map(row => row.id), ["3"]);
  assert.equal(filterTableRows(rows, { status: undefined }), rows);
});

test("drag reorder uses stable IDs, preserves group order and ignores self drops", () => {
  const rows = ["a", "b", "c", "d"].map(id => ({ id }));
  assert.deepEqual(reorderTableRows(rows, ["a"], "c", "after").map(row => row.id), ["b", "c", "a", "d"]);
  assert.deepEqual(reorderTableRows(rows, ["c", "d"], "a", "before").map(row => row.id), ["c", "d", "a", "b"]);
  assert.equal(reorderTableRows(rows, ["a"], "a", "after"), rows);
  assert.equal(reorderTableRows(rows, ["a"], "missing", "before"), rows);
  assert.deepEqual(rows.map(row => row.id), ["a", "b", "c", "d"]);
});

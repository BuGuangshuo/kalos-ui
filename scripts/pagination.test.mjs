import assert from "node:assert/strict";
import test from "node:test";
import { paginationItems, paginationPageForSize, paginationSizes, paginationState } from "../components/ui/kalos-pagination-model.ts";

test("page windows keep a fixed slot count and include every current page", () => {
  for (const siblings of [0, 1, 2, 5]) {
    for (const count of [1, 2, 7, 8, 20, 10000]) {
      for (const page of [1, 2, 3, 4, 5, Math.ceil(count / 2), count - 3, count - 1, count].filter(page => page >= 1 && page <= count)) {
        const items = paginationItems(page, count, siblings);
        assert.equal(items.length, Math.min(count, siblings * 2 + 5));
        const numbers = items.filter(item => typeof item === "number");
        assert.equal(new Set(numbers).size, numbers.length);
        assert.ok(numbers.includes(page));
        assert.equal(numbers[0], 1);
        assert.equal(numbers.at(-1), count);
        for (let i = 1; i < numbers.length; i++) assert.ok(numbers[i] > numbers[i - 1]);
      }
    }
  }
});

test("empty, last-page, unknown-total and invalid values stay within bounds", () => {
  assert.deepEqual(paginationItems(5, 52), [1, "start-ellipsis", 4, 5, 6, "end-ellipsis", 52]);
  const empty = paginationState({ page: 9, total: 0 });
  assert.equal(empty.page, 1);
  assert.equal(empty.from, 0);
  assert.equal(empty.to, 0);
  const last = paginationState({ page: 999, total: 1284, pageSize: 25 });
  assert.equal(last.page, 52);
  assert.equal(last.from, 1276);
  assert.equal(last.to, 1284);
  assert.equal(paginationState({ page: 99, pageCount: 12 }).page, 12);
  const invalid = paginationState({ page: NaN, pageCount: Infinity, pageSize: 0, siblings: -2 });
  assert.equal(invalid.page, 1);
  assert.equal(invalid.pageSize, 1);
  assert.deepEqual(invalid.items, [1]);
  assert.equal(paginationState({ page: 1, total: 40, pageCount: 99, pageSize: 20 }).pageCount, 2);
});

test("changing page size keeps the previously visible first record on screen", () => {
  const state = paginationState({ page: 5, total: 1284, pageSize: 25 });
  assert.equal(paginationPageForSize(state, 50), 3);
  assert.equal(paginationPageForSize(state, 10), 11);
  assert.equal(paginationPageForSize(paginationState({ page: 52, total: 1284, pageSize: 25 }), 100), 13);
  assert.equal(paginationPageForSize(paginationState({ page: 1, total: 0 }), 50), 1);
  assert.deepEqual(paginationSizes([25, 25, 50, 0, -10, NaN], 20), [20, 25, 50]);
});

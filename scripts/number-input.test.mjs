import assert from "node:assert/strict";
import test from "node:test";
import { clampNumber, createNumberFormatter, stepNumber } from "../components/ui/kalos-number-input-model.ts";

test("numeric boundaries preserve empty values and reject non-finite numbers", () => {
  assert.equal(clampNumber(null, 1, 20), null);
  assert.equal(clampNumber(99, 1, 20), 20);
  assert.equal(clampNumber(-10, 1, 20), 1);
  assert.equal(clampNumber(Infinity), null);
});

test("stepping uses the minimum as origin without accumulating decimal errors", () => {
  assert.equal(stepNumber(0.2, 1, 0.1, 0, 1), 0.3);
  assert.equal(stepNumber(3, 1, 2, 1, 20), 5);
  assert.equal(stepNumber(4, 1, 2, 1, 20), 5);
  assert.equal(stepNumber(4, -1, 2, 1, 20), 3);
  assert.equal(stepNumber(19, 1, 2, 1, 20), 20);
  assert.equal(stepNumber(1, -1, 2, 1, 20), 1);
  assert.equal(stepNumber(3, 1, 1, 1, 20, 10), 13);
  assert.equal(stepNumber(null, 1, 1, 1, 20), 1);
  assert.equal(stepNumber(null, -1, 1, undefined, -5), -5);
});

test("localized parsing accepts grouping, decimals, currencies and native numerals", () => {
  for (const locale of ["zh-CN", "en-US", "de-DE", "fr-FR", "ar-EG"]) {
    const formatter = createNumberFormatter(locale, { minimumFractionDigits: 2 });
    assert.equal(formatter.parse(formatter.format(-12345.6)), -12345.6, locale);
  }
  const currency = createNumberFormatter("de-DE", { style: "currency", currency: "EUR" });
  assert.equal(currency.parse(currency.format(1234.5)), 1234.5);
});

test("percent values round-trip as fractions and malformed input cannot become zero", () => {
  const formatter = createNumberFormatter("zh-CN", { style: "percent", maximumFractionDigits: 0 });
  assert.equal(formatter.format(0.75), "75%");
  assert.equal(formatter.parse("75%"), 0.75);
  assert.equal(formatter.parse("75"), 0.75);
  assert.equal(formatter.parse(""), null);
  assert.ok(Number.isNaN(formatter.parse("abc")));
  assert.ok(Number.isNaN(formatter.parse("-")));
  assert.ok(Number.isNaN(formatter.parse("1.2.3")));
});

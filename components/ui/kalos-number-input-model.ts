import type { ComponentProps, ReactNode } from "react";

export type KalosNumberInputProps = Omit<ComponentProps<"input">, "value" | "defaultValue" | "onChange" | "type" | "size" | "min" | "max" | "step" | "prefix"> & {
  label: string;
  value?: number | null;
  defaultValue?: number | null;
  onValueChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  largeStep?: number;
  prefix?: ReactNode;
  unit?: string;
  locale?: string;
  formatOptions?: Intl.NumberFormatOptions;
  hint?: string;
  error?: string;
  inputClassName?: string;
};

export function clampNumber(value: number | null, min = -Infinity, max = Infinity) {
  return value === null || !Number.isFinite(value) ? null : Math.min(Math.max(value, min), max);
}

export function stepNumber(value: number | null, direction: number, step = 1, min = -Infinity, max = Infinity, amount = step) {
  const safeStep = Number.isFinite(step) && step > 0 ? step : 1;
  const origin = Number.isFinite(min) ? min : 0;
  const start = value ?? (Number.isFinite(min) ? min : Number.isFinite(max) && max < 0 ? max : 0);
  if (value === null) return clampNumber(start, min, max);
  const position = (start - origin) / safeStep;
  const rounded = Math.round(position);
  const aligned = Math.abs(position - rounded) < 1e-8;
  const next = aligned
    ? start + direction * amount
    : origin + (direction > 0 ? Math.ceil(position) : Math.floor(position)) * safeStep;
  return clampNumber(Number(next.toPrecision(15)), min, max);
}

export function createNumberFormatter(locale = "zh-CN", options: Intl.NumberFormatOptions = {}) {
  const formatter = new Intl.NumberFormat(locale, { maximumFractionDigits: 20, ...options });
  const parts = formatter.formatToParts(-12345.6);
  const decimal = new Intl.NumberFormat(locale).formatToParts(1.1).find(part => part.type === "decimal")?.value ?? ".";
  const groups = new Set(parts.filter(part => part.type === "group").map(part => part.value));
  const symbols = parts.filter(part => ["currency", "percentSign", "unit", "literal"].includes(part.type)).map(part => part.value);
  const digits = Array.from({ length: 10 }, (_, digit) => new Intl.NumberFormat(locale, { useGrouping: false }).format(digit));
  return {
    format: (value: number | null) => value === null ? "" : formatter.format(value),
    parse(text: string): number | null {
      let normalized = text.trim();
      if (!normalized) return null;
      digits.forEach((digit, value) => { normalized = normalized.replaceAll(digit, String(value)); });
      for (const group of groups) normalized = normalized.replaceAll(group, "");
      for (const symbol of symbols) normalized = normalized.replaceAll(symbol, "");
      normalized = normalized.replaceAll(decimal, ".").replace(/[−﹣－]/g, "-").replace(/[\s\u200e\u200f\u061c]/g, "");
      if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(normalized)) return NaN;
      const value = Number(normalized) / (options.style === "percent" ? 100 : 1);
      return Number.isFinite(value) ? value : NaN;
    },
  };
}

"use client";
import { useId } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/pop-base-select";
export function PopSelect({
  label,
  placeholder = "请选择",
  items,
  value,
  onValueChange,
}: {
  label: string;
  placeholder?: string;
  items: { value: string; label: string }[];
  value?: string;
  onValueChange?: (value: string) => void;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <Select
        items={items}
        value={value}
        onValueChange={(next) => {
          if (next !== null) onValueChange?.(next);
        }}
      >
        <SelectTrigger
          size="default"
          id={id}
          className="w-full rounded-[var(--radius-element,12px)] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-input"
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

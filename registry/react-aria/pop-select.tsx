"use client";
import { Label } from "react-aria-components";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/pop-aria-select";
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
  return (
    <Select
      selectedKey={value}
      onSelectionChange={(key) => {
        if (key !== null) onValueChange?.(String(key));
      }}
      placeholder={placeholder}
      className="flex w-full flex-col gap-2"
    >
      <Label className="text-sm font-medium">{label}</Label>
      <SelectTrigger
        size="default"
        className="w-full rounded-[var(--radius-element,12px)] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-input"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {items.map((item) => (
            <SelectItem key={item.value} id={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

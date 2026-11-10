"use client";
import { cn } from "@/lib/utils";
import { controlStyles } from "@/components/ui/kalos-styles";
import { slidingHighlightClasses, useSlidingHighlight } from "@/components/ui/kalos-highlight";
import { Label } from "react-aria-components";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/kalos-aria-select";
export function KalosSelect({
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
  const highlight = useSlidingHighlight('[role="option"]', '[role="option"][data-focused], [role="option"][aria-selected="true"]', true);
  return (
    <Select
      selectedKey={value}
      onSelectionChange={(key) => {
        if (key !== null) onValueChange?.(String(key));
      }}
      placeholder={placeholder}
      className="flex w-full flex-col gap-2"
    >
      <Label className={controlStyles.label}>{label}</Label>
      <SelectTrigger
        size="default"
        className={controlStyles.selectTrigger}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent ref={highlight} placement="bottom start" className={cn(slidingHighlightClasses, controlStyles.selectMenu)}>
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

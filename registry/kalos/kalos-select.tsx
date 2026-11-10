"use client";
import { cn } from "@/lib/utils";
import { controlStyles } from "@/components/ui/kalos-styles";
import { useId } from "react";
import { slidingHighlightClasses, useSlidingHighlight } from "@/components/ui/kalos-highlight";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
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
  const id = useId();
  const highlight = useSlidingHighlight('[role="option"]', '[role="option"][data-highlighted], [role="option"][data-focused], [role="option"][data-state="checked"], [role="option"][aria-selected="true"]', true);
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={controlStyles.label}>
        {label}
      </label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger
          size="default"
          id={id}
          className={controlStyles.selectTrigger}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent ref={highlight} position="popper" align="start" className={cn(slidingHighlightClasses, controlStyles.selectMenu)}>
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

"use client";

import { Filter } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { controlStyles } from "@/components/ui/kalos-styles";
import { KalosTableView, TableTag, type TableCheckProps, type TableTagSelectProps } from "@/components/ui/kalos-table-view";
import type { KalosTableProps } from "@/components/ui/kalos-table-model";
import { Select, SelectTrigger, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { slidingHighlightClasses, useSlidingHighlight } from "@/components/ui/kalos-highlight";

export type { KalosTableProps, KalosTableColumn, KalosTableRow, KalosTableTone } from "@/components/ui/kalos-table-model";

function TableCheck({ label, checked, indeterminate, onChange }: TableCheckProps) {
  return <Checkbox aria-label={label} checked={checked} indeterminate={indeterminate} onCheckedChange={onChange} className={controlStyles.checkbox} />;
}

export function KalosTable(props: KalosTableProps) {
  return <KalosTableView {...props} Check={TableCheck} TagSelect={TableTagSelect} />;
}

function TableTagSelect({ ownerId, label, value, options, tagTones, open, onOpenChange, onChange, kind = "cell", optionLabels }: TableTagSelectProps) {
  const highlight = useSlidingHighlight('[role="option"]', '[role="option"][data-highlighted], [role="option"][data-selected]', true);
  return <Select items={options.map(option => ({ value: option, label: optionLabels?.[option] ?? option }))} value={value || null} open={open} onOpenChange={onOpenChange} onValueChange={next => { if (next !== null) onChange(next); }}>
    <SelectTrigger aria-label={label} tabIndex={kind === "filter" ? 0 : -1} data-filtered={kind === "filter" && value !== "0" || undefined} className={kind === "filter" ? controlStyles.tableFilterTrigger : controlStyles.tableTagTrigger}>{kind === "filter" ? <Filter aria-hidden /> : <TableTag value={value} tagTones={tagTones} />}</SelectTrigger>
    <SelectContent onClick={event => event.stopPropagation()} onKeyDown={event => event.stopPropagation()} data-table-owner={ownerId} ref={highlight} align="start" alignItemWithTrigger={false} finalFocus={kind === "filter" ? undefined : false} className={cn(slidingHighlightClasses, controlStyles.selectMenu, kind === "filter" ? controlStyles.tableFilterMenu : controlStyles.tableTagMenu)}>
      <SelectGroup>{options.map(option => <SelectItem key={option} value={option}>{kind === "filter" ? optionLabels?.[option] ?? option : <TableTag value={option} tagTones={tagTones} />}</SelectItem>)}</SelectGroup>
    </SelectContent>
  </Select>;
}

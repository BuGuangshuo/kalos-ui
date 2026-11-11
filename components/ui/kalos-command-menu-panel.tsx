"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { controlStyles } from "@/components/ui/kalos-styles";
import { slidingHighlightClasses, useSlidingHighlight } from "@/components/ui/kalos-highlight";

export type KalosCommandItem = { value: string; label: string; description?: ReactNode; icon?: ReactNode; keywords?: string; disabled?: boolean };
export type KalosCommandGroup = { label: string; items: KalosCommandItem[] };
export type KalosCommandMenuProps = {
  groups: KalosCommandGroup[];
  label?: string;
  placeholder?: string;
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (query: string) => void;
  onRun?: (value: string) => void;
  onClose?: () => void;
  filter?: boolean;
  autoFocus?: boolean;
  emptyMessage?: string;
  className?: string;
};

export function KalosCommandMenu({ groups, label = "命令菜单", placeholder = "搜索命令…", query, defaultQuery = "", onQueryChange, onRun, onClose, filter = true, autoFocus = false, emptyMessage = "没有找到匹配的内容", className }: KalosCommandMenuProps) {
  const [internalQuery, setInternalQuery] = useState(defaultQuery);
  const [index, setIndex] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const value = query ?? internalQuery;
  const listId = useId();
  const words = value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const visible = groups.map(group => ({ ...group, items: group.items.filter(item => !filter || words.every(word => `${item.label} ${typeof item.description === "string" ? item.description : ""} ${item.keywords ?? ""}`.toLocaleLowerCase().includes(word))) })).filter(group => group.items.length);
  const options = visible.flatMap(group => group.items).filter(item => !item.disabled);
  const active = options.length ? Math.min(index, options.length - 1) : -1;
  const activeItem = options[active];
  const activeId = activeItem ? `${listId}-${options.indexOf(activeItem)}` : undefined;
  const highlight = useSlidingHighlight('[role="option"]', '[role="option"][aria-selected="true"]', true);
  useEffect(() => {
    if (activeId && document.activeElement === input.current) document.getElementById(activeId)?.scrollIntoView({ block: "nearest" });
  }, [activeId, value]);
  const changeQuery = (next: string) => {
    if (query === undefined) setInternalQuery(next);
    setIndex(0);
    onQueryChange?.(next);
  };
  return <div className={cn(controlStyles.commandMenu, className)}>
    <label className={controlStyles.commandSearch}>
      <Search aria-hidden="true" />
      <input
        ref={input}
        role="combobox" aria-label={label} aria-expanded="true" aria-controls={listId} aria-activedescendant={activeId} aria-autocomplete="list"
        autoComplete="off" autoFocus={autoFocus} className={controlStyles.commandInput} placeholder={placeholder} value={value}
        onChange={event => changeQuery(event.target.value)}
        onKeyDown={event => {
          if (event.nativeEvent.isComposing) return;
          if (["ArrowDown", "ArrowUp"].includes(event.key)) {
            event.preventDefault();
            if (options.length) setIndex((active + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length);
          } else if ((event.ctrlKey || event.metaKey) && ["Home", "End"].includes(event.key)) {
            event.preventDefault(); setIndex(event.key === "Home" ? 0 : Math.max(0, options.length - 1));
          } else if (event.key === "Tab" && options.length) {
            event.preventDefault();
            const navigable = visible.filter(group => group.items.some(item => !item.disabled));
            const groupIndex = navigable.findIndex(group => group.items.includes(activeItem));
            const next = navigable[(groupIndex + (event.shiftKey ? -1 : 1) + navigable.length) % navigable.length].items.find(item => !item.disabled)!;
            setIndex(options.indexOf(next));
          } else if (event.key === "Enter" && activeItem) {
            event.preventDefault(); onRun?.(activeItem.value);
          } else if (event.key === "Escape") {
            event.preventDefault(); event.stopPropagation();
            if (value) changeQuery(""); else onClose?.();
          }
        }}
      />
      <kbd aria-hidden="true" className={controlStyles.commandKey}>↵</kbd>
    </label>
    <div ref={highlight} id={listId} role="listbox" aria-label={`${label}结果`} className={cn(slidingHighlightClasses, controlStyles.commandList)}>
      {visible.map(group => <div key={group.label} role="group" aria-label={group.label}>
        <div className={controlStyles.commandGroup} aria-hidden="true">{group.label}</div>
        {group.items.map(item => {
          const itemIndex = options.indexOf(item);
          const selected = itemIndex >= 0 && active === itemIndex;
          return <button
            key={item.value} id={itemIndex < 0 ? undefined : `${listId}-${itemIndex}`} type="button" role="option" aria-selected={selected} disabled={item.disabled} data-disabled={item.disabled || undefined}
            tabIndex={-1} className={controlStyles.commandItem}
            onPointerMove={() => { if (!item.disabled) setIndex(itemIndex); }}
            onMouseDown={event => event.preventDefault()}
            onClick={() => onRun?.(item.value)}
          >{item.icon ? <span className={controlStyles.commandIcon}>{item.icon}</span> : null}<span className={controlStyles.commandItemText}><span className={controlStyles.commandTitle}>{item.label}</span>{item.description ? <span className={controlStyles.commandDescription}>{item.description}</span> : null}</span></button>;
        })}
      </div>)}
      {visible.length === 0 ? <p className="px-3 py-8 text-center text-[13px] text-muted-foreground" role="status">{emptyMessage}</p> : null}
    </div>
    <div className={controlStyles.commandFooter} aria-hidden="true">
      <span><kbd className={controlStyles.commandKey}>↑</kbd><kbd className={controlStyles.commandKey}>↓</kbd>选择</span>
      <span><kbd className={controlStyles.commandKey}>Tab</kbd>切换分组</span>
      <span><kbd className={controlStyles.commandKey}>↵</kbd>执行</span>
      <span><kbd className={controlStyles.commandKey}>esc</kbd>清空 / 关闭</span>
    </div>
    <span className="sr-only" role="status">{options.length} 个可用结果</span>
  </div>;
}

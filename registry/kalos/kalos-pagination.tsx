"use client";

import { useLayoutEffect, useRef, type ComponentProps, type CSSProperties } from "react";
import { Button } from "@base-ui/react/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { KalosSelect } from "./kalos-select";
import { paginationCss } from "@/components/ui/kalos-pagination-styles";
import { paginationPageForSize, paginationSizes, paginationState } from "@/components/ui/kalos-pagination-model";
import { cn } from "@/lib/utils";

export interface KalosPaginationProps extends ComponentProps<"nav"> {
  page: number;
  onPageChange: (page: number) => void;
  total?: number;
  pageSize?: number;
  pageCount?: number;
  pageSizes?: number[];
  onPageSizeChange?: (pageSize: number) => void;
  siblings?: number;
  compact?: boolean;
  disabled?: boolean;
}

export function KalosPagination({
  page, onPageChange, total, pageSize = 20, pageCount, pageSizes, onPageSizeChange,
  siblings = 1, compact = false, disabled = false, className, style,
  "aria-label": ariaLabel = "分页导航", children, ...props
}: KalosPaginationProps) {
  const state = paginationState({ page, total, pageSize, pageCount, siblings });
  const buttons = useRef(new Map<number, HTMLElement>());
  const focusPage = useRef<number | null>(null);
  useLayoutEffect(() => {
    if (focusPage.current === null) return;
    // A keyed page button may move when an ellipsis changes sides.
    const target = buttons.current.get(state.page);
    if (target && (document.activeElement === document.body || target.parentElement?.parentElement?.contains(document.activeElement))) {
      target.focus({ preventScroll: true });
    }
    focusPage.current = null;
  }, [state.page]);

  const change = (next: number, followFocus = false) => {
    if (disabled || next === state.page || next < 1 || next > state.pageCount) return;
    if (followFocus) focusPage.current = next;
    onPageChange(next);
  };
  const format = (value: number) => value.toLocaleString("zh-CN");
  const summary = state.total === undefined
    ? `第 ${format(state.page)} / ${format(state.pageCount)} 页`
    : `共 ${format(state.total)} 条`;

  return <nav {...props} aria-label={ariaLabel} data-disabled={disabled || undefined}
    className={cn("kalos-pagination", className)} data-compact={compact || undefined}
    style={{ "--pg-digits": String(state.pageCount).length, ...style } as CSSProperties}>
    <style>{paginationCss}</style>
    <span className="kalos-pagination-summary" role="status" aria-live="polite" aria-atomic="true">{summary}{state.total !== undefined ? <span className="sr-only">，第 {format(state.page)} / {format(state.pageCount)} 页</span> : null}</span>
    <ul className="kalos-pagination-pages">
      <li><Button type="button" className="kalos-pagination-button" aria-label="上一页"
        disabled={disabled || state.page <= 1} focusableWhenDisabled={!disabled}
        onClick={() => change(state.page - 1)}><ChevronLeft aria-hidden="true" /></Button></li>
      {!compact ? state.items.map(item => <li key={item} className="kalos-pagination-number">
        {typeof item === "number" ? <Button type="button" className="kalos-pagination-button"
          ref={node => { if (node) buttons.current.set(item, node); else buttons.current.delete(item); }}
          aria-label={`第 ${format(item)} 页`} aria-current={item === state.page ? "page" : undefined}
          disabled={disabled} onClick={() => change(item, true)}>{item}</Button>
          : <span className="kalos-pagination-ellipsis" aria-hidden="true"><MoreHorizontal /></span>}
      </li>) : null}
      <li><Button type="button" className="kalos-pagination-button" aria-label="下一页"
        disabled={disabled || state.page >= state.pageCount} focusableWhenDisabled={!disabled}
        onClick={() => change(state.page + 1)}><ChevronRight aria-hidden="true" /></Button></li>
    </ul>
    {pageSizes?.length ? <div className="kalos-pagination-size">
      <KalosSelect label="每页条数" clearable={false} disabled={disabled || !onPageSizeChange}
        value={String(state.pageSize)} items={paginationSizes(pageSizes, state.pageSize).map(size => ({ value: String(size), label: `${format(size)}条` }))}
        onValueChange={value => {
          if (disabled || !onPageSizeChange) return;
          const size = Number(value);
          if (size === state.pageSize) return;
          onPageSizeChange(size);
          onPageChange(paginationPageForSize(state, size));
        }} />
    </div> : null}
    {children}
  </nav>;
}

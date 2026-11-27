"use client";

import {
  Fragment, useLayoutEffect, useRef, useState,
  type ComponentPropsWithRef, type CSSProperties, type MouseEvent, type ReactNode,
} from "react";
import { KalosGlyph, type HugeIcon } from "@/components/ui/kalos-glyph";
import { DirectionProvider } from "@base-ui/react/direction-provider";
import { Menu } from "@base-ui/react/menu";
import { breadcrumbCss, breadcrumbMaxItems } from "@/components/ui/kalos-breadcrumb-styles";
import { cn } from "@/lib/utils";

export type { HugeIcon };

export interface KalosBreadcrumbItem {
  label: string;
  href?: string;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  icon?: ReactNode | HugeIcon;
}

export interface KalosBreadcrumbProps extends Omit<ComponentPropsWithRef<"nav">, "children"> {
  items: readonly KalosBreadcrumbItem[];
  separator?: "slash" | "chevron" | ReactNode;
  maxItems?: number;
}

// Hugeicons Free, MIT. See the license shipped with kalos-breadcrumb-styles.
function TrailIcon({ name }: { name: "chevron" | "more" | "nest" }) {
  return <svg className={`kalos-breadcrumb-${name === "more" ? "dots" : name}`} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {name === "chevron" && <path d="M9 6s6 4.42 6 6-6 6-6 6" />}
    {name === "more" && <path d="M6 12.5V12m12 .5V12m-6 .5V12m-5 .5a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm12 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm-6 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Z" />}
    {name === "nest" && <><path d="M19 15h-7c-3.77 0-5.66 0-6.83-1.17C4 12.66 4 10.77 4 7V4" /><path d="M15 20s5-3.68 5-5-5-5-5-5" /></>}
  </svg>;
}

function Crumb({ item, current }: { item: KalosBreadcrumbItem; current: boolean }) {
  function updateTitle(event: MouseEvent<HTMLElement>) {
    const text = event.currentTarget.querySelector(".kalos-breadcrumb-label");
    if (text && text.scrollWidth > text.clientWidth + 1) event.currentTarget.title = item.label;
    else event.currentTarget.removeAttribute("title");
  }
  const content = <>
    {item.icon != null && <span className="kalos-breadcrumb-icon" aria-hidden="true"><KalosGlyph icon={item.icon} /></span>}
    <span className="kalos-breadcrumb-label" dir="auto">{item.label}</span>
  </>;
  const props = { className: "kalos-breadcrumb-link", onPointerEnter: updateTitle };
  if (current) return <span className="kalos-breadcrumb-current" aria-current="page" onPointerEnter={updateTitle}>{content}</span>;
  if (item.href != null) return <a {...props} href={item.href} onClick={item.onClick}>{content}</a>;
  if (item.onClick) return <button {...props} type="button" onClick={item.onClick}>{content}</button>;
  return <span {...props}>{content}</span>;
}

function showInTopLayer(node: HTMLDivElement | null) {
  if (node?.isConnected && node.showPopover && !node.matches(":popover-open")) node.showPopover();
}

function FoldedCrumbs({ items }: { items: readonly KalosBreadcrumbItem[] }) {
  const host = useRef<HTMLLIElement>(null);
  const [direction, setDirection] = useState<"ltr" | "rtl">("ltr");
  return <li ref={host} className="kalos-breadcrumb-item">
    <DirectionProvider direction={direction}>
      <Menu.Root modal={false} onOpenChange={open => {
        if (open && host.current) setDirection(getComputedStyle(host.current).direction === "rtl" ? "rtl" : "ltr");
      }}>
        <Menu.Trigger className="kalos-breadcrumb-more" aria-label={`显示另外 ${items.length} 个层级`}
          title={items.map(item => item.label).join(" / ")}>
          <TrailIcon name="more" />
        </Menu.Trigger>
        <Menu.Portal container={host}>
          <Menu.Positioner ref={showInTopLayer} popover="manual" positionMethod="fixed" className="kalos-breadcrumb-positioner"
            side="bottom" align="start" sideOffset={6} alignOffset={direction === "rtl" ? 0 : -4} collisionPadding={8}>
            <Menu.Popup className="kalos-breadcrumb-menu" aria-label="折叠的层级" onFocus={event => {
              if (event.target === event.currentTarget) {
                event.currentTarget.querySelector<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])')?.focus({ preventScroll: true });
              }
            }}>
              {items.map((item, index) => {
                const props = {
                  label: item.label, title: item.label, className: "kalos-breadcrumb-row",
                  style: { "--bc-depth": Math.min(index, 3) } as CSSProperties,
                };
                const content = <>
                  <span className="kalos-breadcrumb-row-icon" aria-hidden="true">
                    {item.icon != null ? <KalosGlyph icon={item.icon} /> : <TrailIcon name="nest" />}
                  </span>
                  <span className="kalos-breadcrumb-row-label" dir="auto">{item.label}</span>
                </>;
                const key = `${index}-${item.label}`;
                return item.href != null
                  ? <Menu.LinkItem {...props} key={key} href={item.href} onClick={item.onClick} closeOnClick>{content}</Menu.LinkItem>
                  : <Menu.Item {...props} key={key} disabled={!item.onClick} onClick={item.onClick}>{content}</Menu.Item>;
              })}
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </DirectionProvider>
  </li>;
}

export function KalosBreadcrumb({
  items, separator = "slash", maxItems = breadcrumbMaxItems, className,
  "aria-label": ariaLabel = "面包屑导航", ...props
}: KalosBreadcrumbProps) {
  const list = useRef<HTMLOListElement>(null);
  const sizes = useRef<HTMLDivElement>(null);
  const limit = Math.max(2, Math.floor(Number.isNaN(maxItems) ? breadcrumbMaxItems : maxItems));
  const byCount = Math.max(0, items.length - limit);
  const [byWidth, setByWidth] = useState(0);
  const hidden = Math.min(Math.max(0, items.length - 2), Math.max(byWidth, byCount));

  useLayoutEffect(() => {
    const row = list.current;
    const labels = sizes.current;
    const divider = row?.children[1] as HTMLElement | undefined;
    if (!row || !labels || !divider || items.length < 3) return;

    function measure() {
      if (!row || !labels || !divider) return;
      // offsetWidth is in layout pixels even when a catalog preview is visually scaled.
      const widths = Array.from(labels.children, label => (label as HTMLElement).offsetWidth);
      const gap = divider.offsetWidth;
      const more = parseFloat(getComputedStyle(row).getPropertyValue("--bc-moreWidth"));
      let required = widths.reduce((sum, width) => sum + width, 0) + gap * (widths.length - 1);
      let fold = 0;
      while (fold < widths.length - 2 && (fold < byCount || required > row.clientWidth + 1)) {
        fold++;
        required -= widths[fold] + gap;
        if (fold === 1) required += more + gap;
      }
      setByWidth(fold);
    }

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(row);
    observer.observe(labels);
    observer.observe(divider);
    return () => observer.disconnect();
  }, [items, byCount, separator]);

  if (items.length === 0) return null;
  const divide = <li className="kalos-breadcrumb-separator" role="presentation" aria-hidden="true">
    {separator === "slash" ? "/" : separator === "chevron" ? <TrailIcon name="chevron" /> : separator}
  </li>;
  function crumb(item: KalosBreadcrumbItem, index: number) {
    const current = index === items.length - 1;
    return <li key={item.label} className="kalos-breadcrumb-item" data-current={current || undefined}><Crumb item={item} current={current} /></li>;
  }
  return <nav {...props} className={cn("kalos-breadcrumb", className)} aria-label={ariaLabel}>
    <style href="kalos-breadcrumb" precedence="default">{breadcrumbCss}</style>
    <ol ref={list} className="kalos-breadcrumb-list" data-tight={hidden === items.length - 2 || undefined}>
      {crumb(items[0], 0)}
      {items.length > 1 && divide}
      {hidden > 0 && <><FoldedCrumbs items={items.slice(1, hidden + 1)} />{divide}</>}
      {items.slice(hidden + 1).map((item, offset) =>
        <Fragment key={`${hidden + 1 + offset}-${item.label}`}>
          {offset > 0 && divide}
          {crumb(item, hidden + 1 + offset)}
        </Fragment>)}
    </ol>
    {items.length > 2 && <div className="kalos-breadcrumb-measure" aria-hidden="true" inert>
      <div ref={sizes} className="kalos-breadcrumb-sizes">
        {items.map((item, index) => <span key={index} data-icon={item.icon != null || undefined} dir="auto">{item.label}</span>)}
      </div>
    </div>}
  </nav>;
}

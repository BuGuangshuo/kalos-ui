"use client";

import { useCallback, useEffect, useRef } from "react";

export const slidingHighlightClasses = "relative isolate before:pointer-events-none before:absolute before:left-[var(--kalos-highlight-x,0px)] before:top-[var(--kalos-highlight-y,0px)] before:z-0 before:h-[var(--kalos-highlight-height,0px)] before:w-[var(--kalos-highlight-width,0px)] before:rounded-[5px] before:bg-accent before:opacity-[var(--kalos-highlight-opacity,0)] before:transition-[left,top,width,height,opacity] before:duration-200 before:ease-[cubic-bezier(.2,.8,.2,1)] before:content-[''] [&_[role=option]]:relative [&_[role=option]]:z-10 [&_[role=option]]:bg-transparent!";

/** A single background follows the library's own focused/selected item. */
export function useSlidingHighlight(selector: string, activeSelector: string, followPointer = false) {
  const cleanup = useRef<(() => void) | null>(null);
  useEffect(() => () => cleanup.current?.(), []);
  return useCallback((node: HTMLElement | null) => {
    cleanup.current?.();
    cleanup.current = null;
    if (!node) return;
    let frame = 0;
    const position = (item: HTMLElement | null) => {
      if (!item) { node.style.setProperty("--kalos-highlight-opacity", "0"); return; }
      if (!node.contains(item) || item.matches('[aria-disabled="true"], [data-disabled]')) return;
      const root = node.getBoundingClientRect();
      const target = item.getBoundingClientRect();
      const scaleX = node.offsetWidth ? root.width / node.offsetWidth : 1;
      const scaleY = node.offsetHeight ? root.height / node.offsetHeight : 1;
      node.style.setProperty("--kalos-highlight-x", `${(target.left - root.left) / scaleX + node.scrollLeft - node.clientLeft}px`);
      node.style.setProperty("--kalos-highlight-y", `${(target.top - root.top) / scaleY + node.scrollTop - node.clientTop}px`);
      node.style.setProperty("--kalos-highlight-width", `${target.width / scaleX}px`);
      node.style.setProperty("--kalos-highlight-height", `${target.height / scaleY}px`);
      node.style.setProperty("--kalos-highlight-opacity", "1");
    };
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => position(activeSelector.split(",").map(query => node.querySelector<HTMLElement>(query.trim())).find(Boolean) ?? null));
    };
    const pointer = (event: Event) => {
      if (event.target instanceof Element) position(event.target.closest<HTMLElement>(selector));
    };
    const observer = new MutationObserver(update);
    observer.observe(node, { subtree: true, childList: true, attributes: true, attributeFilter: ["data-highlighted", "data-focused", "data-state", "aria-selected", "aria-activedescendant"] });
    const resize = new ResizeObserver(update);
    resize.observe(node);
    node.addEventListener("scroll", update, true);
    if (followPointer) {
      node.addEventListener("pointermove", pointer);
      node.addEventListener("focusin", pointer);
    }
    update();
    cleanup.current = () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resize.disconnect();
      node.removeEventListener("scroll", update, true);
      node.removeEventListener("pointermove", pointer);
      node.removeEventListener("focusin", pointer);
    };
  }, [selector, activeSelector, followPointer]);
}

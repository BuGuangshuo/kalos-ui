import { useRef, type PointerEvent } from "react";
import { useSlidingHighlight } from "@/components/ui/kalos-highlight";

export function useNavigationHighlight(itemSelector: string) {
  const hoveredItem = useRef<HTMLElement>(null);
  const highlight = useSlidingHighlight(itemSelector, `:is(${itemSelector})[data-highlighted]`);

  const clearHover = () => {
    hoveredItem.current?.removeAttribute("data-highlighted");
    hoveredItem.current = null;
  };

  return {
    highlight,
    onPointerOver(event: PointerEvent<HTMLElement>) {
      if (event.pointerType === "touch" || !(event.target instanceof Element)) return;
      const item = event.target.closest<HTMLElement>(itemSelector);
      if (!item || item === hoveredItem.current) return;
      clearHover();
      item.setAttribute("data-highlighted", "");
      hoveredItem.current = item;
    },
    onPointerLeave: clearHover,
  };
}

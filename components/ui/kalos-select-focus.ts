"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

export function useSelectFocus(controlRef: RefObject<HTMLElement | null>, disabled = false) {
  const popupRef = useRef<HTMLElement | null>(null);
  const dismissedOutside = useRef(false);
  const [focused, setFocused] = useState(false);
  const onOpenChange = useCallback((open: boolean) => {
    if (open) {
      dismissedOutside.current = false;
      setFocused(true);
    }
  }, []);
  const onCloseAutoFocus = useCallback((event: Event) => {
    if (dismissedOutside.current) event.preventDefault();
  }, []);
  const finalFocus = useCallback(() => !dismissedOutside.current, []);

  useEffect(() => {
    const contains = (target: EventTarget | null) => target instanceof Node && (
      controlRef.current?.contains(target) || popupRef.current?.contains(target)
    );
    const focusIn = (event: FocusEvent) => {
      // Closing a portal can briefly leave focus on body before restoring the trigger.
      if (event.target === document.body || event.target === document.documentElement) return;
      // A native overlay may restore its trigger after an outside press.
      // Keep that restoration from reactivating the visual focus state.
      setFocused(!!contains(event.target) && !dismissedOutside.current);
    };
    const pointerDown = (event: PointerEvent) => {
      const inside = !!contains(event.target);
      dismissedOutside.current = !inside;
      setFocused(inside);
    };
    const keyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab") dismissedOutside.current = false;
      if (contains(event.target)) {
        dismissedOutside.current = false;
        setFocused(true);
      }
    };
    document.addEventListener("focusin", focusIn, true);
    document.addEventListener("pointerdown", pointerDown, true);
    document.addEventListener("keydown", keyDown, true);
    return () => {
      document.removeEventListener("focusin", focusIn, true);
      document.removeEventListener("pointerdown", pointerDown, true);
      document.removeEventListener("keydown", keyDown, true);
    };
  }, [controlRef]);

  return { focused: focused && !disabled, popupRef, onOpenChange, onCloseAutoFocus, finalFocus };
}

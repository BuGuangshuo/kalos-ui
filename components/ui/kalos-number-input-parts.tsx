"use client";

import * as React from "react";
import { controlStyles, numberInputSettings } from "@/components/ui/kalos-styles";
import { cn } from "@/lib/utils";

export function KalosNumberInputValue({ prefix, unit, children }: { prefix?: React.ReactNode; unit?: string; children: React.ReactNode }) {
  return <div className={controlStyles.numberValue}>
    {prefix != null ? <span aria-hidden="true" className={controlStyles.numberAffix}>{prefix}</span> : null}
    {children}
    {unit ? <span aria-hidden="true" className={cn(controlStyles.numberAffix, "ml-1.5")}>{unit}</span> : null}
  </div>;
}

export function useNumberInputMotion(inputRef: React.RefObject<HTMLInputElement | null>, value: number | null) {
  const previous = React.useRef(value);
  React.useEffect(() => {
    const old = previous.current;
    previous.current = value;
    const input = inputRef.current;
    if (!input || old === value || old === null || value === null || document.activeElement === input) return;
    const animation = input.animate([
      { transform: `translateY(${value > old ? 3 : -3}px)`, opacity: 0.45 },
      { transform: "translateY(0)", opacity: 1 },
    ], { duration: numberInputSettings.duration, easing: "cubic-bezier(0.22, 1, 0.36, 1)" });
    return () => animation.cancel();
  }, [inputRef, value]);
}

export function useNumberInputReset(inputRef: React.RefObject<HTMLInputElement | null>, reset: () => void) {
  const onReset = React.useEffectEvent(reset);
  React.useEffect(() => {
    const form = inputRef.current?.form;
    if (!form) return;
    const handleReset = (event: Event) => queueMicrotask(() => { if (!event.defaultPrevented) onReset(); });
    form.addEventListener("reset", handleReset);
    return () => form.removeEventListener("reset", handleReset);
  }, [inputRef]);
}

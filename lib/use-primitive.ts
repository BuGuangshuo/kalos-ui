"use client";
import { useSyncExternalStore } from "react";
export type Primitive = "radix" | "base-ui" | "react-aria";
export const primitiveNames: Record<Primitive, string> = {
  radix: "Radix UI",
  "base-ui": "Base UI",
  "react-aria": "React Aria",
};
const event = "kalos-ui-primitive";
function subscribe(callback: () => void) {
  window.addEventListener(event, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(event, callback);
    window.removeEventListener("storage", callback);
  };
}
function snapshot(): Primitive {
  try {
    const value = localStorage.getItem(event);
    return value === "base-ui" || value === "react-aria" ? value : "radix";
  } catch {
    return "radix";
  }
}
export function usePrimitive() {
  const primitive = useSyncExternalStore(
    subscribe,
    snapshot,
    () => "radix" as Primitive,
  );
  const setPrimitive = (value: string) => {
    if (!(value in primitiveNames)) return;
    try {
      localStorage.setItem(event, value);
    } catch {
      return;
    }
    window.dispatchEvent(new Event(event));
  };
  return { primitive, setPrimitive };
}

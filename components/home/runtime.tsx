"use client";

import {
  createContext,
  use,
  useEffect,
  useEffectEvent,
  useSyncExternalStore,
} from "react";
import { useReducedMotion } from "motion/react";

export const easeOut = [0.16, 1, 0.3, 1] as const;
export const popSpring = {
  type: "spring",
  stiffness: 400,
  damping: 28,
} as const;
export const IntroContext = createContext({ playing: false, done: true });
export const AutoplayContext = createContext(false);
export const PackageManagerContext = createContext<{
  manager: string;
  setManager: (manager: string) => void;
}>({
  manager: "npm",
  setManager: () => {},
});
export const useIntro = () => use(IntroContext);

export function useAutoplay(step: () => void, every: number, offset = 0) {
  const paused = use(AutoplayContext);
  const reduced = useReducedMotion();
  // Effect events always use the current callback without restarting the clock.
  const callback = useEffectEvent(step);
  useEffect(() => {
    if (paused || reduced) return;
    let interval: ReturnType<typeof setInterval> | undefined;
    const timeout = setTimeout(() => {
      callback();
      interval = setInterval(callback, every);
    }, offset);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [paused, reduced, every, offset]);
}

function subscribeViewport(callback: () => void) {
  window.addEventListener("resize", callback, { passive: true });
  return () => window.removeEventListener("resize", callback);
}
const getViewport = () => `${window.innerWidth}:${window.innerHeight}`;
const getServerViewport = () => "1200:860";
export function useViewport() {
  const snapshot = useSyncExternalStore(
    subscribeViewport,
    getViewport,
    getServerViewport,
  );
  const [width, height] = snapshot.split(":").map(Number);
  return { width, height };
}

export const reveal = (index = 0) => ({
  initial: { opacity: 0, y: 24, filter: "blur(8px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7, ease: easeOut, delay: index * 0.09 },
});

"use client";

import { useEffect, useId, useRef, type ComponentProps } from "react";
import { flushSync } from "react-dom";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const revealDuration = 650;
const revealEasing = "cubic-bezier(0.65, 0, 0.35, 1)";

export function ThemeToggle({ className, onClick, ...props }: ComponentProps<typeof Button>) {
  const { setTheme } = useTheme();
  const maskId = `theme-moon-${useId()}`;
  const activeTransition = useRef<ViewTransition | null>(null);
  const themeRequest = useRef(0);

  useEffect(() => () => {
    themeRequest.current += 1;
    if (activeTransition.current) {
      activeTransition.current.skipTransition();
      activeTransition.current = null;
      document.documentElement.classList.remove("theme-transition");
    }
  }, []);

  async function toggleTheme(button: HTMLButtonElement) {
    const request = ++themeRequest.current;
    activeTransition.current?.skipTransition();
    activeTransition.current = null;

    const root = document.documentElement;
    const nextTheme = root.classList.contains("dark") ? "light" : "dark";
    if (
      !document.startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      root.classList.remove("theme-transition");
      setTheme(nextTheme);
      return;
    }

    const rect = button.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    // Reveal the new theme from the toggle, matching movin.design's timing.
    root.classList.add("theme-transition");
    try {
      const transition = document.startViewTransition(() => {
        if (request === themeRequest.current) {
          flushSync(() => setTheme(nextTheme));
        }
      });
      activeTransition.current = transition;
      const finished = transition.finished.catch(() => {});
      await transition.ready;
      if (request !== themeRequest.current) return;

      const reveal = root.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${radius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: revealDuration,
          easing: revealEasing,
          pseudoElement: "::view-transition-new(root)",
        },
      );
      await reveal.finished;
      await finished;
    } catch {
      // Interrupted or unsupported transitions still complete the theme change.
      if (request === themeRequest.current) {
        activeTransition.current?.skipTransition();
        setTheme(nextTheme);
      }
    } finally {
      if (request === themeRequest.current) {
        root.classList.remove("theme-transition");
        activeTransition.current = null;
      }
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="切换深浅主题"
      className={cn("theme-toggle", className)}
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) void toggleTheme(event.currentTarget);
      }}
    >
      <svg viewBox="0 0 24 24" className="theme-toggle-icon" aria-hidden="true">
        <mask id={maskId}>
          <rect width="24" height="24" fill="white" />
          <circle
            className="theme-toggle-cutout"
            cx="16.5"
            cy="7.5"
            r="7"
            fill="black"
          />
        </mask>
        <g mask={`url(#${maskId})`}>
          <circle
            className="theme-toggle-disc"
            cx="12"
            cy="12"
            r="5"
            fill="currentColor"
          />
        </g>
        <g
          className="theme-toggle-rays"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
        </g>
      </svg>
    </Button>
  );
}

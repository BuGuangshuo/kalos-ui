import type { ComponentProps } from "react";
import { Disc3Icon } from "@/components/ui/disc-3-icon";
import { KALOS_WORDMARK_VIEWBOX, KALOS_WORDMARK } from "@/lib/brand";
import { cn } from "@/lib/utils";

export function BrandMark({
  className,
  ...props
}: ComponentProps<typeof Disc3Icon>) {
  return (
    <Disc3Icon
      size={64}
      {...props}
      className={cn("brand-symbol", className)}
      aria-hidden="true"
    />
  );
}

export function BrandLogo({ className }: { className?: string }) {
  return (
    <div className={cn("brand-lockup", className)}>
      <BrandMark />
      <svg viewBox={KALOS_WORDMARK_VIEWBOX} className="brand-wordmark" aria-hidden="true">
        <path fill="currentColor" d={KALOS_WORDMARK} />
      </svg>
    </div>
  );
}

export function GithubIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width="18"
      height="18"
      aria-hidden="true"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12a10 10 0 0 0 6.84 9.49c.5.09.68-.22.68-.48v-1.86c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.64-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03A9.6 9.6 0 0 1 12 6.82c.85 0 1.71.12 2.51.34 1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 22 12c0-5.52-4.48-10-10-10Z" />
    </svg>
  );
}

export function OpenAIIcon() {
  return <span
    data-brand-icon=""
    aria-hidden="true"
    style={{ display: "inline-block", background: "currentColor", mask: "url(/decision-card/openai.svg) center / contain no-repeat" }}
  />;
}

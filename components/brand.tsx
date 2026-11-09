import { POP_LOGO_VIEWBOX, POP_MARK_BODY, POP_WORDMARK } from "@/lib/brand";

export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 106 106" className={className} aria-hidden="true">
      <path fill="currentColor" fillRule="evenodd" d={POP_MARK_BODY} />
    </svg>
  );
}

export function BrandLogo({ className }: { className?: string }) {
  return (
    <svg viewBox={POP_LOGO_VIEWBOX} className={className} aria-hidden="true">
      <path fill="currentColor" fillRule="evenodd" d={POP_MARK_BODY} />
      <path fill="currentColor" d={POP_WORDMARK} />
    </svg>
  );
}

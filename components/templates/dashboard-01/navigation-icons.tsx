import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const markMotion =
  "[transform-box:fill-box] origin-[50%_80%] transition-transform duration-[350ms] ease-[cubic-bezier(.22,1.5,.38,1)]";

export function MotionMark(props: IconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <circle
        cx="3.4"
        cy="16.8"
        r="2.25"
        fill="currentColor"
        className={`${markMotion} group-hover/brand:translate-y-px group-hover/brand:scale-[1.12]`}
      />
      <g stroke="currentColor" strokeWidth="3.8" strokeLinecap="round">
        <path
          d="m5.7 6.8 6 10.2"
          className={`${markMotion} group-hover/brand:-translate-y-0.5 group-hover/brand:-rotate-[8deg]`}
        />
        <path
          d="m14.1 6.8 6 10.2"
          className={`${markMotion} group-hover/brand:-translate-y-[3px] group-hover/brand:-rotate-[8deg] group-hover/brand:delay-[45ms]`}
        />
      </g>
    </svg>
  );
}

export function CatalogMark(props: IconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <rect x="2.2" y="3.3" width="18.8" height="8.2" rx="3.3" />
      <rect x="3.8" y="13" width="18.3" height="7.9" rx="3.3" />
      <circle cx="16.7" cy="7.4" r="1.45" fill="var(--background)" />
      <circle cx="8.2" cy="17" r="1.45" fill="var(--background)" />
    </svg>
  );
}

function StudioGlyph({ children, ...props }: IconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function TextMark(props: IconProps) {
  return (
    <StudioGlyph {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="3.8" />
      <path d="M8 9V7.8h8V9M12 8v8.5" />
    </StudioGlyph>
  );
}

export function ShapesMark(props: IconProps) {
  return (
    <StudioGlyph {...props}>
      <rect x="3.8" y="3.5" width="6.3" height="6.7" rx="2.4" />
      <path d="M16.3 4.7c.6-1.1 1.8-1.1 2.4 0l2 3.5c.6 1-.1 2-1.2 2h-4c-1.2 0-1.8-1-1.2-2Z" />
      <circle cx="7.2" cy="17.1" r="3.7" />
    </StudioGlyph>
  );
}

export function HalftoneMark(props: IconProps) {
  return (
    <StudioGlyph {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.2" />
      {[7.6, 12, 16.4].map((x, column) =>
        [8, 12, 16].map((y) => (
          <circle
            key={`${x}-${y}`}
            cx={x}
            cy={y}
            r={1.05 - column * 0.22}
            fill="currentColor"
            stroke="none"
          />
        )),
      )}
    </StudioGlyph>
  );
}

export function ShaderMark(props: IconProps) {
  return (
    <StudioGlyph {...props}>
      <path d="M9 3.1c2.5-1.1 5.4.3 5.7 2.8.2 1.9-.6 3.6.5 5.2 1.4 1.9 4.5 2.2 5.4 4.4 1.1 2.6-.6 5.3-3.2 5.4-2.8.3-4.6-1.4-5.2-3.8-.7-3.2-.9-5.2-3.5-7.2C5.8 7.8 6.2 4.3 9 3.1Z" />
      <ellipse cx="6.3" cy="18.1" rx="3.3" ry="3.6" transform="rotate(-38 6.3 18.1)" />
    </StudioGlyph>
  );
}

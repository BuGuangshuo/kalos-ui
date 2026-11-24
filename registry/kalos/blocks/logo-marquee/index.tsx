"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import "../shared/inter";
import { firstGrapheme } from "../shared/initials";
import { useLoopTrack, useStaticTrack } from "../shared/use-loop-track";
import { marqueeLogos } from "./logos";
import "./styles.css";

export { marqueeLogos };
export type MarqueeLogo = {
  name: string;
  svg?: ReactNode;
  src?: string;
  color?: string;
  scale?: number;
  href?: string;
};

export type LogoMarqueeProps = {
  logos?: MarqueeLogo[];
  speed?: number;
  direction?: "left" | "right";
  rows?: 1 | 2;
  gap?: number;
  pauseOnHover?: boolean;
  grayscale?: boolean;
  labels?: "none" | "below" | "beside";
  label?: string;
  className?: string;
  appearance?: "clean" | "classic";
};

type RowProps = {
  logos: MarqueeLogo[];
  prefix: string;
  labels: NonNullable<LogoMarqueeProps["labels"]>;
  variable: string;
  velocity: number;
  start: number;
  pauseOnHover: boolean;
};

function initial(name: string) {
  return firstGrapheme(name.trim()).toLocaleUpperCase() || "?";
}

function Logo({ logo, prefix, labels, variable, original }: Pick<RowProps, "prefix" | "labels" | "variable"> & {
  logo: MarqueeLogo;
  original: boolean;
}) {
  const [failedSource, setFailedSource] = useState<string>();
  const hasImage = logo.src && logo.src !== failedSource;
  const mark = logo.svg ?? (hasImage ? (
    // Registry clients can use remote, local or data URLs for their marks.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={logo.src} alt="" draggable={false} onError={() => setFailedSource(logo.src)} />
  ) : labels === "none" ? <span className={prefix + "__tile"}>{initial(logo.name)}</span> : null);
  const body = (
    <>
      {mark && <span className={prefix + "__mark"} aria-hidden="true">{mark}</span>}
      <span className={prefix + (labels === "none" ? "__sr" : "__name")} title={logo.name}>{logo.name}</span>
    </>
  );
  return (
    <li className={prefix + "__item"} style={{ [variable + "-brand"]: logo.color, [variable + "-scale"]: logo.scale } as CSSProperties}>
      {logo.href ? (
        <a className={prefix + "__link"} href={logo.href} tabIndex={original ? undefined : -1} draggable={false}>{body}</a>
      ) : <span className={prefix + "__link"}>{body}</span>}
    </li>
  );
}

function MarqueeRow({ logos, prefix, labels, variable, velocity, start, pauseOnHover }: RowProps) {
  const { viewport, track, original, copies } = useLoopTrack({ axis: "x", velocity, start, pauseOnHover });
  return (
    <div className={prefix + "__row"} ref={viewport}>
      <div className={prefix + "__track"} ref={track}>
        {Array.from({ length: copies }, (_, index) => (
          <ul key={index} className={prefix + "__set"} ref={index === 1 ? original : undefined} aria-hidden={index !== 1 || undefined}>
            {logos.map((logo, item) => (
              <Logo key={item + "-" + logo.name} logo={logo} prefix={prefix} labels={labels} variable={variable} original={index === 1} />
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

export function KalosLogoMarquee({
  logos = marqueeLogos, speed = 40, direction = "left", rows = 1, gap = 56,
  pauseOnHover = true, grayscale = true, labels = "none", label = "Logos of companies using the product",
  className, appearance = "clean",
}: LogoMarqueeProps) {
  const still = useStaticTrack();
  if (!logos.length) return null;
  const prefix = "kalos-logo-marquee--" + appearance;
  const variable = appearance === "clean" ? "--ui-lmc" : "--ui-lm";
  const rowsOfLogos = rows === 2 && logos.length > 1
    ? [logos.filter((_, i) => i % 2 === 0), logos.filter((_, i) => i % 2 === 1)]
    : [logos];
  return (
    <div
      className={[prefix, className].filter(Boolean).join(" ")}
      role="region"
      aria-label={label}
      tabIndex={still || logos.some(logo => logo.href) ? undefined : 0}
      data-loop-region=""
      data-grayscale={grayscale || undefined}
      data-labels={labels}
      style={{ [variable + "-gap"]: Math.max(0, gap) + "px" } as CSSProperties}
    >
      {still ? (
        <ul className={prefix + "__wrap"}>
          {logos.map((logo, index) => <Logo key={index + "-" + logo.name} logo={logo} prefix={prefix} labels={labels} variable={variable} original />)}
        </ul>
      ) : rowsOfLogos.map((row, index) => (
        <MarqueeRow
          key={index}
          logos={row}
          prefix={prefix}
          labels={labels}
          variable={variable}
          velocity={speed * (direction === "left" ? 1 : -1) * (index ? -1 : 1)}
          start={index * 0.5}
          pauseOnHover={pauseOnHover}
        />
      ))}
    </div>
  );
}

export function KalosLogoMarqueePreview({ appearance = "clean" }: Pick<LogoMarqueeProps, "appearance">) {
  return (
    <div className="kalos-logo-marquee-preview" data-appearance={appearance}>
      <div className="kalos-logo-marquee-preview__content">
        <p className="kalos-logo-marquee-preview__caption">Trusted by teams at</p>
        <KalosLogoMarquee appearance={appearance} logos={marqueeLogos} rows={2} speed={36} labels="beside" label="Companies that use the product" />
      </div>
    </div>
  );
}

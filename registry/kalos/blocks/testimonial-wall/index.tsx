"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import "../shared/inter";
import { firstGrapheme } from "../shared/initials";
import { useLoopTrack, useStaticTrack } from "../shared/use-loop-track";
import { testimonials } from "./testimonials";
import "./styles.css";

export { testimonials };
export type Testimonial = {
  quote: string;
  name: string;
  role?: string;
  company?: string;
  avatar?: string;
  rating?: number;
  verified?: boolean;
};

export type TestimonialWallProps = {
  items?: Testimonial[];
  columns?: 1 | 2 | 3;
  speed?: number;
  pauseOnHover?: boolean;
  label?: string;
  className?: string;
  appearance?: "clean" | "classic";
};

const pace = [1, -0.84, 1.12];
const initialOffset = [0, 0.42, 0.18];

function initials(name: string) {
  const words = name.trim().split(/\s+/);
  const letters = words.filter(word => /^\p{L}/u.test(word));
  const names = (letters.length ? letters : words).filter((word, i) => !i || !/^(jr|sr|i{1,3}|iv|v|vi|phd|md|esq)[.,]?$/i.test(word));
  const outer = names.length > 1 ? [names[0], names[names.length - 1]] : names;
  return outer.map(firstGrapheme).join("").toLocaleUpperCase() || "?";
}

function fullTextIfTruncated(event: PointerEvent<HTMLElement>) {
  const element = event.currentTarget;
  element.title = element.scrollHeight > element.clientHeight + 1 || element.scrollWidth > element.clientWidth + 1 ? element.textContent || "" : "";
}

function QuoteCard({ item, prefix, original, appearance }: {
  item: Testimonial; prefix: string; original: boolean; appearance: TestimonialWallProps["appearance"];
}) {
  const [brokenPhoto, setBrokenPhoto] = useState<string>();
  const rating = item.rating && Number.isFinite(item.rating) ? Math.max(1, Math.min(5, Math.round(item.rating))) : 0;
  const meta = [item.role?.trim(), item.company?.trim()].filter(Boolean).join("\u00a0· ");
  const avatarSize = appearance === "clean" ? 32 : 36;
  return (
    <li className={prefix + "__item"}>
      <figure className={prefix + "__card"} tabIndex={original ? 0 : undefined}>
        {rating > 0 && (
          <div className={prefix + "__stars"} role="img" aria-label={`Rated ${rating} out of 5`}>
            {Array.from({ length: 5 }, (_, i) => (
              <svg key={i} data-on={i < rating || undefined} viewBox="0 0 16 16" aria-hidden="true">
                <path d="M8 1.6l1.9 3.95 4.35.6-3.17 3.03.78 4.32L8 11.43 4.14 13.5l.78-4.32L1.75 6.15l4.35-.6L8 1.6z" />
              </svg>
            ))}
          </div>
        )}
        {item.quote.trim() && (
          <blockquote className={prefix + "__quote"}><p dir="auto" onPointerEnter={fullTextIfTruncated}>{item.quote.trim()}</p></blockquote>
        )}
        <figcaption className={prefix + "__who"}>
          {item.avatar && item.avatar !== brokenPhoto ? (
            // The distributable block accepts photo URLs without requiring a Next.js image loader.
            // eslint-disable-next-line @next/next/no-img-element
            <img className={prefix + "__avatar"} src={item.avatar} width={avatarSize} height={avatarSize} alt="" loading="lazy" decoding="async" draggable={false} onError={() => setBrokenPhoto(item.avatar)} />
          ) : (
            <span className={prefix + "__avatar " + prefix + "__avatar--initials"} aria-hidden="true">{initials(item.name)}</span>
          )}
          <span className={prefix + "__id"}>
            <span className={prefix + "__name"}>
              <span className={prefix + "__name-text"} dir="auto" onPointerEnter={fullTextIfTruncated}>{item.name.trim()}</span>
              {item.verified && (
                <svg className={prefix + "__verified"} viewBox="0 0 16 16" role="img" aria-label="Verified customer">
                  <circle cx="8" cy="8" r="7" />
                  <path d="M5.2 8.1l1.9 1.9 3.7-3.8" fill="none" stroke={appearance === "clean" ? "var(--ui-twc-card)" : "var(--ui-tw-card)"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            {meta && <span className={prefix + "__meta"} dir="auto" onPointerEnter={fullTextIfTruncated}>{meta}</span>}
          </span>
        </figcaption>
      </figure>
    </li>
  );
}

function QuoteColumn({ items, prefix, index, speed, pauseOnHover, appearance }: {
  items: Testimonial[]; prefix: string; index: number; speed: number; pauseOnHover: boolean; appearance: TestimonialWallProps["appearance"];
}) {
  const { viewport, track, original, copies } = useLoopTrack({ axis: "y", velocity: speed * pace[index], start: initialOffset[index], pauseOnHover });
  return (
    <div className={prefix + "__col"} ref={viewport}>
      <div className={prefix + "__track"} ref={track}>
        {Array.from({ length: copies }, (_, copy) => (
          <ul key={copy} className={prefix + "__set"} aria-hidden={copy !== 1 || undefined} ref={copy === 1 ? original : undefined}>
            {items.map((item, index) => (
              <QuoteCard key={index + "-" + item.name} item={item} prefix={prefix} appearance={appearance} original={copy === 1} />
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

export function KalosTestimonialWall({
  items = testimonials, columns = 3, speed = 28, pauseOnHover = true, label = "What customers say", className, appearance = "clean",
}: TestimonialWallProps) {
  const still = useStaticTrack();
  const region = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState(3);
  useLayoutEffect(() => {
    const view = region.current;
    if (!view) return;
    const measure = () => setFit(view.clientWidth >= 740 ? 3 : view.clientWidth >= 480 ? 2 : 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(view);
    return () => observer.disconnect();
  }, []);
  const count = Math.max(1, Math.min(fit, columns, items.length));
  const prefix = "kalos-testimonial-wall--" + appearance;
  const variable = appearance === "clean" ? "--ui-twc-cols" : "--ui-tw-cols";
  return (
    <div
      ref={region}
      role="region"
      aria-label={label}
      className={[prefix, className].filter(Boolean).join(" ")}
      data-empty={!items.length || undefined}
      data-cols={count}
      data-static={still || undefined}
      style={{ [variable]: count } as CSSProperties}
    >
      {items.length ? Array.from({ length: count }, (_, index) => {
        const cards = items.filter((_, i) => i % count === index);
        if (still) return (
          <div key={index} className={prefix + "__col"}>
            <ul className={prefix + "__set"}>
              {cards.map((item, i) => <QuoteCard key={i + "-" + item.name} item={item} prefix={prefix} appearance={appearance} original />)}
            </ul>
          </div>
        );
        return (
        <QuoteColumn
          key={index}
          prefix={prefix}
          items={cards}
          index={index}
          speed={speed}
          pauseOnHover={pauseOnHover}
          appearance={appearance}
        />
        );
      }) : <p className={prefix + "__empty"}>No quotes yet</p>}
    </div>
  );
}

export function KalosTestimonialWallPreview({ appearance = "clean" }: Pick<TestimonialWallProps, "appearance">) {
  return (
    <section className="kalos-testimonial-wall-preview" data-appearance={appearance}>
      <div className="kalos-testimonial-wall-preview__content">
        <header className="kalos-testimonial-wall-preview__head">
          <p>Testimonials</p>
          <h2>Loved by product teams</h2>
        </header>
        <KalosTestimonialWall items={testimonials} speed={26} appearance={appearance} label="What product teams say" />
      </div>
    </section>
  );
}

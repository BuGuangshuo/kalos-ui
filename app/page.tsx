import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Code2,
  SlidersHorizontal,
  Accessibility,
  Terminal,
  Heart,
} from "lucide-react";
import { HeroShowcase, ComponentDemo } from "@/components/demos";
import { InstallCommand, GithubIcon } from "@/components/site-shell";
import { catalog } from "@/lib/catalog";
import { site } from "@/lib/site";
export default function Home() {
  return (
    <>
      <section className="hero page-width">
        <div className="hero-copy">
          <Link className="release-pill" href="/components">
            <span className="status-dot" />A small collection. A thoughtful
            beginning.
            <ArrowRight />
          </Link>
          <h1>
            Small details.
            <br />
            <span className="serif-line">Better interfaces.</span>
            <span className="hero-spark">✳</span>
          </h1>
          <p>
            Thoughtful React components that make your next idea feel a little
            more <em>you.</em> Beautifully simple. Ready to make your own.
          </p>
          <div className="hero-actions">
            <Link href="/components" className="primary-link">
              Explore components <ArrowRight />
            </Link>
            <a
              href={site.github}
              target="_blank"
              rel="noreferrer"
              className="secondary-link"
            >
              <GithubIcon />
              View on GitHub <ArrowUpRight />
            </a>
          </div>
          <div className="hero-meta">
            <span>
              <span className="tiny-check">✓</span>Open source
            </span>
            <span>
              <span className="tiny-check">✓</span>Free, forever
            </span>
            <span>
              <span className="tiny-check">✓</span>Yours to shape
            </span>
          </div>
        </div>
        <HeroShowcase />
      </section>
      <section className="compatibility page-width">
        <span>A familiar foundation. A fresh perspective.</span>
        <div>
          <span className="tech-logo">
            ⚛ <b>React</b>
          </span>
          <span className="tech-logo">
            <b className="next-logo">N</b> Next.js
          </span>
          <span className="tech-logo shadcn-logo">
            ╱╱ <b>shadcn/ui</b>
          </span>
          <span className="tech-logo">
            ≋ <b>Tailwind CSS</b>
          </span>
          <span className="tech-logo">
            <b className="ts-logo">TS</b> TypeScript
          </span>
        </div>
      </section>
      <section className="collection-section page-width">
        <div className="section-eyebrow">
          <span className="status-dot" />
          THE COLLECTION
        </div>
        <div className="section-heading">
          <div>
            <h2>A good place to start.</h2>
            <p>
              The essentials, with a little extra care. Go ahead, try them out.
            </p>
          </div>
          <Link href="/components" className="text-link">
            All components <span>12</span>
            <ArrowUpRight />
          </Link>
        </div>
        <div className="component-grid">
          {catalog.slice(0, 6).map((item, index) => (
            <article className="component-card" key={item.slug}>
              <div className={`component-preview preview-${item.slug}`}>
                <ComponentDemo slug={item.slug} compact />
              </div>
              <Link
                className="component-card-label"
                href={`/components/${item.slug}`}
              >
                <div>
                  <span className="component-number">0{index + 1}</span>
                  <h3>{item.title}</h3>
                </div>
                <span className="component-category">{item.category}</span>
                <ArrowUpRight />
              </Link>
            </article>
          ))}
        </div>
      </section>
      <section className="values-section page-width">
        <div className="value-intro">
          <span className="section-eyebrow">LESS FRICTION. MORE CREATING.</span>
          <h2>
            Good components.
            <br />
            No strings attached.
          </h2>
          <p>
            Install what you need. Change what you like.
            <br />
            Build something that feels like you.
          </p>
          <Link href="/docs" className="text-link">
            Get started <ArrowRight />
          </Link>
        </div>
        <div className="value-grid">
          {[
            {
              Icon: Code2,
              title: "Your code, your canvas.",
              text: "Real source files in your project. No black boxes. No waiting for someone else to change a detail.",
            },
            {
              Icon: SlidersHorizontal,
              title: "Made to be made yours.",
              text: "Semantic tokens and familiar primitives. Find your colors, your rhythm, your own point of view.",
            },
            {
              Icon: Accessibility,
              title: "The details are handled.",
              text: "Keyboard navigation, focus management, and accessible primitives. A considerate place to begin.",
            },
            {
              Icon: Terminal,
              title: "One command away.",
              text: "Works with the shadcn CLI you already know. Copy, install, and get back to making things.",
            },
          ].map(({ Icon, title, text }) => (
            <div className="value-item" key={title}>
              <Icon />
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="get-started page-width">
        <div className="section-eyebrow">
          <Heart /> A LITTLE POP GOES A LONG WAY
        </div>
        <h2>Your next idea is waiting.</h2>
        <p>Start with a button. See where it takes you.</p>
        <InstallCommand />
        <Link className="text-link" href="/docs">
          The two-minute setup <ArrowUpRight />
        </Link>
      </section>
    </>
  );
}

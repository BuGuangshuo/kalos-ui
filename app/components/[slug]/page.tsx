import { readFile } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { catalog } from "@/lib/catalog";
import { Sidebar, CodeBlock } from "@/components/docs-parts";
import { ComponentDetails } from "@/components/component-details";
import { InstallCommand } from "@/components/site-shell";
import { Badge } from "@/components/ui/badge";
export const dynamicParams = false;
export function generateStaticParams() {
  return catalog.map((item) => ({ slug: item.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = catalog.find((item) => item.slug === slug);
  return { title: item?.title || "Component", description: item?.description };
}
export default async function DetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = catalog.find((item) => item.slug === slug);
  if (!item) notFound();
  const source = await readFile(
    path.join(process.cwd(), "registry", "pop", `${item.slug}.tsx`),
    "utf8",
  );
  const index = catalog.indexOf(item);
  const previous = catalog[index - 1],
    next = catalog[index + 1];
  return (
    <div className="page-width docs-layout">
      <Sidebar active={slug} />
      <article className="detail-content">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/components">Components</Link>
          <ChevronRight />
          <span>{item.title}</span>
        </nav>
        <h1>{item.title}</h1>
        <p className="lead">{item.description}</p>
        <div className="detail-meta">
          <Badge variant="secondary">{item.category}</Badge>
          <span>React · TypeScript · shadcn/ui</span>
        </div>
        <ComponentDetails slug={slug} source={source} />
        <h2>Make it yours.</h2>
        <p className="muted text-xs leading-relaxed">
          Add this component to an initialized shadcn/ui project. Required
          primitives are installed automatically.
        </p>
        <InstallCommand slug={slug} />
        <h2>Usage</h2>
        <CodeBlock
          code={`import { ${item.slug
            .split("-")
            .map((part) => part[0].toUpperCase() + part.slice(1))
            .join("")} } from "@/components/ui/${slug}"\n\n${item.usage}`}
        />
        <h2>Component API</h2>
        <p className="props-info">{item.props}</p>
        <div className="detail-next">
          {previous ? (
            <Link href={`/components/${previous.slug}`}>
              <ArrowLeft />
              {previous.title}
            </Link>
          ) : (
            <Link href="/components">
              <ArrowLeft />
              All components
            </Link>
          )}
          {next ? (
            <Link href={`/components/${next.slug}`}>
              {next.title}
              <ArrowRight />
            </Link>
          ) : (
            <Link href="/docs">
              Documentation
              <ArrowRight />
            </Link>
          )}
        </div>
      </article>
    </div>
  );
}

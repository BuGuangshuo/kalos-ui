import { readFile } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { catalog } from "@/lib/catalog";
import { Sidebar } from "@/components/docs-parts";
import { PagePagination } from "@/components/page-pagination";
import { ComponentDetails, ComponentInstallation, ComponentReference } from "@/components/component-details";
import { InstallCommand } from "@/components/site-shell";
import { PrimitiveCode } from "@/components/primitive-code";
import { reactExample } from "@/lib/component-examples";
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
  return {
    title: item ? `${item.title} ${item.english}` : "组件",
    description: item?.description,
  };
}
export default async function DetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = catalog.find((item) => item.slug === slug);
  if (!item) notFound();
  const [source, baseSource, ariaSource] = slug === "kalos-command-menu"
    ? Array<string>(3).fill(await readFile(path.join(process.cwd(), "components/ui/kalos-command-menu-panel.tsx"), "utf8"))
    : await Promise.all([
    readFile(
      path.join(process.cwd(), "registry", "kalos", `${item.slug}.tsx`),
      "utf8",
    ),
    readFile(
      path.join(process.cwd(), "registry", "base-ui", `${item.slug}.tsx`),
      "utf8",
    ),
    readFile(
      path.join(process.cwd(), "registry", "react-aria", `${item.slug}.tsx`),
      "utf8",
    ),
  ]);
  const index = catalog.indexOf(item);
  const previous = catalog[index - 1],
    next = catalog[index + 1];
  return (
    <div className="workbench component-workbench">
      <Sidebar active={slug} />
      <div className="component-docs-panel">
        <article className="detail-content">
          <nav className="breadcrumbs" aria-label="面包屑导航">
            <Link href="/components">组件</Link>
            <ChevronRight />
            <span>{item.category}</span>
            <ChevronRight />
            <span>{item.title}</span>
          </nav>
          <header className="detail-title">
            <h1>
              {item.title}
              <span>{item.english}</span>
            </h1>
            <p>{item.description}</p>
            <InstallCommand slug={slug} />
          </header>
          <section id="preview">
            <ComponentDetails
              slug={slug}
              source={source}
              baseSource={baseSource}
              ariaSource={ariaSource}
            />
          </section>
          <ComponentInstallation slug={slug} />
          <section id="usage">
            <h2>使用</h2>
            <PrimitiveCode
              radix={reactExample(item)}
            />
          </section>
          <ComponentReference slug={slug} />
          <PagePagination
            previous={previous ? { href: `/components/${previous.slug}`, title: previous.title } : { href: "/components", title: "全部组件" }}
            next={next ? { href: `/components/${next.slug}`, title: next.title } : { href: "/docs/getting-started", title: "安装" }}
          />
        </article>
      </div>
    </div>
  );
}

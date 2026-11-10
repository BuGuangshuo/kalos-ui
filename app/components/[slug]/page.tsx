import { readFile } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { catalog } from "@/lib/catalog";
import { Sidebar } from "@/components/docs-parts";
import { ComponentDetails, ComponentInstallation, ComponentReference } from "@/components/component-details";
import { InstallCommand } from "@/components/site-shell";
import { FrameworkCode } from "@/components/framework";
import { reactExample } from "@/lib/component-examples";
import { vueExample } from "@/lib/vue-catalog";
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
  const sharedSource = slug === "kalos-command-menu" ? path.join(process.cwd(), "components/ui/kalos-command-menu-panel.tsx") : undefined;
  const [source, vueSource, baseSource, ariaSource] = await Promise.all([
    readFile(
      sharedSource || path.join(process.cwd(), "registry", "kalos", `${item.slug}.tsx`),
      "utf8",
    ),
    readFile(
      path.join(process.cwd(), "registry", "vue", `${item.slug}.vue`),
      "utf8",
    ),
    readFile(
      sharedSource || path.join(process.cwd(), "registry", "base-ui", `${item.slug}.tsx`),
      "utf8",
    ),
    readFile(
      sharedSource || path.join(process.cwd(), "registry", "react-aria", `${item.slug}.tsx`),
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
              vueSource={vueSource}
            />
          </section>
          <ComponentInstallation slug={slug} />
          <section id="usage">
            <h2>使用</h2>
            <FrameworkCode
              reactFilename="example.tsx"
              vueFilename="Example.vue"
              vue={vueExample(slug)}
              react={reactExample(item)}
            />
          </section>
          <ComponentReference slug={slug} />
          <div className="detail-next">
            {previous ? (
              <Link href={`/components/${previous.slug}`}>
                <ArrowLeft />
                {previous.title}
              </Link>
            ) : (
              <Link href="/components">
                <ArrowLeft />
                全部组件
              </Link>
            )}
            {next ? (
              <Link href={`/components/${next.slug}`}>
                {next.title}
                <ArrowRight />
              </Link>
            ) : (
              <Link href="/docs/getting-started">
                使用文档
                <ArrowRight />
              </Link>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}

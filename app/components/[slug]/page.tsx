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
import { CodeBlock } from "@/components/code-block";
import { reactExample } from "@/lib/component-examples";
import { hoverCardActivityExample } from "@/lib/hover-card-examples";
import { PopoverExamples } from "@/components/popover-examples";
import { SegmentedControlExamples } from "@/components/segmented-control-examples";
import { DropdownMenuExamples } from "@/components/dropdown-menu-examples";
import { NumberInputExamples } from "@/components/number-input-examples";
import { TableExamples } from "@/components/table-examples";
import { tableExample, tableExampleVariants } from "@/lib/table-examples";
import { componentPrompt } from "@/lib/component-prompt";
import { installerCommand } from "@/lib/installer";
import { site } from "@/lib/site";
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
    title: item ? `${item.english} ${item.title}` : "组件",
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
  const [source, hoverCardDemoSource, tableDemoSource, tableOptionsSource] = await Promise.all([
    slug === "kalos-command-menu"
      ? readFile(path.join(process.cwd(), "components/ui/kalos-command-menu-panel.tsx"), "utf8")
      : readFile(path.join(process.cwd(), "registry/kalos", `${item.slug}.tsx`), "utf8"),
    slug === "kalos-hover-card" ? readFile(path.join(process.cwd(), "components/hover-card-activity-demo.tsx"), "utf8") : "",
    slug === "kalos-table" ? readFile(path.join(process.cwd(), "components/table-demo.tsx"), "utf8") : "",
    slug === "kalos-table" ? readFile(path.join(process.cwd(), "components/table-row-options.tsx"), "utf8") : "",
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
            <h1 className="component-title">
              {item.english}
              <span>{item.title}</span>
            </h1>
            <p>{item.description}</p>
            <InstallCommand slug={slug} />
          </header>
          <section id="preview">
            <ComponentDetails
              slug={slug}
              source={source}
              prompt={componentPrompt({
                name: `${item.title} ${item.english}`,
                description: item.description,
                installation: installerCommand(site.url, "npm", item.slug),
                example: reactExample(item),
                docsUrl: `${site.url}/components/${item.slug}`,
                registryUrl: `${site.url}/r/${item.slug}.json`,
              })}
            />
          </section>
          <ComponentInstallation slug={slug} />
          <section id="usage">
            <h2>使用</h2>
            {slug === "kalos-table" ? <p>默认示例的 Options 使用 Dropdown Menu、Dialog、Input 和 Button；同时安装这些组件，并运行 npm install sonner 以显示操作结果。已有 Toaster 时复用原有入口。</p> : null}
            <CodeBlock
              code={slug === "kalos-hover-card" ? hoverCardActivityExample(hoverCardDemoSource) : slug === "kalos-table" ? tableExample("data", tableDemoSource, tableOptionsSource) : reactExample(item)}
              language="tsx"
            />
          </section>
          {slug === "kalos-number-input" && <NumberInputExamples />}
          {slug === "kalos-segmented-control" && <SegmentedControlExamples />}
          {slug === "kalos-dropdown-menu" && <DropdownMenuExamples />}
          {slug === "kalos-popover" && <PopoverExamples />}
          {slug === "kalos-table" && <TableExamples examples={Object.fromEntries(tableExampleVariants.map(({ variant }) => [variant, tableExample(variant, tableDemoSource, tableOptionsSource)]))} />}
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

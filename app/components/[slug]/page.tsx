import { readFile } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { catalog } from "@/lib/catalog";
import { Sidebar, CodeBlock, OnThisPage } from "@/components/docs-parts";
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
  const source = await readFile(
    path.join(process.cwd(), "registry", "pop", `${item.slug}.tsx`),
    "utf8",
  );
  const index = catalog.indexOf(item);
  const previous = catalog[index - 1],
    next = catalog[index + 1];
  return (
    <div className="workbench">
      <Sidebar active={slug} />
      <div className="docs-grid">
        <article className="detail-content">
          <nav className="breadcrumbs" aria-label="面包屑导航">
            <Link href="/components">组件</Link>
            <ChevronRight />
            <span>{item.title}</span>
          </nav>
          <header className="detail-title">
            <h1>
              {item.title}
              <span>{item.english}</span>
            </h1>
            <p>{item.description}</p>
            <div className="detail-meta">
              <Badge variant="secondary">{item.category}</Badge>
              <span>React · TypeScript · Radix UI</span>
            </div>
          </header>
          <section id="preview">
            <ComponentDetails slug={slug} source={source} />
          </section>
          <section id="installation">
            <h2>安装</h2>
            <p>
              在已初始化的 Radix 版 shadcn/ui
              项目中运行。所需基础组件会自动安装。
            </p>
            <InstallCommand slug={slug} />
          </section>
          <section id="usage">
            <h2>使用</h2>
            <CodeBlock
              language="tsx"
              filename="example.tsx"
              code={`import { ${item.slug
                .split("-")
                .map((part) => part[0].toUpperCase() + part.slice(1))
                .join("")} } from "@/components/ui/${slug}"\n\n${item.usage}`}
            />
          </section>
          <section id="api">
            <h2>组件 API</h2>
            <p className="props-info">{item.props}</p>
            <p>
              组件继承现有的语义颜色，视觉规范参考{" "}
              <Link href="/docs/tokens">设计变量</Link>
              。需要自定义时，直接修改安装到项目中的源码即可。
            </p>
          </section>
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
        <OnThisPage
          links={[
            { id: "preview", title: "预览与源码" },
            { id: "installation", title: "安装" },
            { id: "usage", title: "使用" },
            { id: "api", title: "组件 API" },
          ]}
        />
      </div>
    </div>
  );
}

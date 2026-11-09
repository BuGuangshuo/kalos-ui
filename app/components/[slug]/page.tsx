import { readFile } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { catalog } from "@/lib/catalog";
import { Sidebar, OnThisPage } from "@/components/docs-parts";
import { ComponentDetails } from "@/components/component-details";
import { InstallCommand } from "@/components/site-shell";
import { Badge } from "@/components/ui/badge";
import { FrameworkCode, FrameworkSwitcher } from "@/components/framework";
import { PrimitiveSwitcher, PrimitiveText } from "@/components/primitives";
import { vueCatalog, vueExample } from "@/lib/vue-catalog";
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
  const [source, vueSource, baseSource, ariaSource] = await Promise.all([
    readFile(
      path.join(process.cwd(), "registry", "pop", `${item.slug}.tsx`),
      "utf8",
    ),
    readFile(
      path.join(process.cwd(), "registry", "vue", `${item.slug}.vue`),
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
              <span>
                <PrimitiveText
                  radix="React · TypeScript · Radix UI"
                  base="React · TypeScript · Base UI"
                  aria="React · TypeScript · React Aria"
                  vue="Vue · TypeScript · Reka UI"
                />
              </span>
            </div>
            <FrameworkSwitcher />
            <PrimitiveSwitcher />
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
          <section id="installation">
            <h2>安装</h2>
            <p>
              <PrimitiveText
                radix="在已初始化的 Radix 版 shadcn/ui 项目中运行。"
                base="在 Base UI 版 shadcn/ui 项目中运行（init --base base）。"
                aria="在 React Aria 版 shadcn/ui 项目中运行（init --base aria）。"
                vue="在已初始化的 shadcn-vue 项目中运行（Vue 3.5+、Tailwind CSS）。"
              />
              所需基础组件会自动安装。
            </p>
            <InstallCommand slug={slug} />
          </section>
          <section id="usage">
            <h2>使用</h2>
            <FrameworkCode
              reactFilename="example.tsx"
              vueFilename="Example.vue"
              vue={vueExample(slug)}
              react={`import { ${item.slug
                .split("-")
                .map((part) => part[0].toUpperCase() + part.slice(1))
                .join("")} } from "@/components/ui/${slug}"\n\n${item.usage}`}
            />
          </section>
          <section id="api">
            <h2>组件 API</h2>
            <p className="props-info">
              <PrimitiveText
                radix={item.props}
                base={
                  slug === "pop-checkbox"
                    ? "label: string；description?: string；checked?: boolean；onCheckedChange?: (checked: boolean) => void；indeterminate?: boolean。支持 Base UI Checkbox 属性。"
                    : slug === "pop-button"
                      ? "支持 Base UI Button 属性（包括 render）；variant、size、loading?: boolean。"
                      : item.props
                }
                aria={
                  slug === "pop-checkbox"
                    ? "label: string；description?: string；checked?: boolean；onCheckedChange?: (checked: boolean) => void；isIndeterminate?: boolean。也支持 React Aria 的 isSelected、defaultSelected、isDisabled 和 onChange。"
                    : slug === "pop-switch"
                      ? "label: string；description?: string；checked?: boolean；onCheckedChange?: (checked: boolean) => void。也支持 React Aria 的 isSelected、defaultSelected、isDisabled 和 onChange。"
                      : slug === "pop-button"
                        ? "variant、size、loading?: boolean；isDisabled / disabled 控制禁用；onPress 处理操作，onClick?: () => void 为便捷别名。其余属性继承 React Aria Button。"
                        : item.props
                }
                vue={vueCatalog[slug].props}
              />
            </p>
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

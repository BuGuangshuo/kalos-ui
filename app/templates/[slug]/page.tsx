import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { CodeBlock } from "@/components/code-block";
import { ComponentInstallation } from "@/components/component-installation";
import { PagePagination } from "@/components/page-pagination";
import { InstallCommand } from "@/components/site-shell";
import { TemplateManualSource, TemplatePreview } from "@/components/templates/template-preview";
import { componentPrompt } from "@/lib/component-prompt";
import { installerCommand } from "@/lib/installer";
import { templates } from "@/lib/templates";
import { site } from "@/lib/site";
import "@/components/block-details.css";
import "@/components/templates/template-preview.css";

type PageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return templates.map(({ slug }) => ({ slug }));
}

function getTemplate(slug: string) {
  return templates.find(template => template.slug === slug) ?? notFound();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { english, title, description } = getTemplate((await params).slug);
  return { title: `${english} ${title}`, description };
}

export default async function TemplatePage({ params }: PageProps) {
  const { slug, href, previewHref, english, title, description, componentName, sources } = getTemplate((await params).slug);
  const registryName = `kalos-${slug}`;
  const registryPath = `/r/${registryName}.json`;
  const usage = `import { ${componentName} } from "@/components/templates/${slug}";\n\nexport default function Page() {\n  return <${componentName} />;\n}`;
  const prompt = componentPrompt({
    name: `${english} ${title}`,
    description,
    installation: installerCommand(site.url, "npm", registryName),
    example: usage,
    docsUrl: `${site.url}${href}`,
    registryUrl: `${site.url}${registryPath}`,
  });

  return <article className="component-docs-panel template-detail-page">
    <nav className="breadcrumbs" aria-label="面包屑导航">
      <Link href="/templates">模版</Link>
      <ChevronRight aria-hidden="true" />
      <span aria-current="page">{title}</span>
    </nav>
    <header className="detail-title">
      <h1 className="component-title">{english}<span>{title}</span></h1>
      {description && <p>{description}</p>}
      <InstallCommand slug={registryName} />
    </header>
    <section id="preview" aria-label={`${english} 预览和源码`}>
      <TemplatePreview name={english} previewHref={previewHref} sourceHref={`${href}/source`} sources={sources} prompt={prompt} />
    </section>
    <div className="detail-content">
      <ComponentInstallation slug={registryName} manualContent={<TemplateManualSource href={registryPath} entry={`components/templates/${slug}/index.tsx`} />} />
      <section id="usage"><h2>使用</h2><CodeBlock code={usage} language="tsx" /></section>
      <PagePagination previous={{ href: "/templates", title: "全部模版" }} />
    </div>
  </article>;
}

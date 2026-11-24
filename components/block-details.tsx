import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { BlockDoc } from "@/lib/blocks";
import { BlockPreview } from "@/components/block-preview";
import { BlockSource, type BlockRegistrySource } from "@/components/block-source";
import { componentPrompt } from "@/lib/component-prompt";
import { installerCommand } from "@/lib/installer";
import { site } from "@/lib/site";
import { ComponentInstallation } from "@/components/component-installation";
import { ReferenceTable } from "@/components/reference-table";
import { CodeBlock } from "@/components/code-block";
import { InstallCommand } from "@/components/site-shell";
import "./block-details.css";

export async function BlockDetails({ item, pagination }: { item: BlockDoc; pagination: ReactNode }) {
  const { slug, english, title, description, usage, props, keyboard } = item;
  const registryName = `kalos-${slug}`;
  const registryPath = `/r/${registryName}.json`;
  const source: BlockRegistrySource = JSON.parse(await readFile(path.join(process.cwd(), "public", registryPath), "utf8"));
  const prompt = componentPrompt({
    name: `${title} ${english}`,
    description,
    installation: installerCommand(site.url, "npm", registryName),
    example: usage,
    docsUrl: `${site.url}/components/${slug}`,
    registryUrl: `${site.url}${registryPath}`,
  });
  return <article className="block-article">
    <div className="detail-content">
      <nav className="breadcrumbs" aria-label="面包屑导航">
        <Link href="/components">组件</Link>
        <ChevronRight aria-hidden="true" />
        <Link href="/components#block">Block</Link>
        <ChevronRight aria-hidden="true" />
        <span>{title}</span>
      </nav>
      <header className="detail-title">
        <h1 className="component-title">{english}<span>{title}</span></h1>
        <p>{description}</p>
        <InstallCommand slug={registryName} />
      </header>
    </div>
    <section id="preview" aria-label={`${english} 预览和源码`}>
      <BlockPreview key={slug} slug={slug} source={source} prompt={prompt} />
    </section>
    <div className="detail-content">
      <ComponentInstallation slug={registryName} manualContent={<BlockSource key={slug} source={source} manual />} />
      <section id="usage"><h2>使用</h2><CodeBlock code={usage} language="tsx" /></section>
      <ReferenceTable props={props} keyboard={keyboard} />
      {pagination}
    </div>
  </article>;
}

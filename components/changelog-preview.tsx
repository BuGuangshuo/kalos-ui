import type { ReactNode } from "react";
import { CatalogBlockPreview } from "@/components/catalog-block-preview";
import { CatalogPreview } from "@/components/catalog-preview";
import { blocks } from "@/lib/blocks";
import { catalog } from "@/lib/catalog";

export function ChangelogPreview({ slug, caption = true, full = false, children }: { slug: string; caption?: boolean; full?: boolean; children?: ReactNode }) {
  const block = blocks.find(item => item.slug === slug);
  const item = block ?? catalog.find(component => component.slug === slug);
  if (!item) return null;

  return <figure className="changelog-preview" data-component={slug} data-full-preview={full || undefined} aria-label={`${item.english} ${item.title}预览`}>
    {caption ? <figcaption>{item.english}<span>{item.title}</span></figcaption> : null}
    {block ? <CatalogBlockPreview slug={block.slug} /> : <CatalogPreview slug={slug} compact={!full}>{children}</CatalogPreview>}
  </figure>;
}

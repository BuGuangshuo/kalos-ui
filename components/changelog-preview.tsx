import { CatalogPreview } from "@/components/catalog-preview";
import { catalog } from "@/lib/catalog";

export function ChangelogPreview({ slug, caption = true, full = false }: { slug: string; caption?: boolean; full?: boolean }) {
  const item = catalog.find(component => component.slug === slug);
  if (!item) return null;

  return <figure className="changelog-preview" data-component={slug} data-full-preview={full || undefined} aria-label={`${item.english} ${item.title}预览`}>
    {caption ? <figcaption>{item.english}<span>{item.title}</span></figcaption> : null}
    <CatalogPreview slug={slug} compact={!full} />
  </figure>;
}

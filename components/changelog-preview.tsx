import { CatalogPreview } from "@/components/catalog-preview";
import { catalog } from "@/lib/catalog";

export function ChangelogPreview({ slug, caption = true }: { slug: string; caption?: boolean }) {
  const item = catalog.find(component => component.slug === slug);
  if (!item) return null;

  return <figure className="changelog-preview" data-component={slug} aria-label={`${item.english} ${item.title}预览`}>
    {caption ? <figcaption>{item.english}<span>{item.title}</span></figcaption> : null}
    <CatalogPreview slug={slug} />
  </figure>;
}

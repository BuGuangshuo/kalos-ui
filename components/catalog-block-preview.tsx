"use client";

import { useEffect, useRef, useState } from "react";
import { blockPreviews } from "@/components/block-previews";
import { CatalogPreview } from "@/components/catalog-preview";
import type { BlockSlug } from "@/lib/blocks";

export function CatalogBlockPreview({ slug }: { slug: BlockSlug }) {
  const card = useRef<HTMLDivElement>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const target = card.current;
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setShowPreview(true);
      observer.disconnect();
    }, { rootMargin: "320px" });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const Preview = blockPreviews[slug];
  return <div ref={card} className="catalog-block-preview">
    <CatalogPreview slug={slug}>{showPreview ? <Preview /> : <span aria-hidden="true" />}</CatalogPreview>
  </div>;
}

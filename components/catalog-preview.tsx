"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { ComponentDemo } from "@/components/demos";

export function CatalogPreview({ slug, compact = true, children }: { slug: string; compact?: boolean; children?: ReactNode }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!viewport || !content) return;

    const fit = () => {
      const width = Math.max(content.offsetWidth, content.scrollWidth);
      const height = Math.max(content.offsetHeight, content.scrollHeight);
      if (!width || !height) return;
      const scale = Math.min(1, viewport.clientWidth / width, viewport.clientHeight / height);
      content.style.setProperty("--catalog-preview-scale", String(scale));
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(viewport);
    observer.observe(content);
    return () => observer.disconnect();
  }, []);

  return <div className="component-preview" data-component={slug}>
    <div className="catalog-preview-viewport" ref={viewportRef}>
      <div className="catalog-preview-content" ref={contentRef}>
        {children ?? <ComponentDemo slug={slug} compact={compact} />}
      </div>
    </div>
  </div>;
}

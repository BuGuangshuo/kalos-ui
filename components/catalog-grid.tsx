"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { ArrowUpRight, Layers } from "lucide-react";
import { catalog } from "@/lib/catalog";
import type { BlockSlug } from "@/lib/blocks";
import { filterLibraryItems, libraryCategories } from "@/components/library-items";
import { blockPreviews } from "@/components/block-previews";
import { CatalogPreview } from "@/components/catalog-preview";
import { DropdownMenuPanelPreview } from "@/components/dropdown-menu-demo";
import { LibrarySidebar } from "@/components/library-sidebar";
import { PagePagination } from "@/components/page-pagination";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
function CatalogBlockPreview({ slug }: { slug: BlockSlug }) {
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

export function CatalogGrid() {
  const [query, setQuery] = useState("");
  const items = filterLibraryItems(query);
  return (
    <div className="workbench">
      <LibrarySidebar
        active="overview"
        query={query}
        onQueryChange={setQuery}
      />
      <div className="catalog-content">
        <div className="mobile-catalog-search">
          <Input
            aria-label="筛选组件"
            placeholder="搜索组件…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        {query ? (
          <div className="catalog-result">
            “{query}” 的搜索结果 · {items.length} 个组件
          </div>
        ) : null}
        {items.length ? (
          libraryCategories.map((category) => {
            const group = items.filter((item) => item.category === category);
            return group.length ? (
              <section className="catalog-section" id={category === "Block" ? "block" : undefined} key={category}>
                <h2>
                  {category}
                  <span>{group.length}</span>
                </h2>
                <div className="component-grid">
                  {group.map((item) => (
                    <article className="component-card" key={item.slug}>
                      {item.category === "Block" ? <CatalogBlockPreview slug={item.slug} /> : <CatalogPreview slug={item.slug} compact={item.slug !== "kalos-otp-input"}>
                        {item.slug === "kalos-dropdown-menu" ? <DropdownMenuPanelPreview /> : null}
                      </CatalogPreview>}
                      <Link
                        href={`/components/${item.slug}`}
                        className="component-card-label"
                      >
                        <span>
                          {item.title}
                          <small>{item.english}</small>
                        </span>
                        <ArrowUpRight />
                      </Link>
                    </article>
                  ))}
                </div>
              </section>
            ) : null;
          })
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Layers />
              </EmptyMedia>
              <EmptyTitle>没有找到匹配的组件</EmptyTitle>
              <EmptyDescription>
                试试其他关键词，例如“按钮”“输入”或“Button”。
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
        <PagePagination previous={{ href: "/docs/getting-started", title: "安装" }} next={{ href: `/components/${catalog[0].slug}`, title: catalog[0].title }} />
      </div>
    </div>
  );
}

"use client";
import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ArrowUpRight, Layers } from "lucide-react";
import { catalog, categories } from "@/lib/catalog";
import { CatalogPreview } from "@/components/catalog-preview";
import { LibrarySidebar } from "@/components/library-sidebar";
import { PagePagination } from "@/components/page-pagination";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
export function CatalogGrid() {
  const [query, setQuery] = useState("");
  const items = catalog.filter((item) =>
    `${item.title} ${item.english} ${item.description} ${item.category}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
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
          categories.map((category) => {
            const group = items.filter((item) => item.category === category);
            return group.length ? (
              <section className="catalog-section" key={category}>
                <h2>
                  {category}
                  <span>{group.length}</span>
                </h2>
                <div className="component-grid">
                  {group.map((item) => (
                    <article className="component-card" key={item.slug}>
                      <CatalogPreview slug={item.slug} />
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

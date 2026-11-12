"use client";
import Link from "next/link";
import { useState } from "react";
import { Search, ArrowUpRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { catalog, categories } from "@/lib/catalog";
import { site } from "@/lib/site";
export function LibrarySidebar({
  active,
  query,
  onQueryChange,
}: {
  active?: string;
  query?: string;
  onQueryChange?: (value: string) => void;
}) {
  const [localQuery, setLocalQuery] = useState("");
  const term = query ?? localQuery;
  const isDocs =
    active === "docs" || active === "tokens" || active === "skills" || active === "registry";
  const filtered = catalog.filter((item) =>
    `${item.title} ${item.english}`.toLowerCase().includes(term.toLowerCase()),
  );
  return (
    <aside className="library-sidebar">
      {!isDocs ? (
        <>
          <div className="sidebar-search">
            <Search />
            <Input
              aria-label="搜索组件"
              placeholder="搜索组件…"
              value={term}
              onChange={(event) =>
                onQueryChange
                  ? onQueryChange(event.target.value)
                  : setLocalQuery(event.target.value)
              }
            />
          </div>
          <Link
            className="sidebar-overview"
            href="/components"
            aria-current={active === "overview" ? "page" : undefined}
          >
            全部组件 <span>{catalog.length}</span>
          </Link>
          {categories.map((category) => {
            const group = filtered.filter((item) => item.category === category);
            return group.length ? (
              <div className="sidebar-group" key={category}>
                <span>{category}</span>
                {group.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/components/${item.slug}`}
                    aria-current={active === item.slug ? "page" : undefined}
                  >
                    <span>{item.english}</span>
                    <small>{item.title}</small>
                  </Link>
                ))}
              </div>
            ) : null;
          })}
          {filtered.length === 0 ? (
            <p className="sidebar-empty">没有匹配的组件</p>
          ) : null}
        </>
      ) : (
        <>
          <div className="sidebar-section">使用指南</div>
          <Link
            href="/docs/getting-started"
            aria-current={active === "docs" ? "page" : undefined}
          >
            快速开始
          </Link>
          <Link href="/docs/registry" aria-current={active === "registry" ? "page" : undefined}>注册表配置</Link>
          <Link href="/docs/skills" aria-current={active === "skills" ? "page" : undefined}>Skills</Link>
          <div className="sidebar-section">设计基础</div>
          <Link href="/docs/tokens" aria-current={active === "tokens" ? "page" : undefined}>设计系统</Link>
          <div className="sidebar-section">资源</div>
          <Link href="/components">组件总览</Link>
          <a href={site.github} target="_blank" rel="noreferrer">
            GitHub 仓库 <ArrowUpRight />
          </a>
        </>
      )}
    </aside>
  );
}

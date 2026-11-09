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
    active === "docs" || active === "tokens" || active === "skills";
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
            全部组件 <span>12</span>
          </Link>
          <div className="sidebar-section">组件</div>
          {categories.map((category) => (
            <div className="sidebar-group" key={category}>
              <span>{category}</span>
              {filtered
                .filter((item) => item.category === category)
                .map((item) => (
                  <Link
                    key={item.slug}
                    href={`/components/${item.slug}`}
                    aria-current={active === item.slug ? "page" : undefined}
                  >
                    {item.title}
                    <small>{item.english}</small>
                  </Link>
                ))}
            </div>
          ))}
          {filtered.length === 0 ? (
            <p className="sidebar-empty">没有匹配的组件</p>
          ) : null}
        </>
      ) : (
        <>
          <Link
            className="sidebar-overview"
            href="/docs/getting-started"
            aria-current={active === "docs" ? "page" : undefined}
          >
            快速开始
          </Link>
          <div className="sidebar-section">使用指南</div>
          <Link href="/docs/getting-started#installation">安装与配置</Link>
          <Link href="/docs/getting-started#usage">使用第一个组件</Link>
          <Link href="/docs/getting-started#namespace">注册表命名空间</Link>
          <Link href="/docs/getting-started#maintenance">扩展组件库</Link>
          <Link
            href="/docs/skills"
            aria-current={active === "skills" ? "page" : undefined}
          >
            Skills
          </Link>
          <div className="sidebar-section">设计基础</div>
          <Link
            href="/docs/tokens"
            aria-current={active === "tokens" ? "page" : undefined}
          >
            设计变量
          </Link>
          <Link href="/docs/tokens#colors">颜色与主题</Link>
          <Link href="/docs/tokens#spacing">间距</Link>
          <Link href="/docs/tokens#size">尺寸</Link>
          <Link href="/docs/tokens#radius">圆角</Link>
          <Link href="/docs/tokens#typography">排版</Link>
          <Link href="/docs/tokens#motion">动效</Link>
          <div className="sidebar-section">资源</div>
          <Link href="/components">组件总览</Link>
          <Link href="/docs/skills">
            安装 Skill <ArrowUpRight />
          </Link>
          <a href={site.github} target="_blank" rel="noreferrer">
            GitHub 仓库 <ArrowUpRight />
          </a>
        </>
      )}
    </aside>
  );
}

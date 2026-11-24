"use client";
import Link from "next/link";
import { useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { Search, ChevronDown, ArrowUpRight } from "lucide-react";
import { useNavigationHighlight } from "@/components/navigation-highlight";
import { Input } from "@/components/ui/input";
import { slidingHighlightClasses } from "@/components/ui/kalos-highlight";
import { filterLibraryItems, libraryCategories, libraryItems } from "@/components/library-items";
import "./library-browser.css";
import { newComponentSlugs } from "@/lib/changelog-releases";
import { site } from "@/lib/site";
import { designSections } from "@/lib/docs-navigation";
import { cn } from "@/lib/utils";
import { KalosBadge } from "@/registry/kalos/kalos-badge";

const sidebarScrollPositions: Record<"components" | "docs", number | null> = { components: null, docs: null };

function subscribeHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  window.addEventListener("popstate", onChange);
  return () => {
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener("popstate", onChange);
  };
}
const getHash = () => window.location.hash.slice(1);
const getServerHash = () => "";

function DesignSectionLinks({ active }: { active: boolean }) {
  const hash = useSyncExternalStore(subscribeHash, getHash, getServerHash);
  const SectionLink = active ? "a" : Link;
  return designSections.map(section => <SectionLink
    key={section.id}
    href={`/docs/tokens#${section.id}`}
    aria-current={active && (hash || designSections[0].id) === section.id ? "location" : undefined}
  >{section.title}</SectionLink>);
}
function ComponentLinks({ active, items }: { active?: string; items: typeof libraryItems }) {
  return <>
    <Link
      className="sidebar-overview"
      href="/components"
      aria-current={active === "overview" ? "page" : undefined}
    >
      全部组件 <span>{libraryItems.length}</span>
    </Link>
    {libraryCategories.map((category) => {
      const group = items.filter((item) => item.category === category);
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
              <small title={item.title}>{item.title}</small>
              {newComponentSlugs.has(item.slug) ? (
                <>
                  <KalosBadge tone="info" variant="ghost" size="sm" dot className="px-0!" aria-hidden="true" />
                  <span className="sr-only">新增组件</span>
                </>
              ) : null}
            </Link>
          ))}
        </div>
      ) : null;
    })}
    {items.length === 0 ? (
      <p className="sidebar-empty">没有匹配的组件</p>
    ) : null}
  </>;
}

function MobileComponentNavigation({ active }: { active?: string }) {
  const [query, setQuery] = useState("");
  const nav = useRef<HTMLElement>(null);
  return <details className="mobile-component-directory" onToggle={event => {
    if (!event.currentTarget.open || !nav.current) return;
    const selected = nav.current.querySelector<HTMLElement>('[aria-current="page"]');
    if (selected) nav.current.scrollTop += selected.getBoundingClientRect().top - nav.current.getBoundingClientRect().top - 36;
  }} onClick={event => {
    if ((event.target as HTMLElement).closest('a')) event.currentTarget.open = false;
  }}>
    <summary>组件目录 <ChevronDown size={14} aria-hidden="true" /></summary>
    <Input aria-label="搜索目录中的组件" placeholder="搜索组件…" value={query} onChange={event => setQuery(event.target.value)} />
    <nav className="sidebar-navigation" ref={nav} aria-label="移动组件导航">
      <div className="sidebar-list"><ComponentLinks active={active} items={filterLibraryItems(query)} /></div>
    </nav>
  </details>;
}

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
    active === "docs" || active === "tokens" || active === "skills" || active === "registry" || active === "mcp" || active === "changelog";
  const scrollKey = isDocs ? "docs" : "components";
  const navigationRef = useRef<HTMLElement>(null);
  const { highlight, ...pointerHandlers } = useNavigationHighlight("a[href]");
  useLayoutEffect(() => {
    const navigation = navigationRef.current;
    if (!navigation) return;
    const saved = sidebarScrollPositions[scrollKey];
    if (saved !== null) {
      navigation.scrollTop = saved;
      return;
    }
    const selected = navigation.querySelector<HTMLElement>('[aria-current="page"]');
    if (!selected) return;
    const viewport = navigation.getBoundingClientRect();
    const row = selected.getBoundingClientRect();
    if (row.bottom > viewport.bottom) navigation.scrollTop += row.bottom - viewport.bottom;
    else if (row.top < viewport.top) navigation.scrollTop -= viewport.top - row.top;
  }, [active, scrollKey]);
  const filtered = filterLibraryItems(term);
  return <>
    <aside className="library-sidebar">
      {!isDocs && (
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
      )}
      <nav
        ref={navigationRef}
        className="sidebar-navigation"
        aria-label={isDocs ? "文档导航" : "组件导航"}
        onScroll={event => { sidebarScrollPositions[scrollKey] = event.currentTarget.scrollTop; }}
        onClickCapture={event => { sidebarScrollPositions[scrollKey] = event.currentTarget.scrollTop; }}
      >
        <div ref={highlight} className={cn(slidingHighlightClasses, "navigation-highlight sidebar-list")} {...pointerHandlers}>
          {!isDocs ? (
            <ComponentLinks active={active} items={filtered} />
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
              <Link href="/docs/mcp" aria-current={active === "mcp" ? "page" : undefined}>MCP 配置</Link>
              <Link href="/docs/skills" aria-current={active === "skills" ? "page" : undefined}>Skills</Link>
              <Link href="/docs/changelog" aria-current={active === "changelog" ? "page" : undefined}>更新日志</Link>
              <div className="sidebar-section">设计基础</div>
              <DesignSectionLinks active={active === "tokens"} />
              <div className="sidebar-section">资源</div>
              <Link href="/components">组件总览</Link>
              <a href={site.github} target="_blank" rel="noreferrer">
                GitHub 仓库 <ArrowUpRight />
              </a>
            </>
          )}
        </div>
      </nav>
    </aside>
    {!isDocs && active !== "overview" && <MobileComponentNavigation key={active} active={active} />}
  </>;
}

"use client";
import Link from "next/link";
import { useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { Search, ArrowUpRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { catalog, categories } from "@/lib/catalog";
import { site } from "@/lib/site";
import { designSections } from "@/lib/docs-navigation";

const sidebarScrollPositions = { components: 0, docs: 0 };

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
  const sidebarRef = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    if (sidebarRef.current) sidebarRef.current.scrollTop = sidebarScrollPositions[scrollKey];
  }, [scrollKey]);
  const filtered = catalog.filter((item) =>
    `${item.title} ${item.english}`.toLowerCase().includes(term.toLowerCase()),
  );
  return (
    <aside ref={sidebarRef} className="library-sidebar" onScroll={event => { sidebarScrollPositions[scrollKey] = event.currentTarget.scrollTop; }} onClickCapture={event => { sidebarScrollPositions[scrollKey] = event.currentTarget.scrollTop; }}>
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
                    <small title={item.title}>{item.title}</small>
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
    </aside>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BookOpen, Home, Layers, Palette, Search, Sparkles, type LucideIcon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { KalosCommandMenu } from "@/registry/kalos/kalos-command-menu";
import { highlightMatches, searchSite, type SearchSection } from "@/lib/search";

const icons = { 组件: Layers, 文档: BookOpen, 设计系统: Palette, Skills: Sparkles, 页面: Home } satisfies Record<SearchSection, LucideIcon>;
export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const panel = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const results = searchSite(query);
  const sections = [...new Set(results.map(result => result.section))];
  const groups = sections.map(section => {
    const Icon = icons[section];
    return { label: section, items: results.filter(result => result.section === section).map(result => ({
      value: result.href, label: result.title, icon: <Icon aria-hidden="true" />,
      description: <>{highlightMatches(result.context, query).map((part, index) => part.matched ? <mark key={index}>{part.text}</mark> : part.text)}</>,
    })) };
  });
  const changeOpen = (next: boolean) => { setOpen(next); if (!next) setQuery(""); };
  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault(); setOpen(true);
        panel.current?.querySelector<HTMLInputElement>('input[role="combobox"]')?.focus();
      }
    };
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);
  return <Dialog open={open} onOpenChange={changeOpen}>
    <DialogTrigger asChild><button type="button" className="global-search-trigger" aria-label="打开全站搜索" title="搜索（⌘/Ctrl+K）"><Search aria-hidden="true" /></button></DialogTrigger>
    <DialogContent
      ref={panel} className="global-command-dialog translate-x-0 translate-y-0" showCloseButton={false}
      onEscapeKeyDown={event => { event.preventDefault(); if (query) setQuery(""); else changeOpen(false); }}
      onOpenAutoFocus={event => { event.preventDefault(); panel.current?.querySelector<HTMLInputElement>('input[role="combobox"]')?.focus(); }}
    >
      <DialogTitle className="sr-only">全站搜索</DialogTitle>
      <DialogDescription className="sr-only">搜索页面正文，选择结果后跳转到对应章节。</DialogDescription>
      <KalosCommandMenu groups={groups} label="搜索全站正文" placeholder="搜索全站正文…" query={query} onQueryChange={setQuery} filter={false} autoFocus onClose={() => changeOpen(false)} onRun={href => { router.push(href); changeOpen(false); }} />
    </DialogContent>
  </Dialog>;
}

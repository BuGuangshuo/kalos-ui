import content from "./search-content.json" with { type: "json" };

export const searchSections = ["组件", "文档", "设计系统", "Skills", "页面"] as const;
export type SearchSection = (typeof searchSections)[number];
export type SearchEntry = { title: string; href: string; section: SearchSection; paragraphs: string[] };
export type SearchResult = Omit<SearchEntry, "paragraphs"> & { context: string };
export const searchEntries = content as SearchEntry[];
export const queryTerms = (query: string) => [...new Set(query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean))];

export function contextSnippet(paragraph: string, terms: string[], length = 132) {
  const lower = paragraph.toLocaleLowerCase();
  const positions = terms.map(term => lower.indexOf(term)).filter(index => index >= 0);
  const first = positions.length ? Math.min(...positions) : 0;
  let start = Math.max(0, first - 28);
  if (start) {
    const boundary = [...paragraph.slice(start, first).matchAll(/[。！？!?]\s*/g)].at(-1);
    if (boundary) start += boundary.index! + boundary[0].length;
  }
  const end = Math.min(paragraph.length, Math.max(start + length, first + Math.max(0, ...terms.map(term => term.length))));
  return `${start ? "…" : ""}${paragraph.slice(start, end)}${end < paragraph.length ? "…" : ""}`;
}
export function highlightMatches(text: string, query: string) {
  const terms = queryTerms(query).sort((a, b) => b.length - a.length);
  if (!terms.length) return [{ text, matched: false }];
  const pattern = new RegExp(`(${terms.map(term => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "ig");
  return text.split(pattern).filter(Boolean).map(part => ({ text: part, matched: terms.includes(part.toLocaleLowerCase()) }));
}
export function searchSite(query: string, entries: SearchEntry[] = searchEntries): SearchResult[] {
  const terms = queryTerms(query);
  if (!terms.length) {
    const featured = ["/docs/getting-started", "/components/kalos-command-menu", "/components/kalos-popover", "/docs/tokens", "/docs/skills"];
    return featured.flatMap(href => entries.filter(entry => entry.href === href).map(({ paragraphs, ...entry }) => ({ ...entry, context: contextSnippet(paragraphs[0], []) })));
  }
  return entries.flatMap(({ paragraphs, ...entry }, order) => {
    const matches = paragraphs.filter(paragraph => terms.every(term => paragraph.toLocaleLowerCase().includes(term)));
    if (!matches.length) return [];
    const paragraph = matches.sort((a, b) => a.length - b.length)[0];
    return [{ ...entry, context: contextSnippet(paragraph, terms), score: paragraph.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()) ? 2 : 1, order }];
  }).sort((a, b) => b.score - a.score || a.order - b.order).slice(0, 12).map(({ title, href, section, context }) => ({ title, href, section, context }));
}

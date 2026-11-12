import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { docsPages } from "@/lib/docs-navigation";

type PageLink = { href: string; title: string };

export function PagePagination({ previous, next }: { previous?: PageLink; next?: PageLink }) {
  return (
    <nav className="page-pagination" aria-label="章节导航">
      {previous ? <Button asChild variant="ghost" className="page-pagination-previous">
        <Link href={previous.href} rel="prev" aria-label={`上一章：${previous.title}`}><ArrowLeft data-icon="inline-start" />{previous.title}</Link>
      </Button> : null}
      {next ? <Button asChild variant="ghost" className="page-pagination-next">
        <Link href={next.href} rel="next" aria-label={`下一章：${next.title}`}>{next.title}<ArrowRight data-icon="inline-end" /></Link>
      </Button> : null}
    </nav>
  );
}

export function DocsPagination({ current }: { current: string }) {
  const index = docsPages.findIndex(page => page.href === current);
  return <PagePagination
    previous={index > 0 ? docsPages[index - 1] : { href: "/", title: "首页" }}
    next={docsPages[index + 1] ?? { href: "/components", title: "全部组件" }}
  />;
}

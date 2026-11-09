import Link from "next/link";
import { catalog } from "@/lib/catalog";
import { CopyButton } from "@/components/site-shell";
export function Sidebar({ active }: { active?: string }) {
  return (
    <aside className="docs-sidebar">
      <span className="sidebar-heading">Getting started</span>
      <Link href="/docs" aria-current={active === "docs" ? "page" : undefined}>
        Introduction
      </Link>
      <Link href="/docs#installation">Installation</Link>
      <Link href="/docs#theming">Theming</Link>
      <Link href="/docs#your-registry">Your registry</Link>
      <span className="sidebar-heading">Components</span>
      {catalog.map((item) => (
        <Link
          key={item.slug}
          href={`/components/${item.slug}`}
          aria-current={active === item.slug ? "page" : undefined}
        >
          {item.title}
        </Link>
      ))}
    </aside>
  );
}
export function CodeBlock({
  code,
  filename,
}: {
  code: string;
  filename?: string;
}) {
  return (
    <div className="code-block">
      {filename ? <div className="source-file">{filename}</div> : null}
      <div className="code-copy">
        <CopyButton value={code} compact />
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}

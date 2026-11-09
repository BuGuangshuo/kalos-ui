import { CopyButton } from "@/components/site-shell";
export { LibrarySidebar as Sidebar } from "@/components/library-sidebar";
export function CodeBlock({
  code,
  filename,
  language = "bash",
}: {
  code: string;
  filename?: string;
  language?: string;
}) {
  return (
    <div className="code-block">
      <div className="code-header">
        <span>{filename || language}</span>
        <CopyButton value={code} label="复制代码" compact />
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}
export function OnThisPage({
  links,
}: {
  links: { id: string; title: string }[];
}) {
  return (
    <aside className="page-outline">
      <span>本页内容</span>
      <nav aria-label="本页目录">
        {links.map((link) => (
          <a href={`#${link.id}`} key={link.id}>
            {link.title}
          </a>
        ))}
      </nav>
    </aside>
  );
}

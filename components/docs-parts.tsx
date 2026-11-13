export { LibrarySidebar as Sidebar } from "@/components/library-sidebar";
export { CodeBlock } from "@/components/code-block";
export function OnThisPage({
  links,
}: {
  links: readonly { id: string; title: string }[];
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

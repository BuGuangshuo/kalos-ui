import { LibrarySidebar } from "@/components/library-sidebar";

export default async function ComponentLayout({ children, params }: LayoutProps<"/components/[slug]">) {
  const { slug } = await params;
  return (
    <div className="workbench component-workbench">
      <LibrarySidebar active={slug} />
      <div className="component-docs-panel">{children}</div>
    </div>
  );
}

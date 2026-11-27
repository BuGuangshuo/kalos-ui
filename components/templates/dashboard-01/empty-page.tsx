import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { dashboardPages } from "./navigation";

export function DashboardEmptyPage({ page }: { page: (typeof dashboardPages)[number] }) {
  const Icon = page.icon;
  return (
    <section aria-label={page.label} className="flex min-h-full flex-col px-5 py-6 sm:px-8 lg:px-10">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon"><Icon aria-hidden="true" /></EmptyMedia>
          <EmptyTitle>暂无内容</EmptyTitle>
        </EmptyHeader>
      </Empty>
    </section>
  );
}

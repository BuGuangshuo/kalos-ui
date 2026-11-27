import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DashboardEmptyPage } from "@/components/templates/dashboard-01/empty-page";
import { dashboardPages, findDashboardPage } from "@/components/templates/dashboard-01/navigation";
import Overview from "@/components/templates/dashboard-01/overview/overview";

type PageProps = { params: Promise<{ section: string[] }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return dashboardPages.map(page => ({ section: page.id.split("/") }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = findDashboardPage((await params).section);
  if (!page) notFound();
  return { title: `${page.label} · dashboard-01` };
}

export default async function DashboardSectionPage({ params }: PageProps) {
  const page = findDashboardPage((await params).section);
  if (!page) notFound();
  return page.id === "overview" ? <Overview /> : <DashboardEmptyPage page={page} />;
}

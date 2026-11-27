"use client";

import { useParams, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import DashboardTemplate from "@/components/templates/dashboard-01/dashboard-template";
import { findDashboardPage, type DashboardPageId } from "@/components/templates/dashboard-01/navigation";
import { dashboardTemplate } from "@/lib/templates";

const hrefForPage = (id: DashboardPageId) => `${dashboardTemplate.previewHref}/${id}`;

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { section } = useParams<{ section?: string[] }>();
  const router = useRouter();
  const page = findDashboardPage(section ?? []);
  return (
    <DashboardTemplate page={page?.id ?? "overview"} hrefForPage={hrefForPage} onNavigate={id => router.push(hrefForPage(id), { scroll: false })}>
      {children}
    </DashboardTemplate>
  );
}

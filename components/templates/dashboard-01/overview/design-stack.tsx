"use client";

import { Layers, Users, UserRound } from "lucide-react";
import { useEffect, useRef } from "react";
import { DesignStackTable, stackColumns, stackRows } from "@/components/design-stack-table";
import { Toaster } from "@/components/ui/sonner";
import type { KalosTableColumn } from "@/components/ui/kalos-table-model";
import { DashboardToolIcon } from "./design-stack-icons";

const columnWidths: Record<string, number> = { tool: 112, category: 128, website: 104, renews: 110 };
const columns: KalosTableColumn[] = [
  ...stackColumns.map(column => ({ ...column, width: columnWidths[column.key] })),
  { key: "plan", label: "Plan", type: "tag", icon: <Layers />, width: 128, options: ["Free", "Team", "Pro", "Standard"] },
  { key: "seats", label: "Seats", type: "number", icon: <Users />, width: 96 },
  { key: "owner", label: "Owner", icon: <UserRound />, width: 112 },
];

const subscriptions: Record<string, { plan: string; seats: number; owner: string }> = {
  figma: { plan: "Team", seats: 12, owner: "Alex Kim" },
  framer: { plan: "Free", seats: 1, owner: "Mina Lee" },
  linear: { plan: "Pro", seats: 24, owner: "Sam Li" },
  loom: { plan: "Team", seats: 8, owner: "Jo Park" },
  vercel: { plan: "Team", seats: 6, owner: "Kai Chen" },
};

const additionalTools = [
  { tool: "Adobe", category: "Design", website: "adobe.com", renews: "Sep 8, 2026", plan: "Team", seats: 9, owner: "Mina Lee" },
  { tool: "Canva", category: "Design", website: "canva.com", renews: "Oct 3, 2026", plan: "Pro", seats: 1, owner: "Jo Park" },
  { tool: "Cloudflare", category: "Hosting", website: "cloudflare.com", renews: "Nov 16, 2026", plan: "Pro", seats: 3, owner: "Kai Chen" },
  { tool: "GitHub", category: "Issue tracking", website: "github.com", renews: "Dec 1, 2026", plan: "Team", seats: 24, owner: "Sam Li" },
  { tool: "Jira", category: "Issue tracking", website: "atlassian.com/software/jira", renews: "Sep 22, 2026", plan: "Standard", seats: 18, owner: "Alex Kim" },
  { tool: "Vimeo", category: "Video", website: "vimeo.com", renews: "Oct 14, 2026", plan: "Standard", seats: 3, owner: "Jo Park" },
  { tool: "Webflow", category: "Website", website: "webflow.com", renews: "Dec 12, 2026", plan: "Team", seats: 6, owner: "Mina Lee" },
] as const;

const rows = [
  ...stackRows.map(row => ({ ...row, ...subscriptions[row.id] })),
  ...additionalTools.map(row => ({
    ...row,
    id: row.tool.toLowerCase(),
    icon: <DashboardToolIcon name={row.tool} />,
  })),
];

export default function DashboardDesignStack() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const viewport = section?.querySelector<HTMLElement>('[data-slot="kalos-table-scroll"]');
    if (!section || !viewport) return;

    const direction = getComputedStyle(viewport).direction === "rtl" ? -1 : 1;
    const updateEdges = () => {
      const limit = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
      const offset = Math.max(0, Math.min(limit, direction * viewport.scrollLeft));
      section.toggleAttribute("data-overflow-start", offset > 1);
      section.toggleAttribute("data-overflow-end", limit - offset > 1);
    };
    const observer = new ResizeObserver(() => {
      section.style.setProperty("--stack-scrollbar-width", `${viewport.offsetWidth - viewport.clientWidth}px`);
      updateEdges();
    });
    observer.observe(viewport);
    viewport.addEventListener("scroll", updateEdges, { passive: true });
    updateEdges();
    return () => {
      observer.disconnect();
      viewport.removeEventListener("scroll", updateEdges);
    };
  }, []);

  return (
    <section ref={sectionRef} id="dashboard-tools" aria-label="工具清单" tabIndex={-1} className="h-[431px] min-w-0">
      <DesignStackTable
        columns={columns}
        initialRows={rows}
        className="grid h-full max-w-none grid-rows-[auto_minmax(0,1fr)_auto] rounded-xl border border-border shadow-none [&>[role=grid]]:grid [&>[role=grid]]:grid-rows-[auto_minmax(0,1fr)]"
      />
      <Toaster position="bottom-right" />
    </section>
  );
}

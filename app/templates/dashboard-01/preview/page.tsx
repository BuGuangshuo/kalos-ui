import { redirect } from "next/navigation";
import { dashboardTemplate } from "@/lib/templates";

export default function DashboardIndexPage() {
  redirect(`${dashboardTemplate.previewHref}/overview`);
}

import type { Metadata } from "next";
import { CatalogGrid } from "@/components/catalog-grid";
export const metadata: Metadata = { title: "组件库" };
export default function ComponentsPage() {
  return <CatalogGrid />;
}

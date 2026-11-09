import type { Metadata } from "next";
import { CatalogGrid } from "@/components/catalog-grid";
export const metadata: Metadata = { title: "Components" };
export default function ComponentsPage() {
  return (
    <div className="page-width">
      <div className="catalog-heading">
        <span className="section-eyebrow">
          <span className="status-dot" />
          THE COLLECTION
        </span>
        <h1>Little pieces. Big possibilities.</h1>
        <p>
          A growing collection of thoughtful components. Try them, take them
          apart, and make something that feels like you.
        </p>
      </div>
      <CatalogGrid />
    </div>
  );
}

"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Search, Layers } from "lucide-react";
import { catalog } from "@/lib/catalog";
import { ComponentDemo } from "@/components/demos";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
export function CatalogGrid() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const items = catalog.filter(
    (item) =>
      (category === "All" || item.category === category) &&
      `${item.title} ${item.description} ${item.category}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <div className="catalog-body">
      <div className="catalog-toolbar">
        <ToggleGroup
          type="single"
          variant="outline"
          value={category}
          onValueChange={(value) => {
            if (value) setCategory(value);
          }}
          className="filter-group"
          aria-label="Filter by category"
        >
          {[
            "All",
            "Actions",
            "Inputs",
            "Display",
            "Navigation",
            "Feedback",
          ].map((cat) => (
            <ToggleGroupItem value={cat} key={cat}>
              {cat}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <div className="catalog-search">
          <Search />
          <Input
            aria-label="Search components"
            placeholder="Find your next component…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>
      <div className="catalog-count">
        {items.length} thoughtfully crafted component
        {items.length === 1 ? "" : "s"}
      </div>
      {items.length ? (
        <div className="component-grid">
          {items.map((item) => (
            <article className="component-card" key={item.slug}>
              <div className="component-preview">
                <ComponentDemo slug={item.slug} compact />
              </div>
              <Link
                href={`/components/${item.slug}`}
                className="component-card-label"
              >
                <h3>{item.title}</h3>
                <span className="component-category">{item.category}</span>
                <ArrowUpRight />
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Layers />
            </EmptyMedia>
            <EmptyTitle>A little too specific?</EmptyTitle>
            <EmptyDescription>
              No components found. Try a different search or category.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </div>
  );
}

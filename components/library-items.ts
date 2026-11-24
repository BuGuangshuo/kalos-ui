import { blocks } from "@/lib/blocks";
import { catalog, categories } from "@/lib/catalog";

export const libraryCategories = [...categories, "Block"] as const;
export const libraryItems = [
  ...catalog,
  ...blocks.map(({ slug, english, title, description }) => ({ slug, english, title, description, category: "Block" as const })),
];

export function filterLibraryItems(query: string) {
  const term = query.trim().toLowerCase();
  return libraryItems.filter(({ title, english, description, category, slug }) =>
    `${title} ${english} ${description} ${category} ${slug}`.toLowerCase().includes(term),
  );
}

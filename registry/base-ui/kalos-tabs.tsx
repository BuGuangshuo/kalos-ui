"use client";
import { controlStyles } from "@/components/ui/kalos-styles";
import { slidingHighlightClasses, useSlidingHighlight } from "@/components/ui/kalos-highlight";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/kalos-base-tabs";
export function KalosTabs({
  items,
  defaultValue,
}: {
  items: { value: string; label: string; content: ReactNode }[];
  defaultValue?: string;
}) {
  const highlight = useSlidingHighlight('[role="tab"]', '[role="tab"][aria-selected="true"]');
  return (
    <Tabs defaultValue={defaultValue || items[0]?.value}>
      <TabsList ref={highlight} className={cn(slidingHighlightClasses, controlStyles.tabsList)}>
        {items.map((item) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            className={controlStyles.tabsTrigger}
          >
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {items.map((item) => (
        <TabsContent
          key={item.value}
          value={item.value}
          className="rounded-[7px]"
        >
          {item.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}

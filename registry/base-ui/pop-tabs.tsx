"use client";
import type { ReactNode } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/pop-base-tabs";
export function PopTabs({
  items,
  defaultValue,
}: {
  items: { value: string; label: string; content: ReactNode }[];
  defaultValue?: string;
}) {
  return (
    <Tabs defaultValue={defaultValue || items[0]?.value}>
      <TabsList className="rounded-full">
        {items.map((item) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            className="rounded-full focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-transparent"
          >
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {items.map((item) => (
        <TabsContent
          key={item.value}
          value={item.value}
          className="rounded-full"
        >
          {item.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}

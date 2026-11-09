"use client";
import type { ReactNode } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/pop-base-accordion";
export function PopAccordion({
  items,
}: {
  items: { question: string; answer: ReactNode }[];
}) {
  return (
    <Accordion multiple={false}>
      {items.map((item, index) => (
        <AccordionItem key={index} value={String(index)}>
          <AccordionTrigger className="py-3 text-sm focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-transparent focus-visible:after:border-transparent">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-sm">{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

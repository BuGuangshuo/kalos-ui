"use client";
import { controlStyles } from "@/components/ui/kalos-styles";
import type { ReactNode } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/kalos-aria-accordion";
export function KalosAccordion({
  items,
}: {
  items: { question: string; answer: ReactNode }[];
}) {
  return (
    <Accordion className={controlStyles.font} allowsMultipleExpanded={false}>
      {items.map((item, index) => (
        <AccordionItem key={index} id={String(index)}>
          <AccordionTrigger className="py-3 text-sm focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-transparent focus-visible:after:border-transparent">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-sm">{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

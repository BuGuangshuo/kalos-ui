"use client";

import { motion } from "motion/react";
import { POP_LOGO_VIEWBOX, POP_MARK_BODY, POP_WORDMARK } from "@/lib/brand";
import { BrandMark } from "@/components/brand";
import { easeOut } from "./runtime";

export function PopLogo({
  draw = false,
  className,
}: {
  draw?: boolean;
  className?: string;
}) {
  return (
    <svg viewBox={POP_LOGO_VIEWBOX} aria-hidden="true" className={className}>
      {[POP_MARK_BODY, POP_WORDMARK].map((d, index) => (
        <motion.path
          key={index}
          d={d}
          fillRule={index === 0 ? "evenodd" : "nonzero"}
          stroke="currentColor"
          strokeWidth={1}
          fill="currentColor"
          initial={draw ? { pathLength: 0, fillOpacity: 0 } : false}
          animate={{ pathLength: 1, fillOpacity: 1 }}
          transition={{
            pathLength: {
              duration: 1.3 - index * 0.2,
              delay: index * 0.2,
              ease: "easeInOut",
            },
            fillOpacity: { duration: 0.45, delay: 1.15, ease: easeOut },
          }}
        />
      ))}
    </svg>
  );
}

export const PopMark = BrandMark;

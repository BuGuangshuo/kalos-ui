"use client";

import { motion } from "motion/react";
import { KALOS_WORDMARK_VIEWBOX, KALOS_WORDMARK } from "@/lib/brand";
import {
  BRAND_ICON_BODY,
  BRAND_ICON_VIEWBOX,
} from "@/lib/brand-icon";
import { BrandMark } from "@/components/brand";
import { cn } from "@/lib/utils";
import { easeOut } from "./runtime";

const drawTransition = { duration: 1.3, ease: "easeInOut" } as const;
const outlineState = { pathLength: 0, fillOpacity: 0, strokeOpacity: 1 };
const solidState = { pathLength: 1, fillOpacity: 1, strokeOpacity: 0 };
const logoTransition = {
  pathLength: drawTransition,
  fillOpacity: { duration: 0.35, delay: 1.3, ease: easeOut },
  strokeOpacity: { duration: 0.35, delay: 1.3, ease: easeOut },
};

export function KalosLogo({
  draw = false,
  className,
}: {
  draw?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("brand-lockup", className)} aria-hidden="true">
      {draw ? (
        <svg
          viewBox={BRAND_ICON_VIEWBOX}
          className="brand-symbol"
          data-brand-icon="disc-3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <motion.path
            d={BRAND_ICON_BODY}
            fill="currentColor"
            fillRule="evenodd"
            stroke="currentColor"
            strokeWidth={24 / 64}
            initial={outlineState}
            animate={solidState}
            transition={logoTransition}
          />
        </svg>
      ) : (
        <BrandMark />
      )}
      <svg viewBox={KALOS_WORDMARK_VIEWBOX} className="brand-wordmark">
        <motion.path
          d={KALOS_WORDMARK}
          stroke="currentColor"
          strokeWidth={1}
          fill="currentColor"
          initial={draw ? outlineState : false}
          animate={solidState}
          transition={logoTransition}
        />
      </svg>
    </div>
  );
}

export const KalosMark = BrandMark;

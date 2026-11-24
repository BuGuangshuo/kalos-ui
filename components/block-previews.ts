"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { BlockSlug } from "@/lib/blocks";

export const blockPreviews: Record<BlockSlug, ComponentType> = {
  "pricing-plans": dynamic(() => import("@/registry/kalos/blocks/pricing-plans").then(m => m.KalosPricingPlansPreview)),
  "logo-marquee": dynamic(() => import("@/registry/kalos/blocks/logo-marquee").then(m => m.KalosLogoMarqueePreview)),
  "invoice-credit": dynamic(() => import("@/registry/kalos/blocks/invoice-credit").then(m => m.KalosInvoiceCreditPreview)),
  "testimonial-wall": dynamic(() => import("@/registry/kalos/blocks/testimonial-wall").then(m => m.KalosTestimonialWallPreview)),
  "task-board": dynamic(() => import("@/registry/kalos/blocks/task-board").then(m => m.KalosTaskBoardPreview)),
};

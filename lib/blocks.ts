import { blockDoc as pricingPlans } from "../registry/kalos/blocks/pricing-plans/doc.ts";
import { blockDoc as logoMarquee } from "../registry/kalos/blocks/logo-marquee/doc.ts";
import { blockDoc as invoiceCredit } from "../registry/kalos/blocks/invoice-credit/doc.ts";
import { blockDoc as testimonialWall } from "../registry/kalos/blocks/testimonial-wall/doc.ts";
import { blockDoc as taskBoard } from "../registry/kalos/blocks/task-board/doc.ts";

export const blocks = [pricingPlans, logoMarquee, invoiceCredit, testimonialWall, taskBoard] as const;
export type BlockDoc = (typeof blocks)[number];
export type BlockSlug = BlockDoc["slug"];

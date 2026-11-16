import type { KalosBadgeVariant } from "@/registry/kalos/kalos-badge";

export function badgeExample(variant: KalosBadgeVariant = "soft") {
  const appearance = variant === "soft" ? "" : ` variant="${variant}"`;
  return `"use client";

import { Clock, Pause } from "lucide-react";
import { KalosBadge } from "@/components/ui/kalos-badge";

export default function Example() {
  return <div className="flex flex-wrap items-center gap-2">
    <KalosBadge${appearance} tone="info" live>进行中</KalosBadge>
    <KalosBadge${appearance} tone="warning" dot>待处理</KalosBadge>
    <KalosBadge${appearance} tone="success">已完成</KalosBadge>
    <KalosBadge${appearance} tone="danger">失败</KalosBadge>
    <KalosBadge${appearance} icon={<Clock />}>已计划</KalosBadge>
    <KalosBadge${appearance} icon={<Pause />}>已暂停</KalosBadge>
    <KalosBadge${appearance} tone="purple">内测</KalosBadge>
    <KalosBadge${appearance} tone="pink">草稿</KalosBadge>
    <KalosBadge${appearance} count={7} aria-label="共 7 项任务" />
    <KalosBadge${appearance} tone="warning" count={128} max={99} aria-label="128 项待处理" />
  </div>;
}`;
}

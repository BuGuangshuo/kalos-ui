"use client";

import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import type { DemoComponents } from "@/components/demo-content";

export function CardDemo({ KalosCard, KalosButton }: Pick<DemoComponents, "KalosCard" | "KalosButton">) {
  return <div className="demo-card">
    <KalosCard
      as="section"
      aria-label="文档资料"
      title="文档资料"
      description="最近 30 天"
      icon={<span className="card-demo-icon" aria-hidden="true"><span className="card-demo-activity">
        {Array.from({ length: 9 }, (_, index) => <i key={index} data-on={index !== 1 && index !== 7 || undefined} style={{ animationDelay: `${(Math.floor(index / 3) + index % 3) * 120}ms` }} />)}
      </span></span>}
      action={<KalosButton variant="ghost" size="icon" aria-label="查看文档信息" onClick={() => toast("142 份文档，已使用 4.2 GB 存储空间")}><MoreHorizontal /></KalosButton>}
      footer={<>
        <span>2 分钟前同步</span>
        <span className="card-demo-open"><KalosButton onClick={() => toast("已打开文档资料")}>打开</KalosButton></span>
      </>}
    >
      <dl className="card-demo-stats">
        <div><dt>文档</dt><dd>142</dd></div>
        <div><dt>已同步</dt><dd>96%</dd></div>
        <div><dt>存储</dt><dd>4.2 GB</dd></div>
      </dl>
    </KalosCard>
  </div>;
}

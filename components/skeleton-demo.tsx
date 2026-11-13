"use client";

import { useState } from "react";
import { KalosCard } from "@/registry/kalos/kalos-card";
import { KalosSegmentedControl } from "@/registry/kalos/kalos-segmented-control";
import { KalosSkeleton, KalosLoading } from "@/registry/kalos/kalos-skeleton";
import { controlStyles } from "@/components/ui/kalos-styles";
import { cn } from "@/lib/utils";

const records = [
  { title: "整理客户反馈", detail: "客服记录 · 14 条反馈", time: "2 分钟", tone: "blue", pattern: [0, 1, 2, 4, 6, 8], width: 212, metaWidth: 136 },
  { title: "核对联系人资料", detail: "通讯录 · 23 位联系人", time: "8 分钟", tone: "purple", pattern: [3, 5, 6, 7, 8], width: 164, metaWidth: 124 },
  { title: "检查设计规范", detail: "文档 · 6 个文件", time: "21 分钟", tone: "teal", pattern: [1, 3, 4, 5, 6, 8], width: 176, metaWidth: 104 },
  { title: "起草每周摘要", detail: "文档 · 1 份草稿", time: "1 小时", tone: "orange", pattern: [1, 3, 5, 6, 7, 8], width: 196, metaWidth: 112 },
  { title: "同步通讯录", detail: "联系人 · 312 条记录", time: "3 小时", tone: "green", pattern: [0, 1, 2, 4, 6, 8], width: 128, metaWidth: 128 },
];

export function SkeletonDemo() {
  const [mode, setMode] = useState("loading");
  const loading = mode === "loading";
  return <KalosCard
    as="section"
    title="最近记录"
    aria-label="最近记录"
    className={cn(controlStyles.loadingDemo, "loading-demo-card skeleton-demo")}
    action={<KalosSegmentedControl aria-label="预览状态" size="sm" variant="tray" value={mode} onChange={setMode} options={[{ value: "data", label: "Data" }, { value: "loading", label: "Loading" }]} />}
  >
    {loading ? <KalosLoading label="正在加载最近记录" className="loading-demo-list">
      {records.map(record => <div key={record.title} className="skeleton-demo-row">
        <KalosSkeleton width={16} height={16} radius={4} />
        <div className="skeleton-demo-text">
          <KalosSkeleton line={20} width={record.width} height={10} />
          <KalosSkeleton line={16} width={record.metaWidth} height={8} />
        </div>
        <KalosSkeleton width={20} height={8} className="skeleton-demo-time" />
      </div>)}
    </KalosLoading> : <ul className="loading-demo-list">
      {records.map(record => <li key={record.title} className="skeleton-demo-row">
        <svg className="skeleton-demo-mark" data-tone={record.tone} width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          {record.pattern.map(cell => <rect key={cell} x={1.5 + (cell % 3) * 4.5} y={1.5 + Math.floor(cell / 3) * 4.5} width="3" height="3" rx="0.5" fill="currentColor" />)}
        </svg>
        <div className="skeleton-demo-text"><span className="skeleton-demo-name">{record.title}</span><span className="skeleton-demo-meta">{record.detail}</span></div>
        <span className="skeleton-demo-time">{record.time}</span>
      </li>)}
    </ul>}
  </KalosCard>;
}

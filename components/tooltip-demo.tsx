"use client";

import { useEffect, useState } from "react";
import { Check, Copy, ListFilter, MoreHorizontal, Pin, RotateCcw, Search, Share2, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KalosTooltip } from "@/registry/kalos/kalos-tooltip";
import { controlStyles } from "@/components/ui/kalos-styles";
import { toast } from "sonner";

const task = "汇总上周的客户反馈，为客服团队起草回复并标记需要跟进的问题";
const reply = "已整理 14 条客户反馈，其中 3 条提到了导出超时。回复草稿已生成，相关问题已加入待办。";

export function TooltipDemo({ compact = false }: { compact?: boolean }) {
  const [pinned, setPinned] = useState(false);
  const [liked, setLiked] = useState(true);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(timer);
  }, [copied]);

  return <div className={`${controlStyles.formCard} tooltip-demo-card`} role="group" aria-label="客户反馈摘要">
    <div className="tooltip-demo-header">
      <KalosTooltip content={task} side="bottom" align="start"><button type="button" className="tooltip-demo-title">{task}</button></KalosTooltip>
      <div className="tooltip-demo-tools" role="group" aria-label="任务操作">
        <KalosTooltip content="搜索记录" shortcut="⌘K" side="bottom" defaultOpen={!compact}><Button variant="outline" size="icon" aria-label="搜索记录" onClick={() => toast("已打开搜索")}><Search /></Button></KalosTooltip>
        <KalosTooltip content="筛选" shortcut="F" side="bottom"><Button variant="outline" size="icon" aria-label="筛选" onClick={() => toast("已打开筛选")}><ListFilter /></Button></KalosTooltip>
        <KalosTooltip content="固定记录" shortcut="P" side="bottom"><Button variant="outline" size="icon" aria-label="固定记录" aria-pressed={pinned} onClick={() => setPinned(value => !value)}><Pin /></Button></KalosTooltip>
        <KalosTooltip content="分享" shortcut="⇧⌘S" side="bottom"><Button variant="outline" size="icon" aria-label="分享" onClick={() => toast("已打开分享")}><Share2 /></Button></KalosTooltip>
      </div>
    </div>
    <div className="tooltip-demo-reply">
      <p>{reply}</p>
      <div className="tooltip-demo-actions" role="group" aria-label="回复操作">
        <KalosTooltip content="复制回复" shortcut="⌘C"><Button variant="ghost" size="icon" aria-label="复制回复" onClick={async () => {
          try { await navigator.clipboard.writeText(reply); setCopied(true); toast.success("回复已复制"); }
          catch { toast.error("复制失败，请重试"); }
        }}>{copied ? <Check /> : <Copy />}</Button></KalosTooltip>
        <KalosTooltip content="好回答，后续同类反馈可参考这条回复"><Button variant="ghost" size="icon" aria-label="好回答" aria-pressed={liked} onClick={() => setLiked(value => !value)}><ThumbsUp /></Button></KalosTooltip>
        <KalosTooltip content="重新生成" shortcut="⌘R"><Button variant="ghost" size="icon" aria-label="重新生成" onClick={() => toast.success("回复已重新生成")}><RotateCcw /></Button></KalosTooltip>
        <KalosTooltip content="更多操作"><Button variant="ghost" size="icon" aria-label="更多操作" onClick={() => toast("已打开更多操作")}><MoreHorizontal /></Button></KalosTooltip>
      </div>
    </div>
  </div>;
}

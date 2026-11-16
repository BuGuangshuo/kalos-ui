import { Clock, Pause } from "lucide-react";
import type { ComponentType } from "react";
import { KalosCard } from "@/registry/kalos/kalos-card";
import type { KalosBadgeProps } from "@/registry/kalos/kalos-badge";

export function BadgeDemo({ KalosBadge }: { KalosBadge: ComponentType<KalosBadgeProps> }) {
  return <KalosCard
    as="section"
    aria-label="任务状态"
    className="badge-demo-card"
    title={<span className="badge-demo-heading">任务 <KalosBadge count={7} aria-label="共 7 项任务" /></span>}
    action={<span className="badge-demo-heading">待处理 <KalosBadge tone="warning" count={128} aria-label="128 项待处理" /></span>}
    footer={<span className="badge-demo-heading">文档助手 <KalosBadge tone="purple" size="md">内测</KalosBadge></span>}
  >
    <ul className="badge-demo-list">
      <li><span className="badge-demo-text"><span>同步通讯录</span><span>2 分钟前开始</span></span><KalosBadge tone="info" live>进行中</KalosBadge></li>
      <li><span className="badge-demo-text"><span>整理反馈回复</span><span>14 条反馈待确认</span></span><KalosBadge tone="warning" dot>待处理</KalosBadge></li>
      <li><span className="badge-demo-text"><span>生成每周摘要</span><span>用时 3 分 12 秒</span></span><KalosBadge tone="success">已完成</KalosBadge></li>
      <li><span className="badge-demo-text"><span>上传附件</span><span>网络连接中断</span></span><KalosBadge tone="danger">失败</KalosBadge></li>
      <li><span className="badge-demo-text"><span>更新文档索引</span><span>明天 06:00 开始</span></span><KalosBadge icon={<Clock />}>已计划</KalosBadge></li>
      <li><span className="badge-demo-text"><span>清理过期文件</span><span>由陈晓暂停</span></span><KalosBadge icon={<Pause />}>已暂停</KalosBadge></li>
      <li><span className="badge-demo-text"><span>起草使用指南</span><span>尚未发布</span></span><KalosBadge tone="pink">草稿</KalosBadge></li>
    </ul>
  </KalosCard>;
}

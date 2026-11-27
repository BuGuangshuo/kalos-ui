import { EmptyStateDemoIcon } from "@/components/empty-state-demo-icons";
import { KalosButton } from "@/registry/kalos/kalos-button";
import { KalosEmptyState } from "@/registry/kalos/kalos-empty-state";
import "./empty-state-demo.css";

export function EmptyStateDemo() {
  return (
    <div className="empty-state-demo">
      <div role="region" aria-label="运行计划">
        <h3 className="empty-state-demo__heading">运行计划 <span>0</span></h3>
        <KalosEmptyState
          icon={<EmptyStateDemoIcon name="calendar" />}
          title="暂无运行计划"
          text="智能体定期执行的任务会显示在这里，并列出每个计划的下次运行时间。"
          action={
            <KalosButton type="button" className="empty-state-demo__action" size="xs" variant="secondary">
              <span className="empty-state-demo__plus"><EmptyStateDemoIcon name="plus" /></span>
              <span className="empty-state-demo__action-label">新建计划</span>
            </KalosButton>
          }
        />
      </div>
      <aside className="empty-state-demo__panel" aria-label="运行详情">
        <div className="empty-state-demo__panel-head">运行详情</div>
        <div className="empty-state-demo__panel-body">
          <KalosEmptyState bare tall icon={<EmptyStateDemoIcon name="activity" />}
            title="尚未选择运行记录" text="选择一条运行记录，查看执行步骤、Token 用量和费用。" />
        </div>
      </aside>
    </div>
  );
}

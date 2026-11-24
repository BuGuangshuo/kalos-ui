export const blockDoc = {
  slug: "task-board", english: "Task Board", title: "任务看板",
  description: "按状态组织任务，拖动卡片调整顺序或移动到其他列。可搜索标题与编号、按标签筛选，打开详情面板修改任务。",
  usage: `"use client";

import { useState } from "react";
import { KalosTaskBoard, type Task } from "@/components/blocks/task-board";

const tasks: Task[] = [
  { key: "DOC-1", title: "校对快速开始文档", status: "todo", priority: 2, labels: ["docs"] },
];

export default function Board() {
  const [items, setItems] = useState(tasks);
  return (
    <KalosTaskBoard
      tasks={items}
      statuses={[{ id: "todo", label: "待处理" }, { id: "done", label: "已完成" }]}
      labels={[{ id: "docs", label: "文档", color: "#4fb0fe" }]}
      people={[{ id: "lin", name: "林悦" }]}
      path={["文档", "本周任务"]}
      onChange={setItems}
    />
  );
}`,
  props: [
    ["tasks", "Task[]", "示例任务", "任务按 key 唯一区分，title 和 status 为必填。可提供 priority（0 至 4）、estimate、labels、assignee、dueIn、subtasks、pullRequest、created。"],
    ["statuses", "TaskStatus[]", "四列状态", "列按传入顺序显示。id 与任务的 status 对应，label 为列名，icon 可替换状态图标。"],
    ["labels", "TaskLabel[]", "示例标签", "每个标签包含 id、label 和 color，用于卡片、筛选菜单及任务详情。"],
    ["people", "TaskPerson[]", "示例成员", "每位成员提供 id、name 和可选的 avatar 图片地址。"],
    ["path", "string[]", "示例路径", "看板顶部的面包屑路径。"],
    ["onChange", "(tasks: Task[]) => void", "—", "新增、删除、移动或编辑任务时返回更新后的完整任务列表。"],
    ["appearance", '"clean" | "classic"', '"clean"', "选择紧凑工具栏或带独立面包屑和属性标签的经典样式。"],
  ],
  keyboard: [
    ["Tab / Shift + Tab", "在工具栏、卡片和新增按钮间移动，打开详情后焦点留在面板内。"],
    ["Enter / Space", "打开卡片详情或操作当前按钮。"],
    ["↑ / ↓、Home / End", "在筛选菜单内切换标签或跳到首尾。"],
    ["← / →", "在详情面板切换状态或优先级，可直接跨列移动任务。"],
    ["Enter", "在新增输入框内提交并聚焦新卡片。"],
    ["Escape", "关闭详情或筛选菜单，或取消当前新增。"],
  ],
} as const;

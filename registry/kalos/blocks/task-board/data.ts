import type { ReactNode } from "react";

export type TaskPriority = 0 | 1 | 2 | 3 | 4;
export type TaskStatus = { id: string; label: string; icon?: ReactNode };
export type TaskLabel = { id: string; label: string; color: string };
export type TaskPerson = { id: string; name: string; avatar?: string };
export type Task = {
  key: string;
  title: string;
  status: string;
  priority?: TaskPriority;
  estimate?: string;
  labels?: string[];
  assignee?: string | null;
  dueIn?: number | string;
  subtasks?: string | [number, number];
  pullRequest?: number | string;
  created?: string;
};

export const initialStatuses: TaskStatus[] = [
  { id: "todo", label: "Todo" },
  { id: "review", label: "In review" },
  { id: "progress", label: "In progress" },
  { id: "done", label: "Done" },
];

export const initialLabels: TaskLabel[] = [
  { id: "website", label: "Website", color: "#4fb0fe" },
  { id: "billing", label: "Billing", color: "#a651f0" },
  { id: "mobile", label: "Mobile", color: "#13b3a0" },
  { id: "bug", label: "Bug", color: "#ee3e9e" },
  { id: "feature", label: "Feature", color: "#a9d9ff" },
];

export const initialPath = ["Northwind", "Launch", "Sprint 12"];

export const initialTasks: Task[] = [
  { key: "NW-214", title: "Add the launch banner to the marketing site", status: "todo", priority: 2, estimate: "M", labels: ["website", "feature"], assignee: "mara", created: "Oct 2" },
  { key: "NW-209", title: "Fix currency rounding on annual invoices", status: "todo", priority: 3, labels: ["billing", "bug"], assignee: "theo", dueIn: 2, created: "Sep 28" },
  { key: "NW-197", title: "Follow up on pricing feedback from beta users", status: "todo", priority: 1, assignee: "sofia", subtasks: [2, 4], created: "Sep 24" },
  { key: "NW-221", title: "Review the welcome copy for the new plans", status: "review", priority: 2, labels: ["website"], assignee: "lena", dueIn: 1, created: "Oct 2" },
  { key: "NW-205", title: "List usage limits in the plan comparison table", status: "review", priority: 3, labels: ["website", "feature"], assignee: "jonas", estimate: "L", created: "Sep 27" },
  { key: "NW-188", title: "Enable push notifications on iOS", status: "review", priority: 2, labels: ["mobile"], assignee: "mara", pullRequest: 412, created: "Sep 21" },
  { key: "NW-230", title: "Write the help center export guide", status: "progress", priority: 2, labels: ["website"], assignee: "jonas", created: "Sep 30" },
  { key: "NW-201", title: "Prorate seats added during a billing cycle", status: "progress", priority: 3, labels: ["billing"], assignee: "theo", dueIn: 4, created: "Sep 23" },
  { key: "NW-176", title: "Browse the task list offline", status: "progress", priority: 2, labels: ["mobile", "feature"], assignee: "mara", pullRequest: 398, estimate: "XL", created: "Sep 16" },
  { key: "NW-160", title: "Add dark mode to the dashboard", status: "done", priority: 2, labels: ["website", "feature"], assignee: "lena", created: "Sep 12" },
  { key: "NW-171", title: "Fix a crash when uploading large avatars", status: "done", priority: 3, labels: ["mobile", "bug"], assignee: "jonas", created: "Sep 15" },
];

export const initialPeople: TaskPerson[] = [
  { id: "mara", name: "Mara Lindqvist", avatar: "https://www.affectui.com/avatars/mara.jpg" },
  { id: "jonas", name: "Jonas Weber", avatar: "https://www.affectui.com/avatars/jonas.jpg" },
  { id: "lena", name: "Lena Hart", avatar: "https://www.affectui.com/avatars/lena.jpg" },
  { id: "theo", name: "Theo Brandt", avatar: "https://www.affectui.com/avatars/theo.jpg" },
  { id: "sofia", name: "Sofia Marin", avatar: "https://www.affectui.com/avatars/sofia.jpg" },
];

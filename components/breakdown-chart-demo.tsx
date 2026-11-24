import type { ReactNode } from "react";
import { sprintPriorities, sprintRecords, sprintStatuses } from "@/components/breakdown-chart-demo-data";
import { KalosBreakdownChart, type Dimension, type Measure } from "@/registry/kalos/kalos-breakdown-chart";

function statusIcon(stroke: string, shape: ReactNode) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={stroke}
      strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {shape}
    </svg>
  );
}

const dimensions: Dimension[] = [
  {
    key: "status",
    label: "Status",
    values: sprintStatuses,
    icons: {
      Backlog: statusIcon("#bdbdbd", <path d="M2.5 9.5 4 3.5h8l1.5 6m-11 0v3h11v-3m-11 0H6l.8 1.5h2.4l.8-1.5h3.5" />),
      Todo: statusIcon("#8c8c8c", <rect x="3" y="3" width="10" height="10" rx="2.5" />),
      "In progress": statusIcon("#4fb0fe", <><circle cx="8" cy="8" r="5.5" /><path d="M8 5v3l2 1.5" /></>),
      "In review": statusIcon("#a651f0", <><path d="M1.8 8C1.8 8 4 3.8 8 3.8S14.2 8 14.2 8 12 12.2 8 12.2 1.8 8 1.8 8Z" /><circle cx="8" cy="8" r="1.8" /></>),
      Done: statusIcon("#0190fe", <><rect x="2.5" y="2.5" width="11" height="11" rx="3" fill="#0190fe" stroke="none" /><path d="m5.5 8.2 1.8 1.8 3.3-3.6" stroke="white" strokeWidth="1.3" /></>),
      Canceled: statusIcon("#d4d4d4", <><circle cx="8" cy="8" r="5.5" /><path d="m4.2 11.8 7.6-7.6" /></>),
    },
  },
  {
    key: "priority",
    label: "Priority",
    values: sprintPriorities,
  },
  {
    key: "team",
    label: "Team",
    values: ["Design", "Web", "Mobile", "Platform"],
  },
  {
    key: "type",
    label: "Type",
    values: ["Feature", "Bug", "Chore"],
  },
];

const measures: Measure[] = [
  { key: "count", label: "Task count", unit: "tasks" },
  { key: "points", label: "Story points", unit: "points", field: "points" },
];

export function BreakdownChartDemo() {
  return (
    <KalosBreakdownChart
      title="Sprint 24"
      records={sprintRecords}
      dimensions={dimensions}
      measures={measures}
      defaultMeasure="count"
      defaultSlice="status"
      defaultSegment="priority"
    />
  );
}

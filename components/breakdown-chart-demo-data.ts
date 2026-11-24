import type { BreakdownRecord } from "@/registry/kalos/kalos-breakdown-chart";

export const sprintPriorities = ["Urgent", "High", "Medium", "Low", "None"] as const;

// Counts follow the same priority order as the chart legend.
const countsByStatus = {
  Backlog: [5, 8, 7, 7, 5],
  Todo: [7, 8, 10, 7, 6],
  "In progress": [8, 11, 9, 7, 7],
  "In review": [7, 7, 8, 6, 6],
  Done: [7, 6, 8, 8, 7],
  Canceled: [5, 6, 6, 7, 6],
} satisfies Record<string, [number, number, number, number, number]>;

export const sprintStatuses = Object.keys(countsByStatus);

// Rotate through this mix across groups so every slice has work from several teams and types.
const taskMix: [team: string, type: string, points: number][] = [
  ["Web", "Feature", 5],
  ["Mobile", "Bug", 5],
  ["Design", "Chore", 2],
  ["Platform", "Feature", 5],
  ["Web", "Bug", 3],
  ["Design", "Feature", 3],
  ["Mobile", "Chore", 2],
  ["Platform", "Bug", 3],
  ["Mobile", "Feature", 2],
  ["Web", "Chore", 2],
  ["Design", "Bug", 3],
  ["Platform", "Chore", 3],
  ["Web", "Feature", 3],
  ["Mobile", "Bug", 2],
  ["Design", "Chore", 3],
  ["Web", "Chore", 3],
];

export const sprintRecords: BreakdownRecord[] = [];
for (const [status, counts] of Object.entries(countsByStatus)) {
  for (const [index, priority] of sprintPriorities.entries()) {
    for (let task = 0; task < counts[index]; task++) {
      const [team, type, points] = taskMix[sprintRecords.length % taskMix.length];
      sprintRecords.push({ status, priority, team, type, points });
    }
  }
}

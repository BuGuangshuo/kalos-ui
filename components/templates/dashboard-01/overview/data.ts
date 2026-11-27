export const metrics = [
  { key: "visits", label: "访问次数", unit: "次" },
  { key: "visitors", label: "访客数", unit: "人" },
  { key: "newVisitors", label: "新访客数", unit: "人" },
  { key: "registrations", label: "注册人数", unit: "人" },
] as const;

export type Metric = (typeof metrics)[number]["key"];
export type ReportMonth = "2026-08" | "2026-07";
type TrafficCounts = Record<Metric, number>;

export type TrafficChannel = TrafficCounts & {
  id: string;
  name: string;
};

// Example monthly cohorts, attributed to each visitor's first acquisition channel.
// All sessions, new visitors, and first registrations use that same channel.
const august: TrafficChannel[] = [
  {
    id: "organic",
    name: "自然搜索",
    visits: 41720,
    visitors: 26940,
    newVisitors: 16280,
    registrations: 7162,
  },
  {
    id: "direct",
    name: "直接访问",
    visits: 22480,
    visitors: 18420,
    newVisitors: 8640,
    registrations: 6054,
  },
  {
    id: "social",
    name: "社交媒体",
    visits: 26760,
    visitors: 12630,
    newVisitors: 8060,
    registrations: 2486,
  },
  {
    id: "referral",
    name: "引荐网站",
    visits: 16180,
    visitors: 8940,
    newVisitors: 5340,
    registrations: 3098,
  },
  { id: "paid", name: "付费广告", visits: 11890, visitors: 6810, newVisitors: 4820, registrations: 1664 },
  { id: "email", name: "电子邮件", visits: 9430, visitors: 3930, newVisitors: 1180, registrations: 1086 },
];

const july: TrafficChannel[] = [
  {
    id: "organic",
    name: "自然搜索",
    visits: 25390,
    visitors: 23760,
    newVisitors: 13820,
    registrations: 6078,
  },
  {
    id: "direct",
    name: "直接访问",
    visits: 34660,
    visitors: 16940,
    newVisitors: 7810,
    registrations: 5224,
  },
  {
    id: "social",
    name: "社交媒体",
    visits: 33620,
    visitors: 11240,
    newVisitors: 7270,
    registrations: 2062,
  },
  {
    id: "referral",
    name: "引荐网站",
    visits: 10100,
    visitors: 8120,
    newVisitors: 4630,
    registrations: 2726,
  },
  { id: "paid", name: "付费广告", visits: 6900, visitors: 6270, newVisitors: 4530, registrations: 1398 },
  { id: "email", name: "电子邮件", visits: 4060, visitors: 3480, newVisitors: 1020, registrations: 946 },
];

export function total(rows: readonly TrafficChannel[], metric: Metric) {
  return rows.reduce((sum, row) => sum + row[metric], 0);
}

const june: TrafficChannel[] = [
  { id: "organic", name: "自然搜索", visits: 34420, visitors: 22740, newVisitors: 14280, registrations: 5552 },
  { id: "direct", name: "直接访问", visits: 15960, visitors: 13410, newVisitors: 6390, registrations: 3986 },
  { id: "social", name: "社交媒体", visits: 17310, visitors: 14540, newVisitors: 8910, registrations: 2598 },
  { id: "referral", name: "引荐网站", visits: 16780, visitors: 7810, newVisitors: 4340, registrations: 2496 },
  { id: "paid", name: "付费广告", visits: 11660, visitors: 4250, newVisitors: 2760, registrations: 932 },
  { id: "email", name: "电子邮件", visits: 9110, visitors: 3180, newVisitors: 1080, registrations: 858 },
];

export const reports = {
  "2026-08": { label: "2026年8月", channels: august, previous: { label: "2026年7月", channels: july } },
  "2026-07": { label: "2026年7月", channels: july, previous: { label: "2026年6月", channels: june } },
} as const;

const counts = new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 0 });
export const formatCount = (value: number) => counts.format(value);

export function seriesColor(index: number) {
  return `var(--chart-${index + 1})`;
}

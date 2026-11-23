"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  KalosUsageMeter,
  type UsageDay,
  type UsageLimit,
} from "@/registry/kalos/kalos-usage-meter";

const periods = [
  { id: "month", label: "本月" },
  { id: "last", label: "上月" },
  { id: "week", label: "最近 7 天" },
] as const;
type Period = (typeof periods)[number]["id"];

const categories = ["文档问答", "全文检索", "图像生成", "API 调用"];
const usage = {
  month: { total: 10000, used: [3980, 1640, 1120, 680], seats: 8, storage: 3.2, documents: 12 },
  last: { total: 10000, used: [5210, 2140, 1690, 960], seats: 10, storage: 2.9, documents: 11 },
  week: { total: 10000, used: [1260, 540, 0, 340], seats: 8, storage: 3.2, documents: 12 },
};

function days(month: number, start: number, values: (number | null)[]): UsageDay[] {
  return values.map((value, index) => {
    const date = new Date(Date.UTC(2026, month - 1, start + index));
    return { label: `${date.getUTCMonth() + 1} 月 ${date.getUTCDate()} 日`, value };
  });
}

const daily: Record<Period, UsageDay[]> = {
  month: days(11, 2, [253, 356, 331, 275, 467, 166, 179, 392, 399, 357, 346, 476, 151, 181, 462, 531, 418, 342, 382, 239, 224, 493, null, null, null, null, null, null, null, null]),
  last: days(10, 3, [117, 200, 472, 337, 375, 356, 363, 200, 203, 311, 318, 307, 318, 297, 198, 178, 426, 367, 343, 566, 346, 257, 155, 599, 480, 411, 525, 615, 161, 199]),
  week: days(11, 17, [241, 395, 440, 345, 203, 145, 371]),
};

export function UsageMeterDemo() {
  const [period, setPeriod] = useState<Period>("month");
  const data = usage[period];
  const limits: UsageLimit[] = [
    { label: "成员席位", used: data.seats, total: 10 },
    { label: "存储空间", used: data.storage, total: 5, unit: "GB" },
    { label: "文档数", used: data.documents, total: null },
  ];

  return <KalosUsageMeter
    title="文档助手"
    plan="专业版"
    locale="zh-CN"
    total={data.total}
    used={categories.map((label, index) => ({ label, value: data.used[index] })).filter(({ value }) => value > 0)}
    limits={limits}
    daily={daily[period]}
    periods={periods}
    period={period}
    onPeriodChange={(id) => {
      const next = periods.find((option) => option.id === id);
      if (next) setPeriod(next.id);
    }}
    resetAt="2026-12-02"
    onUpgrade={() => toast("已选择购买额度")}
  />;
}

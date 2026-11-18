import type { KalosComboboxOption } from "@/registry/kalos/kalos-combobox";

export const reviewers = [
  { value: "chen", label: "陈晓", hint: "产品设计师", avatar: "/avatars/combobox/chen.webp", group: "设计", keywords: ["chen xiao"] },
  { value: "lin", label: "林悦", hint: "设计负责人", avatar: "/avatars/combobox/lin.webp", group: "设计", keywords: ["lin yue"] },
  { value: "zhou", label: "周宁", hint: "品牌设计师", avatar: "/avatars/combobox/zhou.webp", group: "设计" },
  { value: "gu", label: "顾言", hint: "前端工程师", avatar: "/avatars/combobox/gu.webp", group: "研发", keywords: ["frontend"] },
  { value: "shen", label: "沈澄", hint: "后端工程师", avatar: "/avatars/combobox/shen.webp", group: "研发" },
  { value: "he", label: "何川", hint: "移动端工程师", avatar: "/avatars/combobox/he.webp", group: "研发" },
  { value: "lu", label: "陆遥", hint: "质量工程师", avatar: "/avatars/combobox/lu.webp", group: "研发" },
  { value: "jiang", label: "江月", hint: "产品经理", avatar: "/avatars/combobox/jiang.webp", group: "产品" },
  { value: "su", label: "苏晴", hint: "数据分析师", avatar: "/avatars/combobox/su.webp", group: "产品" },
  { value: "wen", label: "温书", hint: "产品运营", avatar: "/avatars/combobox/wen.webp", group: "产品" },
] satisfies KalosComboboxOption[];

export function comboboxExample() {
  return `"use client";

import { useState } from "react";
import { KalosCombobox, type KalosComboboxOption } from "@/components/ui/kalos-combobox";

const reviewers: KalosComboboxOption[] = [
  { value: "chen", label: "陈晓", hint: "产品设计师", avatar: true, group: "设计" },
  { value: "lin", label: "林悦", hint: "设计负责人", avatar: true, group: "设计" },
  { value: "gu", label: "顾言", hint: "前端工程师", avatar: true, group: "研发", keywords: ["frontend"] },
  { value: "jiang", label: "江月", hint: "产品经理", avatar: true, group: "产品" },
];

export function Reviewers() {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <KalosCombobox
      label="审阅人"
      name="reviewers"
      placeholder="添加审阅人…"
      options={reviewers}
      value={selected}
      onChange={setSelected}
      maxVisibleTags={4}
      creatable
      createLabel={text => \`添加“\${text}”\`}
    />
  );
}`;
}

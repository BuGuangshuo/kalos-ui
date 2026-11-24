export const blockDoc = {
  slug: "pricing-plans",
  english: "Pricing Plans",
  title: "定价方案",
  description: "并排比较套餐价格、用量上限和集成能力。切换计费周期后价格逐位滚动，各套餐的详细权益可单独收起。",
  usage: `"use client";

import { KalosPricingPlans, type Plan } from "@/components/blocks/pricing-plans";

const plans: Plan[] = [
  {
    name: "Starter",
    monthly: 29,
    yearly: 24,
    limits: [{ label: "Seats", value: 2 }],
    features: [{ label: "Email support", included: true }],
    onSelect: billing => console.log("Starter", billing),
  },
];

export function Pricing() {
  return <KalosPricingPlans plans={plans} defaultBilling="yearly" />;
}`,
  props: [
    ["plans", "Plan[]", "内置三个套餐", "套餐名称、月付和年付折算月价、额度、权益、集成信息及选择回调。传入空数组会显示空状态。"],
    ["title", "string", '"Choose your plan"', "定价区标题。"],
    ["subtitle", "string", "—", "标题下方的说明。"],
    ["defaultBilling", '"monthly" | "yearly"', '"yearly"', "初始计费周期。"],
    ["currency", "string", '"$"', "价格前缀或 ISO 4217 货币代码。"],
    ["appearance", '"clean" | "classic"', '"clean"', "切换卡片外观与操作按钮的排列。"],
    ["className", "string", "—", "附加到定价区的类名。"],
    ["Plan.id / name", "string", "—", "name 为必填显示名称。可选 id 为列表项提供稳定标识。"],
    ["Plan.monthly / yearly", "number | null", "—", "月付月价与年付折算月价，非数值显示 Custom。"],
    ["Plan.badge / cta", "string", "—", "推荐徽标与行动按钮文案，按钮默认为 Start free trial。"],
    ["Plan.limits", "{ label, value, icon? }[]", "—", "用量标签、字符串或数值以及可选 React 图标。"],
    ["Plan.sync / integrations", "string / { label, choice?, icons? }", "—", "同步频率、集成标签、可选数量说明及品牌图标节点。"],
    ["Plan.features", "{ label: string; included: boolean }[]", "—", "标明每项权益是否包含在该方案中。"],
    ["Plan.onSelect", "(billing: Billing) => void", "—", "点击行动按钮后接收当前计费周期。"],
  ],
  keyboard: [
    ["Tab", "依次聚焦计费切换器、套餐按钮和详情开关。"],
    ["← / →", "在计费切换器内选择月付或年付。"],
    ["Enter / Space", "选择套餐，或展开、收起该套餐的详情。"],
  ],
} as const;

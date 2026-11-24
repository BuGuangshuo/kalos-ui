import Image from "next/image";
import { KalosThinkingState, type ThinkingSource, type ThinkingStep } from "@/registry/kalos/kalos-thinking-state";

const sources: ThinkingSource[] = [
  { label: "Slack · #team-offsite", href: "https://slack.com", icon: <Image src="/command-menu/slack.svg" width={14} height={14} alt="" className="bg-white p-[2px]" unoptimized /> },
  { label: "X · @lisbonguide", href: "https://x.com", icon: <Image src="/thinking-state/x.svg" width={14} height={14} alt="" unoptimized /> },
  { label: "Notion · Offsite plan", href: "https://www.notion.so", icon: <Image src="/command-menu/notion.svg" width={14} height={14} alt="" className="bg-white p-[2px]" unoptimized /> },
  { label: "Wikipedia · Lisbon", href: "https://en.wikipedia.org/wiki/Lisbon", icon: <Image src="/ai-answer/wikipedia.svg" width={14} height={14} alt="" className="bg-white p-[2px]" unoptimized /> },
  { label: "Google Flights · LIS", href: "https://www.google.com/travel/flights", icon: <Image src="/thinking-state/google.svg" width={14} height={14} alt="" className="bg-white p-[2px]" unoptimized /> },
  { label: "Booking.com · Lisbon", href: "https://www.booking.com/city/pt/lisbon.html", icon: <Image src="/thinking-state/booking.svg" width={14} height={14} alt="" unoptimized /> },
  { label: "Airbnb · Alfama", href: "https://www.airbnb.com", icon: <Image src="/thinking-state/airbnb.svg" width={14} height={14} alt="" className="bg-white p-[2px]" unoptimized /> },
];

const steps: readonly ThinkingStep[] = [
  { kind: "search", label: "已搜索 Lisbon 的团建资料", activeLabel: "正在搜索 Lisbon 的团建资料", sources: sources.slice(0, 4), moreSources: sources.slice(4) },
  { kind: "step", label: "阅读 7 个来源" },
  { kind: "step", label: "比较直飞航班和住宿" },
  { kind: "step", label: "核对成员可参加的日期" },
  { kind: "step", label: "整理团建行程" },
];

const compactSteps = steps.slice(0, 3);

export function ThinkingStateDemo({ compact = false }: { compact?: boolean }) {
  return <KalosThinkingState steps={compact ? compactSteps : steps} stepMs={compact ? 180 : undefined} />;
}

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { KalosAIAnswer, type KalosAnswerSource } from "@/registry/kalos/kalos-ai-answer";

const sources: readonly KalosAnswerSource[] = [
  {
    name: "Notion",
    title: "团建计划：候选地点与预算",
    href: "https://www.notion.so",
    icon: <Image unoptimized src="/ai-answer/notion.png" width={12} height={12} alt="" />,
  },
  {
    name: "Slack",
    title: "#team-offsite：成员可参加的日期",
    href: "https://slack.com",
    icon: <Image unoptimized src="/ai-answer/slack.png" width={12} height={12} alt="" />,
  },
  {
    name: "维基百科",
    title: "阿尔法玛：里斯本最古老的街区",
    href: "https://en.wikipedia.org/wiki/Alfama",
    icon: <Image unoptimized src="/ai-answer/wikipedia.svg" width={12} height={12} alt="" className="rounded-[2px] bg-white p-px" />,
  },
  {
    name: "Google 航班",
    title: "5 月 14 日周四，柏林和慕尼黑飞往里斯本",
    href: "https://www.google.com/travel/flights",
    icon: <Image unoptimized src="/ai-answer/google-flights.png" width={12} height={12} alt="" />,
  },
  {
    name: "Airbnb",
    title: "阿尔法玛两栋相连的民宿，可住 14 人",
    href: "https://www.airbnb.com",
    icon: <Image unoptimized src="/ai-answer/airbnb.png" width={12} height={12} alt="" />,
  },
  {
    name: "Booking.com",
    title: "拜萨区可接待 12 人的酒店",
    href: "https://www.booking.com",
    icon: <Image unoptimized src="/ai-answer/booking.png" width={12} height={12} alt="" />,
  },
];

const question = "在里斯本哪里办团建最合适？";
const chunks = [
  "**阿尔法玛**最适合这次 12 人团建。这里适合步行，早晨安静，费用也在预算内 [1, 3]。\n\n",
  "- **日期**：5 月 14–16 日大家都有空，约纳斯第二天加入 [2]。\n- **住宿**：阿尔法玛两栋相连的民宿住三晚共 2,880 欧元，比酒店便宜约 20% [5, 6]。\n",
  "- **航班**：从柏林和慕尼黑出发的直飞航班都在 10:30 前抵达，第一天的活动可以从午餐后开始 [4]。\n\n建议这周预订民宿，5 月只剩一个周末还有空房 [5]。",
];

export function AIAnswerDemo({ compact = false }: { compact?: boolean }) {
  return compact ? <KalosAIAnswer
    question={question}
    sources={sources.slice(0, 3)}
    answer={chunks[0]}
    animate={false}
    showFeedback={false}
    framed
  /> : <StreamingAnswerDemo />;
}

function StreamingAnswerDemo() {
  const [received, setReceived] = useState(0);
  const [stopped, setStopped] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>();
  const startedAt = useRef(0);
  const streaming = !stopped && received < chunks.length;

  useEffect(() => {
    if (!streaming) return;
    if (received === 0) startedAt.current = performance.now();
    const timer = window.setTimeout(() => {
      setReceived(received + 1);
      if (received + 1 === chunks.length) setElapsedSeconds((performance.now() - startedAt.current) / 1000);
    }, received === 0 ? 720 : 820);
    return () => window.clearTimeout(timer);
  }, [streaming, received]);

  function start() {
    setReceived(0);
    setStopped(false);
    setElapsedSeconds(undefined);
  }

  return <KalosAIAnswer
    framed
    question={question}
    sources={sources}
    answer={chunks.slice(0, received).join("")}
    streaming={streaming}
    elapsedSeconds={elapsedSeconds}
    onRegenerate={start}
    onStop={() => setStopped(true)}
  />;
}

"use client";

import { ReceiptText, Rocket, UserRound } from "lucide-react";
import { AnimatePresence, motion, useIsPresent } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { GithubIcon, OpenAIIcon } from "@/components/brand";
import {
  KalosPermissionRequest,
  type KalosPermissionRequestProps,
  type PermissionDecision,
  type PermissionScope,
} from "@/registry/kalos/kalos-permission-request";

function BrandImage({ src, color }: { src: string; color?: string }) {
  return <span data-brand-icon="" style={color ? {
    backgroundColor: color,
    mask: `url(${src}) center / contain no-repeat`,
  } : { background: `url(${src}) center / contain no-repeat` }} />;
}

const recipients = [
  "anna@northwind.example",
  "jia@lumen.example",
  "maria@acme.example",
  ...Array.from({ length: 37 }, (_, index) => `contact-${index + 4}@example.com`),
];

const requests: readonly (KalosPermissionRequestProps & { id: string })[] = [
  {
    id: "publish",
    agent: { name: "文档助手", avatar: <OpenAIIcon /> },
    action: "发布文档更新",
    target: "kalos-ui/docs",
    toolIcon: <GithubIcon />,
    reason: "设计变量和组件文档已完成校对，两份文件的修改均已通过审核和检查。",
    preview: [
      { id: "tokens", label: "docs/design/tokens.mdx", meta: "+12 −4" },
      { id: "components", label: "docs/components/index.mdx", meta: "+31 −2" },
      { id: "publish", label: "合并后发布文档", icon: <Rocket strokeWidth={1.5} /> },
    ],
  },
  {
    id: "email",
    agent: { name: "销售助手", avatar: <BrandImage src="/decision-card/claude.svg" color="#d97757" /> },
    action: "发送 40 封邮件",
    target: "Gmail · 客户跟进",
    toolIcon: <BrandImage src="/permission-request/gmail.svg" />,
    reason: "向上周开启试用、之后未再登录的客户发送跟进邮件，提醒试用即将到期。",
    previewTitle: "收件人",
    preview: recipients.map((label, index) => ({
      id: label,
      label,
      meta: index % 3 === 0 ? "周五试用到期" : "周六试用到期",
      icon: <UserRound strokeWidth={1.5} />,
    })),
  },
  {
    id: "refund",
    agent: { name: "运营助手", avatar: <BrandImage src="/permission-request/gemini.svg" /> },
    action: "退款 $240.00",
    target: "Stripe · 正式环境",
    toolIcon: <BrandImage src="/permission-request/stripe.svg" />,
    risk: "destructive",
    reason: "结账异常导致两笔订单被重复扣款，需要将重复收取的款项退回。",
    previewTitle: "退款明细",
    preview: [
      { id: "4821", label: "订单 #4821 · 林晓", meta: "$120.00", icon: <ReceiptText strokeWidth={1.5} /> },
      { id: "4822", label: "订单 #4822 · 陈扬", meta: "$120.00", icon: <ReceiptText strokeWidth={1.5} /> },
    ],
  },
];

type RequestChoice = { scope: PermissionScope; decision: PermissionDecision | null };
type Story = { index: number; autoplay: boolean; simulatedGrant: boolean; choices: RequestChoice[] };

const hour = 60 * 60_000;
const previewClockSpeed = 600;

function initialStory(autoplay: boolean): Story {
  return { index: 0, autoplay, simulatedGrant: false, choices: requests.map(() => ({ scope: "once", decision: null })) };
}

function DemoRequestCard({ children }: { children: ReactNode }) {
  const present = useIsPresent();
  return <motion.div
    className="min-w-0 overflow-clip [overflow-clip-margin:3px]"
    inert={!present}
    aria-hidden={!present || undefined}
    initial={{ height: 0, opacity: 0, y: 6 }}
    animate={{ height: "auto", opacity: 1, y: 0 }}
    exit={{ height: 0, opacity: 0, y: -6 }}
    transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
  >{children}</motion.div>;
}

export function PermissionRequestDemo({ compact = false }: { compact?: boolean }) {
  const [story, setStory] = useState(() => initialStory(!compact));
  const [clock, setClock] = useState<{ at: number; now: number }>();
  const { index, autoplay, simulatedGrant } = story;
  const { scope, decision } = story.choices[index];
  const grantAt = simulatedGrant && index < 2 ? story.choices[0].decision?.at : undefined;
  const previewNow = grantAt !== undefined && clock?.at === grantAt ? clock.now : grantAt;

  useEffect(() => {
    if (!autoplay || grantAt === undefined) return;
    const until = grantAt + hour;
    const timer = window.setInterval(() => {
      const now = Math.min(until, grantAt + (Date.now() - grantAt) * previewClockSpeed);
      setClock({ at: grantAt, now });
      if (now >= until) window.clearInterval(timer);
    }, 100);
    return () => window.clearInterval(timer);
  }, [autoplay, grantAt]);

  useEffect(() => {
    const finished = decision !== null && index === requests.length - 1;
    if (compact || (!autoplay && (finished || !decision))) return;

    const pickingDuration = index === 0 && scope === "once" && !decision;
    const delay = finished ? 3200 : decision ? 500 : pickingDuration ? 1400 : index === 0 ? 1300 : 4800;
    const timer = window.setTimeout(() => {
      const time = Date.now();
      setStory(current => {
        if (current.index !== index || (!current.autoplay && (finished || !decision))) return current;
        if (finished) return initialStory(true);
        if (decision) return { ...current, index: index + 1 };

        const value: RequestChoice = { scope, decision: null };
        if (pickingDuration) value.scope = "timed";
        else if (scope === "timed") {
          value.decision = { allow: true, scope, at: time, until: time + hour };
        } else {
          value.decision = { allow: index !== 1, scope, at: time };
        }
        return {
          ...current,
          simulatedGrant: current.simulatedGrant || value.decision?.scope === "timed",
          choices: current.choices.map((choice, position) => position === index ? value : choice),
        };
      });
    }, delay);
    return () => window.clearTimeout(timer);
  }, [autoplay, compact, decision, index, scope]);

  function pauseAutoplay() {
    setStory(current => current.autoplay ? { ...current, autoplay: false } : current);
  }

  if (compact) return <KalosPermissionRequest {...requests[0]} defaultScope="timed" />;

  const first = Math.max(0, index - 1);
  return <div className="flex w-full min-w-0 flex-col gap-2.5" onPointerDownCapture={pauseAutoplay} onFocusCapture={pauseAutoplay}>
    <AnimatePresence initial={false}>
      {requests.slice(first, index + 1).map((request, offset) => {
        const position = first + offset;
        const { id, ...props } = request;
        const choice = story.choices[position];
        return <DemoRequestCard key={id}>
          <KalosPermissionRequest
            {...props}
            scope={choice.scope}
            decision={choice.decision}
            now={position === 0 ? previewNow : undefined}
            onScopeChange={scope => setStory(current => ({
              ...current, autoplay: false,
              choices: current.choices.map((choice, i) => i === position ? { ...choice, scope } : choice),
            }))}
            onDecisionChange={decision => setStory(current => ({
              index: decision ? current.index : position,
              autoplay: false,
              simulatedGrant: position !== 0 && current.simulatedGrant,
              choices: current.choices.map((choice, i) => i === position || (decision === null && i > position)
                ? { ...choice, decision }
                : choice),
            }))}
          />
        </DemoRequestCard>;
      })}
    </AnimatePresence>
  </div>;
}

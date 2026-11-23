"use client";

import Image from "next/image";
import { Search } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { GithubIcon } from "@/components/brand";
import { KalosCollaborationStream, type StreamAgent, type StreamAttachment, type StreamMessage, type StreamSend } from "@/registry/kalos/kalos-collaboration-stream";

const agents: readonly StreamAgent[] = [
  { id: "lead", name: "Orchestrator", model: "Gemini 3.8" },
  { id: "research", name: "Researcher", model: "Gemini 3.8 Flash" },
  { id: "writer", name: "Writer", model: "Sonnet 5.5" },
  { id: "coder", name: "Coder", model: "Opus 5.5" },
];
const logos = {
  Notion: <Image src="/command-menu/notion.svg" width={14} height={14} alt="" unoptimized />,
  Figma: <Image src="/collaboration-stream/figma.svg" width={14} height={14} alt="" unoptimized />,
  GitHub: <GithubIcon />,
  Stripe: <Image src="/permission-request/stripe.svg" width={14} height={14} alt="" unoptimized />,
};
const audit: StreamAttachment = {
  label: "guide-audit.csv",
  meta: "3 rows",
  preview: 'Page,Finding,Next step\nQuick start,Old navigation path,Update link\nInvite members,Outdated screenshot,Replace image\nPermissions,Current,Keep',
};
const draft: StreamAttachment = {
  label: "onboarding-copy.md",
  meta: "1 KB",
  preview: "# Quick start\nOpen Settings → Members to invite a teammate.\nChoose a role before sending the invitation.\nManage plans and invoices in Settings → Billing.\n\nTip: Review permission levels before inviting guests.",
};
const first: StreamMessage = { id: "request", from: "you", to: "lead", kind: "ask", at: "14:02", text: "周五前把新手指南更新一下。新手第一次跟着做，五分钟内要能走完。" };
const research: StreamMessage = { id: "start-research", from: "lead", to: "research", kind: "spawn", text: "对照现在的界面走一遍，把过时的步骤列出来。" };
const writing: StreamMessage = { id: "start-writer", from: "lead", to: "writer", kind: "spawn", text: "参考核对结果，把入门流程更新一下。" };
const report: StreamMessage = {
  id: "audit", from: "research", to: "lead", kind: "share", at: "14:04", replyTo: research.id,
  text: "Notion 里有两步需要更新，Figma 上的截图已经是新版界面了。",
  attachments: [audit],
  details: {
    facts: [{ label: "Model", value: agents[1].model }, { label: "Tokens", value: "8.4k" }, { label: "Cost", value: "$0.02" }, { label: "Elapsed", value: "42s" }],
    items: [
      { label: "source_check", icon: <Search />, detail: "3 onboarding sources reviewed" },
      { label: "notion.so/onboarding", icon: logos.Notion, detail: "Checked the published steps" },
      { label: "figma.com/onboarding", icon: logos.Figma, detail: "Compared 3 screens" },
      { label: "github.com/docs", icon: logos.GitHub, detail: "Verified the current navigation" },
    ],
  },
};
const messages: readonly StreamMessage[] = [first, research, writing];
const stages: readonly { delay: number; message: StreamMessage }[] = [
  { delay: 800, message: { ...report, text: "", attachments: undefined, details: undefined, typing: true } },
  { delay: 1350, message: report },
  { delay: 2150, message: { id: "draft", from: "writer", to: "lead", kind: "reply", at: "14:06", replyTo: writing.id, text: "改好的步骤放到 Notion 了。入门流程现在大概四分钟就能走完。", attachments: [draft] } },
  { delay: 1400, message: { id: "start-coder", from: "lead", to: "coder", kind: "spawn", text: "把改好的文案和截图更新到帮助页。" } },
  { delay: 1200, message: {
    id: "handoff", from: "lead", to: "coder", kind: "handoff", at: "14:07", replyTo: "draft",
    text: "文案用 Notion 里的版本，截图用 Figma 里的。这次改动在 GitHub 上有记录。",
    attachments: [
      { label: "docs/onboarding/", meta: "6 items", preview: "screenshots/\nexamples/\nquick-start.md\ninvite-members.md\npermissions.md\nREADME.md" }, draft, audit,
      { label: "Guide / Desktop", kind: "link", meta: "Figma", preview: "Guide / Desktop – 1440 × 1800\nQuick start, member invitations, and permission settings.\nLast edited by Writer at 14:06." },
    ],
    details: { facts: [{ label: "From", value: "Orchestrator" }, { label: "To", value: "Coder" }], items: [
      { label: "Guide / Desktop", detail: "3 frames", icon: logos.Figma }, { label: "docs/onboarding", detail: "Documentation branch", icon: logos.GitHub },
    ] },
  } },
  { delay: 1450, message: { id: "shorten", from: "coder", to: "writer", kind: "ask", at: "14:08", text: "账单那句在手机上换行了，能缩成一行吗？" } },
  { delay: 1450, message: { id: "short-copy", from: "writer", to: "coder", kind: "reply", at: "14:09", replyTo: "shorten", text: "在设置里就能管理套餐和发票。" } },
  { delay: 1600, message: {
    id: "question", from: "coder", to: "you", kind: "question", at: "14:11", replyTo: first.id,
    text: "账单那一节已经链接到 Stripe 了。快速入门里要不要也放个链接，跳到完整的权限指南？",
    details: { facts: [{ label: "Model", value: agents[3].model }, { label: "Waiting", value: "Your reply" }, { label: "Holds", value: "Publish" }],
      items: [{ label: "Billing guide", icon: logos.Stripe, detail: "Link checked in the preview" }] },
  } },
  { delay: 1800, message: { id: "preview-ready", from: "lead", to: "all", kind: "share", at: "14:12", text: "新手指南已经更新到预览页了，大家可以去看看。", attachments: [{ label: "PR #218", kind: "link", meta: "GitHub · Documentation update", preview: "Updated the invite steps, screenshots, and short billing note." }] } },
];
const ongoing: readonly Omit<StreamMessage, "id" | "at" | "typing">[] = [
  { from: "research", to: "lead", kind: "share", text: "我在手机预览里试了下，邀请和权限两个链接都能打开。" },
  { from: "writer", to: "coder", kind: "reply", text: "Notion 里权限截图下面那段说明，我又缩短了一点。" },
  { from: "coder", to: "lead", kind: "share", text: "最新版文案已经放到预览页了，GitHub 上的文档检查也都通过了。" },
  { from: "lead", to: "all", kind: "handoff", text: "下一轮从已经发布的快速入门开始看，发现过时的步骤就标一下。" },
  { from: "research", to: "writer", kind: "reply", text: "我又走了一遍，快速入门大概四分钟。Figma 里的标注也都对得上。" },
  { from: "writer", to: "lead", kind: "share", text: "改动我都整理到 Notion 了，下一轮可以直接看那份。" },
];
const clock = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" });

export function CollaborationStreamDemo({ compact = false }: { compact?: boolean }) {
  return compact ? <KalosCollaborationStream agents={agents.slice(0, 3)} messages={messages} task="Refresh the onboarding guide" maxHeight={230} /> : <LiveCollaborationDemo />;
}

function LiveCollaborationDemo() {
  const session = useId();
  const nextMessage = useRef(0);
  const [log, setLog] = useState(messages);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const stage = stages[step];
    const followUpStep = step - stages.length;
    const followUpIndex = Math.floor(followUpStep / 2);
    const typing = followUpStep % 2 === 0;
    const timer = window.setTimeout(() => {
      const next = stage ? stage.message : {
        ...ongoing[followUpIndex % ongoing.length],
        id: `update-${followUpIndex}`,
        ...(typing ? { text: "", typing: true } : { at: clock.format(new Date()) }),
      };
      setLog(current => current.some(message => message.id === next.id)
        ? current.map(message => message.id === next.id ? next : message)
        : [...current, next]);
      setStep(step + 1);
    }, stage?.delay ?? (typing ? 3400 : 1200));
    return () => window.clearTimeout(timer);
  }, [step]);

  function send({ text, to, replyTo }: StreamSend) {
    const id = `${session}-user-${++nextMessage.current}`;
    const at = clock.format(new Date());
    setLog(current => [...current, { id, from: "you", to, kind: replyTo ? "reply" : "ask", text, at, replyTo }]);
  }

  return <KalosCollaborationStream agents={agents} messages={log} task="Refresh the onboarding guide" logos={logos} live maxHeight={636} onSend={send} />;
}

"use client";

import { ArrowUp, Check, ChevronDown, CircleCheck, Hand, Mic, Plus, ShieldAlert, Sparkles, X } from "lucide-react";
import { useLayoutEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import { KalosButton } from "@/registry/kalos/kalos-button";
import { KalosDecisionCard, type KalosDecision, type KalosDecisionAnswer } from "@/registry/kalos/kalos-decision-card";
import { KalosDropdownMenu } from "@/registry/kalos/kalos-dropdown-menu";

const thumbnails = {
  illustration: [[43, 20, 14, 26], [32, 56, 36, 5], [39, 67, 22, 4], [44, 80, 12, 9]],
  checklist: [[12, 18, 33, 6], [12, 30, 64, 3], [12, 45, 6, 9], [23, 47, 42, 4], [12, 63, 6, 9], [23, 65, 35, 4], [12, 80, 6, 9], [23, 82, 29, 4]],
  sample: [[30, 15, 39, 13], [13, 61, 8, 23], [25, 47, 8, 37], [37, 66, 8, 18], [49, 40, 8, 44], [61, 54, 8, 30], [73, 33, 8, 51]],
} as const;

function Thumbnail({ kind }: { kind: keyof typeof thumbnails }) {
  return <span className="decision-demo-art" data-kind={kind}>
    {thumbnails[kind].map(([x, y, width, height], index) => <span
      key={index}
      style={{ left: `${x}%`, top: `${y}%`, width: `${width}%`, height: `${height}%` }}
    />)}
  </span>;
}

const initialDecisions: readonly KalosDecision[] = [
  {
    id: "queue", task: "文档索引", question: "文档索引应使用哪个队列？",
    options: [
      { id: "kafka", title: "Kafka", summary: "保留事件，可在索引失败后重放", recommended: true },
      { id: "sqs", title: "SQS", summary: "托管队列，免维护，消费后无法重放" },
      { id: "postgres", title: "PostgreSQL 队列", summary: "复用现有数据库，适合更新量较低的场景" },
      { id: "nats", title: "NATS JetStream", summary: "支持重放，占用资源较少" },
    ],
  },
  {
    id: "empty-state", task: "文档列表", kind: "pick", question: "文档列表为空时展示哪种界面？",
    options: [
      { id: "illustration", title: "插图", preview: <Thumbnail kind="illustration" /> },
      { id: "checklist", title: "引导清单", preview: <Thumbnail kind="checklist" />, recommended: true },
      { id: "sample", title: "示例数据", preview: <Thumbnail kind="sample" /> },
    ],
  },
  {
    id: "weekly-update", task: "每周简报", kind: "approval", question: "将本周简报发送给协作者？",
    facts: [
      { label: "收件人", value: "周宁" },
      { label: "主题", value: "本周文档更新" },
      { label: "正文", value: "索引已就绪，文档列表的空状态正在审核。" },
    ],
  },
];

const approvalModes = [
  { value: "ask", label: "请求审批", icon: Hand, description: "编辑外部文件或联网前先询问" },
  { value: "delegate", label: "代我审批", icon: CircleCheck, description: "仅在操作有风险时询问" },
  { value: "full", label: "完全访问", icon: ShieldAlert, description: "允许访问网络和本机文件", danger: true },
] as const;

const models = [
  { value: "auto", label: "自动" },
  { value: "opus", label: "Claude Opus 5.5", short: "Opus", brand: "claude" },
  { value: "gpt", label: "GPT-6.2 Sol", short: "Sol", brand: "openai" },
  { value: "gemini", label: "Gemini 4 Carbon", short: "Carbon", brand: "gemini" },
  { value: "grok", label: "Grok 4.7", short: "4.7", brand: "grok" },
  { value: "kimi", label: "Kimi K3.1 Pro", short: "K3.1", brand: "kimi" },
] as const;

const waveform = [2, 2, 2, 3, 2, 2, 4, 2, 5, 3, 7, 4, 9, 5, 12, 8, 11, 6];

function ModelMark({ model }: { model: (typeof models)[number] }) {
  return "brand" in model
    ? <span className="decision-demo-model-mark" data-brand={model.brand} aria-hidden="true" />
    : <Sparkles aria-hidden="true" />;
}

function DecisionDemoComposer({ inputRef }: { inputRef: RefObject<HTMLTextAreaElement | null> }) {
  const [draft, setDraft] = useState("");
  const [sentMessage, setSentMessage] = useState("");
  const [attachment, setAttachment] = useState("");
  const [approval, setApproval] = useState<string>(approvalModes[0].value);
  const [model, setModel] = useState<string>("opus");
  const [recording, setRecording] = useState(false);
  const voice = useRef<HTMLButtonElement>(null);
  const discard = useRef<HTMLButtonElement>(null);
  const focusTarget = useRef<"voice" | "discard" | "input" | null>(null);
  const selectedApproval = approvalModes.find(option => option.value === approval) ?? approvalModes[0];
  const selectedModel = models.find(option => option.value === model) ?? models[0];
  const compactModelLabel = "short" in selectedModel ? selectedModel.short : selectedModel.label;
  const ApprovalIcon = selectedApproval.icon;

  useLayoutEffect(() => {
    const target = focusTarget.current;
    focusTarget.current = null;
    if (target === "discard") discard.current?.focus({ preventScroll: true });
    if (target === "voice") voice.current?.focus({ preventScroll: true });
    if (target === "input") inputRef.current?.focus({ preventScroll: true });
  }, [inputRef, recording]);

  function finishRecording(accept: boolean) {
    if (accept) setDraft(value => [value.trimEnd(), "起草一份简短更新。"].filter(Boolean).join("\n"));
    focusTarget.current = accept ? "input" : "voice";
    setRecording(false);
  }

  return <form
    className="decision-demo-composer"
    onKeyDown={event => {
      if (recording && event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        finishRecording(false);
      }
    }}
    onSubmit={event => {
      event.preventDefault();
      if (recording || (!draft.trim() && !attachment)) return;
      setSentMessage(`已发送 ${draft.trim() || attachment}`);
      setDraft("");
      setAttachment("");
      event.currentTarget.reset();
    }}
  >
    <span className="sr-only" role="status">{sentMessage}</span>
    <textarea
      ref={inputRef}
      aria-label="消息"
      placeholder={recording ? "草稿" : "输入消息…"}
      readOnly={recording}
      value={draft}
      onChange={event => setDraft(event.currentTarget.value)}
    />
    <div className="decision-demo-composer-tools">
      {recording ? <div className="decision-demo-recording">
        <span className="sr-only" role="status">正在录音。按 Escape 取消。</span>
        <span className="decision-demo-wave" aria-hidden="true">
          {waveform.map((height, index) => <i key={index} style={{ "--wave-height": `${height}px`, "--wave-delay": `${index * -45}ms` } as CSSProperties} />)}
        </span>
        <KalosButton ref={discard} type="button" size="icon-sm" variant="outline" aria-label="取消录音" aria-keyshortcuts="Escape" onClick={() => finishRecording(false)}><X /></KalosButton>
        <KalosButton type="button" size="icon-sm" aria-label="使用录音" onClick={() => finishRecording(true)}><Check /></KalosButton>
      </div> : <>
        <div className="decision-demo-composer-start">
          <label className="decision-demo-attach">
            <input type="file" aria-label="添加附件" onChange={event => setAttachment(event.currentTarget.files?.[0]?.name ?? "")} />
            <Plus aria-hidden="true" />
          </label>
          <div className="decision-demo-approval" data-danger={approval === "full" || undefined}>
            <KalosDropdownMenu
              trigger={<><ApprovalIcon aria-hidden="true" /><span>{selectedApproval.label}</span></>}
              triggerProps={{ variant: "ghost" }}
              title="操作如何审批？"
              contentClassName="decision-demo-approval-menu"
              side="top"
              width={420}
              items={approvalModes.map(({ icon: Icon, ...option }) => ({ ...option, icon: <Icon />, type: "radio", checked: option.value === approval }))}
              onAction={setApproval}
            />
          </div>
          {attachment ? <span className="decision-demo-attachment" title={attachment}>{attachment}</span> : null}
        </div>
        <div className="decision-demo-composer-end">
          <div className="decision-demo-model">
            <KalosDropdownMenu
              trigger={<>
                <span className="decision-demo-model-trigger-mark"><ModelMark model={selectedModel} /></span>
                <span className="decision-demo-model-label">{selectedModel.label}</span>
                <span className="decision-demo-model-short">{compactModelLabel}</span>
                <ChevronDown className="decision-demo-model-chevron" aria-hidden="true" />
              </>}
              triggerProps={{ variant: "ghost", "aria-label": selectedModel.label }}
              aria-label="选择模型"
              align="end"
              side="top"
              width={220}
              items={models.map(option => ({
                value: option.value,
                label: option.label,
                icon: <ModelMark model={option} />,
                type: "radio",
                checked: option.value === model,
              }))}
              onAction={setModel}
            />
          </div>
          <KalosButton
            ref={voice}
            type="button"
            variant="ghost"
            size="icon-sm"
            className="decision-demo-voice-trigger"
            aria-label="语音输入"
            onClick={() => { focusTarget.current = "discard"; setRecording(true); }}
          ><Mic /></KalosButton>
          <KalosButton type="submit" size="icon-sm" className="decision-demo-send" aria-label="发送消息" disabled={!draft.trim() && !attachment}><ArrowUp /></KalosButton>
        </div>
      </>}
    </div>
  </form>;
}

export function DecisionCardDemo({ compact = false }: { compact?: boolean }) {
  const [decisions, setDecisions] = useState(initialDecisions);
  const [lastDecision, setLastDecision] = useState("");
  const composer = useRef<HTMLTextAreaElement>(null);
  const status = lastDecision || `${decisions.length} 项决策待确认`;

  function respond(id: string, answer: KalosDecisionAnswer) {
    const decision = decisions.find(item => item.id === id);
    if (!decision) return;
    const response = typeof answer === "string" ? answer === "approve" ? "同意" : "拒绝"
      : "text" in answer ? answer.text
      : decision.kind !== "approval" ? decision.options.find(item => item.id === answer.option)?.title ?? answer.option
      : answer.option;
    setLastDecision(`${decision.task ?? decision.question} - ${response}`);
    setDecisions(items => items.filter(item => item.id !== id));
    if (decisions.length === 1) composer.current?.focus({ preventScroll: true });
  }

  return <div className="decision-demo">
    {!compact ? <p className="decision-demo-status">
      <span className="decision-demo-agent-mark" aria-hidden="true">
        {Array.from({ length: 9 }, (_, index) => <i key={index} />)}
      </span>
      <span className="decision-demo-status-text" title={status}>{status}</span>
    </p> : null}
    <KalosDecisionCard decisions={decisions} onDecide={respond} />
    {!compact ? <DecisionDemoComposer inputRef={composer} /> : null}
  </div>;
}

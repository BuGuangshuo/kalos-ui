"use client";

import { useEffect, useEffectEvent, useId, useLayoutEffect, useRef, useState, type ReactElement, type ReactNode } from "react";
import { Popover } from "@base-ui/react/popover";
import {
  Check, ChevronRight, FileText, RotateCw, Square, ThumbsDown, ThumbsUp,
} from "lucide-react";
import { controlStyles } from "@/components/ui/kalos-styles";
import { KalosTooltip, KalosTooltipProvider } from "@/registry/kalos/kalos-tooltip";
import { KalosButton } from "@/registry/kalos/kalos-button";
import { answerCss, answerDefaults, answerStyleHref } from "@/components/ui/kalos-ai-answer-styles";
import { cn } from "@/lib/utils";

export type KalosAnswerSource = {
  name: string;
  title: string;
  href?: string;
  icon?: ReactNode;
  snippet?: string;
};

export type KalosAIAnswerProps = {
  question?: string;
  answer: string;
  sources?: readonly KalosAnswerSource[];
  streaming?: boolean;
  animate?: boolean;
  speed?: number;
  framed?: boolean;
  elapsedSeconds?: number;
  followUps?: readonly string[];
  showFeedback?: boolean;
  feedbackReasons?: readonly string[];
  onFollowUp?: (question: string) => void;
  onRegenerate?: () => void;
  onStop?: () => void;
  onFeedback?: (value: "up" | "down", reason?: string) => void;
  onCopy?: (text: string) => void;
  className?: string;
};

const defaultReasons = ["内容不准确", "来源有误", "回答太长", "信息过时"];
const emptySources: readonly KalosAnswerSource[] = [];
const citationPattern = /\[\d+(?:,\s*\d+)*\]/g;
const revealPattern = /\[\d+(?:,\s*\d+)*\]|\*\*|\p{Script=Han}|[^\s*[\p{Script=Han}]+|\S/gu;
const wordsPattern = /(\p{Script=Han}|[^\s\p{Script=Han}]+)/gu;
type SourcePreviewChange = (id: string, numbers: readonly number[] | null) => void;

function AnswerSparkles() {
  return <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path className="kalos-answer-spark-large" d="M6 1.5 7.4 5.1 11 6.5 7.4 7.9 6 11.5 4.6 7.9 1 6.5 4.6 5.1Z" />
    <path className="kalos-answer-spark-small" d="m12.5 8.5 1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z" />
  </svg>;
}

function CopySheets() {
  return <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M6 1.5h6.5a2 2 0 0 1 2 2V10a2 2 0 0 1-1.5 1.9v-7a2 2 0 0 0-2-2H4.1A2 2 0 0 1 6 1.5Z" />
    <rect x="1.5" y="4.5" width="10" height="10" rx="1.6" />
  </svg>;
}

function nextRevealEnd(answer: string, end: number) {
  revealPattern.lastIndex = end;
  let found = false;
  for (let match = revealPattern.exec(answer); match; match = revealPattern.exec(answer)) {
    if (match[0] === "**" || match[0] === "-") continue;
    if (found) return match.index;
    found = true;
  }
  return answer.length;
}

function citationNumbers(token: string, count: number) {
  return [...new Set(token.slice(1, -1).split(",").map(Number))].filter(n => n >= 1 && n <= count);
}

function sourceHref(href?: string) {
  if (!href?.trim()) return undefined;
  try {
    const url = new URL(href, "https://kalos.invalid");
    if (url.protocol === "https:" || url.protocol === "http:") return href.trim();
  } catch {
    return undefined;
  }
}

function SourceHeading({ source, name = source.name }: { source: KalosAnswerSource; name?: string }) {
  return <span className="kalos-answer-source-heading">
    <span className="kalos-answer-source-icon" aria-hidden="true">{source.icon ?? <FileText />}</span>
    <span className="kalos-answer-source-name">{name}</span>
  </span>;
}

function SourcePreview({ sources, numbers, trigger, hover = false, onPreviewChange }: {
  sources: readonly KalosAnswerSource[];
  numbers: readonly number[];
  trigger: ReactElement;
  hover?: boolean;
  onPreviewChange?: SourcePreviewChange;
}) {
  const id = useId();
  const popupRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  return <Popover.Root onOpenChange={open => onPreviewChange?.(id, open ? numbers : null)}>
    <Popover.Trigger ref={triggerRef} render={trigger} openOnHover={hover} delay={150} closeDelay={140} />
    <Popover.Portal>
      <Popover.Positioner align={hover ? "center" : "end"} sideOffset={6} collisionPadding={8} className="z-50"
        alignOffset={hover ? ({ positioner }) => {
          const anchor = triggerRef.current;
          const card = anchor?.closest(".kalos-ai-answer");
          if (!anchor || !card) return 0;
          const bounds = card.getBoundingClientRect();
          const triggerBounds = anchor.getBoundingClientRect();
          if (bounds.width < positioner.width + 16) return 0;
          const centered = triggerBounds.left + (triggerBounds.width - positioner.width) / 2;
          const aligned = Math.max(bounds.left + 8, Math.min(centered, bounds.right - 8 - positioner.width));
          return aligned - centered;
        } : undefined}
      >
        <Popover.Popup ref={popupRef} initialFocus={popupRef} className={cn(controlStyles.popover, "kalos-answer-source-popup")} aria-label="参考来源">
          <ul className="kalos-answer-source-list">
            {numbers.map(number => {
              const source = sources[number - 1];
              const href = sourceHref(source.href);
              const host = href && URL.canParse(href) ? new URL(href).hostname.replace(/^www\./, "") : undefined;
              const contents = <>
                <SourceHeading source={source} name={host || undefined} />
                <strong>{source.title}</strong>
                {source.snippet ? <span className="kalos-answer-source-snippet">{source.snippet}</span> : null}
              </>;
              return <li key={number}>{href
                ? <a className="kalos-answer-source-row" href={href} target="_blank" rel="noreferrer">{contents}</a>
                : <div className="kalos-answer-source-row">{contents}</div>}
              </li>;
            })}
          </ul>
        </Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>;
}

function SourceCards({ sources, highlighted }: { sources: readonly KalosAnswerSource[]; highlighted?: readonly number[] }) {
  return <div className="kalos-answer-sources" role="group" aria-label="参考来源">
    {sources.slice(0, 3).map((source, index) => {
      const number = index + 1;
      const href = sourceHref(source.href);
      const active = highlighted?.includes(number) || undefined;
      const contents = <><SourceHeading source={source} /><span className="kalos-answer-card-title">{source.title}</span></>;
      return href
        ? <a key={number} data-highlighted={active} className="kalos-answer-source-card" href={href} target="_blank" rel="noreferrer">{contents}</a>
        : <SourcePreview key={number} sources={sources} numbers={[number]} trigger={
          <button data-highlighted={active} className="kalos-answer-source-card" type="button">{contents}</button>
        } />;
    })}
    {sources.length > 2 ? <SourcePreview
      sources={sources}
      numbers={sources.map((_, index) => index + 1)}
      trigger={<button className="kalos-answer-source-card kalos-answer-more" type="button" data-narrow-only={sources.length === 3 || undefined} aria-label="查看全部来源">
        <strong>
          <span className="kalos-answer-more-wide">+{sources.length - 3}</span>
          <span className="kalos-answer-more-narrow">+{sources.length - 2}</span>
        </strong>
        <span>更多</span>
      </button>}
    /> : null}
  </div>;
}

function renderInline(text: string, sources: readonly KalosAnswerSource[], busy: boolean, animate: boolean, onPreviewChange: SourcePreviewChange) {
  function renderWords(part: string) {
    return animate ? part.split(wordsPattern).map((word, index) => index % 2
      ? <span key={index} className="kalos-answer-word">{word}</span> : word) : part;
  }

  function renderCitations(part: string) {
    return part.split(/(\[\d+(?:,\s*\d+)*\])/g).map((token, index) => {
      if (index % 2 === 0) return renderWords(token);
      const numbers = citationNumbers(token, sources.length);
      if (numbers.length === 0) return token;
      const label = numbers.map(number => sources[number - 1].title).join("、");
      return <SourcePreview key={index} sources={sources} numbers={numbers} hover onPreviewChange={onPreviewChange} trigger={
        <button type="button" className="kalos-answer-citation" aria-label={`引用来源 ${label}`}>
          {sources[numbers[0] - 1].name}
          {numbers.length > 1 ? <span>+{numbers.length - 1}</span> : null}
        </button>
      } />;
    });
  }

  const parts = text.split("**");
  return parts.map((part, index) => {
    if (index % 2 === 0) return renderCitations(part);
    if (index === parts.length - 1 && !busy) return renderCitations(`**${part}`);
    return <strong key={index}>{renderCitations(part)}</strong>;
  });
}

function AnswerText({ text, sources, busy, animate, onPreviewChange }: {
  text: string;
  sources: readonly KalosAnswerSource[];
  busy: boolean;
  animate: boolean;
  onPreviewChange: SourcePreviewChange;
}) {
  const content = busy ? text.replace(/(?:\[\d*(?:,\s*\d*)*|(?<!\*)\*|(?:^|\n)[ \t]*-[ \t]*)$/, "") : text;
  const blocks: { list: boolean; lines: string[] }[] = [];
  let current: (typeof blocks)[number] | undefined;
  for (const line of content.split(/\r?\n/)) {
    if (!line.trim()) {
      current = undefined;
      continue;
    }
    const list = /^\s*-\s/.test(line);
    if (!current || current.list !== list) {
      current = { list, lines: [] };
      blocks.push(current);
    }
    current.lines.push(list ? line.replace(/^\s*-\s+/, "") : line);
  }

  const cursor = busy ? <span className="kalos-answer-cursor" aria-hidden="true" /> : null;
  return <div className="kalos-answer-text">
    {blocks.map(({ list, lines }, index) => {
      const tail = index === blocks.length - 1 ? cursor : null;
      return list ? <ul key={index}>{lines.map((line, item) => <li key={item}>
        {renderInline(line, sources, busy, animate, onPreviewChange)}{item === lines.length - 1 ? tail : null}
      </li>)}</ul> : <p key={index} className="kalos-answer-paragraph">{renderInline(lines.join(" "), sources, busy, animate, onPreviewChange)}{tail}</p>;
    })}
    {blocks.length === 0 ? cursor : null}
  </div>;
}

function clipboardText(text: string, sources: readonly KalosAnswerSource[]) {
  const plain = text
    .replace(/\*\*([^\n]+?)\*\*/g, "$1")
    .replace(citationPattern, token => citationNumbers(token, sources.length).length > 0 ? "" : token)
    .replace(/[ \t]+(?=[。，！？、；：,.!?;:]|$)/gm, "").trim();
  if (sources.length === 0) return plain;
  return [plain, "参考来源", sources.map((source, index) => {
    const href = sourceHref(source.href);
    return `${index + 1}. ${source.name} · ${source.title}${href ? ` — ${href}` : ""}`;
  }).join("\n")].join("\n\n");
}

export function KalosAIAnswer({
  question, answer, sources = emptySources, streaming = false, animate = true, speed = answerDefaults.speed,
  framed = false, elapsedSeconds, followUps, showFeedback = true, feedbackReasons = defaultReasons,
  onFollowUp, onRegenerate, onStop, onFeedback, onCopy, className,
}: KalosAIAnswerProps) {
  const titleId = useId();
  const reasonsId = useId();
  const [writing, setWriting] = useState({ question, answer, end: 0, stopped: false, revision: 0 });
  const [copyResult, setCopyResult] = useState<{ text: string; question?: string; status: "copied" | "failed" } | null>(null);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const [reasonsOpen, setReasonsOpen] = useState(false);
  const [preview, setPreview] = useState<{ id: string; numbers: readonly number[] } | null>(null);
  const copyAttempt = useRef(0);
  const downRef = useRef<HTMLButtonElement>(null);
  const expansionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const resetWriting = () => {
    setWriting({ question, answer, end: 0, stopped: false, revision: writing.revision + 1 });
    setCopyResult(null);
    setFeedback(null);
    setReasonsOpen(false);
    setPreview(null);
  };
  if (writing.question !== question || !answer.startsWith(writing.answer)) {
    resetWriting();
  } else if (writing.answer !== answer) {
    setWriting({ ...writing, answer });
  }

  const end = animate || writing.stopped ? Math.min(writing.end, answer.length) : answer.length;
  const text = answer.slice(0, end);
  const revealing = animate && !writing.stopped && end < answer.length;
  const busy = !writing.stopped && (streaming || revealing);
  const copyState = copyResult?.text === text && copyResult?.question === question ? copyResult.status : null;
  const rate = Number.isFinite(speed) && speed > 0 ? Math.min(speed, 120) : answerDefaults.speed;
  const revealNext = useEffectEvent(() => {
    if (!revealing) return;
    const next = nextRevealEnd(answer, end);
    setWriting(state => ({ ...state, end: next }));
  });
  useEffect(() => {
    if (!revealing) return;
    // Keep the cadence when new chunks arrive faster than the reveal interval.
    const timer = window.setInterval(() => revealNext(), 1000 / rate);
    return () => window.clearInterval(timer);
  }, [revealing, rate]);

  useLayoutEffect(() => {
    const expansion = expansionRef.current;
    const content = contentRef.current;
    if (!animate || !expansion || !content) return;
    const updateHeight = () => expansion.style.setProperty("--aa-measured-height", `${content.offsetHeight}px`);
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(content);
    return () => {
      observer.disconnect();
      expansion.style.removeProperty("--aa-measured-height");
    };
  }, [animate]);

  useEffect(() => {
    if (!copyResult) return;
    const timer = window.setTimeout(() => setCopyResult(null), 2200);
    return () => window.clearTimeout(timer);
  }, [copyResult]);

  async function copyAnswer() {
    const plain = clipboardText(text, sources);
    const attempt = ++copyAttempt.current;
    try {
      await navigator.clipboard.writeText(plain);
    } catch {
      if (attempt === copyAttempt.current) setCopyResult({ text, question, status: "failed" });
      return;
    }
    if (attempt !== copyAttempt.current) return;
    setCopyResult({ text, question, status: "copied" });
    onCopy?.(plain);
  }

  function submitFeedback(value: "up" | "down", reason?: string) {
    if (reasonsOpen && reason) downRef.current?.focus();
    setReasonsOpen(false);
    setFeedback(value);
    onFeedback?.(value, reason);
  }

  function handleReplay() {
    copyAttempt.current++;
    resetWriting();
    onRegenerate?.();
  }

  function handleStop() {
    setWriting({ ...writing, end, stopped: true });
    onStop?.();
  }

  function highlightCitation(id: string, numbers: readonly number[] | null) {
    setPreview(current => numbers ? { id, numbers } : current?.id === id ? null : current);
  }

  const duration = elapsedSeconds !== undefined && Number.isFinite(elapsedSeconds) && elapsedSeconds >= 0
    ? `用时 ${Math.round(elapsedSeconds)} 秒` : "";
  const status = copyState === "copied" ? "已复制"
    : copyState === "failed" ? "复制失败，请重试"
    : reasonsOpen ? "请选择原因"
    : feedback ? "已收到反馈"
    : writing.stopped ? "已停止生成" : duration;
  const canFollowUp = !busy && !writing.stopped && text.length > 0 && !!followUps?.length && !!onFollowUp;
  const canCopy = !busy && !!text.trim();
  const canRate = canCopy && showFeedback;
  const pressedFeedback = reasonsOpen ? "down" : feedback;
  const generationAction = busy ? onStop : onRegenerate;
  const readingSources = streaming && busy && !text && sources.length > 0;
  const answerLabel = readingSources ? `正在阅读 ${sources.length} 条来源`
    : busy ? "回答中"
    : writing.stopped || !text.trim() ? "回答" : "已完成";

  return <div className={cn("kalos-ai-answer", className)} data-framed={framed || undefined} data-animated={animate || undefined} role="region" aria-labelledby={titleId}>
    <style href={answerStyleHref} precedence="kalos">{answerCss}</style>
    <div className="kalos-answer-expansion" ref={expansionRef}>
      <div className="kalos-answer-content" ref={contentRef}>
        {question ? <h3 className="kalos-answer-question" id={titleId}>{question}</h3> : null}
        {sources.length > 0 ? <SourceCards key={writing.revision} sources={sources} highlighted={preview?.numbers} /> : null}
        <div className="kalos-answer-body" aria-live="polite" aria-atomic="true" aria-busy={busy}>
          <div className="kalos-answer-label" id={question ? undefined : titleId}>
            <span data-writing={busy || undefined}><AnswerSparkles /></span>
            <span key={answerLabel} className="kalos-answer-label-text" data-shimmer={busy || undefined}>
              {answerLabel}
            </span>
          </div>
          {!readingSources ? <AnswerText text={text} sources={sources} busy={busy} animate={animate} onPreviewChange={highlightCitation} /> : null}
        </div>
        {canFollowUp ? <div className="kalos-answer-followups" role="group" aria-label="相关问题">
          <div className="kalos-answer-followup-label">相关问题</div>
          {followUps.map((prompt, index) => <KalosButton key={index} variant="ghost" className="kalos-answer-followup" onClick={() => onFollowUp(prompt)}>
            {prompt}<ChevronRight data-icon="inline-end" aria-hidden="true" />
          </KalosButton>)}
        </div> : null}
      </div>
    </div>
    {canCopy || generationAction || status ? <footer className="kalos-answer-footer">
      <KalosTooltipProvider>
        <div className="kalos-answer-actions">
          {canCopy ? <KalosTooltip content={copyState === "copied" ? "已复制" : "复制回答"}>
            <KalosButton variant="ghost" size="icon" className="kalos-answer-action" data-copied={copyState === "copied" || undefined} aria-label="复制回答" onClick={copyAnswer}>
              {copyState === "copied" ? <Check aria-hidden="true" /> : <CopySheets />}
            </KalosButton>
          </KalosTooltip> : null}
          {generationAction ? <KalosTooltip key="generation" content="重新生成" disabled={busy}>
            <KalosButton variant={busy ? "outline" : "ghost"} size={busy ? "sm" : "icon"}
              className={busy ? "kalos-answer-stop" : "kalos-answer-action"}
              aria-label={busy ? "停止生成" : "重新生成"} onClick={busy ? handleStop : handleReplay}
            >
              {busy ? <><Square data-icon="inline-start" fill="currentColor" aria-hidden="true" />停止</> : <RotateCw aria-hidden="true" />}
            </KalosButton>
          </KalosTooltip> : null}
          {canRate ? <>
            <KalosTooltip content="有帮助">
              <KalosButton variant="ghost" size="icon" className="kalos-answer-action" aria-label="有帮助" aria-pressed={pressedFeedback === "up"} onClick={() => submitFeedback("up")}>
                <ThumbsUp fill="currentColor" aria-hidden="true" />
              </KalosButton>
            </KalosTooltip>
            <KalosTooltip content="没有帮助">
              <KalosButton ref={downRef} variant="ghost" size="icon" className="kalos-answer-action" aria-label="没有帮助"
                aria-pressed={pressedFeedback === "down"}
                aria-expanded={feedbackReasons.length ? reasonsOpen : undefined}
                aria-controls={feedbackReasons.length ? reasonsId : undefined}
                onClick={() => feedbackReasons.length ? setReasonsOpen(open => !open) : submitFeedback("down")}
              ><ThumbsDown fill="currentColor" aria-hidden="true" /></KalosButton>
            </KalosTooltip>
          </> : null}
          <span className={busy ? "sr-only" : "kalos-answer-status"} role="status"><span key={status}>{busy ? answerLabel : status}</span></span>
        </div>
        {canRate && feedbackReasons.length > 0 ? <div className="kalos-answer-reasons" id={reasonsId} role="group" aria-label="反馈原因" data-open={reasonsOpen || undefined} inert={!reasonsOpen}>
          <div className="kalos-answer-reasons-clip">
            <div className="kalos-answer-reasons-list">
              {feedbackReasons.map((reason, index) => <KalosButton key={index} variant="ghost" size="sm" className="kalos-answer-reason" onClick={() => submitFeedback("down", reason)}>{reason}</KalosButton>)}
            </div>
          </div>
        </div> : null}
      </KalosTooltipProvider>
    </footer> : null}
  </div>;
}

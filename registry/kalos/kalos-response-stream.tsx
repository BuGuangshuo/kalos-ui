"use client";

import { AlertCircle, Check, Clock, Copy, CornerUpRight, Play, RotateCw, Square, X } from "lucide-react";
import { memo, useEffect, useEffectEvent, useId, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { responseStreamCss, responseStreamDefaults, responseStreamStyleHref } from "@/components/ui/kalos-response-stream-styles";
import { completeResponseSentences, parseResponseText, responseTextEnd, type ResponseBend } from "@/components/ui/kalos-response-stream-text";
import { KalosButton } from "@/registry/kalos/kalos-button";
import { cn } from "@/lib/utils";

export type { ResponseBend } from "@/components/ui/kalos-response-stream-text";
export type ResponseSteer = { id: string; text: string; kind: "steer" | "queued" };
export type ResponseStreamStatus = "streaming" | "stopped" | "failed" | "done";

export type KalosResponseStreamProps = {
  text: string;
  status: ResponseStreamStatus;
  error?: string;
  steer?: readonly ResponseSteer[];
  bends?: readonly ResponseBend[];
  agent?: { id: string; name: string; color?: string };
  meta?: { tokens?: number; ms?: number };
  onStop?: () => void;
  onContinue?: () => void;
  onRetry?: () => void;
  onDismiss?: () => void;
  onRemoveSteer?: (id: string) => void;
  onCopy?: (text: string) => void;
  onRegenerate?: () => void;
  escToStop?: boolean;
  className?: string;
};

const defaultAgent = { id: "assistant", name: "Assistant" };
const emptySteer: readonly ResponseSteer[] = [];
const emptyBends: readonly ResponseBend[] = [];
const numberFormat = new Intl.NumberFormat("en", { maximumFractionDigits: 1 });
const streamSelector = "[data-kalos-response-stream]";
const wordTokens = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]\p{M}*|\s+|[^\s\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]+/gu;

const AgentMark = memo(function AgentMark({ id }: { id: string }) {
  let hash = 2166136261;
  for (const character of id) hash = Math.imul(hash ^ character.codePointAt(0)!, 16777619);

  return <span className="kalos-response-mark" aria-hidden="true">
    {Array.from({ length: 9 }, (_, index) => <span key={index} className="kalos-response-pixel" style={{
      "--krs-pixel-opacity": index === 4 ? 1 : 0.35 + ((hash >>> (index * 3)) & 7) * 0.085,
      "--krs-pixel-delay": `${(Math.floor(index / 3) + index % 3) * responseStreamDefaults.pixelStagger}ms`,
    } as CSSProperties} />)}
  </span>;
});

const Word = memo(function Word({ text, streaming }: { text: string; streaming: boolean }) {
  const [animate] = useState(streaming);
  return <span className={animate ? "kalos-response-word" : undefined}>{text}</span>;
});

const ResponseParagraph = memo(function ResponseParagraph({ text, start, streaming, caret }: {
  text: string; start: number; streaming: boolean; caret: boolean;
}) {
  const cutoff = Math.max(0, text.length - 96);
  let prefixEnd = 0;
  const tail = [];
  for (const match of text.matchAll(wordTokens)) {
    const end = match.index + match[0].length;
    if (end <= cutoff) prefixEnd = end;
    else tail.push(match);
  }
  return <p className="kalos-response-paragraph">
    {text.slice(0, prefixEnd)}
    {tail.map(match => /^\s/u.test(match[0]) ? match[0] : <Word key={start + match.index} text={match[0]} streaming={streaming} />)}
    {caret ? <span className="kalos-response-caret" aria-hidden="true" /> : null}
  </p>;
});

function ResponseAnnouncements({ plain, status, error, copyMessage }: {
  plain: string; status: ResponseStreamStatus; error?: string; copyMessage: string;
}) {
  const complete = completeResponseSentences(plain);
  const [seen, setSeen] = useState(() => ({ through: status === "streaming" ? "" : complete, spoken: "" }));
  if (complete !== seen.through) {
    const spoken = complete.startsWith(seen.through) ? complete.slice(seen.through.length).trim() : "";
    setSeen({ through: complete, spoken });
  }
  const state = status === "streaming" ? "Writing an answer" : status === "stopped" ? "Answer stopped" : status === "done" ? "Answer finished" : error ? `Answer failed. ${error}` : "Answer failed";
  return <div className="kalos-response-sr">
    <span aria-live="polite" aria-atomic="true">{seen.spoken}</span>
    <span role="status">{state}</span>
    <span role="status">{copyMessage}</span>
  </div>;
}

function responseMetadata(meta: KalosResponseStreamProps["meta"]) {
  const { tokens, ms } = meta ?? {};
  return [
    ms !== undefined && Number.isFinite(ms) && ms >= 0 ? `${numberFormat.format(ms / 1000)}s` : "",
    tokens !== undefined && Number.isFinite(tokens) && tokens >= 0 ? `${numberFormat.format(tokens)} tokens` : "",
  ].filter(Boolean).join(" · ");
}

export function KalosResponseStream({
  text, status, error, steer = emptySteer, bends = emptyBends, agent = defaultAgent, meta, onStop,
  onContinue, onRetry, onDismiss, onRemoveSteer, onCopy, onRegenerate, escToStop = true, className,
}: KalosResponseStreamProps) {
  const id = useId();
  const root = useRef<HTMLElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const footer = useRef<HTMLDivElement>(null);
  const returnFocus = useRef(false);
  const copyTimer = useRef<number>(undefined);
  const copyRequest = useRef(0);
  const [expanded, setExpanded] = useState(false);
  const [dismissal, setDismissal] = useState<"leaving" | "done">();
  const [copyMessage, setCopyMessage] = useState("");
  const streaming = status === "streaming";
  const canEscape = streaming && escToStop && Boolean(onStop) && !dismissal;
  const source = text.slice(0, responseTextEnd(text, status !== "done"));
  const body = useMemo(() => parseResponseText(source, bends), [source, bends]);
  const prose = body.flatMap(part => part.kind === "text" ? [part.text] : []).join("\n");
  const statistics = status === "done" ? responseMetadata(meta) : "";
  const firstQueued = steer.find(item => item.kind === "queued")?.id;
  const shownSteer = expanded ? steer : steer.slice(0, 3);

  function runAction(action: () => void) {
    returnFocus.current = Boolean(root.current?.contains(root.current.ownerDocument.activeElement));
    action();
  }

  const escape = useEffectEvent((event: KeyboardEvent) => {
    if (!onStop || event.key !== "Escape" || event.defaultPrevented || event.isComposing || event.repeat) return;
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest('input, textarea, select, [role="textbox"], [contenteditable]:not([contenteditable="false"])')) return;
    const owner = target?.closest(streamSelector);
    if (owner && owner !== root.current) return;
    if (!owner && target?.closest('[role="dialog"], [role="alertdialog"], [role="menu"], [role="listbox"]')) return;
    if (!owner && Array.from(document.querySelectorAll(`${streamSelector}[data-esc-stop]`)).at(-1) !== root.current) return;
    event.preventDefault();
    runAction(onStop);
  });

  useEffect(() => {
    if (!canEscape) return;
    const handle = (event: KeyboardEvent) => escape(event);
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [canEscape]);

  useLayoutEffect(() => {
    if (!returnFocus.current) return;
    returnFocus.current = false;
    (footer.current?.querySelector<HTMLButtonElement>("button") ?? head.current)?.focus({ preventScroll: true });
  }, [status]);

  const finishDismissal = useEffectEvent(() => {
    setDismissal("done");
    onDismiss?.();
  });

  useEffect(() => {
    if (dismissal !== "leaving") return;
    const timer = window.setTimeout(() => finishDismissal(), responseStreamDefaults.dismissDuration);
    return () => window.clearTimeout(timer);
  }, [dismissal]);

  useEffect(() => () => window.clearTimeout(copyTimer.current), []);

  async function copy() {
    const request = ++copyRequest.current;
    let message = "Answer copied";
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      message = "Could not copy answer";
    }
    if (request !== copyRequest.current || !root.current) return;
    window.clearTimeout(copyTimer.current);
    setCopyMessage(message);
    copyTimer.current = window.setTimeout(() => setCopyMessage(""), 1600);
    if (message === "Answer copied") onCopy?.(text);
  }

  if (dismissal === "done") return null;

  const lastPart = body.at(-1);
  return <article
    ref={root}
    className={cn("kalos-response-stream", className)}
    data-kalos-response-stream=""
    data-state={status}
    data-esc-stop={canEscape || undefined}
    data-dismissing={dismissal === "leaving" || undefined}
    aria-label={`${agent.name} answer`}
    aria-hidden={dismissal === "leaving" || undefined}
    inert={dismissal === "leaving"}
    style={agent.color ? { "--krs-agent-color": agent.color } as CSSProperties : undefined}
  >
    <style href={responseStreamStyleHref} precedence="kalos">{responseStreamCss}</style>
    {shownSteer.length ? <div className="kalos-response-steering">
      <ul className="kalos-response-chips" id={id} aria-label="Sent while it writes" role="list">
        {shownSteer.map(item => {
          const Icon = item.kind === "steer" ? CornerUpRight : Clock;
          return <li key={item.id} className="kalos-response-chip">
            <Icon aria-hidden="true" strokeWidth={1.5} />
            <span className="kalos-response-chip-badge">{item.kind === "steer" ? "Steer" : item.id === firstQueued ? "Next" : "Queued"}</span>
            <span className="kalos-response-chip-text" title={item.text}>{item.text}</span>
            {onRemoveSteer ? <KalosButton type="button" variant="ghost" size="icon-xs" aria-label={`Remove “${item.text}”`} onClick={event => {
              const list = event.currentTarget.closest("ul");
              const buttons = Array.from(list?.querySelectorAll("button") ?? []);
              const index = buttons.indexOf(event.currentTarget);
              (buttons[index + 1] ?? buttons[index - 1] ?? head.current)?.focus({ preventScroll: true });
              onRemoveSteer(item.id);
            }}><X aria-hidden="true" /></KalosButton> : null}
          </li>;
        })}
      </ul>
      {steer.length > 3 ? <KalosButton type="button" size="xs" variant="ghost" className="kalos-response-more" aria-controls={id} aria-expanded={expanded} onClick={() => setExpanded(value => !value)}>
        {expanded ? "Show fewer" : `+ ${steer.length - 3} more`}
      </KalosButton> : null}
    </div> : null}
    <div ref={head} className="kalos-response-head" tabIndex={-1}>
      <AgentMark id={agent.id} />
      <span className="kalos-response-name">{agent.name}</span>
      {streaming ? <span className="kalos-response-writing" aria-hidden="true">Writing</span> : null}
    </div>
    <div className="kalos-response-content">
      <div className="kalos-response-body" aria-busy={streaming || undefined}>
        {body.map(part => {
          if (part.kind === "bend") return <div key={`bend:${part.index}`} className="kalos-response-bend" role="separator" aria-label={part.text ? `Changed course: ${part.text}` : "Changed course"}>
            <CornerUpRight aria-hidden="true" strokeWidth={1.5} /><span>{part.text ? `Steered · ${part.text}` : "Changed course"}</span>
          </div>;
          if (part.kind === "code") return <div className="kalos-response-code" key={`code:${part.start}`}>
            {part.language ? <div className="kalos-response-code-label">{part.language}</div> : null}
            <pre tabIndex={0} aria-label={part.language ? `${part.language} code` : "Code"}><code>{part.text}</code>{streaming && part === lastPart ? <span className="kalos-response-caret" aria-hidden="true" /> : null}</pre>
          </div>;
          return <ResponseParagraph key={`text:${part.start}`} start={part.start} text={part.text} streaming={streaming} caret={streaming && part === lastPart} />;
        })}
        {streaming && (!lastPart || lastPart.kind === "bend") ? <p className="kalos-response-paragraph"><span className="kalos-response-caret" aria-hidden="true" /></p> : null}
      </div>
      {!streaming || onStop ? <div ref={footer} className="kalos-response-footer" role="group" aria-label="Answer actions">
        {status === "stopped" ? <span className="kalos-response-foot-label" aria-hidden="true">Stopped</span> : null}
        {status === "failed" && error ? <p className="kalos-response-error"><AlertCircle aria-hidden="true" strokeWidth={1.6} /><span>{error}</span></p> : null}
        <div className="kalos-response-actions">
          {streaming && onStop ? <KalosButton type="button" size="sm" variant="outline" data-response-action="" aria-keyshortcuts={canEscape ? "Escape" : undefined} onClick={() => runAction(onStop)}>
            <Square data-icon="inline-start" aria-hidden="true" />Stop{canEscape ? <kbd className="kalos-response-key" aria-hidden="true">Esc</kbd> : null}
          </KalosButton> : null}
          {status === "stopped" ? <>
            {onContinue ? <KalosButton type="button" size="sm" variant="outline" data-response-action="" onClick={() => runAction(onContinue)}><Play data-icon="inline-start" aria-hidden="true" />Continue</KalosButton> : null}
            {onDismiss ? <KalosButton type="button" size="sm" variant="outline" data-response-action="" onClick={() => setDismissal("leaving")}><X data-icon="inline-start" aria-hidden="true" />Dismiss</KalosButton> : null}
          </> : null}
          {status === "failed" ? <>
            <span className="kalos-response-foot-label" aria-hidden="true">Failed</span>
            {onRetry ? <KalosButton type="button" size="sm" variant="outline" data-response-action="" onClick={() => runAction(onRetry)}><RotateCw data-icon="inline-start" aria-hidden="true" />Retry</KalosButton> : null}
          </> : null}
          {status === "done" ? <>
            <KalosButton type="button" size="icon-sm" variant="ghost" aria-label="Copy answer" title={copyMessage || "Copy answer"} onClick={copy} disabled={!text}>
              {copyMessage === "Answer copied" ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
            </KalosButton>
            {onRegenerate ? <KalosButton type="button" size="icon-sm" variant="ghost" aria-label="Regenerate answer" title="Regenerate answer" onClick={() => runAction(onRegenerate)}><RotateCw aria-hidden="true" /></KalosButton> : null}
            {statistics ? <span className="kalos-response-meta">{statistics}</span> : null}
          </> : null}
        </div>
      </div> : null}
    </div>
    <ResponseAnnouncements plain={prose} status={status} error={error} copyMessage={copyMessage} />
  </article>;
}

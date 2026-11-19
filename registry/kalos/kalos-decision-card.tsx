"use client";

import { Button } from "@base-ui/react/button";
import { ArrowUp, ChevronLeft, ChevronRight, LayoutTemplate } from "lucide-react";
import { AnimatePresence, motion, useIsPresent } from "motion/react";
import { useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { decisionCardCss, decisionCardStyleHref, decisionDefaults } from "@/components/ui/kalos-decision-card-styles";
import { slidingHighlightClasses, useSlidingHighlight } from "@/components/ui/kalos-highlight";
import { KalosButton } from "@/registry/kalos/kalos-button";
import { cn } from "@/lib/utils";

export type KalosDecisionOption = {
  id: string;
  title: string;
  summary?: string;
  recommended?: boolean;
  preview?: ReactNode;
};

export type KalosDecision = {
  id: string;
  question: string;
  task?: string;
} & (
  | { kind?: "decision" | "pick"; options: readonly KalosDecisionOption[] }
  | { kind: "approval"; facts?: readonly { label: string; value: ReactNode }[] }
);

export type KalosDecisionAnswer = { option: string } | { text: string } | "approve" | "decline";

const defaultLabels = {
  needsYou: "待确认",
  later: "稍后",
  show: "查看",
  recommended: "推荐",
  approve: "同意",
  decline: "拒绝",
  own: "输入其他答案…",
  send: "提交答案",
  previous: "上一项决策",
  next: "下一项决策",
  waiting: (count: number) => `${count} 项待确认`,
  position: (index: number, count: number) => `${index} / ${count}`,
  accepted: (answer: string, remaining: number) => remaining ? `已提交 ${answer}，还有 ${remaining} 项待确认` : `已提交 ${answer}`,
};

export type KalosDecisionCardLabels = typeof defaultLabels;
export type KalosDecisionCardProps = {
  decisions: readonly KalosDecision[];
  onDecide: (id: string, answer: KalosDecisionAnswer) => void;
  onLater?: (id: string) => void;
  defaultFolded?: boolean;
  reveal?: number;
  labels?: Partial<KalosDecisionCardLabels>;
  className?: string;
};

const foldTransition = { duration: decisionDefaults.foldDuration / 1000, ease: decisionDefaults.ease };
const pageTransition = { duration: decisionDefaults.pageDuration / 1000, ease: decisionDefaults.ease };

function DecisionCollapse({ className, children }: { className: string; children: ReactNode }) {
  const present = useIsPresent();
  return <motion.div
    className={className}
    inert={!present}
    aria-hidden={!present || undefined}
    initial={{ height: 0, opacity: 0 }}
    animate={{ height: "auto", opacity: 1 }}
    exit={{ height: 0, opacity: 0 }}
    transition={foldTransition}
  >{children}</motion.div>;
}

function DecisionBody({
  decision, questionId, labels, onAnswer,
}: {
  decision: KalosDecision;
  questionId: string;
  labels: KalosDecisionCardLabels;
  onAnswer: (answer: KalosDecisionAnswer, label: string) => void;
}) {
  const present = useIsPresent();
  const [cursor, setCursor] = useState(0);
  const [draft, setDraft] = useState("");
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const [focusedOption, setFocusedOption] = useState<string | null>(null);
  const highlight = useSlidingHighlight("[data-decision-option]", "[data-decision-option][data-highlighted]");
  const highlightedOption = hoveredOption ?? focusedOption;
  const field = useRef<HTMLInputElement>(null);
  const options = useRef<(HTMLElement | null)[]>([]);
  const approval = decision.kind === "approval";
  const items: readonly KalosDecisionOption[] = approval
    ? [{ id: "approve", title: labels.approve }, { id: "decline", title: labels.decline }]
    : decision.options;
  const currentRow = Math.min(cursor, Math.max(0, items.length - 1));
  const pick = decision.kind === "pick";

  function choose(index: number) {
    const option = items[index];
    if (!option || !present) return;
    const answer = approval ? index === 0 ? "approve" : "decline" : { option: option.id };
    onAnswer(answer, option.title);
  }

  function move(index: number) {
    setCursor(index);
    options.current[index]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.defaultPrevented || event.nativeEvent.isComposing || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.target === field.current) {
      if (event.key === "ArrowUp" && !draft && items.length) {
        event.preventDefault();
        move(items.length - 1);
      }
      return;
    }
    if (/^[1-9]$/.test(event.key)) {
      const index = Number(event.key) - 1;
      if (index > items.length) return;
      event.preventDefault();
      if (index === items.length) field.current?.focus();
      else choose(index);
      return;
    }
    if (event.target !== options.current[currentRow]) return;
    const list = event.currentTarget.querySelector(".kalos-decision-options");
    const tiled = pick && list && getComputedStyle(list).display === "grid";
    const rowWidth = tiled ? 3 : 1;
    const movement = event.key === "ArrowDown" ? rowWidth : event.key === "ArrowUp" ? -rowWidth
      : tiled && event.key === "ArrowRight" ? 1 : tiled && event.key === "ArrowLeft" ? -1 : 0;
    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      move(event.key === "Home" ? 0 : items.length - 1);
    } else if (movement) {
      event.preventDefault();
      const index = currentRow + movement;
      if (index >= items.length) field.current?.focus();
      else move(Math.max(0, index));
    }
  }

  return <motion.div
    className="kalos-decision-body"
    data-decision-body=""
    inert={!present}
    aria-hidden={!present || undefined}
    initial={{ opacity: 0, y: 3 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -3 }}
    transition={pageTransition}
    onKeyDown={onKeyDown}
  >
    <h3 className="kalos-decision-question" id={questionId}>{decision.question}</h3>
    {approval && decision.facts?.length ? <dl className="kalos-decision-facts">
      {decision.facts.map((fact, index) => <div key={index}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}
    </dl> : null}
    {items.length ? <div
      ref={highlight}
      className={cn("kalos-decision-options", slidingHighlightClasses)}
      data-kind={decision.kind ?? "decision"}
      role="listbox"
      aria-labelledby={questionId}
      onPointerLeave={() => setHoveredOption(null)}
      onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocusedOption(null); }}
    >
      {items.map((option, index) => <Button
        key={option.id}
        ref={node => { options.current[index] = node; }}
        type="button"
        role="option"
        aria-selected={false}
        aria-keyshortcuts={index < 9 ? String(index + 1) : undefined}
        tabIndex={index === currentRow ? 0 : -1}
        data-decision-option=""
        data-highlighted={highlightedOption === option.id || undefined}
        className="kalos-decision-option"
        onPointerMove={event => {
          if (event.pointerType !== "touch" && hoveredOption !== option.id) setHoveredOption(option.id);
        }}
        onFocus={event => {
          setCursor(index);
          if (event.currentTarget.matches(":focus-visible")) {
            setHoveredOption(null);
            setFocusedOption(option.id);
          } else setFocusedOption(null);
        }}
        onClick={() => choose(index)}
      >
        {pick ? <span className="kalos-decision-art" aria-hidden="true">{option.preview ?? <LayoutTemplate />}</span> : null}
        <span className="kalos-decision-option-text">
          <span className="kalos-decision-key" aria-hidden="true">{index + 1}</span>
          <span className="kalos-decision-copy">
            <span className="kalos-decision-option-title">{option.title}</span>
            {option.summary ? <span className="kalos-decision-summary" title={option.summary}>{option.summary}</span> : null}
          </span>
          {option.recommended ? <span className="kalos-decision-recommended">{labels.recommended}</span> : null}
        </span>
      </Button>)}
    </div> : null}
    <form
      className="kalos-decision-own"
      onSubmit={event => {
        event.preventDefault();
        const value = draft.trim();
        if (value && present) onAnswer({ text: value }, value);
      }}
    >
      <span className="kalos-decision-key" aria-hidden="true">{items.length + 1}</span>
      <input
        ref={field}
        data-decision-own=""
        aria-label={labels.own}
        aria-keyshortcuts={items.length < 9 ? String(items.length + 1) : undefined}
        placeholder={labels.own}
        value={draft}
        onChange={event => setDraft(event.currentTarget.value)}
      />
      {draft.trim() ? <KalosButton type="submit" size="icon-xs" variant="ghost" aria-label={labels.send}><ArrowUp /></KalosButton> : null}
    </form>
  </motion.div>;
}

export function KalosDecisionCard({
  decisions, onDecide, onLater, defaultFolded = false, reveal, labels: overrides, className,
}: KalosDecisionCardProps) {
  const labels = { ...defaultLabels, ...overrides };
  const [view, setView] = useState({ id: decisions[0]?.id, folded: defaultFolded, reveal });
  const [announcement, setAnnouncement] = useState("");
  const initialReveal = useRef(reveal);
  const focusNext = useRef<"show" | "answer" | null>(null);
  const surface = useRef<HTMLDivElement>(null);
  const show = useRef<HTMLButtonElement>(null);
  const baseId = useId();
  const index = Math.max(0, decisions.findIndex(decision => decision.id === view.id));
  const decision = decisions[index];
  const questionId = `${baseId}-${encodeURIComponent(decision?.id ?? "")}`;
  const total = decisions.length;
  const folded = view.folded;
  if (view.reveal !== reveal) setView({ ...view, folded: false, reveal });

  useLayoutEffect(() => {
    const request = focusNext.current;
    const wasRevealed = initialReveal.current !== reveal;
    initialReveal.current = reveal;
    focusNext.current = null;
    const card = surface.current;
    if (!card) return;
    if (request === "show") show.current?.focus();
    else if (request === "answer" || wasRevealed) {
      const body = card.querySelector("[data-decision-body]:not([inert])");
      const target = body?.querySelector<HTMLElement>('[data-decision-option][tabindex="0"]') ?? body?.querySelector<HTMLElement>("[data-decision-own]");
      target?.focus();
    }
    if (wasRevealed) {
      const pulse = card.animate(
        [{ backgroundColor: "var(--kd-hover)" }, { backgroundColor: "var(--kd-surface)" }],
        { duration: decisionDefaults.pulseDuration, easing: "ease-out" },
      );
      return () => pulse.cancel();
    }
  }, [decision?.id, folded, reveal]);

  function defer() {
    if (!decision || folded) return;
    focusNext.current = "show";
    setView({ ...view, folded: true });
    setAnnouncement(labels.waiting(total));
    onLater?.(decision.id);
  }

  function answer(value: KalosDecisionAnswer, label: string) {
    if (!decision || folded) return;
    const next = decisions[index + 1] ?? decisions[index - 1];
    focusNext.current = next ? "answer" : null;
    setView({ ...view, id: next?.id });
    setAnnouncement(labels.accepted(label, total - 1));
    onDecide(decision.id, value);
  }

  function page(offset: number) {
    const next = decisions[(index + offset + total) % total];
    if (next) setView({ ...view, id: next.id });
  }

  return <div className={cn("kalos-decision-card", className)}>
    <style href={decisionCardStyleHref} precedence="kalos">{decisionCardCss}</style>
    <span className="kalos-decision-sr" role="status">{announcement}</span>
    <AnimatePresence initial={false}>
      {decision ? <DecisionCollapse key="surface" className="kalos-decision-shell">
        <div
          ref={surface}
          className="kalos-decision-surface"
          role="group"
          aria-labelledby={folded ? undefined : questionId}
          aria-label={folded ? labels.waiting(total) : undefined}
          onKeyDown={event => {
            if (event.key === "Escape" && !event.defaultPrevented && !event.nativeEvent.isComposing && !folded) {
              event.preventDefault();
              defer();
            }
          }}
        >
          <header className="kalos-decision-head">
            <span className="kalos-decision-badge">{labels.needsYou}</span>
            {folded || decision.task ? <span className="kalos-decision-task" title={folded ? undefined : decision.task}>
              {folded ? labels.waiting(total) : decision.task}
            </span> : null}
            <div className="kalos-decision-actions">
              {folded ? <KalosButton
                ref={show} size="xs" variant="ghost"
                onClick={() => { focusNext.current = "answer"; setView({ ...view, folded: false }); }}
              >{labels.show}</KalosButton> : <>
                {total > 1 ? <div className="kalos-decision-pager">
                  <KalosButton size="icon-xs" variant="ghost" aria-label={labels.previous} onClick={() => page(-1)}><ChevronLeft /></KalosButton>
                  <span aria-live="polite">{labels.position(index + 1, total)}</span>
                  <KalosButton size="icon-xs" variant="ghost" aria-label={labels.next} onClick={() => page(1)}><ChevronRight /></KalosButton>
                </div> : null}
                <KalosButton size="xs" variant="ghost" aria-keyshortcuts="Escape" onClick={defer}>{labels.later}</KalosButton>
              </>}
            </div>
          </header>
          <AnimatePresence initial={false}>
            {!folded ? <DecisionCollapse key="body" className="kalos-decision-collapse">
              <AnimatePresence initial={false}>
                <DecisionBody key={decision.id} decision={decision} questionId={questionId} labels={labels} onAnswer={answer} />
              </AnimatePresence>
            </DecisionCollapse> : null}
          </AnimatePresence>
        </div>
      </DecisionCollapse> : null}
    </AnimatePresence>
  </div>;
}

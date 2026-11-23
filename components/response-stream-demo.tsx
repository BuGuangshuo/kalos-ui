"use client";

import { useEffect, useState } from "react";
import { KalosResponseStream, type ResponseSteer, type ResponseStreamStatus } from "@/registry/kalos/kalos-response-stream";
import { KalosButton } from "@/registry/kalos/kalos-button";

const firstQuestion = "How should we roll out the new billing page?";
const intro = "Start with a one-week internal rollout behind the billing flag. Track checkout errors and how long it takes users to make their first payment.";
const plan = "Then enable the page for 10% of new accounts. Keep the previous route available while you compare conversion and support requests.";
const rollback = "In short: start internally, expand to 10%, then roll out to everyone. If checkout errors rise, turn off the flag and switch back to the previous route.";
const code = ["```text", "internal → 10% → general availability", "```"].join("\n");
const answer = [intro, plan, rollback, code].join("\n\n");
const followUp = {
  question: "Then draft the email to the finance team",
  text: "Subject: Billing page rollout\n\nWe will test the new billing page internally before expanding to 10% of new accounts. We will share conversion and checkout error data before widening access.",
};
const direction: ResponseSteer = { id: "rollback", kind: "steer", text: "Keep it shorter" };
const nextMessage: ResponseSteer = { id: "checklist", kind: "queued", text: followUp.question };
const agent = { id: "atlas", name: "Atlas" };
const bendAt = answer.indexOf(rollback);
const failureAt = bendAt + rollback.indexOf("everyone.") + "everyone.".length;

type Preview = {
  answerIndex: number;
  position: number;
  status: ResponseStreamStatus;
  autoplay: boolean;
  stopped: boolean;
  failed: boolean;
  dismissed: boolean;
  removed: readonly string[];
};

function initialPreview(autoplay: boolean, answerIndex = 0): Preview {
  return { answerIndex, position: 0, status: "streaming", autoplay, stopped: false, failed: false, dismissed: false, removed: [] };
}

export function ResponseStreamDemo({ compact = false }: { compact?: boolean }) {
  const [preview, setPreview] = useState(() => initialPreview(!compact));
  const { answerIndex, status, autoplay, dismissed, position, removed } = preview;
  const first = answerIndex === 0;
  const fullText = first ? answer : followUp.text;
  const question = first ? firstQuestion : followUp.question;

  useEffect(() => {
    if (compact || dismissed) return;
    if (status === "streaming") {
      const timer = window.setInterval(() => setPreview(current => {
        if (current.status !== "streaming" || current.answerIndex !== answerIndex) return current;
        const next = Math.min(fullText.length, current.position + 3);
        if (first && current.autoplay && !current.stopped && next >= intro.length) {
          return { ...current, position: intro.length, status: "stopped", stopped: true };
        }
        if (first && current.stopped && !current.failed && next >= failureAt) {
          return { ...current, position: failureAt, status: "failed", failed: true };
        }
        return { ...current, position: next, status: next === fullText.length ? "done" : "streaming" };
      }), 56);
      return () => window.clearInterval(timer);
    }
    if (!autoplay) return;
    const timer = window.setTimeout(() => setPreview(current => {
      if (!current.autoplay || current.status !== status) return current;
      if (status !== "done") return { ...current, status: "streaming" };
      return initialPreview(true, first && !current.removed.includes(nextMessage.id) ? 1 : 0);
    }), status === "done" ? 3000 : status === "failed" ? 2100 : 1700);
    return () => window.clearTimeout(timer);
  }, [answerIndex, autoplay, compact, dismissed, first, fullText, status]);

  if (compact) return <div className="response-stream-demo">
    <div className="response-stream-demo-question">{firstQuestion}</div>
    <KalosResponseStream agent={agent} text={intro} status="done" meta={{ tokens: 84, ms: 2300 }} />
  </div>;

  const steer = first ? [
    ...(position > intro.length + 9 && position < failureAt ? [direction] : []),
    ...(position >= bendAt - 12 ? [nextMessage] : []),
  ].filter(item => !removed.includes(item.id)) : [];
  const bends = first && position >= bendAt && !removed.includes(direction.id) ? [{ at: bendAt, text: direction.text }] : [];

  function restart() {
    setPreview({ ...initialPreview(false, answerIndex), stopped: true, failed: true, removed });
  }

  function resume() {
    setPreview(current => ({ ...current, autoplay: false, status: "streaming" }));
  }

  return <div className="response-stream-demo" onFocusCapture={() => setPreview(current => current.autoplay ? { ...current, autoplay: false } : current)}>
    <div className="response-stream-demo-question">{question}</div>
    {dismissed ? <KalosButton type="button" variant="outline" size="sm" className="justify-self-start" onClick={restart}>Regenerate answer</KalosButton> : <KalosResponseStream
      key={answerIndex}
      agent={agent}
      text={fullText.slice(0, position)}
      status={status}
      error={status === "failed" ? "The model is busy. Retry to continue from here." : undefined}
      steer={steer}
      bends={bends}
      meta={first ? { tokens: 182, ms: 6400 } : { tokens: 96, ms: 2800 }}
      onStop={() => setPreview(current => ({ ...current, autoplay: false, stopped: true, status: "stopped" }))}
      onContinue={resume}
      onRetry={resume}
      onDismiss={() => setPreview(current => ({ ...current, autoplay: false, dismissed: true }))}
      onRemoveSteer={id => setPreview(current => ({ ...current, autoplay: false, removed: [...current.removed, id] }))}
      onRegenerate={restart}
    />}
  </div>;
}

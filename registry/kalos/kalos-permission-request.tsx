"use client";

import { Check, ChevronDown, Clock, CornerDownLeft, FileText, OctagonAlert, TriangleAlert, X } from "lucide-react";
import { AnimatePresence, motion, useIsPresent } from "motion/react";
import { useEffect, useId, useLayoutEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type KeyboardEvent, type ReactNode, type Ref } from "react";
import { permissionCss, permissionDefaults, permissionStyleHref } from "@/components/ui/kalos-permission-request-styles";
import { KalosButton } from "@/registry/kalos/kalos-button";
import { KalosSegmentedControl } from "@/registry/kalos/kalos-segmented-control";
import { cn } from "@/lib/utils";

export type PermissionScope = "once" | "timed" | "always";
export type PermissionDecision = { allow: boolean; scope: PermissionScope; at: number; until?: number };

export type KalosPermissionRequestProps = {
  agent: { name: string; model?: string; avatar?: ReactNode };
  action: string;
  target?: string;
  toolIcon?: ReactNode;
  risk?: "safe" | "risky" | "destructive";
  reason?: string;
  preview?: readonly { id: string; label: string; meta?: ReactNode; icon?: ReactNode }[];
  previewTitle?: string;
  previewLimit?: number;
  scopes?: readonly PermissionScope[];
  scope?: PermissionScope;
  defaultScope?: PermissionScope;
  onScopeChange?: (scope: PermissionScope) => void;
  duration?: number;
  decision?: PermissionDecision | null;
  defaultDecision?: PermissionDecision | null;
  onDecisionChange?: (decision: PermissionDecision | null) => void;
  now?: number;
  className?: string;
};

const allScopes: readonly PermissionScope[] = ["once", "timed", "always"];
const fold = { duration: permissionDefaults.foldDuration / 1000, ease: permissionDefaults.ease };
const swap = { duration: permissionDefaults.swapDuration / 1000, ease: permissionDefaults.ease };
const localTime = new Intl.DateTimeFormat("zh-CN", { hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
const utcTime = new Intl.DateTimeFormat("zh-CN", { hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: "UTC" });
const subscribeToBrowser = () => () => {};

function durationLabel(minutes: number) {
  if (minutes < 1) return `${Math.max(1, Math.ceil(minutes * 60))} 秒`;
  const whole = Math.ceil(minutes);
  if (whole < 60) return `${whole} 分钟`;
  const hours = Math.floor(whole / 60);
  const remainder = whole % 60;
  return remainder ? `${hours} 小时 ${remainder} 分钟` : `${hours} 小时`;
}

function PreviewMeta({ value }: { value: ReactNode }) {
  const diff = typeof value === "string" ? /^(\+\d+)\s+[-−](\d+)$/.exec(value) : null;
  return <span className="kalos-permission-meta">{diff ? <>
    <span className="kalos-permission-meta-add">{diff[1]}</span>
    <span className="kalos-permission-meta-remove">−{diff[2]}</span>
  </> : value}</span>;
}

function PermissionPanel({ children, measure }: { children: ReactNode; measure: (height: number) => void }) {
  const present = useIsPresent();
  const panel = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const node = panel.current;
    if (!node || !present) return;
    const update = () => measure(node.offsetHeight);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, [measure, present]);

  return <motion.div
    ref={panel}
    className="kalos-permission-panel"
    aria-hidden={!present || undefined}
    inert={!present}
    initial={{ opacity: 0, y: 4 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -4 }}
    transition={swap}
  >{children}</motion.div>;
}

function PermissionResult({ decision, agent, action, now, onReset, actionRef }: {
  decision: PermissionDecision;
  agent: string;
  action: string;
  now?: number;
  onReset: () => void;
  actionRef: Ref<HTMLButtonElement>;
}) {
  const { allow, scope, at } = decision;
  const timed = allow && scope === "timed";
  const until = timed && typeof decision.until === "number" && Number.isFinite(decision.until) ? decision.until : at;
  const [tick, setTick] = useState<{ until: number; time: number }>();
  const time = now ?? (tick?.until === until ? tick.time : at);
  const remaining = Math.max(0, until - time);
  const expired = timed && remaining === 0;
  const browser = useSyncExternalStore(subscribeToBrowser, () => true, () => false);
  const format = (timestamp: number) => (browser ? localTime : utcTime).format(timestamp);

  useEffect(() => {
    if (!timed || now !== undefined || until <= at) return;
    let timer: number;
    function update() {
      const time = Date.now();
      setTick({ until, time });
      if (time < until) timer = window.setTimeout(update, Math.min(1000, until - time));
    }
    timer = window.setTimeout(update, 0);
    return () => window.clearTimeout(timer);
  }, [at, now, timed, until]);

  const status = !allow ? "denied" : expired ? "expired" : "allowed";
  const Icon = status === "denied" ? X : status === "expired" ? Clock : Check;
  const grantDuration = durationLabel((until - at) / 60_000);
  const label = !allow ? "已拒绝" : expired ? "已到期" : scope === "once" ? "已允许一次" : scope === "always" ? "已始终允许" : `已允许 ${grantDuration}`;
  const detail = !allow ? `已通知 ${agent} 停止此操作` : expired ? `于 ${format(until)} 到期` : scope === "once" ? `授权于 ${format(at)}，仅本次有效` : scope === "always" ? `自 ${format(at)} 起有效` : `${remaining < 60_000 ? `剩余 ${Math.ceil(remaining / 1000)} 秒` : `剩余 ${durationLabel(Math.ceil(remaining / 60_000))}`} · 至 ${format(until)}`;
  const resetLabel = expired ? "重新请求" : allow && scope !== "once" ? "撤销" : "更改";

  return <div className="kalos-permission-summary">
    <motion.span
      key={status}
      className="kalos-permission-status-icon"
      data-status={status}
      aria-hidden="true"
      initial={{ opacity: 0, scale: 0.55 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 420, damping: 23 }}
    ><Icon /></motion.span>
    <div>
      <div className="kalos-permission-status" role="status">
        <strong>{label}</strong>
        <span className="kalos-permission-status-action kalos-permission-ellipsis" title={action}>· {action}</span>
      </div>
      <div className="kalos-permission-detail kalos-permission-ellipsis" title={detail}>{detail}</div>
    </div>
    <KalosButton ref={actionRef} type="button" variant="ghost" onClick={onReset} onKeyDown={event => {
      if (event.key === "Enter" && event.repeat) event.preventDefault();
    }}>{resetLabel}</KalosButton>
    {timed ? <div className="kalos-permission-progress" aria-hidden="true">
      <span style={{ transform: `scaleX(${Math.min(1, remaining / Math.max(1, until - at))})` }} />
    </div> : null}
  </div>;
}

export function KalosPermissionRequest({
  agent, action, target, toolIcon, risk = "risky", reason, preview, previewTitle = "操作预览", previewLimit = 3,
  scopes = allScopes, scope, defaultScope = "once", onScopeChange, duration = 60, decision, defaultDecision = null,
  onDecisionChange, now, className,
}: KalosPermissionRequestProps) {
  const id = useId();
  const [localScope, setLocalScope] = useState(defaultScope);
  const [localDecision, setLocalDecision] = useState(defaultDecision);
  const [expanded, setExpanded] = useState(false);
  const [height, setHeight] = useState<number>();
  const pending = useRef<HTMLDivElement>(null);
  const resultAction = useRef<HTMLButtonElement>(null);
  const moveFocus = useRef(false);
  const allowedScopes = [...new Set(scopes)].filter(value => risk !== "destructive" || value !== "always");
  const limitedScope = risk === "destructive" && scopes.includes("always");
  const RiskIcon = risk === "destructive" ? OctagonAlert : TriangleAlert;
  const requestedScope = scope ?? localScope;
  const selected = allowedScopes.includes(requestedScope) ? requestedScope : allowedScopes[0];
  const current = decision === undefined ? localDecision : decision;
  const waiting = current === null;
  const minutes = Number.isFinite(duration) && duration > 0 ? duration : 60;
  const labels = { once: "仅一次", timed: durationLabel(minutes), always: "始终" };
  const allowLabel = selected === "timed" ? `允许 ${labels.timed}` : selected === "always" ? "始终允许" : "允许一次";
  const limit = Number.isFinite(previewLimit) ? Math.max(0, Math.trunc(previewLimit)) : 3;
  const previewCount = preview?.length ?? 0;
  const hiddenCount = Math.max(0, previewCount - limit);
  const visibleRows = expanded ? preview : preview?.slice(0, limit);
  const initials = agent.name.trim().split(/\s+/).slice(0, 2).map(word => Array.from(word)[0]).join("").toLocaleUpperCase();

  useLayoutEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    (waiting ? pending.current : resultAction.current)?.focus({ preventScroll: true });
  }, [waiting]);

  function changeDecision(next: PermissionDecision | null) {
    moveFocus.current = true;
    if (next === null) setExpanded(false);
    if (decision === undefined) setLocalDecision(next);
    onDecisionChange?.(next);
  }

  function decide(allow: boolean) {
    if (!waiting || (allow && !selected)) return;
    const at = now ?? Date.now();
    const next: PermissionDecision = { allow, scope: selected ?? "once", at };
    if (allow && selected === "timed") next.until = at + minutes * 60_000;
    changeDecision(next);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.defaultPrevented || event.nativeEvent.isComposing || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key === "Escape" || (event.key === "Enter" && !(event.target as Element).closest('button:not([role="radio"]), a[href]'))) {
      event.preventDefault();
      event.stopPropagation();
      if (!event.repeat) decide(event.key === "Enter");
    }
  }

  return <div className={cn("kalos-permission-request", className)}>
    <style href={permissionStyleHref} precedence="kalos">{permissionCss}</style>
    <motion.div className="kalos-permission-surface" initial={false} animate={{ height: height ?? "auto" }} transition={fold}>
      <AnimatePresence initial={false}>
        {waiting ? <PermissionPanel key="request" measure={setHeight}>
          <div ref={pending} className="kalos-permission-pending" role="dialog" tabIndex={-1} aria-labelledby={`${id}-title`} aria-describedby={reason ? `${id}-reason` : undefined} onKeyDownCapture={onKeyDown}>
            <div className="kalos-permission-header">
              <span className="kalos-permission-avatar" aria-hidden="true" title={agent.model}>{agent.avatar ?? initials}</span>
              <div>
                <h3 className="kalos-permission-title" id={`${id}-title`}><strong>{agent.name}</strong> 请求<strong>{action}</strong></h3>
                {target ? <div className="kalos-permission-target" title={target}>
                  {toolIcon ? <span className="kalos-permission-target-icon" aria-hidden="true">{toolIcon}</span> : null}
                  <span className="kalos-permission-ellipsis">{target}</span>
                </div> : null}
              </div>
              {risk !== "safe" ? <span className="kalos-permission-risk" data-risk={risk}><RiskIcon strokeWidth={1.5} aria-hidden="true" />{risk === "destructive" ? "高风险" : "有风险"}</span> : null}
              {reason ? <p className="kalos-permission-reason" id={`${id}-reason`}>{reason}</p> : null}
            </div>
            {previewCount ? <div className="kalos-permission-preview" role="region" aria-labelledby={`${id}-preview`}>
              <h4 className="kalos-permission-preview-title" id={`${id}-preview`}>{previewTitle}<span className="kalos-permission-count">{previewCount}</span></h4>
              <ul className="kalos-permission-list" id={`${id}-list`} role="list">
                {visibleRows?.map(({ id, label, meta, icon }, index) => <li key={id} className="kalos-permission-item" style={{ "--kpr-order": Math.min(index, 5) } as CSSProperties}>
                  <span className="kalos-permission-item-icon" aria-hidden="true">{icon ?? <FileText strokeWidth={1.5} />}</span>
                  <span className="kalos-permission-ellipsis" title={label}>{label}</span>
                  {meta != null ? <PreviewMeta value={meta} /> : null}
                </li>)}
              </ul>
              {hiddenCount ? <KalosButton type="button" variant="ghost" size="xs" className="kalos-permission-more" aria-expanded={expanded} aria-controls={`${id}-list`} onClick={() => setExpanded(value => !value)}>
                <ChevronDown data-icon="inline-start" className={expanded ? "rotate-180" : undefined} aria-hidden="true" />{expanded ? "收起" : `另有 ${hiddenCount} 项`}
              </KalosButton> : null}
            </div> : null}
            {allowedScopes.length > 1 || limitedScope ? <div className="kalos-permission-scope-field">
              {allowedScopes.length > 1 ? <KalosSegmentedControl
                aria-label="授权时长"
                className="kalos-permission-scopes"
                fullWidth
                variant="buttons"
                options={allowedScopes.map(value => ({ value, label: labels[value] }))}
                value={selected}
                onChange={value => {
                  if (scope === undefined) setLocalScope(value);
                  onScopeChange?.(value);
                }}
              /> : null}
              {limitedScope ? <span className="kalos-permission-scope-note">高风险操作仅支持单次或限时授权。</span> : null}
            </div> : null}
            <div className="kalos-permission-actions">
              <KalosButton type="button" variant="outline" aria-keyshortcuts="Escape" onClick={() => decide(false)}>拒绝 <kbd className="kalos-permission-key" aria-hidden="true">Esc</kbd></KalosButton>
              <KalosButton type="button" variant={risk === "destructive" ? "destructive" : "default"} disabled={!selected} aria-label={allowLabel} aria-keyshortcuts="Enter" onClick={() => decide(true)}>
                <span className="kalos-permission-label" aria-hidden="true">
                  <AnimatePresence initial={false} mode="popLayout">
                    <motion.span key={allowLabel} initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -3 }} transition={swap}>{allowLabel}</motion.span>
                  </AnimatePresence>
                </span>
                <kbd className="kalos-permission-key" aria-hidden="true"><CornerDownLeft className="size-3" strokeWidth={1.5} /></kbd>
              </KalosButton>
            </div>
          </div>
        </PermissionPanel> : <PermissionPanel key="result" measure={setHeight}>
          <PermissionResult decision={current} agent={agent.name} action={action} now={now} onReset={() => changeDecision(null)} actionRef={resultAction} />
        </PermissionPanel>}
      </AnimatePresence>
    </motion.div>
  </div>;
}

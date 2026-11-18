"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, MotionConfig, useIsPresent } from "motion/react";
import { ArrowUpRight, X } from "lucide-react";
import { cn } from "cn";
import { KalosButton } from "./kalos-button";
import { KalosBadge } from "./kalos-badge";
import { notificationCss, notificationDefaults, notificationStyleHref } from "@/components/ui/kalos-notification-styles";

export type KalosNoticePattern = "orbit" | "grid" | "rays";
export type KalosNotificationPosition = "top-right" | "bottom-right" | "top-left" | "bottom-left";
export type KalosNotice = {
  id: string;
  badge?: string;
  title: string;
  text?: string;
  icon?: ReactNode;
  pattern?: KalosNoticePattern | "none";
  action?: { label: string; href?: string; onClick?: () => void | Promise<void>; external?: boolean; disabled?: boolean };
};
export type KalosNotificationProps = {
  notices: KalosNotice[];
  onDismiss?: (notice: KalosNotice) => void;
  /** stack 保留文档流；floating 通过 Portal 固定在视口四角。 */
  variant?: "stack" | "floating";
  position?: KalosNotificationPosition;
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
};

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;
const transition = { duration: notificationDefaults.duration / 1000, ease: [0.22, 1, 0.36, 1] as const };

// Art and stacking adapted from affectUI Notification Stack (MIT).
// The full license is distributed in kalos-notification-styles.ts.
function Pattern({ kind }: { kind: KalosNoticePattern }) {
  return <svg className="kalos-notification__pattern" viewBox="0 0 220 160" fill="none" aria-hidden="true">
    {kind === "orbit" ? <>
      <circle cx="190" cy="10" r="46" /><circle cx="190" cy="10" r="86" /><circle cx="190" cy="10" r="128" />
      <path d="M60 160 220 0M0 58h220M150 0v160" /><circle cx="150" cy="58" r="3.5" className="kalos-notification__dot" />
    </> : null}
    {kind === "grid" ? <>
      {[30, 60, 90, 120, 150, 180, 210].map(x => <path key={`x${x}`} d={`M${x} 0v160`} />)}
      {[20, 50, 80, 110, 140].map(y => <path key={`y${y}`} d={`M0 ${y}h220`} />)}
      <rect x="150" y="50" width="30" height="30" className="kalos-notification__fill" />
      <circle cx="180" cy="50" r="3.5" className="kalos-notification__dot" />
    </> : null}
    {kind === "rays" ? <>
      {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M210 6 L${210 - Math.cos(i * Math.PI / 16) * 230} ${6 + Math.sin(i * Math.PI / 16) * 230}`} />)}
      <path d="M120 6a90 90 0 0 0 90 90" /><circle cx="146" cy="70" r="3.5" className="kalos-notification__dot" />
    </> : null}
  </svg>;
}

function NoticeCard({ notice, depth, frontHeight, height, bottom, left, onDismiss, onMeasure }: {
  notice: KalosNotice; depth: number; frontHeight: number; height: number;
  bottom: boolean; left: boolean; onDismiss: (notice: KalosNotice, restoreFocus?: boolean) => void;
  onMeasure: (id: string, height: number) => void;
}) {
  const present = useIsPresent();
  const titleId = useId();
  const contentRef = useRef<HTMLDivElement>(null);
  const actionRun = useRef<symbol | null>(null);
  const retryFocus = useRef(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const behind = depth > 0;
  const cappedDepth = Math.min(depth, 2);
  const offset = behind ? frontHeight - Math.min(height || frontHeight, frontHeight) + cappedDepth * notificationDefaults.peek : 0;

  useLayoutEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    const measure = () => onMeasure(notice.id, content.offsetHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(content);
    return () => observer.disconnect();
  }, [notice.id, onMeasure]);

  useEffect(() => () => { actionRun.current = null; }, [present]);

  useLayoutEffect(() => {
    if (pending || !error || !present || !retryFocus.current) return;
    retryFocus.current = false;
    contentRef.current?.querySelector<HTMLButtonElement>(".kalos-notification__action-button")?.focus({ preventScroll: true });
  }, [error, pending, present]);

  const action = notice.action;
  const runAction = async () => {
    if (!action || action.disabled || actionRun.current || !present) return;
    const run = Symbol();
    const hadFocus = Boolean(contentRef.current?.contains(document.activeElement));
    actionRun.current = run;
    setPending(true);
    setError("");
    try {
      await action.onClick?.();
      if (actionRun.current === run) onDismiss(notice, hadFocus && document.activeElement === document.body);
    } catch {
      if (actionRun.current === run) {
        retryFocus.current = hadFocus && document.activeElement === document.body;
        setError("操作失败，请重试。");
        setPending(false);
      }
    } finally {
      if (actionRun.current === run) actionRun.current = null;
    }
  };

  return <motion.article
    className="kalos-notification__card"
    data-depth={depth}
    data-leaving={!present || undefined}
    data-notice-id={notice.id}
    aria-labelledby={titleId}
    aria-hidden={behind || !present || undefined}
    inert={behind || !present}
    initial={{ x: left ? -40 : 40, y: bottom ? 12 : -12, opacity: 0, scale: 0.98 }}
    animate={{ x: 0, y: bottom ? -offset : offset, scale: 1 - cappedDepth * notificationDefaults.scaleStep, opacity: depth > 2 ? 0 : 1 }}
    exit={{ x: left ? -40 : 40, opacity: 0, scale: 0.98, transition: { ...transition, duration: notificationDefaults.exitDuration / 1000 } }}
    transition={transition}
    style={{ zIndex: present ? 10 - depth : 11, maxHeight: behind && frontHeight ? frontHeight : undefined }}
  >
    {notice.pattern !== "none" ? <Pattern kind={notice.pattern ?? "orbit"} /> : null}
    <div ref={contentRef} className="kalos-notification__body">
      <KalosButton variant="ghost" size="icon" className="kalos-notification__close" aria-label={`关闭通知：${notice.title}`} onClick={() => {
        actionRun.current = null;
        onDismiss(notice);
      }}><X aria-hidden="true" /></KalosButton>
      {notice.badge ? <div className="kalos-notification__top"><KalosBadge>{notice.badge}</KalosBadge></div> : null}
      <h3 id={titleId} className="kalos-notification__title" dir="auto">
        {notice.icon ? <span className="kalos-notification__icon" aria-hidden="true">{notice.icon}</span> : null}{notice.title}
      </h3>
      {notice.text ? <p className="kalos-notification__text" dir="auto">{notice.text}</p> : null}
      {action ? <div className="kalos-notification__action">
        <KalosButton className="kalos-notification__action-button" aria-label={action.label} disabled={action.disabled} loading={pending} onClick={runAction}
          {...(action.href ? { render: <a href={action.disabled ? undefined : action.href} {...(action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})} />, nativeButton: false } : {})}
        >
          {action.label}{action.external && action.href ? <ArrowUpRight data-icon="inline-end" aria-hidden="true" /> : null}
        </KalosButton>
      </div> : null}
      {error ? <p className="kalos-notification__error" role="alert">{error}</p> : null}
    </div>
  </motion.article>;
}

export function KalosNotification({ notices, onDismiss, variant = "stack", position = "top-right", className, style, "aria-label": label = "通知" }: KalosNotificationProps) {
  const mounted = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  const [dismissed, setDismissed] = useState<ReadonlySet<string>>(() => new Set());
  const [heights, setHeights] = useState<Record<string, number>>({});
  const regionRef = useRef<HTMLElement>(null);
  const restoreFocus = useRef(false);
  const visible = notices.filter(notice => !dismissed.has(notice.id));
  const front = visible[0];
  const frontHeight = front ? heights[front.id] ?? 0 : 0;
  const bottom = position.startsWith("bottom");
  const left = position.endsWith("left");
  const measure = useCallback((id: string, height: number) => {
    setHeights(current => current[id] === height ? current : { ...current, [id]: height });
  }, []);

  useLayoutEffect(() => {
    if (!restoreFocus.current) return;
    restoreFocus.current = false;
    const target = regionRef.current?.querySelector<HTMLButtonElement>('[data-depth="0"]:not([inert]) .kalos-notification__close');
    (target ?? regionRef.current)?.focus({ preventScroll: true });
  }, [front?.id]);

  const dismiss = (notice: KalosNotice, returnFocus = false) => {
    if (dismissed.has(notice.id)) return;
    restoreFocus.current = returnFocus || Boolean(regionRef.current?.contains(document.activeElement));
    setDismissed(current => new Set(current).add(notice.id));
    onDismiss?.(notice);
  };

  const content = <MotionConfig reducedMotion="never">
    <style href={notificationStyleHref} precedence="default">{notificationCss}</style>
    <motion.section ref={regionRef} tabIndex={-1} aria-label={label}
      className={cn("kalos-notification", className)} data-variant={variant} data-position={position}
      initial={false} animate={{ height: front ? frontHeight + Math.min(visible.length - 1, 2) * notificationDefaults.peek : 0 }}
      transition={transition} style={style}
    >
      <span className="kalos-notification__announcement" role="status" aria-atomic="true">{front ? `${front.title}${front.text ? `。${front.text}` : ""}` : ""}</span>
      <AnimatePresence>
        {visible.slice(0, 4).map((notice, depth) => <NoticeCard key={notice.id} notice={notice} depth={depth}
          frontHeight={frontHeight} height={heights[notice.id] ?? 0} bottom={bottom} left={left}
          onDismiss={dismiss} onMeasure={measure}
        />)}
      </AnimatePresence>
    </motion.section>
  </MotionConfig>;

  return variant === "floating" ? mounted ? createPortal(content, document.body) : null : content;
}

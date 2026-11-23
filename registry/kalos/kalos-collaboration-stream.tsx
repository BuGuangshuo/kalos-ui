"use client";

import { Collapsible } from "@base-ui/react/collapsible";
import { Dialog } from "@base-ui/react/dialog";
import { ArrowDown, FileText, X } from "lucide-react";
import { useEffect, useEffectEvent, useId, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import { CollaborationComposer } from "@/components/ui/kalos-collaboration-stream-composer";
import { collaborationCss, collaborationDefaults, collaborationStyleHref } from "@/components/ui/kalos-collaboration-stream-styles";
import type { StreamAgent, StreamAttachment, StreamDetails, StreamMessage, StreamSend } from "@/components/ui/kalos-collaboration-stream-types";
import { KalosButton } from "@/registry/kalos/kalos-button";
import { cn } from "@/lib/utils";

export type { StreamAgent, StreamAttachment, StreamDetails, StreamFact, StreamItem, StreamMessage, StreamSend } from "@/components/ui/kalos-collaboration-stream-types";

export type KalosCollaborationStreamProps = {
  agents: readonly StreamAgent[];
  messages: readonly StreamMessage[];
  task?: string;
  live?: boolean;
  selected?: string | null;
  onSelectedChange?: (id: string | null) => void;
  focusAgent?: string | null;
  onFocusAgentChange?: (id: string | null) => void;
  onSend?: (message: StreamSend) => void;
  placeholder?: string;
  logos?: Record<string, ReactNode>;
  maxHeight?: number;
  title?: string;
  className?: string;
};

const tones = ["blue", "violet", "teal", "amber", "pink"] as const;
const pairedRows = 0b111111000;
const masks = [pairedRows, 0b101010111, pairedRows, 0b010101101, 0b110011110];
const everyone = ["all"];
type AttachmentKind = NonNullable<StreamAttachment["kind"]>;

const attachmentGlyphs: Record<AttachmentKind, ReactNode> = {
  folder: <>
    <path fill="currentColor" d="M1.45 3.05c0-.72.58-1.3 1.3-1.3h1.62c.4 0 .78.17 1.05.47l.92 1.08h2.85c.75 0 1.36.61 1.36 1.36v1.29h-9.1z" />
    <path fill="currentColor" opacity=".45" d="M1.35 5.85h9.3c.3 0 .52.28.46.57l-.58 2.91c-.13.66-.72 1.13-1.39 1.13H2.86c-.67 0-1.26-.47-1.39-1.13L.9 6.42c-.06-.29.16-.57.45-.57Z" />
  </>,
  file: <>
    <path d="M3 1h3.6L9.5 4v5.8A1.2 1.2 0 0 1 8.3 11H3a1.2 1.2 0 0 1-1.2-1.2V2.2A1.2 1.2 0 0 1 3 1Z" opacity=".5" />
    <path d="M6.6 1v2.15c0 .47.38.85.85.85H9.5zM3.35 6.35h4.45v.9H3.35zm0 1.8h3.4v.9h-3.4z" />
  </>,
  table: <>
    <path d="M3 1h3.6L9.5 4v5.8A1.2 1.2 0 0 1 8.3 11H3a1.2 1.2 0 0 1-1.2-1.2V2.2A1.2 1.2 0 0 1 3 1Z" opacity=".5" />
    <path d="M6.6 1v2.15c0 .47.38.85.85.85H9.5zM3.3 5.9h2v1.5h-2zm2.7 0h2v1.5H6zM3.3 8.1h2v1.5h-2zm2.7 0h2v1.5H6z" />
  </>,
  link: <>
    <path d="m4.7 7.3 2.6-2.6" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
    <g fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round">
      <path d="m6.1 8.2-1 1A1.9 1.9 0 0 1 2.4 6.5L4 4.9a1.9 1.9 0 0 1 2.65-.04" opacity=".65" />
      <path d="m5.9 3.8 1-1A1.9 1.9 0 0 1 9.6 5.5L8 7.1a1.9 1.9 0 0 1-2.65.04" />
    </g>
  </>,
  tool: <g fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3.9 3.8 1.7 6l2.2 2.2m4.2-4.4L10.3 6 8.1 8.2" /><path d="m6.7 3-1.4 6" opacity=".65" />
  </g>,
  image: <>
    <rect x="1.1" y="1.7" width="9.8" height="8.6" rx="1.25" opacity=".5" />
    <circle cx="4" cy="4.4" r=".85" /><path d="m2.1 9 2.2-2.3 1.35 1.35 1.9-2.2L9.9 9z" />
  </>,
};

function AttachmentIcon({ kind }: { kind: AttachmentKind }) {
  return <svg viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">{attachmentGlyphs[kind]}</svg>;
}

function recipients(message: StreamMessage): readonly string[] {
  return typeof message.to === "string" ? [message.to] : message.to;
}

function attachmentKind({ kind, label }: StreamAttachment): AttachmentKind {
  if (kind) return kind;
  if (/[/\\]$/.test(label)) return "folder";
  if (/\.(csv|tsv|xlsx?)$/i.test(label)) return "table";
  if (/\.(png|webp|jpe?g|gif|svg)$/i.test(label)) return "image";
  if (/^https?:\/\//i.test(label)) return "link";
  return "file";
}

function delimitedRows(source: string, separator: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < source.length; index++) {
    const char = source[index];
    if (char === '"' && quoted) {
      if (source[index + 1] === '"') {
        field += '"';
        index++;
      } else {
        quoted = false;
      }
    } else if (char === '"' && !field) {
      quoted = true;
    } else if (!quoted && (char === separator || char === "\n")) {
      row.push(field);
      field = "";
      if (char === "\n") {
        if (row.length > 1 || row[0]) rows.push(row);
        row = [];
      }
    } else {
      field += char;
    }
  }
  if (quoted) return [];
  if (field || row.length) rows.push([...row, field]);
  return rows;
}

function AttachmentPreview({ file, kind }: { file: StreamAttachment; kind: AttachmentKind }) {
  if (typeof file.preview !== "string") return file.preview ?? <p>No preview available</p>;
  const source = file.preview.replace(/\r\n?/g, "\n");

  if (kind === "folder") {
    const entries = source.split("\n").map(entry => entry.trim()).filter(Boolean);
    return <ul className="kcs-folder-preview">{entries.map((entry, index) => <li key={index}>
      <AttachmentIcon kind={attachmentKind({ label: entry })} />
      <span>{entry}</span>
    </li>)}</ul>;
  }

  if (kind === "table") {
    const normalized = source.replace(/^\uFEFF/, "");
    const separator = /\.tsv$/i.test(file.label) || normalized.split("\n", 1)[0].includes("\t") ? "\t" : ",";
    const [header, ...rows] = delimitedRows(normalized, separator);
    if (header && (header.length > 1 || /\.(csv|tsv)$/i.test(file.label))) return <table aria-label={file.label}>
      <thead><tr>{header.map((field, index) => <th scope="col" key={index}>{field}</th>)}</tr></thead>
      <tbody>{rows.map((row, rowIndex) => <tr key={rowIndex}>
        {Array.from({ length: Math.max(row.length, header.length) }, (_, index) => <td key={index}>{row[index]}</td>)}
      </tr>)}</tbody>
    </table>;
  }

  if (kind === "file" && /\.(md|markdown)$/i.test(file.label)) {
    return <div className="kcs-document-preview">{source.trim().split(/\n[\t ]*\n+/).flatMap((block, index) => {
      const heading = block.match(/^#{1,6}[\t ]+([^\n]+)(?:\n|$)/);
      if (!heading) return <p key={index}>{block}</p>;
      const body = block.slice(heading[0].length);
      return [<h3 key={`${index}:heading`}>{heading[1]}</h3>, body ? <p key={index}>{body}</p> : null];
    })}</div>;
  }

  if (kind === "link" || kind === "image") return <p className="kcs-link-preview">{source}</p>;
  return <pre className="kcs-text-preview">{source}</pre>;
}

function focusIndex(event: KeyboardEvent, index: number, length: number, axis: "horizontal" | "vertical") {
  if (event.key === "Home") return 0;
  if (event.key === "End") return length - 1;
  const rtl = axis === "horizontal" && getComputedStyle(event.currentTarget).direction === "rtl";
  if (event.key === (axis === "vertical" ? "ArrowDown" : rtl ? "ArrowLeft" : "ArrowRight")) return (index + 1) % length;
  if (event.key === (axis === "vertical" ? "ArrowUp" : rtl ? "ArrowRight" : "ArrowLeft")) return (index - 1 + length) % length;
  return -1;
}

function highlightMessage(target: HTMLButtonElement) {
  target.focus({ preventScroll: true });
  target.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  const card = target.closest(".kcs-message");
  if (card) card.animate([
    { backgroundColor: "var(--kcs-mark-wash)" }, { backgroundColor: getComputedStyle(card).backgroundColor },
  ], { duration: collaborationDefaults.highlight, easing: collaborationDefaults.ease });
}

function AgentMark({ agent, index }: { agent?: StreamAgent; index: number }) {
  const variant = index % tones.length;
  const mask = masks[variant] ?? 0b111111111;
  const firstCell = mask & 0b111 ? 0 : 3;
  return <span aria-hidden="true" className="kcs-mark" data-tone={index < 0 ? "neutral" : tones[variant]}>
    {agent?.avatar ?? <span className="kcs-pixels">
      {Array.from({ length: 9 - firstCell }, (_, index) => {
        const cell = firstCell + index;
        return <i key={cell} data-low={!(mask & (1 << cell)) || undefined} style={{ "--kcs-delay": `${(index % 3 + Math.floor(index / 3)) * collaborationDefaults.pixelStagger}ms` } as CSSProperties} />;
      })}
    </span>}
  </span>;
}

function MessageDetails({ details }: { details: StreamDetails }) {
  return <div className="kcs-details">
    {details.facts?.length ? <dl className="kcs-facts">{details.facts.map(({ label, value }, index) => <div key={`${label}:${index}`}><dt>{label}</dt><dd>{value}</dd></div>)}</dl> : null}
    {details.items?.length ? <ul className="kcs-activity">{details.items.map(({ label, detail, icon }, index) => <li key={`${label}:${index}`}>
      <span aria-hidden="true" className="kcs-activity-icon">{icon ?? <FileText />}</span>
      <span className="kcs-activity-label"><span>{label}</span>{detail == null ? null : <small>{detail}</small>}</span>
    </li>)}</ul> : null}
  </div>;
}

export function KalosCollaborationStream({
  agents, messages, task, live = false, selected, onSelectedChange, focusAgent, onFocusAgentChange, onSend,
  placeholder = "请输入任务消息，可@对应智能体", logos, maxHeight = collaborationDefaults.maxHeight, title = "Agent chat", className,
}: KalosCollaborationStreamProps) {
  const id = useId();
  const root = useRef<HTMLElement>(null);
  const toolbar = useRef<HTMLDivElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const logContent = useRef<HTMLDivElement>(null);
  const selectedDetails = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const popup = useRef<HTMLDivElement>(null);
  const returnTo = useRef<HTMLButtonElement | null>(null);
  const tabButtons = useRef(new Map<string | null, HTMLButtonElement>());
  const messageButtons = useRef(new Map<string, HTMLButtonElement>());
  const seen = useRef(new Set<string>());
  const pinned = useRef(true);
  const latestMessage = useRef(messages.at(-1)?.id ?? null);
  const [readThrough, setReadThrough] = useState(() => messages.at(-1)?.id ?? null);
  const [localSelected, setLocalSelected] = useState<string | null>(null);
  const [localAgent, setLocalAgent] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>();
  const [activeMessage, setActiveMessage] = useState<string | null>(null);
  const [replyId, setReplyId] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ file: StreamAttachment; message: StreamMessage; open: boolean }>();

  const marked = useMemo(() => agents.filter(agent => agent.id !== "you" && agent.id !== "all").map((agent, index) => ({ ...agent, index, mark: <AgentMark agent={agent} index={index} /> })), [agents]);
  const agentMap = useMemo(() => new Map(marked.map(agent => [agent.id, agent])), [marked]);
  const messageMap = useMemo(() => new Map(messages.map(message => [message.id, message])), [messages]);
  const answered = useMemo(() => new Set(messages.filter(message => message.from === "you").map(message => message.replyTo)), [messages]);
  const logoPattern = useMemo(() => {
    const names = Object.keys(logos ?? {}).filter(Boolean).sort((a, b) => b.length - a.length);
    return names.length ? new RegExp(`(?<![\\p{L}\\p{N}_])(${names.map(name => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})(?![\\p{L}\\p{N}_])`, "gu") : null;
  }, [logos]);

  const pickedFilter = focusAgent === undefined ? localAgent : focusAgent;
  const filter = pickedFilter === "you" || pickedFilter && agentMap.has(pickedFilter) ? pickedFilter : null;
  const picked = selected === undefined ? localSelected : selected;
  const selectedId = picked !== null && messageMap.has(picked) ? picked : null;
  const activeId = activeMessage !== null && messageMap.has(activeMessage) ? activeMessage : selectedId ?? messages[0]?.id ?? null;
  const speakers = useMemo(() => [...new Set(messages.filter(message => message.kind !== "spawn" && agentMap.has(message.from)).map(message => message.from))], [messages, agentMap]);
  const tabIds = [null, "you", ...speakers];
  if (filter && !tabIds.includes(filter)) tabIds.push(filter);
  const tabIndexId = activeTab !== undefined && tabIds.includes(activeTab) ? activeTab : filter;
  const replying = replyId ? messageMap.get(replyId) : undefined;
  const height = Number.isFinite(maxHeight) && maxHeight > 0 ? maxHeight : collaborationDefaults.maxHeight;
  const readIndex = messages.findIndex(message => message.id === readThrough);
  const unread = readIndex >= 0 ? messages.length - readIndex - 1 : 0;

  function label(agentId: string) {
    if (agentId === "you") return "You";
    if (agentId === "all") return "Everyone";
    return agentMap.get(agentId)?.name ?? agentId;
  }

  function showText(text: string) {
    if (!logoPattern || !logos) return text;
    return text.split(logoPattern).map((part, index) => index % 2 === 1 ? <span className="kcs-inline-brand" key={index}><span aria-hidden="true">{logos[part]}</span>{part}</span> : part);
  }

  function select(value: string | null) {
    if (selected === undefined) setLocalSelected(value);
    onSelectedChange?.(value);
  }

  function changeFilter(value: string | null) {
    if (focusAgent === undefined) setLocalAgent(value);
    onFocusAgentChange?.(value);
  }

  const dismissSelection = useEffectEvent((event: PointerEvent) => {
    const target = event.target;
    if (selectedId === null || preview?.open || !(target instanceof Element)) return;
    const selectedButton = messageButtons.current.get(selectedId);
    const current = selectedButton?.closest(".kcs-message-stack") ?? selectedButton;
    if (current?.contains(target)) return;
    if (root.current?.contains(target) && target.closest(".kcs-message, .kcs-message-pick")) {
      const action = target.closest("button, a");
      if (!action || action.classList.contains("kcs-message-pick")) return;
    }
    select(null);
  });

  useEffect(() => {
    const owner = root.current?.ownerDocument;
    if (!owner || selectedId === null) return;
    const handlePointer = (event: PointerEvent) => dismissSelection(event);
    owner.addEventListener("pointerdown", handlePointer);
    return () => owner.removeEventListener("pointerdown", handlePointer);
  }, [selectedId]);

  function updateEdges() {
    const track = toolbar.current;
    if (!track) return;
    const offset = Math.abs(track.scrollLeft);
    track.toggleAttribute("data-scroll-start", offset > 2);
    track.toggleAttribute("data-scroll-end", track.scrollWidth - track.clientWidth - offset > 2);
  }

  function updateScroll() {
    const viewport = log.current;
    if (!viewport) return;
    const distance = viewport.scrollHeight - viewport.clientHeight - viewport.scrollTop;
    const atBottom = distance <= 32;
    if (atBottom || pinned.current) setReadThrough(latestMessage.current);
    pinned.current = atBottom;
    viewport.toggleAttribute("data-backlog", !pinned.current);
    viewport.toggleAttribute("data-scrolled", viewport.scrollTop > 2);
    viewport.toggleAttribute("data-scroll-below", distance > 2);
  }

  useLayoutEffect(() => {
    const track = toolbar.current;
    if (!track) return;
    updateEdges();
    const observer = new ResizeObserver(updateEdges);
    observer.observe(track);
    if (track.firstElementChild) observer.observe(track.firstElementChild);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const viewport = log.current;
    const content = logContent.current;
    if (!viewport || !content) return;
    const observer = new ResizeObserver(() => {
      if (live && pinned.current && !selectedDetails.current) viewport.scrollTop = viewport.scrollHeight;
      updateScroll();
    });
    observer.observe(viewport);
    observer.observe(content);
    return () => observer.disconnect();
  }, [live]);

  useLayoutEffect(() => {
    latestMessage.current = messages.at(-1)?.id ?? null;
    for (const message of messages) {
      if (seen.current.has(message.id)) continue;
      messageButtons.current.get(message.id)?.closest("article")?.animate([
        { opacity: 0, transform: "translateY(5px)" }, { opacity: 1, transform: "none" },
      ], { duration: collaborationDefaults.enter, easing: collaborationDefaults.ease });
    }
    // Keep IDs stable when a typing message is replaced or the filter changes.
    seen.current = new Set(messages.map(message => message.id));
    if (live && pinned.current && !selectedDetails.current && log.current) log.current.scrollTop = log.current.scrollHeight;
  }, [live, messages]);

  useLayoutEffect(() => {
    const viewport = log.current;
    const panel = selectedDetails.current;
    const card = panel?.previousElementSibling;
    if (!selectedId || !viewport || !panel || !card) return;

    const fitDetails = () => {
      if (!panel.offsetHeight) return;
      const bounds = viewport.getBoundingClientRect();
      const anchor = card.getBoundingClientRect();
      const bottom = anchor.bottom + panel.offsetHeight + 2;
      const overflow = bottom - bounds.bottom + 12;
      if (overflow > 0) viewport.scrollTop += overflow;
    };

    fitDetails();
    const observer = new ResizeObserver(fitDetails);
    observer.observe(panel);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [selectedId, filter]);

  function jumpTo(messageId: string) {
    const target = messageButtons.current.get(messageId);
    if (target) highlightMessage(target);
  }

  function startReply(message: StreamMessage) {
    setReplyId(message.id);
    input.current?.focus();
  }

  const file = preview?.file;
  const fileMessage = preview?.message;
  const fileAuthor = fileMessage ? agentMap.get(fileMessage.from) : undefined;
  const fileKind = file ? attachmentKind(file) : "file";
  return <section ref={root} aria-label={task ? `${title}: ${task}` : title} className={cn("kalos-collaboration-stream", className)} data-composer={onSend ? "" : undefined}
    style={{ "--kcs-height": `${height}px` } as CSSProperties} onKeyDown={event => {
      if (event.key !== "Escape" || event.defaultPrevented || preview?.open || event.nativeEvent.isComposing) return;
      if (selectedId) select(null);
      else if (filter) { changeFilter(null); tabButtons.current.get(null)?.focus(); }
      else return;
      event.preventDefault();
      event.stopPropagation();
    }}>
    <style href={collaborationStyleHref} precedence="kalos">{collaborationCss}</style>
    <header className="kcs-toolbar">
      <div ref={toolbar} className="kcs-tab-track" onScroll={updateEdges}>
        <div role="toolbar" aria-label="Focus messages by participant" className="kcs-tabs">
          {tabIds.map((tabId, index) => <KalosButton key={tabId ?? "all"} ref={node => {
            if (node) tabButtons.current.set(tabId, node);
            else tabButtons.current.delete(tabId);
          }} type="button" variant="ghost" size="sm" aria-pressed={filter === tabId} tabIndex={tabIndexId === tabId ? 0 : -1}
            onFocus={() => setActiveTab(tabId)} onClick={() => {
              if (selectedId !== null) select(null);
              changeFilter(tabId === filter ? null : tabId);
            }} onKeyDown={event => {
              const next = focusIndex(event, index, tabIds.length, "horizontal");
              if (next < 0) return;
              event.preventDefault();
              tabButtons.current.get(tabIds[next])?.focus();
            }}>
            {tabId === "you" ? <AgentMark index={-1} /> : tabId ? agentMap.get(tabId)?.mark : null}{tabId ? label(tabId) : "Everyone"}
          </KalosButton>)}
        </div>
      </div>
      {live ? <span className="kcs-live">Live</span> : null}
    </header>
    <div className="kcs-log-frame">
      <div ref={log} className="kcs-log" role="log" aria-label={title} aria-live={live ? "polite" : "off"} aria-relevant="additions text" onScroll={updateScroll}>
        <div ref={logContent} className="kcs-log-content">
        {messages.length ? null : <p className="kcs-empty">No messages</p>}
        {messages.map((message, index) => {
          const agent = agentMap.get(message.from);
          const sender = label(message.from);
          const to = recipients(message);
          const target = to.map(label).join(", ");
          const own = message.from === "you";
          const spawn = message.kind === "spawn";
          const needsYou = message.kind === "question" && to.includes("you") && !answered.has(message.id);
          const isSelected = selectedId === message.id;
          const details = message.details?.facts?.length || message.details?.items?.length ? message.details : undefined;
          const muted = selectedId !== null ? !isSelected : filter !== null && message.from !== filter && !to.includes(filter);
          const context = message.replyTo && messages[index - 1]?.id !== message.replyTo ? messageMap.get(message.replyTo) : undefined;
          const detailsId = `${id}-message-${index}`;
          const actionsTabIndex = activeId === message.id ? 0 : -1;
          const status = message.typing ? "Writing…" : "";
          const recipient = <span className="kcs-recipient"><span className="kcs-recipient-prefix" aria-hidden="true">to</span>{to.map((entry, recipientIndex) => <span key={recipientIndex}>
            {entry === "you" ? <AgentMark index={-1} /> : agentMap.get(entry)?.mark}{label(entry)}
          </span>)}</span>;
          const pickMessage = <button ref={node => {
            if (node) messageButtons.current.set(message.id, node);
            else messageButtons.current.delete(message.id);
          }} type="button" className="kcs-message-pick" tabIndex={actionsTabIndex} aria-pressed={isSelected} aria-expanded={details ? isSelected : undefined} aria-controls={details ? detailsId : undefined}
            aria-label={spawn ? `${sender} started ${target}${message.text ? `. ${message.text}` : ""}` : `${sender} to ${target}${message.at ? `, ${message.at}` : ""}${needsYou ? ", Needs you" : ""}${message.kind === "handoff" ? ", Handoff" : ""}: ${message.text || status}`}
            onClick={() => select(isSelected ? null : message.id)} onKeyDown={event => {
              const next = focusIndex(event, index, messages.length, "vertical");
              if (next < 0) return;
              event.preventDefault();
              messageButtons.current.get(messages[next].id)?.focus();
            }}>
            {spawn ? <span className="kcs-spawn">{sender} started <strong>{target}</strong></span> : <span className="kcs-message-meta">
              <strong>{sender}</strong>
              {needsYou ? <span className="kcs-tag" data-kind="question">Needs you</span> : message.kind === "handoff" ? <span className="kcs-tag">Handoff</span> : null}
            </span>}
          </button>;
          return <article key={message.id} className="kcs-row" data-own={own || undefined} data-spawn={spawn || undefined} data-writing={message.typing || undefined}
            data-selected={isSelected || undefined} data-muted={muted || undefined} data-tone={agent ? tones[agent.index % tones.length] : "neutral"} data-needs-you={needsYou || undefined} onFocusCapture={() => setActiveMessage(message.id)}>
            {!spawn && !own ? <AgentMark agent={agent} index={agent?.index ?? -1} /> : null}
            {spawn && !details && !message.attachments?.length ? pickMessage : <Collapsible.Root className="kcs-message-stack" open={isSelected}>
              <div className="kcs-message" onClick={event => {
                if (!(event.target instanceof Element) || event.target.closest("button, a") || window.getSelection()?.isCollapsed === false) return;
                messageButtons.current.get(message.id)?.focus({ preventScroll: true });
                select(isSelected ? null : message.id);
              }}>
                <div className="kcs-message-head">
                  {pickMessage}
                  {onSend && needsYou ? <button type="button" tabIndex={actionsTabIndex} className="kcs-reply" aria-label={`Reply to ${sender}${message.at ? ` at ${message.at}` : ""}`} onClick={() => startReply(message)}>Reply</button> : null}
                  {!spawn && message.at ? <span className="kcs-time" aria-hidden="true">{message.at}</span> : null}
                </div>
                {context ? <button type="button" className="kcs-quote" tabIndex={actionsTabIndex} aria-label={`Jump to ${label(context.from)}’s message: ${context.text}`} onClick={() => jumpTo(context.id)}>
                  {recipient}<span className="kcs-quote-excerpt kcs-truncate">{context.text}</span>
                </button> : !spawn ? recipient : null}
                {!spawn && (message.text || message.typing) ? <div className="kcs-copy" aria-hidden="true">
                  {message.text ? <span className="kcs-text">{showText(message.text)}</span> : null}
                  {message.typing ? <span className="kcs-writing">{status}</span> : null}
                </div> : null}
                {message.attachments?.length ? <div className="kcs-files">
                  {message.attachments.map((attachment, attachmentIndex) => (
                    <KalosButton key={`${attachmentIndex}:${attachment.label}`} type="button" size="xs" variant="ghost" tabIndex={actionsTabIndex} className="kcs-file" aria-haspopup="dialog" aria-label={`Preview ${attachment.label}`} onClick={event => {
                      returnTo.current = event.currentTarget;
                      setPreview({ file: attachment, message, open: true });
                    }}><AttachmentIcon kind={attachmentKind(attachment)} /><span className="kcs-truncate">{attachment.label}</span></KalosButton>
                  ))}
                </div> : null}
              </div>
              {details ? <Collapsible.Panel ref={isSelected ? selectedDetails : undefined} id={detailsId} className="kcs-detail-panel" keepMounted inert={!isSelected}>
                <MessageDetails details={details} />
              </Collapsible.Panel> : null}
            </Collapsible.Root>}
          </article>;
        })}
        </div>
      </div>
      {live ? <KalosButton variant="outline" size="sm" type="button" aria-label={unread ? `Jump to latest, ${unread} new messages` : "Jump to latest"} className="kcs-latest" onClick={() => {
        pinned.current = true;
        messageButtons.current.get(messages.at(-1)?.id ?? "")?.focus({ preventScroll: true });
        setReadThrough(latestMessage.current);
        if (log.current) log.current.scrollTo({ top: log.current.scrollHeight, behavior: "smooth" });
      }}><span>{unread ? `${unread} new` : "Latest"}</span><ArrowDown aria-hidden="true" /></KalosButton> : null}
    </div>
    {onSend ? <CollaborationComposer agents={marked} input={input} placeholder={placeholder} onCancelReply={() => setReplyId(null)} onSend={onSend}
      reply={replying ? { id: replying.id, name: label(replying.from), text: replying.text, to: replying.from === "you" ? recipients(replying).length ? recipients(replying) : everyone : [replying.from] } : undefined} /> : null}
    <Dialog.Root open={preview?.open ?? false} onOpenChange={open => { if (!open) setPreview(current => current ? { ...current, open } : current); }}>
      {file && fileMessage ? <Dialog.Portal container={root}>
        <Dialog.Backdrop className="kcs-preview-backdrop" />
        <Dialog.Popup ref={popup} className="kcs-preview" initialFocus={popup} finalFocus={() => returnTo.current?.isConnected ? returnTo.current : tabButtons.current.get(filter)}>
          <div className="kcs-preview-head">
            <span className="kcs-preview-icon"><AttachmentIcon kind={fileKind} /></span>
            <div className="kcs-preview-heading">
              <Dialog.Title>{file.label}</Dialog.Title>
              <Dialog.Description className="kcs-preview-meta" render={<div />}>
                {fileMessage.from === "you" ? <AgentMark index={-1} /> : fileAuthor?.mark}
                <span>{label(fileMessage.from)}{fileMessage.at ? ` · ${fileMessage.at}` : ""}{file.meta == null ? null : <> · {file.meta}</>}</span>
              </Dialog.Description>
            </div>
            <Dialog.Close render={<KalosButton variant="ghost" size="icon-sm" aria-label="Close preview" />}><X aria-hidden="true" /></Dialog.Close>
          </div>
          <div className="kcs-preview-body"><AttachmentPreview file={file} kind={fileKind} /></div>
        </Dialog.Popup>
      </Dialog.Portal> : null}
    </Dialog.Root>
  </section>;
}

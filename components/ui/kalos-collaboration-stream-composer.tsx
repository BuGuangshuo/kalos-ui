"use client";

import { ArrowUp } from "lucide-react";
import { useId, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode, type RefObject } from "react";
import { Textarea } from "@/components/ui/textarea";
import { KalosButton } from "@/registry/kalos/kalos-button";
import type { StreamAgent, StreamSend } from "./kalos-collaboration-stream-types";

type ComposerAgent = StreamAgent & { mark: ReactNode };
type Mention = { start: number; end: number; query: string };
type Reply = { id: string; name: string; text: string; to: readonly string[] };

function mentionAt(text: string, caret: number): Mention | null {
  const match = /(?:^|\s)@([^\s@]*)$/u.exec(text.slice(0, caret));
  if (!match) return null;
  return { start: caret - match[1].length - 1, end: caret, query: match[1] };
}

function aliasesFor(agents: readonly ComposerAgent[]) {
  const ids = new Map<string, string>();
  for (const agent of agents) {
    ids.set(agent.id.toLowerCase(), agent.id);
    if (!ids.has(agent.name.toLowerCase())) ids.set(agent.name.toLowerCase(), agent.id);
  }
  const names = [...ids.keys()].filter(Boolean).sort((a, b) => b.length - a.length);
  const regex = names.length ? new RegExp(`(?:^|[^\\p{L}\\p{N}_@])@(${names.map(name => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})(?![\\p{L}\\p{N}_-])`, "giu") : null;
  return { ids, regex };
}

export function CollaborationComposer({ agents, input, reply, onCancelReply, onSend, placeholder }: {
  agents: readonly ComposerAgent[];
  input: RefObject<HTMLTextAreaElement | null>;
  reply: Reply | undefined;
  onCancelReply: () => void;
  onSend: (message: StreamSend) => void;
  placeholder: string;
}) {
  const listId = useId();
  const [draft, setDraft] = useState("");
  const [mention, setMention] = useState<Mention | null>(null);
  const [active, setActive] = useState(0);
  const pendingCaret = useRef<number>(null);
  const list = useRef<HTMLUListElement>(null);
  const aliases = useMemo(() => aliasesFor(agents), [agents]);
  const mentioned = aliases.regex ? [...new Set(Array.from(draft.matchAll(aliases.regex), match => aliases.ids.get(match[1].toLowerCase())!))] : [];
  const destinations = mentioned.length ? mentioned : reply?.to ?? ["all"];
  const replyAgent = reply ? agents.find(agent => agent.id === reply.to[0]) : undefined;
  const query = mention?.query.toLowerCase();
  const choices = query ? agents.filter(agent => agent.name.toLowerCase().includes(query) || agent.id.toLowerCase().includes(query)) : agents;
  const option = Math.min(active, choices.length - 1);
  const open = mention !== null && agents.length > 0;

  useLayoutEffect(() => {
    if (pendingCaret.current === null || !input.current) return;
    input.current.focus();
    input.current.setSelectionRange(pendingCaret.current, pendingCaret.current);
    pendingCaret.current = null;
  }, [draft, input]);

  useLayoutEffect(() => {
    if (!open || option < 0) return;
    const box = list.current;
    const item = box?.children[option] as HTMLElement | undefined;
    if (!box || !item) return;
    if (item.offsetTop < box.scrollTop) box.scrollTop = item.offsetTop;
    if (item.offsetTop + item.offsetHeight > box.scrollTop + box.clientHeight) box.scrollTop = item.offsetTop + item.offsetHeight - box.clientHeight;
  }, [open, option]);

  function choose(agent: ComposerAgent) {
    if (!mention) return;
    const before = draft.slice(0, mention.start);
    const after = draft.slice(mention.end);
    const token = `${before && !/\s$/.test(before) ? " " : ""}@${agent.name}${/^\s/.test(after) ? "" : " "}`;
    pendingCaret.current = before.length + token.length;
    setDraft(before + token + after);
    setMention(null);
  }

  function send() {
    const text = draft.trim();
    if (!text) return;
    onSend({ text, to: [...destinations], ...(reply ? { replyTo: reply.id } : {}) });
    setDraft("");
    setMention(null);
    onCancelReply();
    input.current?.focus();
  }

  function handleKey(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.nativeEvent.isComposing) return;
    if (event.key === "Escape" && (open || reply)) {
      event.preventDefault();
      event.stopPropagation();
      if (open) setMention(null);
      else onCancelReply();
      return;
    }
    if (open && (event.key === "ArrowDown" || event.key === "ArrowUp") && choices.length) {
      event.preventDefault();
      setActive((option + (event.key === "ArrowDown" ? 1 : -1) + choices.length) % choices.length);
      return;
    }
    if (open && !event.shiftKey && (event.key === "Enter" || event.key === "Tab" && option >= 0)) {
      event.preventDefault();
      if (option >= 0) choose(choices[option]);
      else setMention(null);
      return;
    }
    if (event.key === "Enter" && !event.shiftKey && !event.altKey && !event.metaKey && !event.ctrlKey) {
      event.preventDefault();
      send();
    }
  }

  return <form className="kcs-compose" onSubmit={event => { event.preventDefault(); send(); }} onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget)) setMention(null);
  }}>
    {reply ? <div className="kcs-compose-reply">
      <div className="kcs-compose-reply-recipient">
        <span>to</span>{replyAgent?.mark}<strong className="kcs-truncate">{reply.name}</strong>
        <button className="kcs-compose-cancel" type="button" aria-label="Cancel reply" onClick={() => { onCancelReply(); input.current?.focus(); }}><span aria-hidden="true">×</span></button>
      </div>
      <span className="kcs-compose-reply-excerpt kcs-truncate">{reply.text}</span>
    </div> : null}
    <div className="kcs-compose-fields">
      {agents.length ? <KalosButton className="kcs-mention-trigger" variant="ghost" size="icon-sm" type="button" aria-label="Name an agent" aria-expanded={open} aria-controls={open ? listId : undefined} onClick={() => {
        const caret = input.current?.selectionStart ?? draft.length;
        setMention(open ? null : mentionAt(draft, caret) ?? { start: caret, end: caret, query: "" });
        setActive(0);
        input.current?.focus();
      }}>@</KalosButton> : null}
      <div className="kcs-compose-input" role="combobox" aria-label="Agent suggestions" aria-haspopup="listbox" aria-expanded={open} aria-controls={open ? listId : undefined}>
        <Textarea ref={input} aria-label="Message the agents" rows={2} placeholder={reply ? `回复 ${reply.name}…` : placeholder} value={draft} aria-autocomplete="list" aria-controls={open ? listId : undefined} aria-activedescendant={open && option >= 0 ? `${listId}-${option}` : undefined} onChange={event => {
          setDraft(event.target.value);
          setMention(mentionAt(event.target.value, event.target.selectionStart));
          setActive(0);
        }} onClick={event => {
          if (!open) return;
          setMention(mentionAt(draft, event.currentTarget.selectionStart));
          setActive(0);
        }} onKeyDown={handleKey} />
      </div>
      <div className="kcs-compose-target" aria-live="polite">
        {destinations.length === 1 && destinations[0] === "all" ? "to everyone" : <>
          <span>to</span>
          {destinations.map((id, index) => {
            const agent = agents.find(candidate => candidate.id === id);
            return <span key={`${id}:${index}`} className="kcs-compose-agent">{agent?.mark}<span>{id === "all" ? "everyone" : agent?.name ?? id}{index < destinations.length - 1 ? "," : ""}</span></span>;
          })}
        </>}
      </div>
      <KalosButton size="icon-sm" type="submit" aria-label="Send message" disabled={!draft.trim()}><ArrowUp aria-hidden="true" /></KalosButton>
    </div>
    {open ? <div className="kcs-mention-panel">
      <ul ref={list} id={listId} role="listbox" aria-label="Agents" className="kcs-mention-list">
        {choices.map((agent, index) => <li key={agent.id} id={`${listId}-${index}`} role="option" aria-selected={index === option} onPointerMove={() => setActive(index)} onMouseDown={event => event.preventDefault()} onClick={() => choose(agent)}>
          {agent.mark}<span className="kcs-truncate">{agent.name}</span>{agent.model ? <small className="kcs-truncate">{agent.model}</small> : null}
        </li>)}
      </ul>
      {!choices.length ? <div role="status" className="kcs-mention-empty">No matching agents</div> : null}
    </div> : null}
  </form>;
}

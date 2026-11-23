import type { ReactNode } from "react";

export type StreamAgent = { id: string; name: string; model?: string; avatar?: ReactNode };
export type StreamAttachment = {
  label: string;
  kind?: "file" | "folder" | "table" | "link" | "tool" | "image";
  preview?: ReactNode;
  meta?: ReactNode;
};
export type StreamFact = { label: string; value: ReactNode };
export type StreamItem = { label: string; detail?: ReactNode; icon?: ReactNode };
export type StreamDetails = { facts?: readonly StreamFact[]; items?: readonly StreamItem[] };
export type StreamMessage = {
  id: string;
  from: string;
  to: string | readonly string[];
  kind: "ask" | "reply" | "handoff" | "share" | "question" | "spawn";
  text: string;
  at?: string;
  replyTo?: string;
  typing?: boolean;
  attachments?: readonly StreamAttachment[];
  details?: StreamDetails;
};
export type StreamSend = { text: string; to: string[]; replyTo?: string };

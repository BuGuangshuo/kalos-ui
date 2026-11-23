export type ResponseBend = { at: number; text?: string };

type TextPart = { kind: "text"; start: number; text: string };
type CodePart = { kind: "code"; start: number; text: string; language?: string };
type BendPart = { kind: "bend"; start: number; text?: string; index: number };

const wordStart = /[\p{Script=Latin}\p{N}_]/u;
const wordTail = /[\p{Script=Latin}\p{N}\p{M}_'’-]/u;
const wordContinuation = /[\p{Script=Latin}\p{N}\p{M}_'’.\-]/u;

export function responseTextEnd(text: string, incomplete: boolean) {
  if (!incomplete) return text.length;
  const line = text.lastIndexOf("\n") + 1;
  if (/^ {0,3}\x60{1,}[^\r\x60]*$/u.test(text.slice(line))) return line;

  if (/[\uD800-\uDBFF]$/.test(text)) return text.length - 1;
  const end = text.length;
  if (!wordTail.test(text.charAt(end - 1))) return end;

  let start = end - 1;
  while (start > line && wordContinuation.test(text.charAt(start - 1))) start--;
  while (start < end && !wordStart.test(text.charAt(start))) start++;
  return start;
}

export function parseResponseText(source: string, bends: readonly ResponseBend[]) {
  const parts: (TextPart | CodePart | BendPart)[] = [];
  const markers = bends
    .map((bend, index) => ({ ...bend, index }))
    .filter(bend => Number.isInteger(bend.at) && bend.at >= 0 && bend.at <= source.length)
    .sort((a, b) => a.at - b.at);
  let marker = 0;

  function append(start: number, end: number, kind: "text" | "code", language?: string) {
    function content(from: number, to: number) {
      const value = source.slice(from, to);
      if (kind === "code") {
        if (value || from === start && start === end) parts.push({ kind, start: from, text: value.replace(/\r?\n$/, ""), language });
        return;
      }
      const paragraphs = /[^\n\r]*(?:\r?\n(?![\t ]*\r?\n)[^\n\r]*)*/g;
      for (const match of value.matchAll(paragraphs)) {
        const trimmed = match[0].trim();
        if (trimmed) parts.push({ kind, start: from + match.index + match[0].indexOf(trimmed), text: trimmed });
      }
    }

    let from = start;
    while (marker < markers.length && markers[marker].at <= end) {
      const { at, index, text } = markers[marker++];
      const offset = Math.max(from, at);
      if (offset > from) content(from, offset);
      parts.push({ kind: "bend", start: at, index, text });
      from = offset;
    }
    if (from < end || kind === "code" && start === end) content(from, end);
  }

  const fence = /^ {0,3}(\x60{3,})[ \t]*([^\r\n\x60]*)\r?\n/gm;
  let offset = 0;
  for (let opening = fence.exec(source); opening; opening = fence.exec(source)) {
    append(offset, opening.index, "text");
    const close = new RegExp(`^ {0,3}\\x60{${opening[1].length},}[ \\t]*(?:\\r?\\n|$)`, "gm");
    close.lastIndex = fence.lastIndex;
    const closing = close.exec(source);
    append(fence.lastIndex, closing?.index ?? source.length, "code", opening[2].trim() || undefined);
    offset = closing ? close.lastIndex : source.length;
    fence.lastIndex = offset;
  }
  append(offset, source.length, "text");
  return parts;
}

export function completeResponseSentences(text: string) {
  let end = 0;
  for (const match of text.matchAll(/[。！？!?]+[”’"'）)]*|\.+[”’"'）)]*(?=\s|$)/gu)) {
    end = match.index + match[0].length;
  }
  return text.slice(0, end);
}

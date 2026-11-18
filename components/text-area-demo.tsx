"use client";

import { useState } from "react";
import { KalosTextArea } from "@/registry/kalos/kalos-text-area";
import { FieldGroup } from "@/components/ui/field";
import { controlStyles } from "@/components/ui/kalos-styles";
import { textAreaContext, textAreaLongContent, type TextAreaExampleVariant } from "@/lib/text-area-examples";

export function TextAreaDemo({ compact, variant = "default" }: { compact?: boolean; variant?: TextAreaExampleVariant }) {
  const [context, setContext] = useState(textAreaContext);
  const [note, setNote] = useState("");
  const [result, setResult] = useState("");
  if (variant === "states") return <FieldGroup className="demo-form">
    <KalosTextArea label="文档摘要" defaultValue="此文档暂不可编辑。" disabled minRows={2} />
    <KalosTextArea label="归档说明" defaultValue="设计规范已归档，可复制内容。" readOnly minRows={2} />
    <KalosTextArea label="修改原因" value={note} onChange={event => setNote(event.target.value)} required minRows={2} error={note.trim() ? undefined : "请填写修改原因"} />
  </FieldGroup>;
  if (variant === "max-height") return <FieldGroup className="demo-form">
    <KalosTextArea label="文档内容" defaultValue={textAreaLongContent} minRows={3} maxRows={8} hint="最高 8 行，超出内容可滚动。" />
  </FieldGroup>;
  return <FieldGroup className={controlStyles.textAreaDemo}>
    <KalosTextArea label="文档说明" value={context} onChange={event => setContext(event.target.value)} placeholder="请输入文档说明" maxLength={2000} counter minRows={3} maxRows={8} />
    {!compact ? <>
      <KalosTextArea label="审阅备注" value={note} onChange={event => { setNote(event.target.value); setResult(""); }} optional placeholder="有哪些内容需要重点查看？" minRows={2} maxRows={5} hint="⌘ / Ctrl + Enter 发送" onSubmitShortcut={text => setResult(text.trim() ? "备注已发送" : "请输入备注内容")} />
      {result ? <output role="status" className="text-xs leading-[18px] text-muted-foreground">{result}</output> : null}
    </> : null}
  </FieldGroup>;
}

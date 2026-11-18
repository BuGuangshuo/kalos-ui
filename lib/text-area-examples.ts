export const textAreaContext = "这份文档整理了组件的排版、图标与交互规范。\n审阅时请重点检查字段标签、错误反馈与键盘操作。\n修改意见请填写在下方备注中。";

export const textAreaLongContent = "文档修订记录\n一、排版规范\n统一正文与字段标签的字号。\n二、图标规范\n图标与文字首行垂直居中。\n三、表单状态\n补充必填、禁用与错误反馈。\n四、交互检查\n核对焦点顺序与快捷键。\n五、发布准备\n整理变更记录与使用示例。";

export const textAreaExampleVariants = [
  { variant: "states", title: "禁用、只读与错误" },
  { variant: "max-height", title: "最大高度" },
] as const;
export type TextAreaExampleVariant = "default" | typeof textAreaExampleVariants[number]["variant"];

export function textAreaExample(variant: TextAreaExampleVariant = "default") {
  if (variant === "states") return `"use client";

import { useState } from "react";
import { FieldGroup } from "@/components/ui/field";
import { KalosTextArea } from "@/components/ui/kalos-text-area";

export default function Example() {
  const [reason, setReason] = useState("");
  return <FieldGroup>
    <KalosTextArea label="文档摘要" defaultValue="此文档暂不可编辑。" disabled minRows={2} />
    <KalosTextArea label="归档说明" defaultValue="设计规范已归档，可复制内容。" readOnly minRows={2} />
    <KalosTextArea label="修改原因" value={reason} onChange={event => setReason(event.target.value)} required minRows={2} error={reason.trim() ? undefined : "请填写修改原因"} />
  </FieldGroup>;
}`;
  if (variant === "max-height") return `import { KalosTextArea } from "@/components/ui/kalos-text-area";

export default function Example() {
  return <KalosTextArea
    label="文档内容"
    defaultValue={${JSON.stringify(textAreaLongContent)}}
    minRows={3}
    maxRows={8}
    hint="最高 8 行，超出内容可滚动。"
  />;
}`;
  return `"use client";

import { useState } from "react";
import { FieldGroup } from "@/components/ui/field";
import { KalosTextArea } from "@/components/ui/kalos-text-area";

export default function Example() {
  const [context, setContext] = useState(${JSON.stringify(textAreaContext)});
  const [note, setNote] = useState("");
  const [result, setResult] = useState("");

  return <FieldGroup className="w-full max-w-[400px] rounded-xl bg-card p-5">
    <KalosTextArea
      label="文档说明"
      value={context}
      onChange={event => setContext(event.target.value)}
      placeholder="请输入文档说明"
      maxLength={2000}
      counter
      minRows={3}
      maxRows={8}
    />
    <KalosTextArea
      label="审阅备注"
      value={note}
      onChange={event => { setNote(event.target.value); setResult(""); }}
      optional
      placeholder="有哪些内容需要重点查看？"
      minRows={2}
      maxRows={5}
      hint="⌘ / Ctrl + Enter 发送"
      onSubmitShortcut={text => setResult(text.trim() ? "备注已发送" : "请输入备注内容")}
    />
    {result ? <output role="status">{result}</output> : null}
  </FieldGroup>;
}`;
}

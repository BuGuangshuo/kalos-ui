export type NumberInputExampleVariant = "default" | "states" | "locale" | "form";

export const numberInputExampleVariants = [
  { variant: "states", title: "字段状态" },
  { variant: "locale", title: "数字格式" },
  { variant: "form", title: "表单提交" },
] as const;

export function numberInputExample(variant: NumberInputExampleVariant) {
  const imports = `"use client";

import { KalosNumberInput } from "@/components/ui/kalos-number-input";`;
  if (variant === "states") return `${imports}

export default function Example() {
  return <div className="flex flex-col gap-4">
    <KalosNumberInput label="下载次数" defaultValue={10} disabled />
    <KalosNumberInput label="已用容量" defaultValue={128} unit="MB" readOnly />
    <KalosNumberInput label="文件数量" required min={1} max={20} error="请输入 1–20 之间的数量" />
  </div>;
}`;
  if (variant === "locale") return `${imports}

export default function Example() {
  return <div className="flex flex-col gap-4">
    <KalosNumberInput label="文件大小" defaultValue={1234.5} min={0} step={0.5} unit="MB" locale="de-DE" />
    <KalosNumberInput label="打印费用" defaultValue={25} min={0} step={0.5} locale="zh-CN" formatOptions={{ style: "currency", currency: "CNY" }} />
  </div>;
}`;
  return `"use client";

import { useState } from "react";
import { KalosNumberInput } from "@/components/ui/kalos-number-input";
import { KalosButton } from "@/components/ui/kalos-button";

export default function Example() {
  const [files, setFiles] = useState<number | null>(3);
  const [result, setResult] = useState<string | null>(null);
  return <form className="flex flex-col gap-4" onSubmit={event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setResult(JSON.stringify(Object.fromEntries(data)));
  }} onReset={() => { setFiles(3); setResult(null); }}>
    <KalosNumberInput label="文件数量" name="files" value={files} onValueChange={setFiles} min={1} max={20} required />
    <KalosNumberInput label="打印费用" name="cost" defaultValue={25} min={0} step={0.5} prefix="¥" formatOptions={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }} />
    <div className="flex gap-3">
      <KalosButton type="submit">提交</KalosButton>
      <KalosButton type="reset" variant="outline">重置</KalosButton>
    </div>
    {result ? <output className="text-xs text-muted-foreground">{result}</output> : null}
  </form>;
}`;
}

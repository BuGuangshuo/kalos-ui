"use client";

import { useState, type ComponentType } from "react";
import type { KalosNumberInputProps } from "@/components/ui/kalos-number-input-model";
import type { NumberInputExampleVariant } from "@/lib/number-input-examples";
import type { DemoComponents } from "@/components/demo-content";

export function NumberInputDemo({ Control, KalosButton, variant = "default", compact }: { Control: ComponentType<KalosNumberInputProps>; KalosButton: DemoComponents["KalosButton"]; variant?: NumberInputExampleVariant; compact?: boolean }) {
  const [files, setFiles] = useState<number | null>(3);
  const [result, setResult] = useState<string | null>(null);
  if (variant === "states") return <div className="demo-form">
    <Control label="下载次数" defaultValue={10} disabled />
    <Control label="已用容量" defaultValue={128} unit="MB" readOnly />
    <Control label="文件数量" required min={1} max={20} error="请输入 1–20 之间的数量" />
  </div>;
  if (variant === "locale") return <div className="demo-form">
    <Control label="文件大小" defaultValue={1234.5} min={0} step={0.5} unit="MB" locale="de-DE" />
    <Control label="打印费用" defaultValue={25} min={0} step={0.5} locale="zh-CN" formatOptions={{ style: "currency", currency: "CNY" }} />
  </div>;
  if (variant === "form") return <form className="demo-form" onSubmit={event => {
    event.preventDefault();
    setResult(JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))));
  }} onReset={() => { setFiles(3); setResult(null); }}>
    <Control label="文件数量" name="files" value={files} onValueChange={setFiles} min={1} max={20} required />
    <Control label="打印费用" name="cost" defaultValue={25} min={0} step={0.5} prefix="¥" formatOptions={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }} />
    <div className="flex gap-3"><KalosButton type="submit">提交</KalosButton><KalosButton type="reset" variant="outline">重置</KalosButton></div>
    {result ? <output className="text-xs text-muted-foreground">{result}</output> : null}
  </form>;
  return <div className="demo-form">
    <Control label="文件数量" name="files" defaultValue={3} min={1} max={20} />
    <Control label="上传限额" name="limit" defaultValue={250} min={10} max={1000} step={10} unit="MB" />
    {!compact ? <>
      <Control label="打印费用" name="cost" prefix="¥" defaultValue={25} min={0} max={100} step={0.5} formatOptions={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }} />
      <Control label="缩放比例" name="scale" defaultValue={0.75} min={0.1} max={2} step={0.05} formatOptions={{ style: "percent", maximumFractionDigits: 0 }} />
    </> : null}
  </div>;
}

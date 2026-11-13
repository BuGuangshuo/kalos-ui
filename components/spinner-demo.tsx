"use client";

import { useEffect, useState } from "react";
import { Check, RotateCw } from "lucide-react";
import { KalosButton } from "@/registry/kalos/kalos-button";
import { KalosCard } from "@/registry/kalos/kalos-card";
import { KalosSpinner } from "@/registry/kalos/kalos-spinner";
import { controlStyles } from "@/components/ui/kalos-styles";
import { loadingDemoSettings } from "@/components/loading-demo-styles";
import { cn } from "@/lib/utils";

const checks = [
  { name: "文件格式", duration: "12 秒" },
  { name: "安全扫描", duration: "8 秒" },
  { name: "权限验证", duration: "41 秒" },
  { name: "同步准备", duration: "1 分 04 秒" },
];

export function SpinnerDemo() {
  const [run, setRun] = useState(0);
  const [completed, setCompleted] = useState(0);
  const running = completed < checks.length;

  useEffect(() => {
    const timers = loadingDemoSettings.stages.map((delay, index) => setTimeout(() => setCompleted(index + 1), delay));
    timers.push(setTimeout(() => { setCompleted(0); setRun(value => value + 1); }, loadingDemoSettings.replayDelay));
    return () => timers.forEach(clearTimeout);
  }, [run]);

  return <div className={cn(controlStyles.loadingDemo, "spinner-demo")}>
    <KalosCard
      as="section"
      aria-label="文件检查"
      className="loading-demo-card spinner-demo-card"
      title={<span className="spinner-demo-title">文件检查 <span role="status" aria-label={`已完成 ${completed} 项，共 ${checks.length} 项`}>{completed}/{checks.length}</span></span>}
      action={<KalosButton className="spinner-demo-action" variant="outline" disabled={running} onClick={() => { setCompleted(0); setRun(value => value + 1); }}>
        {running ? <KalosSpinner data-icon="inline-start" /> : <RotateCw data-icon="inline-start" />}
        {running ? "Loading" : "Retry"}
      </KalosButton>}
    >
      <ul className="loading-demo-list">
        {checks.map((check, index) => <li key={check.name} className="spinner-demo-row" data-done={index < completed || undefined}>
          <span className="spinner-demo-icon">{index < completed ? <Check className="spinner-demo-check" aria-hidden="true" /> : <KalosSpinner />}</span>
          <span className="spinner-demo-name">{check.name}<span className="sr-only">：{index < completed ? "已通过" : "检查中"}</span></span>
          {index < completed ? <span className="spinner-demo-duration">{check.duration}</span> : null}
        </li>)}
      </ul>
    </KalosCard>
    <div className="spinner-demo-sizes" role="group" aria-label="旋转图标尺寸">
      {[12, 14, 16, 20].map(size => <div key={size}><span className="spinner-demo-size-icon"><KalosSpinner size={size} /></span><span>{size}</span></div>)}
    </div>
  </div>;
}

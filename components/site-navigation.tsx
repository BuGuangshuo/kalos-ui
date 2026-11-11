"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

export function SiteNavigation({ onNavigate }: { onNavigate?: () => void }) {
  const path = usePathname();
  const comingSoon = () => {
    onNavigate?.();
    toast("正在建设中");
  };

  return <>
    <Link href="/" aria-current={path === "/" ? "page" : undefined} onClick={onNavigate}>首页</Link>
    <Link href="/docs/getting-started" aria-current={path.startsWith("/docs") ? "page" : undefined} onClick={onNavigate}>文档</Link>
    <Link href="/components" aria-current={path.startsWith("/components") ? "page" : undefined} onClick={onNavigate}>组件</Link>
    <button type="button" onClick={comingSoon}>模版</button>
  </>;
}

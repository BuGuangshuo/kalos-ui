"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useNavigationHighlight } from "@/components/navigation-highlight";
import { slidingHighlightClasses } from "@/components/ui/kalos-highlight";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", section: "/", label: "首页" },
  { href: "/docs/getting-started", section: "/docs", label: "文档" },
  { href: "/components", section: "/components", label: "组件" },
  { href: "/templates", section: "/templates", label: "模版" },
];

export function SiteNavigation({
  className,
  label = "主导航",
  onNavigate,
}: {
  className?: string;
  label?: string;
  onNavigate?: () => void;
}) {
  const path = usePathname();
  const { highlight, ...pointerHandlers } = useNavigationHighlight("[data-site-nav-item]");
  return (
    <nav
      ref={highlight}
      className={cn(slidingHighlightClasses, "navigation-highlight site-navigation", className)}
      aria-label={label}
      {...pointerHandlers}
    >
      {links.map(({ href, section, label }) => (
        <Link
          key={href}
          href={href}
          aria-current={path === section || path.startsWith(`${section}/`) ? "page" : undefined}
          data-site-nav-item=""
          onClick={onNavigate}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}

export function MobileNavTrigger({ open, onClick }: { open: boolean; onClick: () => void }) {
  return <Button variant="ghost" size="icon" className="mobile-menu" aria-label={open ? "关闭导航" : "打开导航"}
    aria-expanded={open} onClick={onClick}>{open ? <X /> : <Menu />}</Button>;
}

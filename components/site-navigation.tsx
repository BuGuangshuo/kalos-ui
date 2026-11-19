"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { useNavigationHighlight } from "@/components/navigation-highlight";
import { slidingHighlightClasses } from "@/components/ui/kalos-highlight";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", section: "/", label: "首页" },
  { href: "/docs/getting-started", section: "/docs", label: "文档" },
  { href: "/components", section: "/components", label: "组件" },
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
  const comingSoon = () => {
    onNavigate?.();
    toast("正在建设中");
  };

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
      <button
        type="button"
        data-site-nav-item=""
        onClick={comingSoon}
      >
        模版
      </button>
    </nav>
  );
}

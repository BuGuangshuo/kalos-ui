"use client";

import { LogIn, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { controlStyles } from "@/components/ui/kalos-styles";
import { cn } from "@/lib/utils";
import { KalosBreadcrumb } from "@/registry/kalos/kalos-breadcrumb";
import { KalosButton } from "@/registry/kalos/kalos-button";
import { KalosSegmentedControl, type KalosSegmentOption } from "@/registry/kalos/kalos-segmented-control";
import { useRef, type MouseEvent, type RefObject } from "react";
import { dashboardPages, type DashboardPageId } from "./navigation";
import { MotionMark } from "./navigation-icons";

export type DashboardPreviewMode = "data" | "loading" | "empty";

const previewModes: KalosSegmentOption<DashboardPreviewMode>[] = [
  { value: "data", label: "Data" },
  { value: "loading", label: "Loading" },
  { value: "empty", label: "Empty" },
];

const loginShape = "rounded-full @min-[360px]/dashboard:@max-[480px]/dashboard:size-8 @min-[360px]/dashboard:@max-[480px]/dashboard:p-0";
const loginLabel = <>
  <LogIn aria-hidden="true" className="hidden size-4 @min-[360px]/dashboard:@max-[480px]/dashboard:block" />
  <span className="@min-[360px]/dashboard:@max-[480px]/dashboard:sr-only">登录账号</span>
</>;

export function DashboardHeader({
  page,
  overviewHref,
  openOverview,
  previewMode,
  onPreviewModeChange,
  loginHref,
  onOpenMenu,
  menuId,
  menuOpen,
  menuTriggerRef,
}: {
  page: DashboardPageId;
  overviewHref: string;
  openOverview: (event: MouseEvent<HTMLElement>) => void;
  previewMode: DashboardPreviewMode;
  onPreviewModeChange: (mode: DashboardPreviewMode) => void;
  loginHref?: string;
  onOpenMenu: () => void;
  menuId: string;
  menuOpen: boolean;
  menuTriggerRef: RefObject<HTMLButtonElement | null>;
}) {
  const loginDialog = useRef<HTMLDivElement>(null);
  const title = dashboardPages.find((item) => item.id === page)?.label ?? "Dashboard";

  return (
    <header className="relative z-[15] flex h-[58px] min-w-0 shrink-0 items-center gap-2 border-b border-border bg-background px-4 py-2 @max-[520px]/dashboard:gap-1 @max-[520px]/dashboard:px-2 @max-[390px]/dashboard:gap-0.5 @max-[390px]/dashboard:px-1.5 @max-[360px]/dashboard:grid @max-[360px]/dashboard:h-auto @max-[360px]/dashboard:grid-cols-[auto_minmax(0,1fr)] @max-[360px]/dashboard:px-3 @max-[360px]/dashboard:py-1 @min-[640px]/dashboard:gap-5 @min-[640px]/dashboard:px-6">
      <h1 className="sr-only">{title}</h1>
      <button
        type="button"
        ref={menuTriggerRef}
        aria-label="工作台导航菜单"
        aria-controls={menuId}
        aria-expanded={menuOpen}
        onClick={onOpenMenu}
        className="inline-flex h-10 w-6 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-muted-foreground @max-[520px]/dashboard:h-8 @min-[1024px]/dashboard:hidden"
      >
        <Menu aria-hidden="true" className="h-5 w-[19px] stroke-[1.6]" />
      </button>
      <KalosBreadcrumb
        className="min-w-0 flex-1 @min-[360px]/dashboard:@max-[640px]/dashboard:[&_ol[data-tight]>li:first-child_.kalos-breadcrumb-label]:sr-only @min-[360px]/dashboard:@max-[640px]/dashboard:[&_.kalos-breadcrumb-separator]:min-w-3!"
        items={[
          { label: "工作台", href: overviewHref, onClick: openOverview, icon: <MotionMark /> },
          ...(page.startsWith("settings/") ? [{ label: "设置" }] : []),
          { label: title },
        ]}
      />
      <div className="ms-auto flex min-w-0 shrink-0 items-center gap-2 @max-[520px]/dashboard:gap-1 @max-[390px]/dashboard:gap-0.5 @max-[360px]/dashboard:col-span-full @max-[360px]/dashboard:max-w-full">
        <ThemeToggle aria-label="切换工作台主题" title="切换主题" />
        <KalosSegmentedControl
          aria-label="预览状态"
          options={previewModes}
          value={previewMode}
          onChange={onPreviewModeChange}
          variant="tray"
          size="md"
          className="@max-[520px]/dashboard:[--segment-padding-x:7px]! @min-[360px]/dashboard:@max-[390px]/dashboard:[--segment-padding-x:4px]!"
        />
        {loginHref ? (
          <a href={loginHref} title="登录账号" className={cn(buttonVariants(), controlStyles.button, controlStyles.buttonSolid, loginShape)}>
            {loginLabel}
          </a>
        ) : (
          <Dialog>
            <DialogTrigger render={<KalosButton title="登录账号" className={loginShape} />}>{loginLabel}</DialogTrigger>
            <DialogContent ref={loginDialog} initialFocus={loginDialog}>
              <DialogHeader className="gap-1 pe-8">
                <DialogTitle>登录账号</DialogTitle>
                <DialogDescription>当前为模板预览，尚未连接账号服务。</DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </header>
  );
}

"use client";

import type { ComponentProps, ReactNode } from "react";
import { X } from "lucide-react";
import { Drawer, DrawerTrigger, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from "@/components/ui/drawer";
import { KalosButton } from "./kalos-button";
import { KalosLoading, KalosSkeleton } from "./kalos-skeleton";
import { KalosSpinner } from "./kalos-spinner";

export type KalosDrawerProps = Omit<ComponentProps<typeof Drawer>, "children"> & {
  trigger: ReactNode;
  triggerProps?: { variant?: "outline" | "ghost"; size?: "default" | "icon"; "aria-label"?: string };
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  contentClassName?: string;
  initialFocus?: ComponentProps<typeof DrawerContent>["initialFocus"];
  showSwipeHandle?: boolean;
  loading?: boolean;
  loadingContent?: ReactNode;
  confirming?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
};

function DrawerSkeleton() {
  return <KalosLoading label="正在加载表单" className="flex flex-col gap-3.5">
    {Array.from({ length: 4 }, (_, index) => <div key={index} className="flex flex-col gap-1.5">
      <KalosSkeleton width={index % 2 ? 64 : 40} height={20} />
      <KalosSkeleton height={32} radius={7} />
    </div>)}
    <div className="flex items-center gap-3">
      <KalosSkeleton width={16} height={16} radius={4.5} />
      <KalosSkeleton width={80} height={20} />
    </div>
  </KalosLoading>;
}

export function KalosDrawer({
  trigger, triggerProps, title, description, children, footer,
  contentClassName, initialFocus, showSwipeHandle = true, loading = false, loadingContent,
  confirming = false, confirmLabel = "确定", cancelLabel = "取消", onConfirm,
  swipeDirection = "right", ...props
}: KalosDrawerProps) {
  return <Drawer {...props} swipeDirection={swipeDirection}>
    <DrawerTrigger render={<KalosButton {...triggerProps} variant={triggerProps?.variant ?? "outline"} />}>{trigger}</DrawerTrigger>
    <DrawerContent className={contentClassName} initialFocus={initialFocus} showSwipeHandle={showSwipeHandle} aria-busy={loading || confirming || undefined}>
      <DrawerHeader>
        <DrawerTitle data-slot="drawer-title">{title}</DrawerTitle>
        {description ? <DrawerDescription data-slot="drawer-description">{description}</DrawerDescription> : null}
        <DrawerClose render={<KalosButton variant="ghost" size="icon" aria-label="关闭" className="kalos-drawer-dismiss" />}>
          <X />
        </DrawerClose>
      </DrawerHeader>
      <div data-slot="drawer-body" className="kalos-drawer-body">
        {loading ? loadingContent ?? <DrawerSkeleton /> : children}
      </div>
      <DrawerFooter>
        {footer}
        <DrawerClose render={<KalosButton variant="outline" />}>{cancelLabel}</DrawerClose>
        {onConfirm ? <KalosButton onClick={onConfirm} disabled={loading || confirming} aria-busy={confirming || undefined}>
          {confirming ? <KalosSpinner data-icon="inline-start" /> : null}
          {confirmLabel}
        </KalosButton> : <DrawerClose render={<KalosButton disabled={loading || confirming} aria-busy={confirming || undefined} />}>
          {confirming ? <KalosSpinner data-icon="inline-start" /> : null}
          {confirmLabel}
        </DrawerClose>}
      </DrawerFooter>
    </DrawerContent>
  </Drawer>;
}

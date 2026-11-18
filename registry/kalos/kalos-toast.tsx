"use client";

import type { ReactNode } from "react";
import { Toast as ToastPrimitive } from "@base-ui/react/toast";
import { CheckIcon, Loader2Icon, XIcon } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { toastCss, toastDefaults } from "@/components/ui/kalos-toast-styles";

export const toast = ToastPrimitive.createToastManager();
export const createToastManager = ToastPrimitive.createToastManager;
export const useToastManager = ToastPrimitive.useToastManager;
export type KalosToasterProps = ToastPrimitive.Provider.Props;

export function KalosToastProvider({ timeout = toastDefaults.timeout, limit = toastDefaults.limit, ...props }: ToastPrimitive.Provider.Props) {
  return <ToastPrimitive.Provider timeout={timeout} limit={limit} {...props} />;
}

export function KalosToastPortal({ className, ...props }: ToastPrimitive.Portal.Props) {
  return <ToastPrimitive.Portal data-slot="toast-portal" className={state => cn("kalos-toast-portal", typeof className === "function" ? className(state) : className)} {...props} />;
}

export function KalosToastViewport({ className, ...props }: ToastPrimitive.Viewport.Props) {
  return <>
    <style href="kalos-toast" precedence="default">{toastCss}</style>
    <ToastPrimitive.Viewport data-slot="toast-viewport" aria-label="提示（按 F6 查看）" className={state => cn("kalos-toast-viewport", typeof className === "function" ? className(state) : className)} {...props} />
  </>;
}

export function KalosToast({ className, ...props }: ToastPrimitive.Root.Props) {
  return <ToastPrimitive.Root data-slot="toast" swipeDirection={["up", "right"]} className={state => cn("kalos-toast", typeof className === "function" ? className(state) : className)} {...props} />;
}

export function KalosToastContent({ className, ...props }: ToastPrimitive.Content.Props) {
  return <ToastPrimitive.Content data-slot="toast-content" className={state => cn("kalos-toast-content", typeof className === "function" ? className(state) : className)} {...props} />;
}

export function KalosToastTitle({ className, ...props }: ToastPrimitive.Title.Props) {
  return <ToastPrimitive.Title data-slot="toast-title" className={state => cn("kalos-toast-title", typeof className === "function" ? className(state) : className)} {...props} />;
}

export function KalosToastDescription({ className, ...props }: ToastPrimitive.Description.Props) {
  return <ToastPrimitive.Description data-slot="toast-description" className={state => cn("kalos-toast-description", typeof className === "function" ? className(state) : className)} {...props} />;
}

export function KalosToastAction({ className, render = <Button variant="outline" size="xs" />, ...props }: ToastPrimitive.Action.Props) {
  return <ToastPrimitive.Action data-slot="toast-action" render={render} className={state => cn("kalos-toast-action", typeof className === "function" ? className(state) : className)} {...props} />;
}

export function KalosToastClose({ className, children, render = <Button variant="ghost" size="icon-xs" />, ...props }: ToastPrimitive.Close.Props) {
  return <ToastPrimitive.Close data-slot="toast-close" aria-label="关闭提示" render={render} className={state => cn("kalos-toast-close", typeof className === "function" ? className(state) : className)} {...props}>
    {children ?? <XIcon aria-hidden="true" />}
  </ToastPrimitive.Close>;
}

export function KalosToastIcon({ type }: { type: string | undefined }) {
  let icon: ReactNode;
  switch (type) {
    case "success": icon = <CheckIcon aria-hidden="true" />; break;
    case "info": icon = <span aria-hidden="true">i</span>; break;
    case "warning": icon = <span aria-hidden="true">!</span>; break;
    case "error": icon = <XIcon aria-hidden="true" />; break;
    case "loading": icon = <Loader2Icon aria-hidden="true" />; break;
    default: return null;
  }
  return <span data-slot="toast-icon" data-type={type} className="kalos-toast-icon">{icon}</span>;
}

export function KalosToastList() {
  const { toasts } = useToastManager();
  return toasts.map(item => <KalosToast key={item.id} toast={item}>
    <KalosToastContent>
      <KalosToastIcon type={item.type} />
      <div className="kalos-toast-text">
        <KalosToastTitle />
        <KalosToastDescription />
      </div>
      <KalosToastAction />
      <KalosToastClose />
    </KalosToastContent>
  </KalosToast>);
}

export function KalosToaster({ children, toastManager = toast, ...props }: KalosToasterProps) {
  return <KalosToastProvider toastManager={toastManager} {...props}>
    {children}
    <KalosToastPortal>
      <KalosToastViewport><KalosToastList /></KalosToastViewport>
    </KalosToastPortal>
  </KalosToastProvider>;
}
